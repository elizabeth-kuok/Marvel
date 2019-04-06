function DisplayElement(id, parent) {
    this.parent = parent;
    this.element = document.createElement('div');
    this.element.id = id;
    this.listeners = {};
}
DisplayElement.prototype.display = function() {
    this.parent.appendChild(this.element);
}
DisplayElement.prototype.addText = function(text) {
    let textNode = document.createTextNode(text);
    this.element.appendChild(textNode);
}
DisplayElement.prototype.addClass = function(class_name) {
    this.element.classList.add(class_name);
}
DisplayElement.prototype.toggleClass = function (class_name) {
    this.element.classList.toggle(class_name);
}
DisplayElement.prototype.addListener = function(name, cb) {
    this.element.addEventListener(name, cb);
    if (this.listeners[name]) {
        this.listeners[name].push(cb);
    } else {
        this.listeners[name] = [cb];
    }
}
DisplayElement.prototype.setInnerHtml = function(html) {
    this.element.innerHTML = html;
}

function HeroCard(id, parent) {
    DisplayElement.call(this, id, parent);
}
HeroCard.prototype = Object.create(DisplayElement.prototype);
Object.defineProperty(HeroCard.prototype, 'constructor', {
    value: HeroCard,
    enumerable: false,
    writable: true
});

HeroCard.prototype.createInnerHtml = function (hero_data) {
    return `
        <div class="media">
            <img src="${hero_data.thumbnail.path + "." + hero_data.thumbnail.extension}" class="img-thumbnail img-200 align-self-center mr-3" alt=${hero_data.name}>
            <div class="media-body">
                <h5 class="mt-0">${hero_data.name}</h5>
                <p>${hero_data.description}</p>
            </div>
        </div>`;
}

function createHeroCard(id, parent, data) {
    const hero = new HeroCard(id, parent);
    hero.addClass('hero-card');
    if (localStorage.getItem(data.id)) {
        hero.addClass('favorite');
    }
    hero.setInnerHtml( hero.createInnerHtml(data) );
    hero.display();
    return hero;
}