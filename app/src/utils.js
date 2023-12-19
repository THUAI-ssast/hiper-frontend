export function checkLoggedIn() {
    return localStorage.getItem('jwt') !== null;
}

export var apiUrl = 'http://127.0.0.1:4523/m1/3494933-0-default';
// export var apiUrl = 'http://127.0.0.1:8080/api/v1';