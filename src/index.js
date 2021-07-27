#!/usr/bin/env node
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.Gluu = void 0;
var HTMLParser = require("node-html-parser");
var glob = require("glob");
var fs_1 = require("./utils/fs");
var defaultConfig = {
    partialDirectory: "partials",
    syntax: "partial",
    output: "dist",
    src: "."
};
var Gluu = /** @class */ (function () {
    function Gluu(args) {
        var _this = this;
        this.config = __assign({}, defaultConfig);
        this.showLogs = false;
        this.readEntryDir = function (path) {
            glob(path + "/**/*", function (er, files) {
                if (er) {
                    return console.log(er);
                }
                files.forEach(function (file) {
                    if (file.match("/" + _this.config.partialDirectory + "/"))
                        return false;
                    if (file.match("/node_modules/"))
                        return false;
                    if (fs_1.isDirectory(file))
                        return false;
                    return _this.processFile(file);
                });
                if (_this.showLogs)
                    console.log("Copying static files to dist...");
            });
        };
        this.readConfigFile = function () {
            if (fs_1.fileExists("./gluu.config.json")) {
                var data = fs_1.readFileSync("./gluu.config.json");
                _this.config = __assign({}, JSON.parse(data));
            }
            else {
                if (_this.showLogs)
                    console.log("cannot read: gluu.config.json doesn't exists.");
            }
        };
        this.initialize = function () {
            if (_this.showLogs)
                console.log("creating " + _this.config.output + " directory");
            if (fs_1.fileExists("./" + _this.config.output + "/")) {
                fs_1.rmDir("./" + _this.config.output + "/", function () {
                    fs_1.mkDir("./" + _this.config.output + "/");
                });
            }
            else {
                fs_1.mkDir("./" + _this.config.output + "/");
            }
        };
        this.saveFile = function (data, fileName, fileOnly) {
            if (fileOnly === void 0) { fileOnly = false; }
            if (_this.showLogs)
                console.log("generating " + fileName);
            // const formattedData = prettier.format("" + data, {
            //   semi: false,
            //   parser: "html",
            // });
            fileName = fileName.replace(_this.config.src + "/", "");
            if (!fileOnly) {
                fs_1.checkDirectory(fileName, _this.showLogs);
            }
            1;
            fs_1.saveDataToFile(fileName, data);
        };
        this.processFile = function (fileName) {
            var data = fs_1.readFileSync(fileName);
            var root = HTMLParser.parse(data);
            var partials = root.querySelectorAll(_this.config.syntax);
            if (partials.length === 0)
                return _this.saveFile(root, _this.config.output + "/" + fileName);
            partials.forEach(function (partial, index) {
                var partialName = partial.getAttribute("name");
                var attrs = partial.attributes;
                var keys = Object.keys(attrs);
                var partialFileData = fs_1.readFileSync("./" + _this.config.partialDirectory + "/" + partialName);
                var filteredData = "" + _this.filterPartialHTML(partialFileData);
                keys.forEach(function (key) {
                    var reg = new RegExp("\\{\\b" + key + "\\b\\}");
                    filteredData = filteredData.replace(reg, attrs[key]);
                    filteredData = filteredData.replace("{content}", partial.innerHTML);
                });
                partial.insertAdjacentHTML("afterend", filteredData);
                partial.remove();
                if (partials.length === index + 1) {
                    _this.saveFile(root, _this.config.output + "/" + fileName);
                }
            });
        };
        this.filterPartialHTML = function (rawHtml) {
            var htmlTree = HTMLParser.parse(rawHtml);
            htmlTree.querySelectorAll("ignore").forEach(function (element) {
                element.remove();
            });
            return htmlTree;
        };
        this.createConfigFile = function () {
            if (!fs_1.fileExists("./gluu.config.json")) {
                _this.saveFile(JSON.stringify(_this.config), "gluu.config.json", true);
            }
            if (!fs_1.fileExists(_this.config.partialDirectory)) {
                fs_1.mkDir("./" + _this.config.partialDirectory + "/");
            }
        };
        if (args.includes("--logs") || args.includes("-l")) {
            this.showLogs = true;
            console.log("================");
            console.log("Debug Mode Enabled");
            console.log("================");
        }
        this.initialize();
        if (args.includes("init")) {
            this.createConfigFile();
        }
        else {
            this.readConfigFile();
            this.readEntryDir(this.config.src);
        }
    }
    return Gluu;
}());
exports.Gluu = Gluu;
