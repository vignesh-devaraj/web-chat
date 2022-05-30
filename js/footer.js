import {
  getElementById,
  makeDivWithClassAndId,
  makeSpanWithIdAndClass,
  makeImgWithClassAndSrc,
} from "./common-function.js";

let userDetails;
let isOpen = false;
const addDetails = getElementById("add-details-btn");
const addDetailsForm = getElementById("add-details-form");

addDetails.addEventListener("click", toggleAddMember);
addDetailsForm.addEventListener("submit", addMember);

export function makeFooter(userData) {
  userDetails = userData;
  displayMembers(userData.members);
}

function displayMembers(members) {
  const memberDiv = getElementById("member-display");
  memberDiv.innerHTML = "";
  members.forEach((member) => {
    const memberRow = makeDivWithClassAndId("row__display member");
    const memberDetailRow = makeDivWithClassAndId(
      "row__display member__details"
    );
    const img = makeImgWithClassAndSrc("member__img", member.profilePhoto);
    const span = makeSpanWithIdAndClass("name", "name", member.name);
    memberDetailRow.appendChild(img);
    memberDetailRow.appendChild(span);
    memberRow.appendChild(memberDetailRow);
    memberRow.appendChild(makeCommonLogo());
    memberDiv.appendChild(memberRow);
  });
}

function makeCommonLogo() {
  const memberLogo = makeDivWithClassAndId(
    "row__display member__details member__logos"
  );
  const phoneDiv = makeDivWithClassAndId("logo__phone", { id: "logo" });
  const messageDiv = makeDivWithClassAndId("logo__message", { id: "logo" });
  memberLogo.appendChild(phoneDiv);
  memberLogo.appendChild(messageDiv);
  return memberLogo;
}

function toggleAddMember() {
  if (!isOpen) {
    addDetailsForm.style.display = "block";
    isOpen = true;
    addDetails.innerText = "Close";
  } else {
    addDetailsForm.style.display = "none";
    isOpen = false;
    addDetails.innerText = "Add details";
  }
}

function addMember(event) {
  event.preventDefault();
  const name = addDetailsForm["person-name"].value;
  if (name) {
    userDetails?.members?.push({
      name: name,
      profilePhoto: "../assets/images/boy55.png",
    });
  }
  addDetailsForm["person-name"].value = "";
  getElementById("member-count").innerText = userDetails.members.length;
  makeFooter(userDetails);
}
