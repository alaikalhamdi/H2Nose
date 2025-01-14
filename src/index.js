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

function toggleDataViewer() {
    const tray = document.getElementById("tray");
    const monitor = document.getElementById("monitor");
    const thgrad = document.getElementById("thgrad");
    const dataviewer = document.getElementById("dataviewer");
    const detailed = document.getElementById("detailed");
    const navmonitorbutton = document.getElementById("navmonitorbutton");
    const navfilebutton = document.getElementById("navfilebutton");

    if (dataviewer.style.display === "block") {
        tray.style.marginBottom = "-20px";
        monitor.style.display = "block";
        thgrad.style.display = "block";
        detailed.style.display = "none";
        dataviewer.style.display = "none";
        navmonitorbutton.classList.add("navactive");
        navfilebutton.classList.remove("navactive");
    } else {
        tray.style.marginBottom = "10px";
        monitor.style.display = "none";
        thgrad.style.display = "none";
        detailed.style.display = "none";
        dataviewer.style.display = "block";
        navmonitorbutton.classList.remove("navactive");
        navfilebutton.classList.add("navactive");
    }
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

document.addEventListener('DOMContentLoaded', ()=>{
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            files = JSON.parse(xhttp.responseText);
            filelist = document.getElementsByClassName('column-grid')[0];
            let keys = Object.keys(files).sort().reverse();
            for(i of keys){
                file = template.cloneNode(true);
                file.childNodes[0].textContent = i;
                file.childNodes[0].title = i;
                file.childNodes[0].addEventListener('click', getRedirectFunction(i));
                file.childNodes[1].childNodes[0].addEventListener('click', getDeleteFunction(i, file));
                filelist.append(file);
            }
            if(keys.length == 0){
                notfound = document.createElement('h1');
                notfound.textContent = 'No Files Found';
                filelist.replaceWith(notfound);
            }
        }
    }
    xhttp.open('GET', 'http://127.0.0.1/f/names', true);
    xhttp.send();
    document.body.style.opacity = 1;
    setTimeout(()=>{
        document.body.style.transition = '0s';
    }, 1000);
});

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
            delhttp.open('GET', '/f/del?fn='+i);
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