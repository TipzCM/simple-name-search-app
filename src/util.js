
export const DEBUG = false;

export function getProvince(path) {
    if (path.includes('nb_')) {
        return 'NB';
    } else if (path.includes('ns_')) {
        return 'NS';
    } else if (path.includes('nfld')) {
        return 'NFLD';
    } else if (path.includes('pei')) {
        return 'PEI';
    } else {
        return 'UNKNOWN'
    }
}