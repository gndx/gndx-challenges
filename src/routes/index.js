import Header from '../templates/Header';
import Home from '../pages/Home';
import Character from '../pages/Character';
import Error404 from '../pages/Error404';
import getHash from '../utils/getHash';
import resolveRoutes from '../utils/resolveRoutes';

const routes = {
    '/': Home,
    '/:id': Character
};

const router = async () => {
    const header = null || document.getElementById('header');
    const content = null || document.getElementById('content');
    header.innerHTML = await Header();
    let hash = getHash();
    let route = await resolveRoutes(hash);
    let render = routes[route] ? routes[route] : Error404;
    content.innerHTML = await render();
    const botonverde = document.getElementById('backpage');
    console.log(botonverde);
    botonverde.addEventListener('click', backhistory);
    function backhistory() {
        window.history.back();
        console.log("osidjuisdfhgi");
    }
};

export default router;