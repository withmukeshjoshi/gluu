#!/usr/bin/env node
var HTMLParser = require("node-html-parser");
var fs = require("fs");

var config = {
  partialDirectory: "partials",
  syntax: "partial",
  output: "dist",
  entry: "index.html"
}
// variable initialization
const [, , ...args] = process.argv;

// function to get values from config file

function readConfigFile() {
  if (fs.existsSync('./glue.config.json')) {
    fs.readFile('./glue.config.json', "utf8", (err, data) => {
      if (err) {
        console.log(err);
        return err;
      }
      config = { ...JSON.parse(data) }
      processFile(config.entry);
    })
  }
}

// Functions
function initialize() {
  if (fs.existsSync("./" + config.output + "/")) {
    fs.rmdirSync("./" + config.output + "/", { recursive: true });
  }
  fs.mkdir("./" + config.output + "/", (err) => {
    if (err) {
      return console.error(err);
    }
  });
}

function saveFile(data, fileName) {
  initialize();
  var stream = fs.createWriteStream("./" + config.output + "/" + fileName);
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
    const partials = root.querySelectorAll(config.syntax);
    partials.forEach((partial) => {
      const partialName = partial.getAttribute("name");
      const newHTML = readPartial(
        "./" + config.partialDirectory + "/" + partialName
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
readConfigFile()
