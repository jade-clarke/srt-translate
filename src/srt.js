/*
  This is a "module" file that will be used to parse the SRT file content.
*/

const fs = require("fs");

const SRT_REGEX =
  /(\d+)\n(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})\n([\s\S]+?)(?=\n{2}|\n*$)/g;

// Function to build the SRT file
async function buildSRTFile(filePath, data) {
  let srtContent = "";
  for (const item of data) {
    srtContent += `${item.index}\n${item.startTime} --> ${item.endTime}\n${item.text}\n\n`;
  }

  try {
    fs.writeFileSync(filePath, srtContent, { encoding: "utf-8" });
  } catch (err) {
    console.error(`Error writing file: ${filePath}`);
    console.error(`Error: ${err.message}`);
  }
}

// Function to read the SRT file
async function readSRTFile(filePath, callback) {
  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) {
      return callback(null, err);
    }

    // Use the SRT_REGEX to parse the SRT content
    const parsedData = [];
    let match;
    while ((match = SRT_REGEX.exec(data))) {
      const index = match[1];
      const startTime = match[2];
      const endTime = match[3];
      const text = match[4].trim();
      parsedData.push({ index, startTime, endTime, text });
    }

    if (parsedData.length === 0) {
      return callback(null, new Error("No valid SRT content found"));
    }

    callback(parsedData, null);
  });
}

module.exports = { buildSRTFile, readSRTFile };
