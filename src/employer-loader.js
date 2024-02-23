import { getProvince } from './util.js';

const employerMap = {};

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