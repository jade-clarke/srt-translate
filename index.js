
const fs = require("fs");

const { parse } = require("./src/cli");
const { readSRTFile, buildSRTFile } = require("./src/srt");
const { authClient, translateText } = require("./src/translate");
const { progressBar } = require("./src/util");

async function main() {
  const options = await parse();
  
  if (!options) {
    return;
  }

  process.stdout.write("Authenticating...");
  const client = await authClient();

  if (!client || client instanceof Error) {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    console.error(`ADC auth failed. ${client.message}`);
    return;
  }
  process.stdout.write("done\n");

  for (const file of options.input) {
    console.log(`Processing file: ${file.filename}`);

    // Read the SRT file
    readSRTFile(file.path, async (data, err) => {
      if (err) {
        console.error("Error reading file.");
        console.error(err);
        return;
      }

      // Translate the SRT content
      await progressBar(async (setup, tick, done) => {
        setup(data.length, "Translating");

        for (let i = 0; i < data.length; i++) {
          data[i].text = await translateText(client, data[i].text, options.language.code);
          tick();
        }

        done();
      })

      // Build the SRT file
      const outFile = file.filename.replace(".srt", `.${options.language.code}.srt`);
      await buildSRTFile(`${options.output.path}/${outFile}`, data);
      console.log(`SRT file written to: ${options.output.path}/${outFile}`);
    });
  }


}

main();