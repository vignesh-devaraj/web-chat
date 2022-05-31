import { makeProfile } from "./profile.js";
import { makeFooter } from "./footer.js";
import { makeChatData } from "./chat-data.js";
import {userData} from "./data.js"

export const baseUrl = location.href;
// fetch("./data.json")
//   .then((data) => data.json())
//   .then((data) => {
//     makeProfile(data?.user);
//     makeFooter(data?.user);
//     makeChatData(data?.user);
//   });
// console.log(userData);
makeProfile(userData?.user);
makeFooter(userData?.user);
makeChatData(userData?.user);