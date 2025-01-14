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

    if (detailed.classList.contains("hidden")) {
        detailed.classList.remove("hidden");
        monitor.classList.add("hidden");
        tray.style.marginBottom = "10px";
    } else {
        detailed.classList.add("hidden");
        monitor.classList.remove("hidden");
        tray.style.marginBottom = "-20px";
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

function toggleDataViewer(method) {
    const elements = {
        tray: document.getElementById("tray"),
        monitor: document.getElementById("monitor"),
        thgrad: document.getElementById("thgrad"),
        dataviewer: document.getElementById("dataviewer"),
        detailed: document.getElementById("detailed"),
        navmonitorbutton: document.getElementById("navmonitorbutton"),
        navfilebutton: document.getElementById("navfilebutton")
    };

    const showMonitor = method === "monitor";
    const showDataViewer = method === "dataviewer";

    if (showDataViewer) {
        getFiles();
    }

    // Add slide-out class to the current visible element
    if (showMonitor) {
        elements.dataviewer.classList.add("slide-out");
        elements.dataviewer.classList.remove("slide-in");
        elements.monitor.classList.add("slide-in");
        elements.monitor.classList.remove("slide-out");
        elements.thgrad.classList.add("slide-in");
        elements.thgrad.classList.remove("slide-out");
    } else {
        elements.monitor.classList.add("slide-out");
        elements.monitor.classList.remove("slide-in");
        elements.dataviewer.classList.add("slide-in");
        elements.dataviewer.classList.remove("slide-out");
        elements.thgrad.classList.add("slide-out");
        elements.thgrad.classList.remove("slide-in");
    }

    // Hide the element after the animation completes
    setTimeout(() => {
        elements.monitor.classList.toggle("hidden", !showMonitor);
        elements.dataviewer.classList.toggle("hidden", !showDataViewer);
        elements.thgrad.classList.toggle("hidden", !showMonitor);
    }, 500);

    elements.tray.style.marginBottom = showMonitor ? "-20px" : "10px";
    elements.detailed.classList.add("hidden");
    elements.navmonitorbutton.classList.toggle("navactive", showMonitor);
    elements.navfilebutton.classList.toggle("navactive", showDataViewer);
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

// DATAVIEWER SCRIPTS

template = document.createElement('div');

file = document.createElement('div')
file.classList.add('file');

tools = document.createElement('div');
trash = document.createElement('img');
trash.src = './src/TrashCan.svg';
tools.append(trash)
tools.classList.add('tools');

template.append(file);
template.append(tools);

animating = false;

function getFiles() {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            const files = JSON.parse(xhttp.responseText);
            const filelist = document.getElementsByClassName('column-grid')[0];
            
            // Clear existing file divs
            while (filelist.firstChild) {
                filelist.removeChild(filelist.firstChild);
            }

            let keys = Object.keys(files).sort().reverse();
            for (let i of keys) {
                const file = template.cloneNode(true);
                file.childNodes[0].textContent = i;
                file.childNodes[0].title = i;
                file.childNodes[0].addEventListener('click', getRedirectFunction(i));
                file.childNodes[1].childNodes[0].addEventListener('click', getDeleteFunction(i, file));
                filelist.append(file);
            }
            if (keys.length == 0) {
                const notfound = document.createElement('h1');
                notfound.textContent = 'No Files Found';
                filelist.replaceWith(notfound);
            }
        }
    };
    xhttp.open('GET', 'http://127.0.0.1/f/names', true);
    xhttp.send();
}

getDeleteFunction = (i, f)=>{
    return (()=>{
        if(confirm('Delete '+i+'?')){
            delhttp = new XMLHttpRequest();
            delhttp.onreadystatechange = function() {
                if (this.readyState == 4) {
                    if(this.status == 200){
                        f.remove();
                    } else if (this.status == 404){
                        alert('Failed to remove '+i);
                    }
                } 
            }
            delhttp.open('GET', 'http://127.0.0.1/f/del?fn='+i);
            delhttp.send();
        }
    })
}

getRedirectFunction = (i) => {
    return ()=>{if(animating){return};animating=true;window.location.href = './view/'+i;}
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