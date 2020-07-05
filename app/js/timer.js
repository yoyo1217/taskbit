const timer = document.querySelector("#timer");
const switchBtb = document.querySelector("#switch");
const stopBtn = document.querySelector("#stop");

let isRunning = false;
let duration = 1500;
let timeLeft = 1500;
let breakTime = 300;

switchBtb.addEventListener("click", () => {
  toggleClock();
  isRunning
    ? (switchBtb.childNodes[0].className = "fas fa-pause")
    : (switchBtb.childNodes[0].className = "fas fa-play");
});

stopBtn.addEventListener("click", () => {
  toggleClock(true);
});

const toggleClock = (reset) => {
  if (reset) {
    stopClock();
  } else {
    if (isRunning === true) {
      clearInterval(clockTimer);
      isRunning = false;
    } else {
      isRunning = true;
      clockTimer = setInterval(() => {
        timeLeft--;
        if (timeLeft == 0) clearInterval(clockTimer);
        displayTimer();
      }, 1000);
    }
  }
};

const stopClock = () => {
  clearInterval(clockTimer);
  isRunning = false;
  timeLeft = duration;
  displayTimer();
};

const displayTimer = () => {
  const secondsLeft = timeLeft;
  let result = "";
  const seconds = secondsLeft % 60;
  const minutes = parseInt(secondsLeft / 60) % 60;
  let hours = parseInt(secondsLeft / 3600);
  function showZeros(time) {
    return time < 10 ? `0${time}` : time;
  }
  if (hours > 0) result += `${hours}:`;
  result += `${showZeros(minutes)}:${showZeros(seconds)}`;
  timer.innerHTML = result.toString();
};
