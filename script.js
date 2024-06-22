import kaboom from "https://unpkg.com/kaboom@3000.0.1/dist/kaboom.mjs";

const device = (() => {
    const ua = navigator.userAgent
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) return "phone"
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) return "tablet"
    return "desktop"
})()

var ball;
var velocity = { x: 0, y: 0 };

function main() {
    kaboom({
        background: [0, 0, 0]
    });

    ball = add([
        circle(16),
        pos(width() / 2, height() / 2),
        color(255, 255, 255),
        "ball"
    ]);

    add([
        circle(10),
        pos(Math.random() * width(), Math.random() * height()),
        color(255, 215, 0),
        "item"
    ]);
}

function handleOrientation(event) {
    const { beta, gamma } = event;
    const speed = 15;

    if (ball) {
        velocity.x = gamma * speed;
        velocity.y = beta * speed;
    }
}

function updateBall() {
    if (ball) {
        ball.pos.x += velocity.x * dt();
        ball.pos.y += velocity.y * dt();

        // Check for collision with walls and reverse velocity if necessary
        if (ball.pos.x <= 0 || ball.pos.x >= width()) {
            velocity.x = -velocity.x;
        }
        if (ball.pos.y <= 0 || ball.pos.y >= height()) {
            velocity.y = -velocity.y;
        }

        // Ensure the ball stays within the screen bounds
        ball.pos.x = Math.max(0, Math.min(ball.pos.x, width()));
        ball.pos.y = Math.max(0, Math.min(ball.pos.y, height()));
    }
}

async function requestDeviceOrientation() {
    if (typeof DeviceOrientationEvent !== "undefined" && typeof DeviceOrientationEvent.requestPermission === "function") {
        try {
            const permissionState = await DeviceOrientationEvent.requestPermission()
            if (permissionState === "granted") {
                main()
                window.addEventListener("deviceorientation", handleOrientation)
                loop(0.016, updateBall);
            }
            else {
                alert("Permission was denied")
            }
        }
        catch (error) {alert(error)}
    }
    else if ("DeviceOrientationEvent" in window) {
        main()
        window.addEventListener("deviceorientation", handleOrientation)
        loop(0.016, updateBall);
    }
    else {alert("Device orientation is not supported on your device")}
}

if (device !== "phone") {
    document.body.innerHTML = "<h1>This game is not available on your device. Please try again on a phone.</h1>"
}
else {
    document.getElementById("start").addEventListener("click", requestDeviceOrientation)
}