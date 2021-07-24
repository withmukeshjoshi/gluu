#!/usr/bin/env node
var HTMLParser = require("node-html-parser");
import * as fs from "fs";

const defaultConfig = {
  partialDirectory: "partials",
  syntax: "partial",
  output: "dist",
  entry: "index.html",
};

export class Gluu {
  private config = { ...defaultConfig };
  constructor(args) {
    if (args.includes("init")) {
      this.createConfigFile();
      this.initialize();
    } else {
      this.readConfigFile();
    }
  }

  private readConfigFile = () => {
    if (fs.existsSync("./gluu.config.json")) {
      fs.readFile("./gluu.config.json", "utf8", (err, data) => {
        if (err) {
          console.log(err);
          return err;
        }
        this.config = { ...JSON.parse(data) };
        this.processFile(this.config.entry);
      });
    }
  };

  private initialize = () => {
    if (fs.existsSync("./" + this.config.output + "/")) {
      fs.rmdirSync("./" + this.config.output + "/", { recursive: true });
    }
    fs.mkdir("./" + this.config.output + "/", (err) => {
      if (err) {
        return console.error(err);
      }
    });
  };

  private saveFile = (data, fileName) => {
    this.initialize();
    var stream = fs.createWriteStream("./" + fileName);
    stream.once("open", function (fd) {
      var html = "" + data;
      stream.end(html);
    });
  };

  private processFile = (fileName) => {
    if (fileName == "") return console.log("Entry point file is required.");
    if (fs.existsSync(fileName)) {
      fs.readFile(fileName, "utf8", (err, data) => {
        if (err) {
          return console.log(err);
        }
        const root = HTMLParser.parse(data);
        const partials = root.querySelectorAll(this.config.syntax);
        partials.forEach((partial) => {
          const partialName = partial.getAttribute("name");
          const newHTML = this.readPartial(
            "./" + this.config.partialDirectory + "/" + partialName
          );
          const attrs = partial.rawAttributes;
          const keys = Object.keys(attrs);
          Promise.resolve(newHTML).then((value) => {
            var filteredData = "" + this.filterPartialHTML(value);
            keys.forEach((key, index) => {
              var reg = new RegExp("\\{\\b" + key + "\\b\\}");
              filteredData = filteredData.replace(reg, attrs[key]);
            });
            partial.insertAdjacentHTML("afterend", filteredData);
            partial.remove();
          });
          this.saveFile(root, this.config.output + "/" + fileName);
        });
      });
    } else {
      console.log(
        `Entry file not found. Project must have a \"${this.config.entry}\" file`
      );
    }
  };

  private readPartial = (partialName) => {
    var html = fs.readFileSync(partialName).toString();
    return html;
  };

  private filterPartialHTML = (rawHtml) => {
    const htmlTree = HTMLParser.parse(rawHtml);
    htmlTree.querySelectorAll("ignore").forEach((element) => {
      element.remove();
    });
    return htmlTree;
  };

  private createConfigFile = () => {
    if (!fs.existsSync("./gluu.config.json")) {
      this.saveFile(JSON.stringify(this.config), "gluu.config.json");
    }
    if (!fs.existsSync(this.config.partialDirectory)) {
      fs.mkdir("./" + this.config.partialDirectory + "/", (err) => {
        if (err) {
          return console.error(err);
        }
      });
    }
  };
}
