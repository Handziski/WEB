var lingLangsTime = 90;
var michelinTime = 100;
var pitStopTime = 20;

var startingDrivers = [
    { name: "Max Verstappen", team: "Red Bull", speed: 1.05, skill: 10.0 },
    { name: "Lewis Hamilton", team: "Ferrari", speed: 1.02, skill: 9.9 },
    { name: "Charles Leclerc", team: "Ferrari", speed: 1.04, skill: 9.5 },
    { name: "Lando Norris", team: "Mc Laren", speed: 1.02, skill: 9.8 },
    { name: "Fernando Alonso", team: "Aston Martin", speed: 1.05, skill: 10.0 },
    { name: "Oscar Piastri", team: "Mc Laren", speed: 1.07, skill: 9.0 },
    { name: "George Russell", team: "Mercedes", speed: 1.04, skill: 9.2 },
    { name: "Carlos Sainz", team: "Williams", speed: 1.01, skill: 9.5 },
    { name: "Sergio Perez", team: "Red Bull", speed: 1.09, skill: 9.2 },
    { name: "Nico Hulkenberg", team: "Sauber", speed: 1.05, skill: 9.0 }
];

var drivers = [];
var currentLap = 0;
var raceStarted = false;

var startB = document.getElementById("startB");
var nextLapB = document.getElementById("nextLapB");
var resetB = document.getElementById("resetB");
var driverT = document.getElementById("driverTable");
var raceInfo = document.getElementById("info");
var winner = document.getElementById("winner");

function resetRace() {
    drivers = [];
    for (var i = 0; i < startingDrivers.length; i++) {
        drivers.push({
            name: startingDrivers[i].name,
            team: startingDrivers[i].team,
            speed: startingDrivers[i].speed,
            skill: startingDrivers[i].skill,
            totalTime: 0,
            tyre: "soft",
            changedTyres: false,
            status: "Na start"
        });
    }
    currentLap = 0;
    raceStarted = false;
    startB.disabled = false;
    nextLapB.disabled = true;
    raceInfo.innerText = "Trkata se ushte ne e zapocnata.";
    winner.innerText = "";
    showTable();
}

function showTable() {
    drivers.sort(function (a, b) {
        return a.totalTime - b.totalTime;
    });
    driverT.innerHTML = "";
    for (var i = 0; i < drivers.length; i++) {
        var row = document.createElement("tr");
        var tyreName = (drivers[i].tyre === "soft") ? "LingLangs" : "Michelin";
        var statusClass = "";
        if (drivers[i].status.indexOf("Pit-stop") !== -1) {
            statusClass = "status-pit";
        } else if (drivers[i].status.indexOf("Izvrtuvanje") !== -1) {
            statusClass = "status-spin";
        } else if (drivers[i].status.indexOf("Bezbednosno") !== -1) {
            statusClass = "status-safety";
        }
        row.innerHTML =
            "<td>" + (i + 1) + "</td>" +
            "<td>" + drivers[i].name + "</td>" +
            "<td>" + drivers[i].team + "</td>" +
            "<td>" + tyreName + "</td>" +
            "<td>" + drivers[i].totalTime.toFixed(2) + " s</td>" +
            '<td class="' + statusClass + '">' + drivers[i].status + "</td>";
        driverT.appendChild(row);
    }
}

function startRace() {
    if (raceStarted === true) {
        return;
    }
    raceStarted = true;
    startB.disabled = true;
    nextLapB.disabled = false;
    for (var i = 0; i < drivers.length; i++) {
        drivers[i].status = "Trkata zapocna";
    }
    raceInfo.innerText = "Start! Krug 0 od 10.";
    showTable();
}

function nextLap() {
    if (raceStarted === false || currentLap === 10) {
        return;
    }
    currentLap++;

    var safetyCar = false;
    if (Math.random() < 0.10) {
        safetyCar = true;
    }

    for (var i = 0; i < drivers.length; i++) {
        var driver = drivers[i];
        driver.status = "Normalno vozenje";

        if (driver.changedTyres === false && currentLap >= 3) {
            var enterPit = false;
            if (currentLap === 8) {
                enterPit = true;
            } else if (Math.random() < 0.30) {
                enterPit = true;
            }
            if (enterPit === true) {
                driver.totalTime = driver.totalTime + pitStopTime;
                driver.tyre = (driver.tyre === "soft") ? "hard" : "soft";
                driver.changedTyres = true;
                driver.status = "Pit-stop";
            }
        }

        var lapTime = lingLangsTime;
        if (driver.tyre === "hard") {
            lapTime = michelinTime;
        }
        lapTime = lapTime / driver.speed;
        lapTime = lapTime - (driver.skill - 8) * 0.45;
        lapTime = lapTime + Math.random() * 1.5;

        if (Math.random() < 0.06) {
            lapTime = lapTime + 10;
            driver.status = "Izvrtuvanje / izletuvanje";
        }
        if (safetyCar === true) {
            lapTime = lapTime + 5;
            if (driver.status === "Normalno vozenje") {
                driver.status = "Bezbednosno vozilo";
            }
        }
        driver.totalTime = driver.totalTime + lapTime;
    }

    raceInfo.innerText = "Zavrsen krug " + currentLap + " od 10.";
    if (safetyCar === true) {
        raceInfo.innerText = raceInfo.innerText + " Izleze bezbednosno vozilo!";
    }
    showTable();

    if (currentLap === 10) {
        finishRace();
    }
}

function finishRace() {
    nextLapB.disabled = true;
    drivers.sort(function (a, b) {
        return a.totalTime - b.totalTime;
    });
    winner.innerText = "Pobednik: " + drivers[0].name +
        " - " + drivers[0].totalTime.toFixed(2) + " sekundi!";
    raceInfo.innerText = "Trkata e zavrsena po 10 kruga.";
    showTable();
}

startB.addEventListener("click", startRace);
nextLapB.addEventListener("click", nextLap);
resetB.addEventListener("click", resetRace);

resetRace();