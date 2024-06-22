import kaboom from "https://unpkg.com/kaboom@3000.0.1/dist/kaboom.mjs";

const device = (() => {
    const ua = navigator.userAgent
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) return "phone"
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) return "tablet"
    return "desktop"
})()

var enemies = []
var lastpos = [20, 20]
var ball

function main() {
    kaboom({
        background: [0, 0, 0]
    })

    ball = add([
        circle(16),
        pos(width() / 2, height() / 2),
        color(255, 255, 255),
        "ball"
    ])

    loop(5, () => {
        if (enemies.length > 0) {lastpos = [enemies[enemies.length - 1].pos.x, enemies[enemies.length - 1].pos.y]}
        
        var newenemy = add([
            circle(15),
            pos(lastpos[0], lastpos[1]),
            color(255, 0, 0),
            area(),
            body(),
            "enemy"
        ])

        enemies.push(newenemy)
    })

    onUpdate(() => {
        for (let i of enemies) {
            var dir = ball.pos.sub(i.pos).unit()
            i.move(dir.scale(100))
        }
    })

    add([
        circle(10),
        pos(Math.random() * width(), Math.random() * height()),
        color(255, 215, 0),
        "item"
    ])
}

function handleOrientation(event) {
    const {alpha, beta, gamma} = event
    const speed = 15

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
    document.getElementById("start").addEventListener("click", requestDeviceOrientation)
}