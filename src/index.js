// Declare state globally or as a property of the button
let state = false;
var online = true;

var ipAddress = "Null";
var wifiSSID = "Not Connected";

let notifVisible = false;

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

    if (recording) {
        statusElement.innerHTML = 'REC ' + formatElapsedTime(elapsed);
        statusDiv.style.backgroundColor = "red";
    } else {
        statusElement.innerHTML = online ? "Online" : "Offline";
        statusDiv.style.backgroundColor = online ? "green" : "black";
    }
}

function showNotif(text) {
    const notification = document.getElementById("notification");
    const notifdesc = document.getElementById("notificationdesc");

    if (text) {
        notifdesc.textContent = 'Saved as ' + text + '.json';
    }

    notifVisible = !notifVisible; // Toggle the visibility state

    if (notifVisible) {
        notification.style.display = "block";
        setTimeout(() => {
            notification.style.right = "40px";
        }, 200);
    } else {
        notification.style.right = "-400px"; // Assuming this hides the notification
        setTimeout(() => {
            notification.style.display = "none";
        }, 200);
    }
}

// add a function to get wifi ssid and ip address via xhttp
function getWifiInfo() {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            const response = this.responseText;
            wifiSSID = response;
        }
    };
    xhttp.open("GET", "http://127.0.0.1/wifi", true);
    xhttp.onerror = function () {
        wifiSSID = 'Not Connected';
    };
    xhttp.send(); // Send the request
}

function redirectSmooth(url){
    document.getElementById('main').style.transition = '1s';
    document.getElementById('main').style.opacity = 0;
    setTimeout(()=>{window.location.href = url;}, 1000);
}

// do the same for ip address
function getIpAddress() {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            const response = this.responseText;
            ipAddress = response;
        }
    };
    xhttp.open("GET", "http://127.0.0.1/ip", true);
    xhttp.onerror = function () {
        ipAddress = "Null";
    };
    xhttp.send(); // Send the request
}

setInterval(() => {
    if(recording){Timer("add");}
    if(elapsed>=180000){stopRecord();};
    changeStatus();
}, 1000);

setInterval(() => {
    getWifiInfo();
    getIpAddress();
    document.getElementById("connection").textContent = wifiSSID + " | " + ipAddress;
}, 10000);