const fs = require("fs");
const path = require("path");

const commandLineArgs = require("command-line-args");
const commandLineUsage = require("command-line-usage");

const { checkLanguages } = require("./translate");

const BASE_LOCALE = { name: "English", code: "en" };

class FileDetails {
  constructor(_path) {
    this.path = path.resolve(_path);
    this.exists = fs.existsSync(_path) && fs.statSync(_path).isFile();
    if (this.exists) {
      this.stats = fs.statSync(_path);
      this.directory = path.dirname(_path);
      this.filename = path.basename(_path);
      this.extension = path.extname(_path);
      this.valid = this.extension === ".srt";
    }
  }
}

class FolderDetails {
  constructor(_path) {
    this.path = path.resolve(_path);
    this.exists = fs.existsSync(_path) && fs.statSync(_path).isDirectory();
  }
}

const optionDefinitions = [
  {
    name: "language",
    alias: "l",
    typeLabel: "{underline code}",
    description:
      'The language code for the language to translate to. Example: "ja" for Japanese.',
    type: (lang) => checkLanguages(lang) || BASE_LOCALE,
    defaultValue: BASE_LOCALE,
  },
  {
    name: "input",
    alias: "i",
    typeLabel: "{underline filepath}",
    description:
      "A filepath for a .srt to translate. Can be specified multiple times.",
    type: (file) => new FileDetails(file),
    multiple: true,
    defaultOption: true,
    defaultValue: [],
  },
  {
    name: "output",
    alias: "o",
    typeLabel: "{underline folder}",
    description: "The output folder to write to.",
    type: (path) => new FolderDetails(path),
    defaultValue: undefined,
  },
  {
    name: "help",
    alias: "h",
    typeLabel: "",
    description: "Print this usage guide.",
    type: Boolean,
  },
];

async function helpDocs() {
  const sections = [
    {
      header: "SRT Translator",
      content:
        "Translate SRT files to a different language. \n\n" +
        "Translated files will be saved in the output folder with the languege code added before the file extension. Example: 'file.srt' -> 'file.ja.srt'. \n\n" +
        "The default language is English (en). \n\n" +
        "Currently only supports translating to one language at a time. \n" +
        "Requires a Google Cloud ADC serive account to be set up.",
    },
    {
      header: "Options",
      optionList: optionDefinitions,
    },
  ];

  console.log(commandLineUsage(sections));
}

async function parse() {
  const options = commandLineArgs(optionDefinitions);
  return (await validate(options)) ? options : undefined;
}

async function validate(options) {
  if (options.help) {
    await helpDocs();
    return false;
  }

  if (options.input.length === 0) {
    console.error("No input files specified. Check -h for help.");
    return false;
  }

  if (options.input.filter((file) => !file.exists || !file.valid).length > 0) {
    console.error("One or more input files aren't valid. Check -h for help.");
    return false;
  }

  if (!options.output) {
    console.error("No output folder specified. Check -h for help.");
    return false;
  }

  if (!options.output.exists) {
    console.error("Output folder doesn't exist. Check -h for help.");
    return false;
  }

  return true;
}

module.exports = { parse };
