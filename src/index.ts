#!/usr/bin/env node
var HTMLParser = require("node-html-parser");
const prettier = require("prettier");
var glob = require("glob");
import {
  checkDirectory,
  fileExists,
  mkDir,
  readFileSync,
  rmDir,
  saveDataToFile,
} from "./utils/fs";

const defaultConfig = {
  partialDirectory: "partials",
  syntax: "partial",
  output: "dist",
  ext: ".html",
  src: ".",
  pretty: false,
};

export class Gluu {
  private config = { ...defaultConfig };
  private showLogs = false;
  private prettify = true;
  constructor(args: any) {
    if (args.includes("--logs") || args.includes("-l")) {
      this.showLogs = true;
      console.log("================");
      console.log("Debug Mode Enabled");
      console.log("================");
    }

    this.initialize();
    if (args.includes("init")) {
      this.createConfigFile();
    } else {
      this.readConfigFile();
      if (args.includes("--pretty=false") || this.config.pretty == false) {
        this.prettify = false;
      }
      this.readEntryDir(this.config.src);
    }
  }

  private readEntryDir = (path: string) => {
    glob(path + "/**/*" + this.config.ext, (er: any, files: string[]) => {
      if (er) {
        return console.log(er);
      }
      files.forEach((file) => this.processFile(file));
    });
  };
  private readConfigFile = () => {
    if (fileExists("./gluu.config.json")) {
      const data = readFileSync("./gluu.config.json");
      this.config = { ...JSON.parse(data) };
    } else {
      if (this.showLogs)
        console.log("cannot read: gluu.config.json doesn't exists.");
    }
  };

  private initialize = () => {
    if (this.showLogs)
      console.log("creating " + this.config.output + " directory");
    if (fileExists("./" + this.config.output + "/")) {
      rmDir("./" + this.config.output + "/", () => {
        mkDir("./" + this.config.output + "/");
      });
    } else {
      mkDir("./" + this.config.output + "/");
    }
  };

  private saveFile = (data: any, fileName: string) => {
    if (this.showLogs) console.log("generating " + fileName);
    const formattedData = prettier.format("" + data, {
      semi: false,
      parser: "html",
    });
    fileName = fileName.replace(this.config.src + "/", "");
    checkDirectory(fileName);
    saveDataToFile(fileName, this.prettify ? formattedData : data);
  };

  private processFile = (fileName: string) => {
    const data = readFileSync(fileName);
    const root = HTMLParser.parse(data);
    const partials = root.querySelectorAll(this.config.syntax);
    if (partials.length === 0)
      return this.saveFile(root, this.config.output + "/" + fileName);
    partials.forEach((partial: HTMLElement, index: number) => {
      const partialName = partial.getAttribute("name");
      const attrs = partial.attributes;
      const keys = Object.keys(attrs);
      const partialFileData = readFileSync(
        "./" + this.config.partialDirectory + "/" + partialName
      );
      let filteredData = "" + this.filterPartialHTML(partialFileData);
      keys.forEach((key) => {
        let reg = new RegExp("\\{\\b" + key + "\\b\\}");

        filteredData = filteredData.replace(reg, attrs[key]);
        filteredData = filteredData.replace("{content}", partial.innerHTML);
      });
      partial.insertAdjacentHTML("afterend", filteredData);
      partial.remove();
      if (partials.length === index + 1) {
        this.saveFile(root, this.config.output + "/" + fileName);
      }
    });
  };

  private filterPartialHTML = (rawHtml: string) => {
    const htmlTree = HTMLParser.parse(rawHtml);
    htmlTree.querySelectorAll("ignore").forEach((element) => {
      element.remove();
    });
    return htmlTree;
  };

  private createConfigFile = () => {
    if (!fileExists("./gluu.config.json")) {
      this.saveFile(JSON.stringify(this.config), "gluu.config.json");
    }
    if (!fileExists(this.config.partialDirectory)) {
      mkDir("./" + this.config.partialDirectory + "/");
    }
  };
}
