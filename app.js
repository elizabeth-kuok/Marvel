const state = {};

let requestParams = {
    apikey: '622acfc296433d3d5fdbe221baa6da38',
    series: 354
};

const resultCountBeginElement = document.getElementById("resultCountBegin");
const resultCountEndElement = document.getElementById("resultCountEnd");
const totalAvailableElement = document.getElementById("totalAvailable");

const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");
const searchBtn = document.getElementById("searchButton");
const searchInput = document.getElementById("search");

displayFavorites();

function request() {
    const loadSpace = document.getElementById("load-space");
    const loadContainer = document.createElement('div');
    loadContainer.id = "loading-container";
    const loadSpin = document.createElement('div');
    loadSpin.id = "loading";
    loadContainer.appendChild(loadSpin);
    loadSpace.appendChild(loadContainer);
    makeRequest(requestParams).then((res) => {
        loadSpace.removeChild(loadContainer);
        displayResponse(res);
    }).catch(err => {
        loadSpace.removeChild(loadContainer);
        alert(err);
    });
}

nextBtn.addEventListener('click', (event) => {
    let offset = state.offset || 0;
    if (offset + state.count < state.total) {
        requestParams.offset = offset + state.count;
        request();
    }
});

prevBtn.addEventListener('click', (event) => {
    let offset = state.offset || 0;
    if (offset > 0) {
        let newOffset = offset - state.count;
        if (newOffset < 0) {
            newOffset = 0;
        }
        requestParams.offset = newOffset;
        request();
    }
});

searchButton.addEventListener('click', (event) => {
    let value = searchInput.value;
    if (value) {
        requestParams.nameStartsWith = value;
        delete requestParams.series;
    } else {
        requestParams.series = 354;
    }
    request();
    event.preventDefault();
});



function clearFavorites() {
    let favoritesDiv = document.getElementById("favorites");
    favoritesDiv.innerHTML = '';
}

function displayFavorites() {
    let hero_ids = Object.keys(localStorage);
    for (let id of hero_ids) {
        let json = localStorage.getItem(id);
        let hero = JSON.parse(json);
        addHeroToFavoritesView(hero);
    }
}

function addHeroToFavoritesView(hero) {
    let favoritesDiv = document.getElementById("favorites");

    let favElement = createHeroFav("fav-" + hero.id, favoritesDiv, hero);

    favElement.addOnRemove((event) => {
        localStorage.removeItem(hero.id); 
        favElement.element.style.opacity = 0;
        setTimeout(() => {
            removeHeroFromFavoritesView(hero);
        }, 1000);
        
        let heroCardElement = document.getElementById("" + hero.id);
        heroCardElement.classList.toggle("favorite");
    });
}

function removeHeroFromFavoritesView(hero) {
    let heroElement = document.getElementById("fav-" + hero.id);
    heroElement.parentNode.removeChild(heroElement);
}

function displayResponse(response) {
    clearDisplay();
    let content = document.getElementById("content");
    let res = JSON.parse(response);
    console.log(res);
    setState(res.data);
    displayResultCount(res.data);
    let results = res.data.results;
    let heroesList = createElementOn(content, "div", "heroes");
    let appearIn = 0;
    for (let hero of results) {
        let heroCard = createHeroCard(hero.id, heroesList, hero);
        
        setTimeout(() => {
            heroCard.element.style.opacity = 1;
        }, appearIn);
        appearIn += 350;

        heroCard.addListener('click', (event) => {
            heroCard.toggleClass("favorite");
            if (localStorage.getItem(hero.id)) {
                localStorage.removeItem(hero.id);
                removeHeroFromFavoritesView(hero);
            } else {
                localStorage.setItem(hero.id, JSON.stringify(hero));
                addHeroToFavoritesView(hero);
            }
        });
    }
}

function clearDisplay() {
    let content = document.getElementById("content");
    content.innerHTML = '';
    removeChildNodes(resultCountBeginElement);
    removeChildNodes(resultCountEndElement);
    removeChildNodes(totalAvailableElement);
}

function removeChildNodes(element) {
    for (let node of element.childNodes) {
        element.removeChild(node);
    }
}

function setState(response_data) {
    state.limit = response_data.limit;
    state.offset = response_data.offset;
    state.count = response_data.count;
    state.total = response_data.total;
}

function displayResultCount(response_data) {
    addTextToElement(resultCountBeginElement, response_data.offset + 1);
    addTextToElement(resultCountEndElement, response_data.offset + response_data.count);
    addTextToElement(totalAvailableElement, response_data.total);
}

function createElementOn(target, tag, id, text) {
    let element = document.createElement(tag);
    if (text) {
        let newContent = document.createTextNode(text);
        element.appendChild(newContent);
    }
    if (id) {
        element.id = id;
    }
    target.appendChild(element);
    return element;
}

function addTextToElement(target, text) {
    let textNode = document.createTextNode(text);
    target.appendChild(textNode);
}

request();