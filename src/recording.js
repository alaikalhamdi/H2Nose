var recording = false;
var pause = false;
var elapsed = 0;

function nutshell(method){
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://127.0.0.1/record/" + method, true);
    xhttp.send();
}

function recordSwitch(){
    if(recording){
        stopRecord();
    } else {
        startRecord();
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

function stopRecord(){
    recording = false;
    pause = true;
    Timer("reset");
    nutshell("pause")
    console.log("recording = " + recording + " " + "pause = " + pause);
    showNotif();
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