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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.Gluu = void 0;
var HTMLParser = require("node-html-parser");
var fs_1 = require("./utils/fs");
var defaultConfig = {
    partialDirectory: "partials",
    syntax: "partial",
    output: "dist",
    ext: ".html",
    src: "."
};
var Gluu = /** @class */ (function () {
    function Gluu(args) {
        var _this = this;
        this.config = __assign({}, defaultConfig);
        this.showLogs = false;
        this.readEntryDir = function (path) { return __awaiter(_this, void 0, void 0, function () {
            var files;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fs_1.readFilesInDir(path, this.config.ext)];
                    case 1:
                        files = _a.sent();
                        files.forEach(function (file) { return _this.processFile(file); });
                        return [2 /*return*/];
                }
            });
        }); };
        this.readConfigFile = function () {
            if (fs_1.fileExists("./gluu.config.json")) {
                fs_1.readFile("./gluu.config.json", function (data) {
                    _this.config = __assign({}, JSON.parse(data));
                });
            }
            else {
                if (_this.showLogs)
                    console.log("cannot read: gluu.config.json doesn't exists.");
            }
        };
        this.initialize = function () {
            if (_this.showLogs)
                console.log("creating " + _this.config.output + " directory");
            if (!fs_1.fileExists("./" + _this.config.output + "/")) {
                fs_1.mkDir("./" + _this.config.output + "/");
            }
        };
        this.saveFile = function (data, fileName) {
            if (_this.showLogs)
                console.log("generating " + fileName);
            fs_1.saveDataToFile(fileName, data);
        };
        this.processFile = function (fileName) {
            fs_1.readFile(fileName, function (data) {
                var root = HTMLParser.parse(data);
                var partials = root.querySelectorAll(_this.config.syntax);
                partials.forEach(function (partial) {
                    var partialName = partial.getAttribute("name");
                    var newHTML = _this.readPartial("./" + _this.config.partialDirectory + "/" + partialName);
                    var attrs = partial.attributes;
                    var keys = Object.keys(attrs);
                    Promise.resolve(newHTML).then(function (value) {
                        var filteredData = "" + _this.filterPartialHTML(value);
                        keys.forEach(function (key, index) {
                            var reg = new RegExp("\\{\\b" + key + "\\b\\}");
                            filteredData = filteredData.replace(reg, attrs[key]);
                            filteredData = filteredData.replace("{content}", partial.innerHTML);
                        });
                        partial.insertAdjacentHTML("afterend", filteredData);
                        partial.remove();
                    });
                    _this.saveFile(root, _this.config.output + "/" + fileName);
                });
            });
        };
        this.readPartial = function (partialName) {
            var html = fs_1.readFileSync(partialName);
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
            if (!fs_1.fileExists("./gluu.config.json")) {
                _this.saveFile(JSON.stringify(_this.config), "gluu.config.json");
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
