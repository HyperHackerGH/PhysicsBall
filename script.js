import kaboom from "https://unpkg.com/kaboom@3000.0.1/dist/kaboom.mjs";

const device = (() => {
    const ua = navigator.userAgent
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) return "phone"
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) return "tablet"
    return "desktop"
})()

var ball;

function main() {
    kaboom();

    add([
        text("Tilt to move the ball!"),
        pos(80, 80),
    ]);

    ball = add([
        circle(16),
        pos(width() / 2, height() / 2),
        color(0, 0, 255),
        "ball"
    ]);

    add([
        rect(16, 16),
        pos(Math.random() * width(), Math.random() * height()),
        color(255, 215, 0),
        "item"
    ]);
}

function handleOrientation(event) {
    const { beta, gamma } = event;
    const speed = 2;

    // Move ball based on beta and gamma values
    if (ball) {
        ball.pos.x += gamma * speed * dt();
        ball.pos.y += beta * speed * dt();

        // Prevent ball from going out of bounds
        ball.pos.x = Math.max(0, Math.min(ball.pos.x, width()));
        ball.pos.y = Math.max(0, Math.min(ball.pos.y, height()));
    }
}

async function requestDeviceOrientation() {
    if (typeof DeviceOrientationEvent !== "undefined" && typeof DeviceOrientationEvent.requestPermission === "function") {
        try {
            const permissionState = await DeviceOrientationEvent.requestPermission()
            if (permissionState === "granted") {
                kaboom()
                main()
                window.addEventListener("deviceorientation", handleOrientation)
            }
            else {
                alert("Permission was denied")
            }
        }
        catch (error) {
            alert(error)
        }
    }
    else if ("DeviceOrientationEvent" in window) {
        kaboom()
        main()
        window.addEventListener("deviceorientation", handleOrientation)
    }
    else {
        alert("Device orientation is not supported on your device")
    }
}

if (device !== "phone") {
    document.body.innerHTML = "<h1>This game is not available on your device. Please try again on a phone.</h1>"
}
else {
    document.getElementById("start").addEventListener("click", requestDeviceOrientation)
}