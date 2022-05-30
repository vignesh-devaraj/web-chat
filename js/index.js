import { makeProfile } from "./profile.js";
import { makeFooter } from "./footer.js";
import { makeChatData } from "./chat-data.js";

fetch("../assets/data.json")
  .then((data) => data.json())
  .then((data) => {
    makeProfile(data?.user);
    makeFooter(data?.user);
    makeChatData(data?.user);
  });
