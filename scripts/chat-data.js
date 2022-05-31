import {
  getElementById,
  makeDivWithClassAndId,
  makeSpanWithIdAndClass,
  makeImgWithClassAndSrc,
  makeSectionWithClassAndId,
  trimSecondsFromTime,
} from "./common-function.js";
import { baseUrl } from "./index.js";

const playSvg = "assets/icons/play-solid.svg";
let userDetails;
let selectedContact;
let searchValue;
let currentScrollIndex = 0;
let scrollPoints = [];

const addCommentId = getElementById("chat__comment");
const chatHeaderDiv = getElementById("chat-header-logos");
const chatSearchForm = getElementById("search-chat-form");
const searchLogo = getElementById("logo-chat");
const searchInput = getElementById("search-chat");
const closeSearch = getElementById("close-search");
const searchBtn = getElementById("search-button");
const upBtn = getElementById("up-button");
const downBtn = getElementById("down-button");
let chatHistory = getElementById("chat-history");

searchLogo.addEventListener("click", enableSearchBox);
searchInput.addEventListener("keydown", searchChatHandler);
closeSearch.addEventListener("click", closeSearchBox);
searchBtn.addEventListener("click", searchChatInHistory);
upBtn.addEventListener("click", scrollToPreviousChat);
downBtn.addEventListener("click", scrollToNextChat);
addCommentId.addEventListener("keydown", addCommentHandler);

function enableSearchBox(event) {
  event.preventDefault();
  chatHeaderDiv.style.display = "none";
  chatSearchForm.style.display = "flex";
}

function closeSearchBox(event) {
  event?.preventDefault();
  chatHeaderDiv.style.display = "flex";
  chatSearchForm.style.display = "none";
  searchInput.value = "";
  makeChatContent(selectedContact);
}

function searchChatHandler(event) {
  if (event.code === "Enter") {
    event.preventDefault();
    searchChatInHistory();
  }
}

function searchChatInHistory() {
  searchValue = searchInput.value;
  if (searchValue) {
    highlightChat(searchValue.toLowerCase());
  }
}

function scrollToNextChat() {
  let newIndex = currentScrollIndex + 1;
  if (newIndex >= 0 && scrollPoints.length > newIndex) {
    currentScrollIndex = newIndex;
    scrollAndHighLight(scrollPoints[currentScrollIndex]?.elem);
  }
}

function scrollToPreviousChat() {
  let newIndex = currentScrollIndex - 1;
  if (newIndex >= 0 && scrollPoints.length > newIndex) {
    currentScrollIndex = newIndex;
    scrollAndHighLight(scrollPoints[currentScrollIndex]?.elem);
  }
}

function scrollAndHighLight(elem) {
  chatHistory.scrollTop = scrollPoints[currentScrollIndex]?.scroll.top;
  let range = new Range();
  let startIndex = elem?.innerText?.toLowerCase().indexOf(searchValue);
  let endIndex = startIndex + searchValue.length;
  range.setStart(elem.firstChild, startIndex);
  range.setEnd(elem.firstChild, endIndex);
  document.getSelection().removeAllRanges();
  document.getSelection().addRange(range);
}

function highlightChat(searchValue) {
  const sections = chatHistory.getElementsByClassName("message");
  scrollPoints = [];
  currentScrollIndex = 0;
  Array.prototype.forEach.call(sections, (section) => {
    const messageClass = section.getElementsByClassName("row__display");
    const messageReverseClass = section.getElementsByClassName(
      "row__display-reverse"
    );
    section.classList.remove("chat__highlight");
    highlightSections(searchValue, section, messageClass, scrollPoints);
    highlightSections(searchValue, section, messageReverseClass, scrollPoints);
  });
  if (scrollPoints.length >= 1) scrollAndHighLight(scrollPoints[0]?.elem);
}

function highlightSections(searchValue, section, messageClass) {
  Array.prototype.forEach.call(messageClass, (msg) => {
    Array.prototype.forEach.call(
      msg.getElementsByClassName("message__details"),
      (msgContent) => {
        msg.classList.remove("chat__highlight");
        if (msgContent.innerText.toLowerCase().includes(searchValue)) {
          scrollPoints.push({
            elem: msgContent,
            scroll: msg.getBoundingClientRect(),
          });
        }
      }
    );
  });
}

function makeChatData(userData) {
  userDetails = userData;
  selectedContact = userData.contacts[0];
  makeChatHeader(userData.contacts[0]);
  makeChatContent(userData.contacts[0]);
}

function loadSelectedChat(contactName) {
  closeSearchBox();
  let chat = userDetails.contacts.filter(
    (contact) => contact.name === contactName
  );
  selectedContact = chat[0];
  makeChatHeader(chat[0]);
  makeChatContent(chat[0]);
}

function makeChatHeader(userContact) {
  const chatHeaderDiv = getElementById("chat-header");
  chatHeaderDiv.innerHTML = "";
  const img = makeImgWithClassAndSrc("chat__photo", baseUrl + userContact.profilePhoto);
  const div = makeDivWithClassAndId("name", {
    id: "name",
    data: userContact.name,
  });
  chatHeaderDiv.appendChild(img);
  chatHeaderDiv.appendChild(div);
}

