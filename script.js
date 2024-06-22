const canvas = document.createElement("canvas")
canvas.id = "world"
document.body.appendChild(canvas)

const Engine = Matter.Engine,
      Render = Matter.Render,
      World = Matter.World,
      Bodies = Matter.Bodies,
      Body = Matter.Body,
      Events = Matter.Events;

// Create engine
const engine = Engine.create();

// Create renderer
const render = Render.create({
    element: document.body,
    engine: engine,
    canvas: document.getElementById('world'),
    options: {
        width: 800,
        height: 600,
        wireframes: false,
        background: '#ffffff'
    }
});

// Function to create water particles
function createWater(x, y, columns, rows, radius, spacing) {
    let particles = [];
    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
            let particle = Bodies.circle(x + i * spacing, y + j * spacing, radius, {
                density: 0.001,
                friction: 0.00001,
                restitution: 0.3,
                render: {
                    fillStyle: '#3498db'
                }
            });
            particles.push(particle);
        }
    }
    return particles;
}

// Create ground and walls
const ground = Bodies.rectangle(400, 590, 810, 60, { isStatic: true });
const leftWall = Bodies.rectangle(10, 300, 20, 600, { isStatic: true });
const rightWall = Bodies.rectangle(790, 300, 20, 600, { isStatic: true });

// Add all bodies to the world
World.add(engine.world, [ground, leftWall, rightWall]);

// Create and add water particles
const waterParticles = createWater(200, 100, 20, 10, 5, 15);
World.add(engine.world, waterParticles);

// Run the engine
Engine.run(engine);

// Run the renderer
Render.run(render);

// Handle device orientation
function handleOrientation(event) {
    const { beta, gamma } = event;

    // Map beta to x gravity (-90 to 90) to (-1 to 1)
    let gravityX = gamma / 90;

    // Map gamma to y gravity (-90 to 90) to (-1 to 1)
    let gravityY = beta / 90;

    engine.world.gravity.x = gravityX;
    engine.world.gravity.y = gravityY;
}

// Request device orientation permission
async function requestDeviceOrientation() {
    if (typeof DeviceOrientationEvent !== "undefined" && typeof DeviceOrientationEvent.requestPermission === "function") {
        try {
            const permissionState = await DeviceOrientationEvent.requestPermission();
            if (permissionState === "granted") {
                window.addEventListener("deviceorientation", handleOrientation);
            } else {
                alert("Permission was denied");
            }
        } catch (error) {
            alert(error);
        }
    } else if ("DeviceOrientationEvent" in window) {
        window.addEventListener("deviceorientation", handleOrientation);
    } else {
        alert("Device orientation is not supported on your device");
    }
}

// Device check
const device = (() => {
    const ua = navigator.userAgent;
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) return "phone";
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) return "tablet";
    return "desktop";
})();

if (device !== "phone") {
    document.body.innerHTML = "<h1>This game is not available on your device. Please try again on a phone.</h1>";
} else {
    document.getElementById("start").addEventListener("click", requestDeviceOrientation);
}