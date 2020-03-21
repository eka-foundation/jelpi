window.l = console.log;
let Jelpi = {};
Jelpi.helper = {
  isAndroid: () => {
    return navigator.userAgent.toLowerCase().indexOf('android') > -1;
  },
  isTouch: () => {
    try {
      document.createEvent("TouchEvent");
      return true;
    } catch (e) {}
    return false;
  },
  isTest: () => {
    // return false;
    return /^https?:\/\/127\.0\.0\.1/.test( location.href );
  },
  crowFlightBetweenCoordinates: (a, b) => {
    let getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
      var R = 6371; // Radius of the earth in km
      var dLat = deg2rad(lat2-lat1);  // deg2rad below
      var dLon = deg2rad(lon2-lon1); 
      var a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2)
        ; 
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      var d = R * c; // Distance in km
      return d;
    };
    let deg2rad = (deg) => {
      return deg * (Math.PI/180)
    };
    return getDistanceFromLatLonInKm(a.latitude, a.longitude, b.latitude, b.longitude);
  },
  pushEmptyURL: () => {
    const state = {};
    const title = '';
    const url = '.';
    history.pushState(state, title, url);
  },
  date: class {
    constructor(timeStamp) {
      this.timeStamp = timeStamp;
    }
    getObject() {
      let date = new Date(this.timeStamp);
      return {
        s: date.getSeconds(),

        i: date.getMinutes().toString().padStart(2, '0'),

        G: ( date.getHours() % 12 ),
        h:   date.getHours().toString().padStart(2, '0'),
        H: ( date.getHours() % 12 ).toString().padStart(2, '0'),

        j: date.getDate().toString().padStart(2, '0'),
        d: date.getDate().toString().padStart(2, '0'),

        n: date.getMonth() + 1,
        m: ( date.getMonth() + 1 ).toString().padStart(2, '0'),

        Y: date.getFullYear(),
      };
    }
    isToday() {
      let date = new Date(this.timeStamp),
      today = new Date();
      return today.getFullYear() === date.getFullYear()
        && today.getMonth() === date.getMonth()
        && today.getDate() === date.getDate();
    }
    isYesterday() {
      let date = new Date(this.timeStamp),
      yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      return yesterday.getFullYear() === date.getFullYear()
        && yesterday.getMonth() === date.getMonth()
        && yesterday.getDate() === date.getDate();
    }
  }
}
Jelpi.main = class {
  constructor() {
    this.frontPage = new Jelpi.frontPage(this);
    this.menu = new Jelpi.menu(this);
    this.asks = new Jelpi.asks(this);
  }
  init() {
    this.frontPage.init();
    this.menu.init();
    this.asks.init();
  }
  locate(callback) {
    if( this.hasOwnProperty('location') ){
      callback( this.location );
      return;
    }
    let mock = {
      coords: {
        latitude: 61.92410999999999,
        longitude: 25.748151,
        altitude: null,
        accuracy: 472109,
        altitudeAccuracy: null,
        heading: null,
        speed: null
      },
      timestamp: Date.now()
    };
    // mock = null;
    let onError = () => {
      callback(null);
    },
    onSuccess = (locationResult) => {
      // l('locationResult3');
      this.location = locationResult;
      callback( this.location );
    };
    if( Jelpi.helper.isTest() ){
      setTimeout(() => { mock ? onSuccess(mock) : onError(); }, 700);
      return;
    }
    if( !navigator.geolocation ){
      onError();
    } else {
      navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }
  }
  page(value) {
    value === 'givehelp' && this.asks.update();
    let body = document.body,
    classname = value.length ? ` page-${value}` : ' ';
    body.className = body.className.replace( /(^|\s)page-[^\s]+|$/, classname );
  }
}
Jelpi.asks = class {
  constructor(parent) {
    this.parent = parent;
    this.data = [];
    this.array = [];
    this.filters = new Jelpi.asksFilters(this);
    this.element = document.querySelector('asks');
  }
  init() {
    this.filters.init();
    let randomType = () => {
      let needs = [ 'Food', 'Medicine', 'Supplies' ];
      return needs[ Math.floor( Math.random() * needs.length ) ];
    }
    for(let i = 0; i < 100; i++){
      this.data.push({
        type: randomType(),
        timeStamp: Date.now() - Math.random() * 1000 * 60 * 60 * 4 - 1000 * 60 * 60 * 24 * 10 * 0,
        latitude: 61.92410999999999 + ( ( Math.random() - .5 ) * 2 ),
        longitude: 25.748151 + ( ( Math.random() - .5 ) * 2 ),
      });
    }
  }
  update() {
    this.parent.locate( this.render.bind(this) );
  }
  render(locationResult) {
    this.array.map(ask => { ask.destroy() });
    this.array = [];
    this.data.map( this.initAsk.bind(this, locationResult) );
    this.sort();
    this.array.map(ask => { ask.init() });
  }
  initAsk(locationResult, properties) {
    let ask = new Jelpi.ask(this, properties, locationResult);
    ask.match() && this.array.push( ask );
  }
  sort() {
    l('SORT');
  }
}
Jelpi.asksFilters = class {
  constructor(parent) {
    this.parent = parent;
    this.toggler = new Jelpi.asksFiltersToggler(this);
  }
  init() {
    this.toggler.init();
  }
  match(object) {
    return true;
  }
}
Jelpi.asksFiltersToggler = class {
  constructor(parent) {
    this.parent = parent;
    this._open = false;
  }
  init() {
    document.querySelector('asksfilterstoggler').addEventListener('click', this.onClick.bind(this));
  }
  onClick() {
    this.toggle();
  }
  toggle() {
    this.open( !this.open() );
  }
  open(value) {
    if( typeof value === 'undefined' ){
      return this._open;
    }
    this._open = value;
    this.update();
    return this._open;
  }
  update() {
    let method = this.open() ? 'add' : 'remove';
    document.body.classList[ method ]('asksfiltersopen');
  }
}
Jelpi.ask = class {
  constructor(parent, properties, locationResult) {
    this.parent = parent;
    this.properties = properties;
    this.locationResult = locationResult;
    this.distance = new Jelpi.askDistance(this);
    this.delay = new Jelpi.askDelay(this);
    this.icon = new Jelpi.askIcon(this);
    this.type = new Jelpi.askType(this);
    this.date = new Jelpi.askDate(this);
    this.contactButton = new Jelpi.askContactButton(this);
  }
  init() {
    this.distance.init();
    this.delay.init();
    this.icon.init();
    this.type.init();
    this.date.init();
    this.contactButton.init();
    this.parent.element.appendChild( this.element() );
  }
  element() {
    if( this.hasOwnProperty('_element') ){
      return this._element;
    }
    let element = document.createElement('ask');
    let className = `type${ this.properties.type }`;
    element.classList.add( className );
    this._element = element;
    return element;
  }
  innerWrapper() {
    if( this.hasOwnProperty('_innerWrapper') ){
      return this._innerWrapper;
    }
    let element = document.createElement('div');
    this.element().appendChild( element )
    this._innerWrapper = element;
    return element;
  }
  match() {
    let filter = this.parent.filter;
    l('FILTER');
    return true;
  }
  destroy() {
    this.element().remove();
  }
}
Jelpi.askIcon = class {
  constructor(parent) {
    this.parent = parent;
  }
  init() {
    this.parent.element().appendChild( this.element() );
  }
  element() {
    if( this.hasOwnProperty('_element') ){
      return this._element;
    }
    let element = document.createElement('askicon');
    this._element = element;
    return element;
  }
}
Jelpi.askDistance = class {
  constructor(parent) {
    this.parent = parent;
  }
  init() {
    this.update();
    this.parent.innerWrapper().appendChild( this.element() );
  }
  update() {
    let element = this.element();
    element.innerHTML = '';
    element.appendChild( this.content() );
  }
  content() {
    return document.createTextNode( this.generateString() );
  }
  generateString() {
    let distance = Jelpi.helper.crowFlightBetweenCoordinates(this.parent.locationResult.coords, this.parent.properties);
    if( distance < .5 ){
      return '< 500m';
    }
    if( distance < 1 ){
      return '< 1km';
    }
    return `${Math.floor(distance)}km`;
  }
  element() {
    if( this.hasOwnProperty('_element') ){
      return this._element;
    }
    let element = document.createElement('askdistance');
    this._element = element;
    return element;
  }
}
Jelpi.askDelay = class {
  constructor(parent) {
    this.parent = parent;
  }
  init() {
    this.update();
    this.parent.innerWrapper().appendChild( this.element() );
  }
  update() {
    let element = this.element();
    element.innerHTML = '';
    element.appendChild( this.content() );
  }
  content() {
    return document.createTextNode( this.generateString() );
  }
  generateString() {
    let diff = Date.now() - this.parent.properties.timeStamp,
    seconds = diff / 1000,
    minutes = seconds / 60,
    hours = minutes / 60,
    days = hours / 24,
    months = days / 365 * 12;
    if( seconds < 59 ){
      return 'Right now';
    }
    if( minutes < 59 ){
      return `${Math.round( minutes )}m ago`;
    }
    if( hours < 23 ){
      return `${Math.round( hours )}h ago`;
    }
    if( days < 365 / 12 ){
      return `${Math.round( days )}days ago`;
    }
    return `${Math.round( months )}months ago`;
  }
  element() {
    if( this.hasOwnProperty('_element') ){
      return this._element;
    }
    let element = document.createElement('askdelay');
    this._element = element;
    return element;
  }
}
Jelpi.askType = class {
  constructor(parent) {
    this.parent = parent;
  }
  init() {
    this.parent.element().appendChild( this.element() );
  }
  element() {
    if( this.hasOwnProperty('_element') ){
      return this._element;
    }
    let element = document.createElement('asktype');
    this._element = element;
    element.appendChild( document.createTextNode( this.parent.properties.type ) );
    return element;
  }
}
Jelpi.askDate = class {
  constructor(parent) {
    this.parent = parent;
  }
  init() {
    this.parent.element().appendChild( this.element() );
  }
  content() {
    let date = new Jelpi.helper.date( this.parent.properties.timeStamp );
    let object = date.getObject();
    let texts = [];
    if( date.isToday() ){
      texts.push( 'Today' );
    } else if( date.isYesterday() ){
      texts.push( 'Yesterday' );
    } else {
      texts.push( `${object.j}.` );
      texts.push( `${object.n}.` );
    }
    if( object.Y !== new Date().getFullYear() ){
      texts.push( object.Y );
    }
    texts.push( ` ${object.G}:${object.i}` );
    return document.createTextNode( texts.join('') );
  }
  element() {
    if( this.hasOwnProperty('_element') ){
      return this._element;
    }
    let element = document.createElement('askDate');
    this._element = element;
    element.appendChild( this.content() );
    return element;
  }
}
Jelpi.askContactButton = class {
  constructor(parent) {
    this.parent = parent;
  }
  init() {
    this.parent.element().appendChild( this.element() );
  }
  onClick() {
    l('click');
  }
  element() {
    if( this.hasOwnProperty('_element') ){
      return this._element;
    }
    let element = document.createElement('askcontactbutton');
    this._element = element;
    element.innerText = 'Contact';
    element.addEventListener('click', this.onClick.bind(this));
    return element;
  }
}
Jelpi.menu = class {
  constructor(parent) {
    this.parent = parent;
    this._open = false;
    this.array = [];
  }
  init() {
    window.addEventListener( 'resize', this.onResize.bind(this) );
    document.querySelector('hamburger').addEventListener('click', this.toggle.bind(this));
    this.menuItems().map( this.initMenuItem.bind(this) );
    this.array.map( menuItem => menuItem.init() );
    this.updateBodyClassNameFromLocationHref();
  }
  updateBodyClassNameFromLocationHref() {
    let hash = /#([^\s]+)/.exec(location.href);
    if( !hash ){
      return;
    }
    hash = hash[1];
    this.pages().includes(hash) && this.page(hash);
  }
  pages() {
    return this.array.map(menuItem => { return menuItem.page });
  }
  page(value) {
    this.parent.page(value);
  }
  initMenuItem(element) {
    this.array.push( new Jelpi.menuItem(this, element) );
  }
  menuItems() {
    let array = [];
    let elements = document.querySelectorAll('menu a');
    for(let i = 0; i < elements.length; i++){
      let element = elements[i];
      array.push(element);
    }
    return array;
  }
  onResize() {
    let onTimeout = () => {
      window.innerWidth > 700 && this.open(false);
      this.updateMenu();
    }
    clearTimeout( this.resizeTimeout );
    this.resizeTimeout = setTimeout( onTimeout, 50 );
  }
  updateMenu() {
    let method = window.innerWidth <= 700 ? 'add' : 'remove';
    document.body.classList[method]('narrow');
  }
  toggle() {
    this.open( !this.open() );
  }
  open(value) {
    if( typeof value === 'undefined' ){
      return this._open;
    }
    let method = value ? 'add' : 'remove';
    document.body.classList[method]('menuOpen');
    this._open = value;
    return value;
  }
}
Jelpi.menuItem = class {
  constructor(parent, element) {
    this.parent = parent;
    this.element = element;
  }
  init() {
    this.element.addEventListener('click', this.onClick.bind(this));
    this.page = this.element.getAttribute('href').substr(1);
  }
  onClick(event) {
    if( !this.page.length ){
      event.preventDefault();
      Jelpi.helper.pushEmptyURL();
    }
    this.parent.page(this.page);
    this.parent.open(false);
  }
}
Jelpi.frontPage = class {
  constructor(parent) {
    this.parent = parent;
    this.needs = new Jelpi.needs(this);
    this.cancelButton = new Jelpi.cancelButton(this);
    this.sendButton = new Jelpi.sendButton(this);
    // this.iCanHelpButton = new Jelpi.iCanHelpButton(this);
    this.inputs = new Jelpi.inputs(this);
  }
  init() {
    window.addEventListener('resize', this.onResize.bind(this));
    this.needs.init();
    this.cancelButton.init();
    this.sendButton.init();
    // this.iCanHelpButton.init();
    this.inputs.init();
    setTimeout(()=> { document.body.classList.add('ready'); }, 20);
  }
  onNeed() {
    this.parent.locate( this.onLocate.bind(this) );
    document.body.classList.add('need');
    let onTimeout = () => {
      document.querySelector('input').focus();
    };
    let shouldAutoFocus = !Jelpi.helper.isTouch() || Jelpi.helper.isAndroid();
    shouldAutoFocus && setTimeout( onTimeout, 200 );
  }
  onLocate(locationResult) {
    if( !locationResult ){
      return this.destroy();
    }
    document.body.classList.add('located');
    let input = this.inputs.array.filter(input => { return input.element.classList.contains('location'); })[0];
    input.element.classList.add('focus');
  }
  destroy() {
    document.body.classList.add('destroyed');
  }
  onCancel() {
    document.body.classList.remove('need');
    this.needs.onCancel();
  }
  onResize() {
    document.body.classList.add('resizing');
    let onTimeout = () => {
      document.body.classList.remove('resizing');
    }
    clearTimeout( this.resizeTimeout );
    this.resizeTimeout = setTimeout(onTimeout, 100);
  }
}
Jelpi.inputs = class {
  constructor(parent) {
    this.parent = parent;
    this.array = [];
  }
  init() {
    this.elements().map( this.initElement.bind(this) );
    this.array.map( input => input.init() );
  }
  elements() {
    let array = [];
    let elements = document.querySelectorAll('inputwrap');
    for(let i = 0; i < elements.length; i++){
      let element = elements[i];
      array.push(element);
    }
    return array;
  }
  initElement(element) {
    let need = new Jelpi.input(this, element);
    this.array.push(need);
  }
}
Jelpi.input = class {
  constructor(parent, element) {
    this.parent = parent;
    this.element = element;
  }
  init() {
    let element = this.element.querySelector('input, button');
    if( !element ){
      return;
    }
    element.addEventListener('mouseover', this.onMouseOver.bind(this));
    element.addEventListener('mouseout', this.onMouseOut.bind(this));
    element.addEventListener('mousedown', this.onMouseDown.bind(this));
    element.addEventListener('mouseup', this.onMouseUp.bind(this));
    element.addEventListener('focus', this.onFocus.bind(this));
    element.addEventListener('blur', this.onBlur.bind(this));
    element.addEventListener('keydown', this.onChange.bind(this));
  }
  onMouseOver() {
    this.element.classList.add('mouseover');
  }
  onMouseOut() {
    this.element.classList.remove('mouseover');
  }
  onMouseDown() {
    this.element.classList.add('mousedown');
  }
  onMouseUp() {
    this.element.classList.remove('mousedown');
  }
  onFocus() {
    this.element.classList.add('focus');
  }
  onBlur() {
    this.element.classList.remove('focus');
  }
  onChange() {
    let element = this.element.querySelector('input');
    if( !element ){
      return;
    }
    let onAnimationFrame = () => {
      let method = element.value.trim().length ? 'add' : 'remove';
      this.element.classList[ method ]('hasText');
    }
    window.requestAnimationFrame( onAnimationFrame );
  }
}
Jelpi.cancelButton = class {
  constructor(parent) {
    this.parent = parent;
  }
  init() {
    this.element().addEventListener('click', this.onClick.bind(this));
  }
  element() {
    return document.getElementById('cancel');
  }
  onClick(event) {
    event.preventDefault();
    event.stopPropagation();
    this.parent.onCancel();
  }
}
Jelpi.sendButton = class {
  constructor(parent) {
    this.parent = parent;
  }
  init() {
    this.element().addEventListener('click', this.onClick.bind(this));
  }
  element() {
    return document.getElementById('send');
  }
  onClick(event) {
    event.preventDefault();
    event.stopPropagation();
    if( this.sending ){
      return;
    }
    if( !this.parent.location ){
      return;
    }
    this.sending = true;
    console.log('send');
  }
}
Jelpi.iCanHelpButton = class {
  constructor(parent) {
    this.parent = parent;
  }
  init() {
    this.element().addEventListener('click', this.onClick.bind(this));
  }
  element() {
    return document.getElementById('icanhelp');
  }
  onClick(event) {
    event.preventDefault();
    event.stopPropagation();
    window.location = '#helpothers';
  }
}
Jelpi.needs = class {
  constructor(parent) {
    this.parent = parent;
    this.array = [];
  }
  init() {
    this.elements().map( this.initElement.bind(this) );
    this.array.map( need => need.init() );
  }
  elements() {
    let array = [];
    let elements = document.querySelectorAll('needs > div');
    for(let i = 0; i < elements.length; i++){
      let element = elements[i];
      array.push(element);
    }
    return array;
  }
  initElement(element) {
    let need = new Jelpi.need(this, element);
    this.array.push(need);
  }
  onNeed(instance) {
    this.parent.onNeed();
    this.array.map( need => need.fadeOutConditionally(instance) );
  }
  onCancel() {
    this.array.map( need => need.fadeIn() );
  }
}
Jelpi.need = class {
  constructor(parent, element) {
    this.parent = parent;
    this.element = element;
    this.type = this.element.getAttribute('data-type');
  }
  init() {
    this.element.addEventListener( 'click', this.onClick.bind(this) );
  }
  onClick(event) {
    event.preventDefault();
    event.stopPropagation();
    this.parent.onNeed(this);
  }
  fadeOutConditionally(instance) {
    if( this === instance ){
      return;
    }
    this.element.classList.add( 'hidden' );
  }
  fadeIn() {
    this.element.classList.remove( 'hidden' );
  }
}

if( /SM-G950F/.test( navigator.userAgent )
// || 1
){
  class CustomLogger {
    log(x) {
      this.element().appendChild( this.makeLoggableElement(x) );
      this.element().scrollTop = 1000000000;
    }
    makeLoggableElement(x) {
      let element = document.createElement('div');
      element.innerText = JSON.stringify( x );
      return element;
    }
    element() {
      if( this.hasOwnProperty('_element') ){
        return this._element;
      }
      let element = document.createElement('customLog');
      this._element = element;
      document.body.appendChild(element);
      return element;
    }
  }
  let customLogger = new CustomLogger();
  window.l = customLogger.log.bind(customLogger);
  // l(navigator.userAgent);
}

window.jelpi = new Jelpi.main();
window.jelpi.init();
// document.querySelector('needs > *').click();
// document.querySelector('hamburger').click();
// setTimeout(()=>{document.querySelector('asksfilterstoggler').click()},100);