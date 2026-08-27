import fs from "node:fs";
import path from "node:path";
import { XMLParser } from "fast-xml-parser";

const xmlData = fs.readFileSync(path.resolve(process.cwd(), "export.xml"), "utf8");
const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  textNodeName: "#text",
  cdataPropName: "__cdata",
  trimValues: true,
});

const parsed = parser.parse(xmlData);
const items = parsed.rss.channel.item;

function extractText(node) {
  if (node === null || node === undefined) return "";
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (typeof node === "object") {
    if (node.__cdata !== undefined) return String(node.__cdata);
    if (node["#text"] !== undefined) return String(node["#text"]);
    return JSON.stringify(node);
  }
  return String(node);
}

const dirItems = items.filter((item) => extractText(item["wp:post_type"]) === "at_biz_dir");

console.log("Directory Listings found:", dirItems.length);
for (const item of dirItems.slice(0, 10)) {
  console.log(" -", extractText(item["title"]), `(${extractText(item["wp:post_name"])})`);
}
