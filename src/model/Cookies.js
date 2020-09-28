import Cookies from 'universal-cookie';

const cookies = new Cookies();

const saveCookie = (key, data) => {
    let segundos = 3600; //1 hora
    cookies.set(key, data, {
        path: '/',
        expires: new Date(Date.now() + (segundos*1000)) //en 1 hora se elimina la cookie
    });
}

const loadCookie = (key) => {
    return cookies.get(key);
}

const deleteCookie = (key) => {
    cookies.remove(key);
}

export { saveCookie, loadCookie, deleteCookie };