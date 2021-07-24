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
var fs = require("fs");
var defaultConfig = {
    partialDirectory: "partials",
    syntax: "partial",
    output: "dist",
    entry: "index.html"
};
var Gluu = /** @class */ (function () {
    function Gluu(args) {
        var _this = this;
        this.config = __assign({}, defaultConfig);
        this.readConfigFile = function () {
            if (fs.existsSync("./gluu.config.json")) {
                fs.readFile("./gluu.config.json", "utf8", function (err, data) {
                    if (err) {
                        console.log(err);
                        return err;
                    }
                    _this.config = __assign({}, JSON.parse(data));
                    _this.processFile(_this.config.entry);
                });
            }
        };
        this.initialize = function () {
            if (fs.existsSync("./" + _this.config.output + "/")) {
                fs.rmdirSync("./" + _this.config.output + "/", { recursive: true });
            }
            fs.mkdir("./" + _this.config.output + "/", function (err) {
                if (err) {
                    return console.error(err);
                }
            });
        };
        this.saveFile = function (data, fileName) {
            _this.initialize();
            var stream = fs.createWriteStream("./" + fileName);
            stream.once("open", function (fd) {
                var html = "" + data;
                stream.end(html);
            });
        };
        this.processFile = function (fileName) {
            if (fileName == "")
                return console.log("Entry point file is required.");
            if (fs.existsSync(fileName)) {
                fs.readFile(fileName, "utf8", function (err, data) {
                    if (err) {
                        return console.log(err);
                    }
                    var root = HTMLParser.parse(data);
                    var partials = root.querySelectorAll(_this.config.syntax);
                    partials.forEach(function (partial) {
                        var partialName = partial.getAttribute("name");
                        var newHTML = _this.readPartial("./" + _this.config.partialDirectory + "/" + partialName);
                        var attrs = partial.rawAttributes;
                        var keys = Object.keys(attrs);
                        Promise.resolve(newHTML).then(function (value) {
                            var filteredData = "" + _this.filterPartialHTML(value);
                            keys.forEach(function (key, index) {
                                var reg = new RegExp("\\{\\b" + key + "\\b\\}");
                                filteredData = filteredData.replace(reg, attrs[key]);
                            });
                            partial.insertAdjacentHTML("afterend", filteredData);
                            partial.remove();
                        });
                        _this.saveFile(root, _this.config.output + "/" + fileName);
                    });
                });
            }
            else {
                console.log("Entry file not found. Project must have a \"" + _this.config.entry + "\" file");
            }
        };
        this.readPartial = function (partialName) {
            var html = fs.readFileSync(partialName).toString();
            return html;
        };
        this.filterPartialHTML = function (rawHtml) {
            var htmlTree = HTMLParser.parse(rawHtml);
            htmlTree.querySelectorAll("ignore").forEach(function (element) {
                element.remove();
            });
            return htmlTree;
        };
        this.createConfigFile = function () {
            if (!fs.existsSync("./gluu.config.json")) {
                _this.saveFile(JSON.stringify(_this.config), "gluu.config.json");
            }
            if (!fs.existsSync(_this.config.partialDirectory)) {
                fs.mkdir("./" + _this.config.partialDirectory + "/", function (err) {
                    if (err) {
                        return console.error(err);
                    }
                });
            }
        };
        if (args.includes("init")) {
            this.createConfigFile();
            this.initialize();
        }
        else {
            this.readConfigFile();
        }
    }
    return Gluu;
}());
exports.Gluu = Gluu;
