let urlTextArea = null;
let titlesDiv = null;
let avgsDiv = null;
let submitButton = null;

let currList = null;
let itemsRemaining = 0;

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
    itemsRemaining = idArr.length;
    currList = new Array(idArr.length);
    for (let i = 0; i < idArr.length; i++) {
        let req = new XMLHttpRequest();
        req.addEventListener("load", function() {
            insertIntoList(this.responseText, i);
        });
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

function insertIntoList(responseText, index) {
    try {
        let res = JSON.parse(responseText);
        currList[index] = res;
    } catch(err) {
        currList[index] = {title: "Poll not found."};
    }
    itemsRemaining--;
    if (itemsRemaining == 0) {
        showResults();
    }
}

function showResults() {
    for (let i = 0; i < currList.length; i++) {
        try {
            let avg = getAverage(currList[i].votes);
            titlesDiv.innerHTML += currList[i].title + "<br />";
            avgsDiv.innerHTML += avg.toPrecision(3) + "<br />";
        } catch(err) {
            // do nothing ):
        }
    }
    titlesDiv.style.display = "block";
    avgsDiv.style.display = "block";
}

function inputListener() {
    titlesDiv.style.display = "none";
    avgsDiv.style.display = "none";
    titlesDiv.innerHTML = "";
    avgsDiv.innerHTML = "";

    let ids = getIdsFromURLs(urlTextArea.value);
    sendRequests(ids);
}

window.addEventListener("load", function() {
    urlTextArea = document.getElementById("urls");
    titlesDiv = document.getElementById("titles");
    avgsDiv = document.getElementById("avgs");
    submit = document.getElementById("submitButton");
    submit.addEventListener("click", inputListener);
})