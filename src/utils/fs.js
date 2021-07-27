"use strict";
exports.__esModule = true;
exports.rmDir = exports.fileExists = exports.readFileSync = exports.readFile = exports.isDirectory = exports.checkDirectory = exports.saveDataToFile = exports.copyFile = exports.mkDir = void 0;
var fs = require("fs");
var path = require("path");
var mkDir = function (path) {
    fs.mkdir(path, function (err) {
        if (err) {
            console.error(err);
            return err;
        }
    });
};
exports.mkDir = mkDir;
var copyFile = function (src, dist) {
    fs.copyFileSync(src, dist);
};
exports.copyFile = copyFile;
var saveDataToFile = function (fileName, data) {
    try {
        var stream = fs.createWriteStream("./" + fileName);
        stream.once("open", function (fd) {
            var html = "" + data;
            stream.end(html);
        });
    }
    catch (err) {
        console.log(err);
    }
};
exports.saveDataToFile = saveDataToFile;
var checkDirectory = function (filePath, showLogs) {
    if (showLogs === void 0) { showLogs = false; }
    var dir = path.parse(filePath).dir;
    if (showLogs)
        console.log("checking for " + filePath);
    if (!fs.existsSync(dir)) {
        if (showLogs)
            console.log("Creating" + dir);
        fs.mkdirSync(dir, { recursive: true });
    }
};
exports.checkDirectory = checkDirectory;
var isDirectory = function (path) {
    return fs.lstatSync(path).isDirectory();
};
exports.isDirectory = isDirectory;
var readFile = function (fileName, fn) {
    fs.readFile(fileName, "utf8", function (err, data) {
        if (err) {
            return console.log(err);
        }
        fn(data);
    });
};
exports.readFile = readFile;
var readFileSync = function (partialName) {
    return fs.readFileSync(partialName).toString();
};
exports.readFileSync = readFileSync;
var fileExists = function (filePath) {
    if (fs.existsSync(filePath)) {
        return true;
    }
    return false;
};
exports.fileExists = fileExists;
var rmDir = function (dirPath, fn) {
    fs.rmSync(dirPath, { recursive: true, force: true });
    fn();
};
exports.rmDir = rmDir;
