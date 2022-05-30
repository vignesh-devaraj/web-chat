function getElementById(id) {
  return document.getElementById(id);
}

function makeDivWithClassAndId(className, message) {
  const div = document.createElement("div");
  className ? div.setAttribute("class", className) : "";
  if (message) {
    div.setAttribute("id", message.id);
    div.innerText = message.data ?? "";
  }
  return div;
}

function makeSectionWithClassAndId(className, message) {
  const section = document.createElement("section");
  className ? section.setAttribute("class", className) : "";
  if (message) {
    section.setAttribute("id", message.id);
    section.innerText = message.data ?? "";
  }
  return section;
}

function makeSpanWithIdAndClass(id, className, value) {
  const span = document.createElement("span");
  span.setAttribute("id", id);
  className ? span.setAttribute("class", className) : "";
  value ? (span.innerText = value) : "";
  return span;
}

function makeImgWithClassAndSrc(className, src) {
  const img = document.createElement("img");
  className ? img.setAttribute("class", className) : "";
  img.src = src;
  return img;
}

function trimSecondsFromTime(dateAndTime) {
  const date = new Date(dateAndTime).toLocaleTimeString();
  const formattedDate = date.split(" ");
  formattedDate[0] = formattedDate[0].split(":").splice(0, 2).join(":");
  return formattedDate.join(" ");
}

export {
  getElementById,
  makeDivWithClassAndId,
  makeSpanWithIdAndClass,
  makeImgWithClassAndSrc,
  trimSecondsFromTime,
  makeSectionWithClassAndId,
};
