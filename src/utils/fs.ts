import * as fs from "fs";
import * as path from "path";
export const mkDir = (path: string) => {
  fs.mkdir(path, (err) => {
    if (err) {
      console.error(err);
      return err;
    }
  });
};

export const readFilesInDir = (dirPath: string, ext: string): string[] => {
  const fileArray = fs.readdirSync(dirPath);
  const filteredArray = fileArray.filter((item) => path.extname(item) === ext);
  return filteredArray;
};

export const saveDataToFile = (fileName, data) => {
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

export const readFile = (fileName, fn: (data: string) => void) => {
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
