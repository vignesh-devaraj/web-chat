import {
  getElementById,
  makeDivWithClassAndId,
  makeSpanWithIdAndClass,
  makeImgWithClassAndSrc,
  trimSecondsFromTime,
  makeSectionWithClassAndId,
} from "./common-function.js";

import { loadSelectedChat } from "./chat-data.js";

let userDetails;
let id = 0;
const searchText = getElementById("search__text");
searchText.addEventListener("input", filterData);
let baseUrl = location.href + location.pathname;

export function makeProfile(userData) {
  userDetails = userData;
  makeProfileHeader(userData);
  displayActiveUsers(userData);
  displayContactChats(sortByDate(userData));
}

function makeProfileHeader(userData) {
  getElementById("profile-name").innerText = userData.name;
  const profilePhoto = getElementById("profile-photo");
  console.log(location.href+userData.profilePhoto)
  profilePhoto.style.background = `url(${location.href}${userData.profilePhoto})`;
  profilePhoto.style.backgroundSize = "cover";
}

function displayActiveUsers(userData) {
  const activeUsers = getElementById("active-users");
  const activeUsersList = userData.contacts.filter((contact) => contact.active);
  activeUsersList.forEach((user) => {
    const div = makeImgWithStatus({
      divClass: "user row__display details__img",
      src: user.profilePhoto,
      imgClass: "user__img",
      statusId: "user__status",
      statusClass: "status",
      isActive: true,
    });
    activeUsers.appendChild(div);
  });
}

function makeImgWithStatus(imageData) {
  const div = makeDivWithClassAndId(imageData.divClass);
  const img = document.createElement("img");
  const statusDiv = document.createElement("div");
  img.src = imageData.src;
  img.setAttribute("class", imageData.imgClass);
  statusDiv.setAttribute("id", imageData.statusId);
  statusDiv.setAttribute("class", imageData.statusClass);
  if (!imageData.isActive) {
    statusDiv.style.backgroundColor = "red";
  }
  div.appendChild(img);
  div.appendChild(statusDiv);
  return div;
}

function displayContactChats(userContacts) {
  const displayChats = getElementById("display-chats");
  displayChats.addEventListener("click", chatClickHandler);
  displayChats.innerHTML = "";
  userContacts.forEach((user) => {
    const chatContainerDiv = makeSectionWithClassAndId(
      "chats__message row__display",
      { id: "user" + id++ }
    );
    const imgContainerDiv = makeImgWithStatus({
      divClass: "row__display details__img",
      src: user.profilePhoto,
      imgClass: "user__img",
      statusId: "user__status",
      statusClass: "status",
      isActive: user.active,
    });
    const userMessageContainerDiv = makeChatAndTimeDiv(
      user.name,
      user.chats[user.chats.length - 1]
    );
    chatContainerDiv.appendChild(imgContainerDiv);
    chatContainerDiv.appendChild(userMessageContainerDiv);
    displayChats.appendChild(chatContainerDiv);
  });
}

function makeChatAndTimeDiv(name, chat) {
  const userMessageDiv = makeDivWithClassAndId("user__message column__display");
  const rowDiv = makeDivWithClassAndId("row__display");
  rowDiv.style = "justify-content: space-between";
  rowDiv.appendChild(makeSpanWithIdAndClass("name", "name", name));
  rowDiv.appendChild(
    makeSpanWithIdAndClass("time", "", trimSecondsFromTime(chat.dateAndTime))
  );
  const chatMessageDiv = makeDivWithClassAndId("", {
    id: "message-first",
    data: chat.message ?? chat.reply,
  });
  userMessageDiv.append(rowDiv);
  userMessageDiv.append(chatMessageDiv);
  return userMessageDiv;
}

function sortByDate(userData) {
  const newUserData = userData.contacts.sort((c1, c2) => {
    const date1 = new Date(c1.chats[c1.chats.length - 1]?.dateAndTime);
    const date2 = new Date(c2.chats[c2.chats.length - 1]?.dateAndTime);
    return date1.getTime() - date2.getTime();
  });
  return newUserData.reverse();
}

function filterData() {
  let newUserDetails = userDetails.contacts.filter((contact) => {
    return contact.name.toLowerCase().includes(searchText.value.toLowerCase());
  });
  displayContactChats(newUserDetails);
}

function chatClickHandler(event) {
  let selectedSection;
  if (
    event.target.id.includes("user") &&
    event.target.classList.contains("chats__message") &&
    event.target.classList.contains("chats__message")
  ) {
    selectedSection = event.target;
  } else {
    selectedSection = event.target.parentElement.closest(
      "#display-chats > section"
    );
  }
  const classes = document.getElementsByClassName(
    "chats__message row__display"
  );
  Array.prototype.forEach.call(classes, (element) => {
    element?.classList?.remove("chat__selected");
  });
  loadSelectedChat(selectedSection.getElementsByClassName("name")[0].innerText);
  selectedSection?.classList?.add("chat__selected");
}