function makeChatContent(userContact) {
  chatHistory.innerHTML = "";
  userContact.chats.forEach((chat, index) => {
    let isMessage;
    const chatSection = makeSectionWithClassAndId("message");
    const imgDiv = makeDivWithClassAndId("message__photo");
    const img = makeImgWithClassAndSrc("photo__profile");

    let msgDiv = makeDivWithClassAndId("column__display message__data");
    const nameDiv = makeDivWithClassAndId("message__name");
    const nameSpan = makeSpanWithIdAndClass("name", "name");
    const timeSpan = makeSpanWithIdAndClass(
      "time",
      "",
      trimSecondsFromTime(chat.dateAndTime)
    );

    if (chat.chatType.msgType === "message") {
      isMessage = true;
      chatSection?.classList.add("row__display-reverse");
      img.src = baseUrl + userContact.profilePhoto;
      nameDiv.classList.add("row__display-reverse");
      nameSpan.innerText = userContact.name;
    } else {
      isMessage = false;
      let messageFromContact = findContact(chat.from);
      chatSection?.classList.add("row__display");
      img.src = baseUrl + messageFromContact.profilePhoto;
      nameDiv.classList.add("row__display");
      nameSpan.innerText = messageFromContact.name;
    }

    imgDiv.appendChild(img);
    nameDiv.appendChild(nameSpan);
    nameDiv.appendChild(timeSpan);
    msgDiv.appendChild(nameDiv);

    msgDiv = makeTextAudioImageSection(isMessage, chat, msgDiv);

    chat.childChat?.forEach((child) => {
      msgDiv = makeTextAudioImageSection(isMessage, child, msgDiv, true);
    });

    chatSection.appendChild(imgDiv);
    chatSection.appendChild(msgDiv);
    chatHistory.appendChild(chatSection);
  });
  chatHistory.scrollTop = chatHistory.scrollHeight;
}

function makeTextAudioImageSection(isMessage, chat, msgDiv, isChild) {
  const msgSection = makeSectionWithClassAndId();
  const msgContentDiv = makeDivWithClassAndId("message__details");
  const logoDiv = makeDivWithClassAndId("logo__more", { id: "logo" });
  if (isMessage) {
    msgSection.classList.add("row__display-reverse");
    if (isChild) {
      msgContentDiv.classList.add("message__reverse");
    } else {
      msgContentDiv.classList.add(
        "message__reverse",
        "message__border__reverse"
      );
    }
  } else {
    msgSection.classList.add("row__display");
    if (isChild) {
      msgContentDiv.classList.add("message__normal");
    } else {
      msgContentDiv.classList.add("message__normal", "message__border__normal");
    }
    // msgContentDiv.innerText = chat.reply;
  }
  if (chat.chatType?.type === "text") {
    msgContentDiv.innerText = chat.message ?? chat.reply;
    msgSection.appendChild(msgContentDiv);
    msgSection.appendChild(logoDiv);
  } else if (chat.chatType?.type === "audio") {
    msgContentDiv.classList.add("audio__msg", "row__display");
    const imgPlay = makeImgWithClassAndSrc("play__icon", baseUrl + playSvg);
    const blankDiv = makeDivWithClassAndId("blank__msg");
    const audioTimeDiv = makeDivWithClassAndId(
      "row__display audio__msg audio__gap"
    );
    const audioStatusDiv = makeDivWithClassAndId("audio__status");
    const timeSpan = makeSpanWithIdAndClass("", "", 1.27);

    audioTimeDiv.appendChild(audioStatusDiv);
    audioTimeDiv.appendChild(timeSpan);

    msgContentDiv.appendChild(imgPlay);
    msgContentDiv.appendChild(blankDiv);
    msgContentDiv.appendChild(audioTimeDiv);
    // msgContentDiv.appendChild(audioStatusDiv);
    // msgContentDiv.appendChild(timeSpan);
    msgSection.appendChild(msgContentDiv);
  } else if (chat.chatType?.type === "image") {
    msgSection.classList.add("message__images");
    chat.images?.forEach((image) => {
      msgSection.appendChild(makeImgWithClassAndSrc("chat__image", baseUrl + image));
    });
    // msgSection.appendChild(msgContentDiv);
  }
  // msgSection.appendChild(msgContentDiv);
  // msgSection.appendChild(logoDiv);
  msgDiv.appendChild(msgSection);
  return msgDiv;
}

function addCommentHandler(event) {
  if (event.code === "Enter") {
    event.preventDefault();
    let comment = addCommentId.value;
    if (comment) {
      const date = new Date();
      const lastChat = selectedContact.chats[selectedContact.chats.length - 1];
      const data = {
        chatType: {
          type: "text",
          msgType: "message",
        },
        message: addCommentId.value,
        dateAndTime: new Date(),
      };
      const difference =
        (date.getTime() - new Date(lastChat?.dateAndTime).getTime()) /
        (60 * 1000);
      if (difference < 1) {
        if (
          !selectedContact.chats[selectedContact.chats.length - 1].childChat
        ) {
          selectedContact.chats[selectedContact.chats.length - 1].childChat =
            [];
        }
        selectedContact.chats[selectedContact.chats.length - 1].childChat?.push(
          data
        );
      } else {
        data.from = selectedContact.name;
        selectedContact.chats.push(data);
      }
    }
    makeChatContent(selectedContact);
    addCommentId.value = "";
  }
}

function findContact(contactName) {
  return userDetails.contacts.filter(
    (contact) => contact.name?.toLowerCase() === contactName?.toLowerCase()
  )[0];
}

export {makeChatData, loadSelectedChat}