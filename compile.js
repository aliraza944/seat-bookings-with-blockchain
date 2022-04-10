import fs from "fs-extra";
import path from "path";
import solc from "solc";
const __dirname = path.resolve();
const buildPath = path.resolve(__dirname, "build");
fs.removeSync(buildPath);

const bookingsPath = path.resolve(__dirname, "contracts", "Bookings.sol");
const source = fs.readFileSync(bookingsPath, "utf8");

const input = {
  language: "Solidity",
  sources: {
    "Bookings.sol": {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["*"],
      },
    },
  },
};

const output = JSON.parse(solc.compile(JSON.stringify(input))).contracts[
  "Bookings.sol"
].Bookings;

const { abi, evm } = output;

fs.ensureDirSync(buildPath);

fs.outputJSONSync(path.resolve(buildPath, "abi.js"), abi);
fs.outputJSONSync(path.resolve(buildPath, "evm.js"), evm);
