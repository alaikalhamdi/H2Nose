var recording = false;
var pause = false;
var elapsed = 0;
var file_name;

const recordingButton = document.getElementById('recordbt');

function nutshell(method){
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://127.0.0.1/record/" + method, true);
    xhttp.send();
}

function recordSwitch(){
    if(recording){
        stopRecord();
        recordingButton.textContent = 'Stop';
    } else {
        startRecord();
        recordingButton.textContent = 'Record';
    }
}

function startRecord(){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            recording = true;
            pause = false;
            console.log("recording = " + recording + " " + "pause = " + pause);
        }
    }
    xhttp.open("GET", "http://127.0.0.1/record/start", true);
    xhttp.send();
}

function stopRecord() {
    nutshell("pause");

    // Get the current date and time
    var now = new Date();
    var day = now.getDate();
    var month = now.getMonth() + 1; // Months are zero-based
    var year = now.getFullYear();
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var seconds = now.getSeconds();

    // Ensure minutes and hours are always two digits
    minutes = minutes < 10 ? '0' + minutes : minutes;
    hours = hours < 10 ? '0' + hours : hours;

    // Replace colon with hyphen or underscore for compatibility
    var file_name = 'R_' + day + '-' + month + '-' + year + '_' + hours + '-' + minutes + '-' + seconds;

    console.log(file_name); // Verify the filename

    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            recording = false;
            pause = true;
            Timer("reset");
            showNotif(file_name);
        }
    };
    // Use the file_name in the request
    xhttp.open("GET", "http://127.0.0.1/record/stop?name=" + encodeURIComponent(file_name), true);
    xhttp.send();
    console.log("recording = " + recording + " " + "pause = " + pause);
}


function Timer(method) {
    if (method === "add") {
        if (!pause) {
            elapsed += 1000;
            console.log(elapsed);
        }
    } else if (method === "reset") {
        elapsed = 0;
    }
}

setInterval(() => {
    if(recording){Timer("add");}
    if(elapsed>=180000){stopRecord();};
}, 1000);