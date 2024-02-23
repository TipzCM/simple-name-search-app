import * as fs from 'fs';

function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

export function getEmployerFiles(dir) {
    return new Promise((resolve, reject) => {
        fs.readdir(dir, 'utf8', (err, files) => {
            const retVal = [];
            for (let file of files) {
                retVal.push({
                    "type": endsWith(file, ".pdf") ? "PDF" : "TXT",
                    "path": file
                });
            }

            resolve(retVal);
        });
    });
}

