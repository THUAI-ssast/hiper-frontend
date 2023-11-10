export function checkLoggedIn() {
    return localStorage.getItem('jwt') !== null;
}

export var apiUrl = 'http://localhost:3000/api';