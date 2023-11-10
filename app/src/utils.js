export function checkLoggedIn() {
    return localStorage.getItem('jwt') !== null;
}

export var apiUrl = 'https://mock.apifox.com/m1/3494933-0-default';