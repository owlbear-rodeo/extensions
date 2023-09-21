import fetch from "node-fetch";
import { getExtensionDetailsFromKey } from "../common/extensionDetails.js";

function createDiscordVerificationPost(id, data) {
  const text = `## Extension Verfication Request\n\n${data.title} would like to be verified.\n\nIt can be installed via this [store page](https://extensions.owlbear.rodeo/${id}).\n\nTo be verified the extension must meet these criteria:\n\n- Extension design uses accessible colors :art:\n- Extension design uses accessible font sizes :blue_book:\n- Extension is legible with Owlbear Rodeo’s light and dark theme :ghost:\n- Extension is fully functional on mobile devices (1)  :mobile_phone:\n- Extension is fully functional across all major browsers (2) :computer:\n- Extension requires no other extensions to be installed :link: \n- Extension functions in a private browsing window or with cookies disabled :lock:\n- Extension makes proper use of the Owlbear Rodeo APIs (3) :jigsaw: \n- Extension functions in all configurations of an Owlbear Rodeo Room (4) :house:\n- Extension provides user support for queries, issues and requests :question:\n- Extension has no known bugs :bug: \n- Extension manifest is hosted on a custom domain controlled by the extension developer :pencil:\n\nNotes:\n\n1) This includes iPhone’s, Android devices as well as tablets such as an iPad.\n\n2) Major browsers include Chrome, Firefox and Safari\n\n3) For example the Scene API is only used to store data that shares the Scene lifecycle\n\n4) Valid configurations include a Room with a Scene open and no Scene open\n\nAlso note that the term “fully functional” above means all extension functionally works correctly whereas the term “functional” means the extension still functions but some features may not be available.\n\n### To help verify this extension react to this message with the criteria that are met! (i.e. react :bug: if it has no known bugs)`;

  const post = {
    thread_name: `${data.title} wants to be verified`,
    content: text,
  };

  return post;
}

export async function sendDiscordWebhook(value) {
  const values = value.replaceAll('"', "").split(" ");
  if (values.length !== 2) {
    console.log(values);
    throw Error("invalid submission");
  }

  const key = values[1];
  const { key: id, data } = await getExtensionDetailsFromKey(key);

  const embed = createDiscordVerificationPost(id, data);

  const response = await fetch(process.env.DISCORD_VERIFY_WEBHOOK, {
    method: "POST",
    body: JSON.stringify(embed),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    console.log("Success!!");
  } else {
    console.log(JSON.stringify(await response.text(), null, 2));
  }
}

await sendDiscordWebhook(process.env.EXTENSION_KEY);
