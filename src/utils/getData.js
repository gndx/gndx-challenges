const API = 'https://gateway.marvel.com:443/v1/public/characters?ts=1&apikey=50431933ee745ab63e682cee13d6b2d3&hash=42c731fd85cc027af5f50021c3465997&limit=100';
const getData = async (id) => {
    const apiURl = id ? `${API}&id=${id}` : API;
    try {
        const response = await fetch(apiURl);
        const data = await response.json();
        return data;
    } catch (error) {
        console.log('Fetch Error', error);
    };
};

export default getData;