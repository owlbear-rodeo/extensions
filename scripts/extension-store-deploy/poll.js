import fetch from "node-fetch";

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function fetchDeploymentDetails(url) {
  const abortController = new AbortController();
  const timeoutId = setTimeout(() => abortController.abort(), 10000);

  try {
    const result = await fetch(encodeURI(url), {
      headers: {
        Authorization: `Bearer ${process.env.CF_API_TOKEN}`,
      },
      signal: abortController.signal,
    });

    if (result.ok) {
      const body = await result.json();

      console.log("deploy res");
      console.log(body);

      return body;
    }

    console.log(await result.text());
  } catch (e) {
    console.error(e);
  } finally {
    clearTimeout(timeoutId);
  }

  return null;
}

async function getDeployment(deploymentId) {
  const body = await fetchDeploymentDetails(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ACCOUNT_ID}/pages/projects/extensions-store/deployments/${deploymentId}`
  );

  if (body) {
    const latest_stage = body.result.latest_stage;

    if (latest_stage === null) {
      console.log("latest stage is null");
      return { status: null, stage: null };
    }

    const stage = latest_stage.name;
    const status = latest_stage.status;

    return { status, stage };
  }
}

export async function poll(deploymentId) {
  const maxAttempts = 8;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      await sleep(60000);

      const { status, stage } = await getDeployment(deploymentId);

      if (status !== "active") {
        if (stage === "deploy" && status === "success") {
          return true;
        }

        return false;
      }
    } catch (e) {
      console.error(e);
    } finally {
      clearTimeout(sleep);
    }
  }

  return false;
}
