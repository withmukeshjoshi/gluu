#!/usr/bin/env node
var HTMLParser = require("node-html-parser");
var fs = require("fs");
const path = require("path");

function initialize() {
  if (fs.existsSync(path.join(__dirname, "dist"))) {
    console.log("Deleting old dist directory");
    fs.rmdirSync(path.join(__dirname, "dist"), { recursive: true });
  }
  fs.mkdir(path.join(__dirname, "dist"), (err) => {
    if (err) {
      return console.error(err);
    }
    console.log("Directory created successfully!");
  });
}
function saveFile(data, fileName) {
  initialize();
  var stream = fs.createWriteStream("dist/" + fileName);
  stream.once("open", function (fd) {
    var html = "" + data;
    stream.end(html);
  });
}

function processFile(fileName) {
  fs.readFile(fileName, "utf8", function (err, data) {
    if (err) {
      return console.log(err);
    }
    const root = HTMLParser.parse(data);
    const partials = root.querySelectorAll("partial");
    partials.forEach((partial) => {
      const partialName = partial.getAttribute("name");
      const newHTML = readPartial(
        path.join(__dirname, "partials/") + partialName
      );
      const attrs = partial.rawAttributes;
      const keys = Object.keys(attrs);
      Promise.resolve(newHTML).then((value) => {
        var filteredData = "" + filterPartialHTML(value);
        keys.forEach((key, index) => {
          var reg = new RegExp("\\{\\b" + key + "\\b\\}");
          filteredData = filteredData.replace(reg, attrs[key]);
        });
        partial.insertAdjacentHTML("afterend", filteredData);
        partial.remove();
      });
      saveFile(root, fileName);
    });
  });
}
async function readPartial(partialName) {
  var html = fs.readFileSync(partialName).toString();
  return html;
}

function filterPartialHTML(rawHtml) {
  const htmlTree = HTMLParser.parse(rawHtml);
  htmlTree.querySelectorAll("ignore").forEach((element) => {
    element.remove();
  });
  return htmlTree;
}

// execution

processFile("./index.html");
