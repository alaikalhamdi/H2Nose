// Declare state globally or as a property of the button
let state = false;
var online = true;

function quitPrompt() {
    const nava = document.getElementsByClassName("nava");
    const navb = document.getElementsByClassName("navb");
    const exitButton = document.getElementById("exit");

    state = !state; // Toggle the state

    // Use a single loop to toggle display for both nava and navb
    for (let i = 0; i < nava.length; i++) {
        nava[i].style.display = state ? "none" : "block";
    }
    for (let i = 0; i < navb.length; i++) {
        navb[i].style.display = state ? "block" : "none";
    }

    // Use a ternary operator for button rotation
    exitButton.style.rotate = state ? "225deg" : "0deg";
}

function closeBrowser() {
    window.close()
}

// viewmore button toggling the detailed div
function viewMore() {
    const detailed = document.getElementById("detailed");
    const monitor = document.getElementById("monitor");
    const tray = document.getElementById("tray");

    if (detailed.style.display === "block") {
        detailed.style.display = "none";
        monitor.style.display = "block";
        tray.style.marginBottom = "-20px";
    } else {
        detailed.style.display = "block";
        monitor.style.display = "none";
        tray.style.marginBottom = "10px";
    }
}

setInterval(Time, 1000);
function Time() {
    const d = new Date();
    document.getElementById("clock").innerHTML = d.toLocaleTimeString();
}

function changeStatus() {
    const statusElement = document.getElementById("status");
    const statusDiv = document.getElementById("statusdiv");

    statusElement.innerHTML = online ? "Online" : "Offline";
    statusDiv.style.backgroundColor = online ? "green" : "black";
}

function showNotif() {
    document.getElementById("notification").style.display = "block";
    setTimeout(() => {
        document.getElementById("notification").style.right = "30px";
    }, 200);
}
