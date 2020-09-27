import getData from '../utils/getData';

const Home = async () => {
    const characters = await getData();
    const view = `
    <div class="Characters">
        ${characters.data.results.map(character => `
        <article class="Characters-item">
            <a href="#/${character.id}/">
                <img src="${character.thumbnail.path}.jpg" alt="${character.name}">
                <h2>${character.name}</h2>
            </a>
        </article>
        `).join('')
        } 
    </div>
`;
    return view;
};
export default Home;