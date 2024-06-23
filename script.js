import kaboom from "https://unpkg.com/kaboom@3000.0.1/dist/kaboom.mjs";

const device = (() => {
    const ua = navigator.userAgent
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) return "phone"
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) return "tablet"
    return "desktop"
})()

var powerup = false
var enemies = []
var speed = 15
var points = 0
var ball

function main() {
    document.getElementById("container").remove()
    
    kaboom({
        background: [0, 0, 0]
    })

    scene("lose", () => {
        add([
            text(`Points: ${points}\n\n   You\n  lose!`, {
                size: 42
            }),
            pos(width() / 2 - 110, height() / 2 - 130)
        ])

        add([
            rect(120, 40),
            pos(width() / 2 - 60, height() / 2 + 70),
            color(255, 255, 255),
            area(),
            "restart"
        ])

        onClick("restart", () => {
            points = 0
            powerup = false
            go("game")
        })

        add([
            text("Restart", {
                size: 24
            }),
            pos(width() / 2 - 50, height() / 2 + 80),
            color(0, 0, 0)
        ])
    })
    
    scene("game", () => {
        const pointdisp = add([
            text("Points: " + points, {size: 24}),
            pos(15, 15)
        ])
        
        ball = add([
            circle(16),
            pos(width() / 2, height() / 2),
            color(255, 255, 255),
            area(),
            "ball"
        ])

        loop(12, () => {
            var posx = randi(0, width() - 16)
            var posy = randi(0, height() - 16)

            var blinkcount = 0

            var blinker = add([
                circle(15),
                pos(posx, posy),
                color(255, 0, 0),
            ])

            var blinking = setInterval(() => {
                if (blinkcount < 10) {
                    if (blinkcount % 2 == 0) {blinker.color = rgb(255, 0, 0)}
                    else {blinker.color = rgb(0, 0, 0)}
                    blinkcount++
                }
                else {
                    var newenemy = add([
                        circle(15),
                        pos(posx, posy),
                        color(255, 0, 0),
                        area(),
                        body(),
                        "enemy"
                    ])

                    enemies.push(newenemy)
                    destroy(blinker)
                    clearInterval(blinking)
                }
            }, 200)
        })

        // loop(10, () => {
        //     if (!powerup) {
        //         add([
        //             circle(13),
        //             pos(randi(0, width() - 16), randi(0, height() - 16)),
        //             color(0, 255, 0),
        //             area(),
        //             "powerup"
        //         ])
        //         powerup = true
        //     }
        // })

        onUpdate(() => {
            for (let i of enemies) {
                var dir = ball.pos.sub(i.pos).unit()
                i.move(dir.scale(100))
            }
        })

        onCollide("ball", "enemy", (ball, enemy) => {go("lose")})
        onCollide("ball", "point", (ball, point) => {
            points++
            pointdisp.text = "Points: " + points
            destroy(point)
            add([
                circle(10),
                pos(Math.random() * width(), Math.random() * height()),
                color(255, 215, 0),
                area(),
                "point"
            ])
        })
        onCollide("ball", "powerup", (ball, powerup) => {
            destroy(powerup)
            powerup = false
            speed = speed + 5
        })
        
        add([
            circle(10),
            pos(Math.random() * width(), Math.random() * height()),
            color(255, 215, 0),
            area(),
            "point"
        ])
    })

    go("game")
}

function handleOrientation(event) {
    const {alpha, beta, gamma} = event

    if (ball) {
        ball.pos.x += gamma * speed * dt()
        ball.pos.y += beta * speed * dt()

        ball.pos.x = Math.max(0, Math.min(ball.pos.x, width()))
        ball.pos.y = Math.max(0, Math.min(ball.pos.y, height()))
    }
}

async function requestDeviceOrientation() {
    if (typeof DeviceOrientationEvent !== "undefined" && typeof DeviceOrientationEvent.requestPermission === "function") {
        try {
            const permissionState = await DeviceOrientationEvent.requestPermission()
            if (permissionState === "granted") {
                main()
                window.addEventListener("deviceorientation", handleOrientation)
            }
            else {alert("Permission was denied")}
        }
        catch (error) {alert(error)}
    }
    else if ("DeviceOrientationEvent" in window) {
        main()
        window.addEventListener("deviceorientation", handleOrientation)
    }
    else {alert("Device orientation is not supported on your device")}
}

if (device !== "phone") {
    document.body.innerHTML = "<h1>This game is not available on your device. Please try again on a phone.</h1>"
}
else {
    document.body.innerHTML = document.body.innerHTML + `
<div id = "container">
    <h1>PhysicsBall</h1>
    <button id = "start">Play</button>
</div>
    `
    document.getElementById("start").addEventListener("click", requestDeviceOrientation)
}