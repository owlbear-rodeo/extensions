import fetch from "node-fetch";

import { poll } from "./poll.js";

async function callWebhook() {
  const response = await fetch(`${process.env.CF_WEBHOOK}`, {
    method: "POST",
  });

  if (response.ok) {
    const body = await response.json();

    if (body.success === true) {
      let id = body.result.id;
      return id;
    }
  }
}

export async function deploy() {
  const deploymentId = await callWebhook();

  const result = await poll(deploymentId);

  if (!result) {
    throw Error("Deployment failed!");
  }
}
