let urlTextArea = null;
let titlesDiv = null;
let avgsDiv = null;
const strawpollURL = "https://www.strawpoll.me/api/v2/polls/";

function getIdsFromURLs(text) {
    let lines = text.split(/\n/);
    let idArr = [];

    for (let i = 0; i < lines.length; i++) {
        let isStrawpoll = /\d+/.test(lines[i]);

        if (!isStrawpoll) {
            continue;
        }

        let id = lines[i].match(/\d+/)[0];
        idArr.push(id);
    }

    return idArr;
}

function sendRequests(idArr) {
    for (let i = 0; i < idArr.length; i++) {
        let req = new XMLHttpRequest();
        req.addEventListener("load", listBuilder);
        req.open("GET", strawpollURL + idArr[i]);
        req.send();
    }
}

function getAverage(votesArr) {
    let avg = sum = total = 0;

    for (let i = 1; i <= votesArr.length; i++) {
        sum += votesArr[i - 1] * i;
        total += votesArr[i - 1];
    }

    avg = sum / total;
    return avg;
}

function listBuilder() {
    let res = JSON.parse(this.responseText);
    try {
        let avg = getAverage(res.votes);
        titlesDiv.innerHTML += res.title + "<br />";
        avgsDiv.innerHTML += avg.toPrecision(3) + "<br />";
    } catch(err) {
        // do nothing ):
    }
}

window.addEventListener("load", function() {
    urlTextArea = document.getElementById("urls");
    titlesDiv = document.getElementById("titles");
    avgsDiv = document.getElementById("avgs");
    urlTextArea.addEventListener("change", function() {
        titlesDiv.innerHTML = "";
        avgsDiv.innerHTML = "";

        let ids = getIdsFromURLs(urlTextArea.value);
        sendRequests(ids);
    });
})