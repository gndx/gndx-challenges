import getHash from '../utils/getHash';
import getData from '../utils/getData';

const Character = async () => {
    const id = getHash();
    const character = await getData(id);
    const view =  `
    <div class="Characters-inner">
        ${character.data.results.map(character => `
                <article class="Characters-card">
                    <img src="${character.thumbnail.path}.jpg" alt="${character.name}">
                    <h2>${character.name}</h2>
                </article>
                <article class="Characters-card">
                    <h3>Comics: <span>${character.comics.available}</span></h3>
                    <h3>Series: <span>${character.series.available}</span></h3>
                    <h3>Stories: <span>${character.stories.available}</span></h3>
                </article>
        `).join('')
        }
    </div>`;
    return view;
};
export default Character;