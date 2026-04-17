let startTime = 0;
let elapsed = 0;
let running = false;
let rafId;
let lastLapTime = 0;

const display = document.getElementById("display");
const lapsList = document.getElementById("lapsList");
const startBtn = document.getElementById("startBtn");
const lapBtn = document.getElementById("lapBtn");
const resetBtn = document.getElementById("resetBtn");

function formatTime(ms) {
    let totalSeconds = Math.floor(ms / 1000);
    let seconds = totalSeconds % 60;
    let minutes = Math.floor(totalSeconds / 60) % 60;
    let hours = Math.floor(totalSeconds / 3600);

    return `${String(hours).padStart(2, '0')}:` +
           `${String(minutes).padStart(2, '0')}:` +
           `${String(seconds).padStart(2, '0')}`;
}

function update() {
    const now = performance.now();
    const time = elapsed + (now - startTime);
    display.textContent = formatTime(time);
    rafId = requestAnimationFrame(update);
}

function startPause() {
    if (!running) {
        startTime = performance.now();
        rafId = requestAnimationFrame(update);
        running = true;
        startBtn.textContent = "Pause";
    } else {
        elapsed += performance.now() - startTime;
        cancelAnimationFrame(rafId);
        running = false;
        startBtn.textContent = "Start";
    }
}

function reset() {
    cancelAnimationFrame(rafId);
    running = false;
    elapsed = 0;
    lastLapTime = 0;
    display.textContent = "00:00:00";
    lapsList.innerHTML = "";
    startBtn.textContent = "Start";
}

function recordLap() {
    if (!running) return;

    const now = performance.now();
    const totalTime = elapsed + (now - startTime);
    const lapTime = totalTime - lastLapTime;
    lastLapTime = totalTime;

    const li = document.createElement("li");
    li.innerHTML = `
        <span>#${lapsList.children.length + 1}</span>
        <span>${formatTime(lapTime)}</span>
        <span>${formatTime(totalTime)}</span>
    `;

    lapsList.prepend(li);
}

/* Events */
startBtn.addEventListener("click", startPause);
resetBtn.addEventListener("click", reset);
lapBtn.addEventListener("click", recordLap);

/* Keyboard shortcuts */
document.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
        e.preventDefault();
        startPause();
    }
    if (e.key.toLowerCase() === "l") recordLap();
    if (e.key.toLowerCase() === "r") reset();
});