import fetch from "node-fetch";

import { getExtensionDetails } from "./extensionDetails.js";

function createDiscordEmbed(id, title, description, url, image, author, tags) {
  const embed = {
    color: 0xbb99ff,
    title,
    description,
    url: encodeURI(`https://extensions.owlbear.rodeo/${id}`),
    image: {
      url: image,
    },
    author: {
      name: author,
    },
    fields: [
      {
        name: "",
        value: `${tags.map((tag) => "`" + tag + "`").join("   ")}`,
        inline: true,
      },
    ],
  };

  console.log(embed);
  return embed;
}

function createDiscordWebhookPayload(
  id,
  title,
  description,
  url,
  image,
  author,
  tags
) {
  const embed = createDiscordEmbed(
    id,
    title,
    description,
    url,
    image,
    author,
    tags
  );

  const payload = {
    content: ":flame: New Extension Released :flame:",
    embeds: [embed],
  };

  return payload;
}

export async function sendDiscordWebhook() {
  const { id, data } = await getExtensionDetails();

  const payload = createDiscordWebhookPayload(
    id,
    data.title,
    data.description,
    data.url,
    data.image,
    data.author,
    data.tags
  );

  const response = await fetch(process.env.DISCORD_WEBHOOK, {
    method: "POST",
    body: JSON.stringify(payload),
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
