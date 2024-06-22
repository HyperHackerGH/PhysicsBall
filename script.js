import kaboom from "https://unpkg.com/kaboom@3000.0.1/dist/kaboom.mjs";

const device = (() => {
    const ua = navigator.userAgent
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {return "phone"}
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {return "tablet"}
    return "desktop"
})()

if (device !== "phone") {
    document.body.innerHTML = "<h1>This game is not available on your device. Please try again on a phone.</h1>"
}
    
else {

function handleorientation(event) {
    const alpha = event.alpha
    const beta = event.beta
    const gamma = event.gamma

    document.body.innerHTML = `${alpha}, ${beta}, ${gamma}`
}

async function requestDeviceOrientation() {
    if (typeof DeviceOrientationEvent !== "undefined" && typeof DeviceOrientationEvent.requestPermission === "function") {
        try {
            const permissionState = await DeviceOrientationEvent.requestPermission()
            if (permissionState === "granted") {
                window.addEventListener("deviceorientation", handleorientation)
                kaboom()
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
        window.addEventListener("deviceorientation", handleorientation)
        kaboom()
    }
    else {
        alert("fail")
    }
}

document.body.innerHTML = "<button onclick = 'requestDeviceOrientation()'>Start</button>"

}