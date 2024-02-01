import { searchCall, genList } from "./app.js";

const saveLS = (fav) => {
    let favorites = getLS();
    favList.innerHTML = '';
    !favorites.includes(fav) ? favorites.push(fav) : removeLS(fav, favorites);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    favorites.includes(fav) ? favoriteBtn.textContent = "Unfavorite this Pokemon" : favoriteBtn.textContent = "Favorite this Pokemon";
    genList(favorites);
}

const getLS = () => {
    let lsData = localStorage.getItem('favorites');
    if (lsData == null) {
        return []
    } else {
        return JSON.parse(lsData);
    }
}

const removeLS = (fav, favorites) => {
    let namedIndex = favorites.indexOf(fav);
    favorites.splice(namedIndex, 1);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    favorites.includes(fav) ? favoriteBtn.textContent = "Unfavorite this Pokemon" : favoriteBtn.textContent = "Favorite this Pokemon";
}

export { saveLS, getLS, removeLS };