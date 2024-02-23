import path, { dirname } from 'path';
import url from 'url';
import {getEmployerFiles} from './read-files.js';
import { readText, readPDF } from './read-pdf.js';
import { addEmployer, getEmployerMap } from './employer-loader.js';
import * as readline from 'node:readline/promises';  // This uses the promise-based APIs
import { stdin as input, stdout as output } from 'node:process';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


function handleData(name, data) {
    const dataType = typeof(data);
    if (dataType === 'string') {
        // our text files
        const lines = data.split('\n');
        for (const line of lines) {
            addEmployer(name, line);
        }
    } else if (dataType === 'object' && dataType.length) {
        // our pdfs
        for (const line of data) {
            addEmployer(name, line);
        }
    } else {
        console.log("Unknown type " + dataType + " for file " + path);
    }
}


function readingEmployerPDF(name, path, callback) {
    readPDF(path)
        .then(data => {
            handleData(name, data);

            callback();
    })
}

function readingEmployerTXT(name, path, callback) {
    readText(path)
        .then(data => {
            handleData(name, data);

            callback();
        })
}

function process(callback) {
    return new Promise((resolve, reject) => {
        const pathToEmplFiles = (path.dirname(path.basename(__dirname)) + "/names/");

        let total = -1;
        let count = 0;

        const cb = () => {
            count++;
            if (total == count) {
                callback();
            }
        }

        getEmployerFiles(pathToEmplFiles)
            .then(files => {
                total = files.length;
                for (let file of files) {
                    if (file.type === 'PDF') {
                        readingEmployerPDF(file.path, path.join(pathToEmplFiles, file.path), cb);
                    } else if (file.type === 'TXT') {
                        readingEmployerTXT(file.path, path.join(pathToEmplFiles, file.path), cb);
                    } else {
                        console.log("unkown type " + file.type);
                    }
                }
            });
    });
}

function detailEmployerInfo() {
    const map = getEmployerMap();
    for (var prop in map) {
        console.log("Found " + map[prop].length + " employers in " + prop);
    }
}

function searchForEmployer(employerName) {
    
}

function promptUser() {
    const rl = readline.createInterface({
        input, output
    });

    rl.setPrompt("Enter employer name (or \"exit\" to close):\n");

    rl.on('line', (userInput) => {
        if (userInput === 'exit') {
            rl.close();
        } else {

            rl.prompt();
        }
    });

    rl.prompt();
}

function main() {
    console.log("... loading");
    process(() => {
        console.log("COMPLETE");
        detailEmployerInfo();

        promptUser();
    });
}


main();