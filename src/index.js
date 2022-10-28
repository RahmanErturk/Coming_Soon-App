import moment from "moment";

// const moment = moment();
const form = document.querySelector("form");
const eventList = document.querySelector("ul");
const eventTitle = document.querySelector(".event-title");
const inputEventName = document.querySelector("#event-name");
const inputEventDate = document.querySelector("#event-date");
const inputEventTime = document.querySelector("#event-time");
let idCount = 1;
let exactDateOfEvent = "2023-01-01 00:00";
let showButtons;
let removeButtons;

const addHTML = (activity) => {
  const newEvent = document.createElement("li");
  newEvent.classList.add("event_li");

  const newEventCont = document.createElement("div");
  newEventCont.classList.add("event_cont");

  const infoContainer = document.createElement("div");
  infoContainer.classList.add("info-container");

  const newEventContName = document.createElement("p");
  newEventContName.classList.add("event_cont-name");
  newEventContName.innerText = activity.name;
  const newEventContDate = document.createElement("p");
  newEventContDate.classList.add("event_cont-date");
  newEventContDate.innerText = activity.date;
  const newEventContTime = document.createElement("p");
  newEventContTime.classList.add("event_cont-time");
  newEventContTime.innerText = activity.time;

  const buttonsContainer = document.createElement("div");
  buttonsContainer.classList.add("buttons-container");

  const showBtn = document.createElement("button");
  showBtn.innerText = "Show";
  showBtn.classList.add("show-btn");
  showBtn.setAttribute("id", activity.id);

  const removeBtn = document.createElement("button");
  removeBtn.innerText = "Remove";
  removeBtn.classList.add("remove-btn");

  eventList.append(newEvent);
  newEvent.append(newEventCont);
  newEventCont.append(infoContainer, buttonsContainer);
  infoContainer.append(newEventContName, newEventContDate, newEventContTime);
  buttonsContainer.append(showBtn, removeBtn);
};

const startConfig = () => {
  // initial settings

  const events = JSON.parse(localStorage.getItem("events"));

  if (!events) {
    localStorage.setItem("events", JSON.stringify([]));
  } else {
    events.forEach((event) => {
      addHTML(event);
    });
    showButtons = document.querySelectorAll(".show-btn");
    removeButtons = document.querySelectorAll(".remove-btn");
  }
};

startConfig();

const addEvent = (event) => {
  event.preventDefault();

  let btnID;
  const events = JSON.parse(localStorage.getItem("events"));
  console.log(events);
  if (events.length === 0) {
    btnID = 1;
  } else {
    btnID = +events[events.length - 1].id + 1;
  }

  if (
    inputEventName.value !== "" &&
    inputEventDate.value !== "" &&
    inputEventTime.value !== ""
  ) {
    const activity = {
      id: btnID,
      name: inputEventName.value,
      date: "Date: " + inputEventDate.value,
      time: "Time: " + inputEventTime.value,
    };

    const events = JSON.parse(localStorage.getItem("events"));
    events.push(activity);
    localStorage.setItem("events", JSON.stringify(events));

    addHTML(activity);
    // let lastShowBtn = document.getElementById(idCount);
    // console.log(lastShowBtn);

    showButtons = document.querySelectorAll(".show-btn");
    console.log(showButtons);
    removeButtons = document.querySelectorAll(".remove-btn");

    document.getElementById(btnID).addEventListener("click", showEvent);
    document
      .getElementById(btnID)
      .nextElementSibling.addEventListener("click", removeEvent);
    // removeButtons.forEach((btn) => btn.addEventListener("click", removeEvent));

    form.reset();
  } else {
    const warning = document.createElement("p");
    warning.classList.add("warning-text");
    warning.innerText = "- You should type an event!!!";
    form.append(warning);

    const warningEvent = form.addEventListener("submit", (event) => {
      event.preventDefault();
      warning.remove();
    });
  }

  idCount++;
};

const showEvent = (e) => {
  if (e.target.id === e.srcElement.id) {
    const nextEventName =
      e.target.parentElement.parentElement.firstChild.childNodes[0].textContent;

    const nextEventDate =
      e.target.parentElement.parentElement.firstChild.childNodes[1].textContent;

    const nextEventTime =
      e.target.parentElement.parentElement.firstChild.childNodes[2].textContent;

    eventTitle.firstElementChild.innerText = nextEventName;
    let dateOfEvent = nextEventDate;
    let hourOfEvent = nextEventTime;

    exactDateOfEvent = dateOfEvent + " " + hourOfEvent;
  }
};

const removeEvent = (e) => {
  const mainLiElem = e.target.parentElement.parentElement.parentElement;

  const text = mainLiElem.firstChild.firstChild.children[0].textContent;
  console.log(text);

  let events = JSON.parse(localStorage.getItem("events"));
  events = events.filter((td) => td.name != text);
  localStorage.setItem("events", JSON.stringify(events));

  mainLiElem.remove();
};

form.addEventListener("submit", addEvent);
showButtons.forEach((btn) => btn.addEventListener("click", showEvent));
removeButtons.forEach((btn) => btn.addEventListener("click", removeEvent));

let x = setInterval(function () {
  const now = moment();
  const graduationFromDCI = moment(exactDateOfEvent);
  let difference = moment.duration(graduationFromDCI.diff(now));

  let days = Math.floor(difference.asDays());
  let hours = Math.floor(difference.hours());
  let minutes = Math.floor(difference.minutes());
  let seconds = Math.floor(difference.seconds());

  if (seconds < 10) seconds = "0" + seconds;
  if (minutes < 10) minutes = "0" + minutes;
  if (hours < 10) hours = "0" + hours;
  if (days < 10) days = "0" + days;

  document.getElementById("day").innerHTML = days;
  document.getElementById("hour").innerHTML = hours;
  document.getElementById("min").innerHTML = minutes;
  document.getElementById("sec").innerHTML = seconds;
}, 1000);
