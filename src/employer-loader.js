import Fuse from 'fuse.js';
import { DEBUG, getProvince } from './util.js';

const employerMap = {};

const prov_2_fuse = {};

export function addEmployer(provName, employer) {
    const prov = getProvince(provName);
    if (!employerMap[prov]) {
        employerMap[prov] = [];
    }
    employerMap[prov].push(employer);
}

export function getEmployerMap() {
    return employerMap;
}


function configureFuse(prov) {
    if (!prov_2_fuse[prov]) {
        if (DEBUG) {
            console.log("constructing fuse for " + prov);
        }
        const options = {
            isCaseSensitive: false,
            threshold: 0.3
        }

        prov_2_fuse[prov] = new Fuse(employerMap[prov], options);

        if (DEBUG) {
            console.log("Fuse for " + prov + " is " + prov_2_fuse[prov]);
        }
    }

    return prov_2_fuse[prov];
}

function processResult(prov, results) {
    console.log("Found the following in " + prov);
    for (const r of results) {
        console.log(r.item);
    }
}

export function searchEmployer(userInput) {
    let resultsToReturn = [];
    let prov = void 0;
    let uinput = void 0;
    if (userInput.indexOf(':') != -1) {
        const provAndName = userInput.split(':');

        if (provAndName.length != 2) {
            console.log("Too many :. Please only enter 1 (this is a dumb program)");
            return employers;
        }
        prov = provAndName[0];
        uinput = provAndName[1];
    }

    let fuseToUse = void 0;
    if (prov && employerMap[prov]) {
        fuseToUse = configureFuse(prov);

        const results = fuseToUse.search(uinput);
        if (results) {
            processResult(prov, results);
            resultsToReturn.push.apply(resultsToReturn, results);
        }
    } else {
        let result = void 0;
        for (const prov in employerMap) {
            fuseToUse = configureFuse(prov);
            if (fuseToUse) {
                const results = fuseToUse.search(userInput);
                if (results) {
                    processResult(prov, results);
                    resultsToReturn.push.apply(resultsToReturn, results);
                    console.log("------------------\n");
                }
            } else if (DEBUG) {
                console.log("no fuse found for " + prov);
            }
        }
    }

    return resultsToReturn;
}