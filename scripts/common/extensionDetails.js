import fetch from "node-fetch";
import data from "../../extensions.json" assert { type: "json" };
import matter from "gray-matter";

export async function getExtensionDetails() {
  const keys = Object.keys(data);

  const id = keys[keys.length - 1];
  const item = data[keys[keys.length - 1]];

  const result = await fetch(item);

  if (result.ok) {
    const markdown = await result.text();
    const data = matter(markdown)["data"];

    return { id, data };
  }
}

export async function getExtensionDetailsFromKey(key) {
  const item = data[key];

  console.log(data);

  const result = await fetch(item);

  if (result.ok) {
    const markdown = await result.text();
    const data = matter(markdown)["data"];

    return { key, data };
  }
}
