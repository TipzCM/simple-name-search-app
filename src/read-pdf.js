import * as fs from 'fs';
import { PdfReader } from 'pdfreader';
import { getProvince, DEBUG } from './util.js';


const NB_BULLET = "•";

const NS_TEXT_TO_IGNORE = [
    "Current as of January 31, 2024", "|", "P a g e",
    "Atlantic Immigration Program Designated Employers",
    "The following is a list of employers designated in Nova Scotia under the Atlantic Immigration Program.",
    "This list does not indicate that these employers are hiring. Designated employers are required to",
    "advertise vacancies to be filled.",
    "Positions with designated employers can be found by searching Canadian and Nova Scotian job search",
    "websites such as explorecareers.novascotia.ca/job search.",
    "If you are looking for a position with a designated employer, you are encouraged to apply for advertised",
    "vacancies",
    "--",
    "Employeurs désignés du Programme d'immigration au Canada atlantique",
    "Voici une liste des employeurs désignés en Nouvelle-Écosse dans le cadre du Programme d'immigration",
    "au Canada atlantique. Cette liste n'indique pas que ces employeurs ont actuellement des postes à",
    "pourvoir. Les employeurs désignés sont tenus de publier les postes à pourvoir.",
    "Les postes à pourvoir chez les employeurs désignés peuvent être consultés dans les sites Web de",
    "recherche d'emploi au Canada et en Nouvelle-Écosse, par exemple :",
    "explorecareers.novascotia.ca/job_search (en anglais seulement).",
    "Si vous souhaitez obtenir un emploi auprès d'un employeur désigné, nous vous encourageons à",
    "présenter une demande en réponse à l'une des offres d'emplois publiées."
];

function shouldIncludeNSText(text) {
    for (const str of NS_TEXT_TO_IGNORE) {
        if (str.includes(text)) {
            return false;
        }
    }
    return true;
}



// https://www.npmjs.com/package/pdfreader
export function readPDF(path) {
    const pdfReader = new PdfReader();
    return new Promise((resolve, reject) => {
        const lines = [];
        let takeNext = false;
        const prov = getProvince(path);
        pdfReader.parseFileItems(path, (err, item) => {
            if (err) {
                reject(err);
                return;
            }

            if (!item) {
                if (DEBUG) {
                    console.log("EOF");
                }
                resolve(lines);
            } else if (item.text) {
                if (takeNext) {
                    lines.push(item.text);
                    takeNext = false;
                } else if (prov === 'NB') {
                    if (item.text === NB_BULLET) {
                        takeNext = true;
                    }
                } else if (prov === 'NS') {
                    if (takeNext) {
                        lines.push(item.text);
                    } else {
                        if (shouldIncludeNSText(item.text)) {
                            lines.push(item.text);
                        }
                    }
                } else {
                    if (DEBUG) {
                        console.log("unrecognized province " + path);
                        console.log(item.text);
                    }
                }
            } else {
                if (item.page && prov === 'NS' && item.page > 1) {
                    takeNext = true;
                }
                // console.log("non text item");
            }
        });
    })
}

export function readText(path) {
    return new Promise((resolve, reject) => {
        let buffer = fs.readFileSync(path, { encoding: "utf-8" });

        resolve(buffer);
    });
}

