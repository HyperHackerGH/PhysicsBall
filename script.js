const device = (() => {
    const ua = navigator.userAgent
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) return "phone"
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) return "tablet"
    return "desktop"
})()

function handleOrientation(event) {
    const {alpha, beta, gamma} = event
    
    document.body.innerHTML = `${alpha}, ${beta}, ${gamma}`
}

async function requestDeviceOrientation() {
    if (typeof DeviceOrientationEvent !== "undefined" && typeof DeviceOrientationEvent.requestPermission === "function") {
        try {
            const permissionState = await DeviceOrientationEvent.requestPermission()
            if (permissionState === "granted") {
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