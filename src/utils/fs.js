"use strict";
exports.__esModule = true;
exports.rmDir = exports.fileExists = exports.readFileSync = exports.readFile = exports.checkDirectory = exports.saveDataToFile = exports.mkDir = void 0;
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
var checkDirectory = function (filePath) {
    var dir = path.parse(filePath).dir;
    console.log("checking for " + filePath);
    if (!fs.existsSync(dir)) {
        console.log("Creating" + dir);
        fs.mkdirSync(dir, { recursive: true });
    }
};
exports.checkDirectory = checkDirectory;
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
