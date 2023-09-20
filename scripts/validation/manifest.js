import Joi from "joi";

import { getExtensionDetails } from "../common/extensionDetails.js";

const checkUrl = (value, helpers) => {
  new URL(value);

  return value;
};

const schema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  author: Joi.string().required(),
  image: Joi.string().custom(checkUrl, "check url is valid format").required(),
  icon: Joi.string().custom(checkUrl, "check url is valid format").required(),
  tags: Joi.array()
    .min(1)
    .items(
      Joi.string().valid("built-by-owlbear").forbidden(),
      Joi.string().valid(
        "dice",
        "fog",
        "tool",
        "content-pack",
        "drawing",
        "audio",
        "combat",
        "automation",
        "other"
      )
    ),
  manifest: Joi.string()
    .custom(checkUrl, "check url is valid format")
    .required(),
  "learn-more": Joi.alternatives()
    .try(
      Joi.string().email(),
      Joi.string().custom(checkUrl, "check url is valid format")
    )
    .required(),
});

async function checkExtensionManifest() {
  const { id, data } = await getExtensionDetails();

  if (!data) {
    return false;
  }

  // const data = {
  //   description: "An example manifest for testing",
  //   author: "Extension Tests",
  //   image: "https://example.com/",
  //   icon: "https://example.com/",
  //   manifest: "https://example.com/manifest.json",
  //   "learn-more": "learn-more.com",
  // };

  const issues = validateManifest(data);

  return issues;
}

export function validateManifest(data) {
  const validationIssues = [];
  const { value, error } = schema.validate(data, { abortEarly: false });

  if (error) {
    error.details.forEach((element) => {
      validationIssues.push(element.message);
    });
  }

  formatConsoleOutput(validationIssues);

  return validationIssues;
}

/*
 *
 */
function formatConsoleOutput(issues) {
  let output = "## Manifest Validation Result\n\n";

  if (Array.isArray(issues)) {
    if (issues.length === 0) {
      output += "No issues found in manifest type validation.";
      console.log(output);
      return;
    }

    output += "***Issues found in manifest type validation.***\n\n";

    for (let issue of issues) {
      output += `- ${issue}\n`;
    }

    output += `\n\n***You must follow the below guidelines on manifest files***\n\n
|    NAME     | DESCRIPTION                                                                                                                                                                                                                                                                                                                                     |
| :---------: | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|    title    | This is the name of your extension                                                                                                                                                                                                                                                                                                              |
| description | This should be a brief description of what your extension is for                                                                                                                                                                                                                                                                                |
|   author    | This is your name or alias                                                                                                                                                                                                                                                                                                                      |
|    image    | This is an absolute link to a hero image for your extension. The image must be hosted on an external site.                                                                                                                                                                                                                                      |
|    icon     | This is an absolute link to your extensions icon and must be hosted on an external site                                                                                                                                                                                                                                                         |
|    tags     | To help make your extension more discoverable you can add tags to it. In the extension store, users will be able to find your extension under that tag. You may only use our [supported tags](https://github.com/owlbear-rodeo/extensions/blob/main/tags.json) and only extensions published by Owlbear Rodeo can use the built-by-owlbear tag. |
|  manifest   | This should have an link to your manifest file. This is what will be copied by other users to install your extension.                                                                                                                                                                                                                           |
| learn-more  | You should link to a site or email that users can go to to find more information about your extension.                                                                                                                                                                                                                                          |

    `;
    console.log(output);
    return;
  }
}

await checkExtensionManifest();
