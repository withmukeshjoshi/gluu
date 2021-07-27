import * as fs from "fs";
const path = require("path");
export const mkDir = (path: string) => {
  fs.mkdir(path, (err) => {
    if (err) {
      console.error(err);
      return err;
    }
  });
};

export const saveDataToFile = (fileName: string, data: any) => {
  try {
    var stream = fs.createWriteStream("./" + fileName);
    stream.once("open", function (fd) {
      var html = "" + data;
      stream.end(html);
    });
  } catch (err) {
    console.log(err);
  }
};
export const checkDirectory = (filePath: string) => {
  const dir = path.parse(filePath).dir;
  console.log("checking for " + filePath);
  if (!fs.existsSync(dir)) {
    console.log("Creating" + dir);
    fs.mkdirSync(dir, { recursive: true });
  }
};
export const readFile = (fileName: string, fn: (data: string) => void) => {
  fs.readFile(fileName, "utf8", (err, data) => {
    if (err) {
      return console.log(err);
    }
    fn(data);
  });
};

export const readFileSync = (partialName: string) => {
  return fs.readFileSync(partialName).toString();
};

export const fileExists = (filePath: string) => {
  if (fs.existsSync(filePath)) {
    return true;
  }
  return false;
};
export const rmDir = (dirPath: string, fn: () => void) => {
  fs.rmSync(dirPath, { recursive: true, force: true });
  fn();
};
