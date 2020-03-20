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
    return false;
    return /^https?:\/\/127\.0\.0\.1/.test( location.href );
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
    if( Jelpi.helper.isTest() ){
      setTimeout(() => { callback(mock); }, 500);
      return;
    }
    let onError = () => {
      callback(null);
    },
    onSuccess = (result) => {
      this.location = result;
      callback( this.location );
    };
    if( !navigator.geolocation ){
      onError();
    } else {
      navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }
  }
}
Jelpi.asks = class {
  constructor(parent) {
    this.parent = parent;
    this.data = [];
  }
  init() {
    for(let i = 0; i < 100; i++){
      this.data.push({
        need: 'Medicine',
        timeStamp: Date.now() - Math.random() * 1000 * 60 * 60,
        location: 'Foo Bar'
      });
    }
    this.data.map( this.initAsk.bind(this) );
  }
  initAsk(object) {
    l('object');
    // l(object);
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
    this.pages().includes(hash) && this.page( hash );
  }
  pages() {
    return this.array.map(menuItem => { return menuItem.page });
  }
  page(value) {
    let body = document.body,
    classname = ` page-${value}`;
    body.className = body.className.replace( /(^|\s)page-[^\s]+|$/, classname );
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
  onLocate(result) {
    if( !result ){
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