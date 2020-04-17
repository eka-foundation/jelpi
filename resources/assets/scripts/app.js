import axios from 'axios';

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
    return /^https?:\/\/(127\.0\.0\.1|192\.168\.43\.25)/.test( location.href );
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
  }
  init() {
    this.frontPage.init();
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
      console.log('Location detection failed.');
      callback(null);
    },
    onSuccess = (locationResult) => {
      document.body.classList.add('located');
      // l('locationResult3');
      console.log( locationResult.coords );
      this.location = locationResult;
      callback( this.location );
    };
    if( Jelpi.helper.isTest() ){
      console.log('Location is mock location.');
      setTimeout(() => { mock ? onSuccess(mock) : onError(); }, 1000);
      return;
    }
    if( !navigator.geolocation ){
      onError();
    } else {
      console.log('Locating using HTML5 API.');
      navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }
  }
}

Jelpi.facebookButton = class {
  constructor(parent) {
    this.parent = parent;
  }
  init() {
    this.element().addEventListener('click', this.onClick.bind(this));
  }
  onClick(event) {
    window.open('facebook','_self');
    event.preventDefault();
    event.stopPropagation();
  }
  element() {
    return document.getElementById('continueWithFacebook');
  }
}
Jelpi.safety = class {
  constructor(parent) {
    this.slides = window.safety_page;
  }
  hideSlider() {
    document.body.classList.remove('safetySliderVisible');
  }
  showSlider() {
    this.slider();
    document.body.classList.add('safetySliderVisible');
  }
  init() {
    this.slides.map( this.makeSlide.bind(this) );
  }
  makeSlide(object, index) {
    this.makeSafetyMenuItem(object.heading, index);
    this.makeTinySliderItem(object);
  }
  makeSafetyMenuItem(heading, index) {
    let safetyMenu = document.querySelector('safetymenu');
    let element = document.createElement('div');
    element.addEventListener('click', this.onMenuClick.bind(this, index));
    element.innerText = heading;
    safetyMenu.appendChild( element );
  }
  onMenuClick(index, event) {
    this.showSlider();
    this.slider().goTo(index);
  }
  makeTinySliderItem(object) {
    let outerWrapper = document.querySelector('.tinySlider'),
    innerWrapper = document.createElement('div'),
    heading = document.createElement('h3'),
    image = document.createElement('img'),
    imageWrapper = document.createElement('imagewrapper'),
    doSubHeading = document.createElement('do'),
    dontSubHeading = document.createElement('dont'),
    makeParagraph = (text) => {
      let paragraph = document.createElement('p');
      paragraph.innerText = text;
      innerWrapper.appendChild( paragraph );
    };

    doSubHeading.innerText = 'Do';
    dontSubHeading.innerText = 'Do Not';
    innerWrapper.classList.add('item');
    outerWrapper.appendChild( innerWrapper );
    heading.innerText = object.heading;
    image.setAttribute('src', object.image);
    imageWrapper.appendChild( image );
    innerWrapper.appendChild( heading );
    innerWrapper.appendChild( imageWrapper );
    innerWrapper.appendChild( doSubHeading );
    object.do.map(makeParagraph);
    innerWrapper.appendChild( dontSubHeading );
    object.do.map(makeParagraph);
  }
  slider() {
    if( this.hasOwnProperty('_slider') ){
      return this._slider;
    }
    this._slider = tns({
      container: '.tinySlider',
      items: 1,
      slideBy: 'page',
      autoplay: false
    });
    return this._slider;
  }
}
Jelpi.frontPage = class {
  constructor(parent) {
    this.parent = parent;
    this.needs = new Jelpi.needs(this);
    this.cancelButton = new Jelpi.cancelButton(this);
    this.facebookButton = new Jelpi.facebookButton(this);
    // this.iCanHelpButton = new Jelpi.iCanHelpButton(this);
    this.inputs = new Jelpi.inputs(this);
  }
  init() {
    window.addEventListener('resize', this.onResize.bind(this));
    this.needs.init();
    this.cancelButton.init();
    this.facebookButton.init();
    // this.iCanHelpButton.init();
    this.inputs.init();
    setTimeout(()=> { document.body.classList.add('ready'); }, 20);
  }
  onNeed() {
    this.parent.locate( this.onLocate.bind(this) );
    document.body.classList.add('need');
    let onTimeout = () => {
      let inp = document.querySelector('input');
      inp && inp.focus();
    };
    let shouldAutoFocus = !Jelpi.helper.isTouch() || Jelpi.helper.isAndroid();
    shouldAutoFocus && setTimeout( onTimeout, 200 );
  }
  onLocate(locationResult) {
    if( !locationResult ){
      return this.destroy();
    }
    let input = this.inputs.array.filter(input => { return input.element.classList.contains('location'); })[0];
    input && input.element.classList.add('focus');
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
    this.element() && this.element().addEventListener('click', this.onClick.bind(this));
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
    this.element() && this.element().addEventListener('click', this.onClick.bind(this));
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
    if (!this.parent.parent.location) {
      return;
    }
    let nam = document.getElementById("ask_name").value;
    let fid = document.getElementById("fb_id").value;
    let cat = document
      .querySelector("needs > div:not(.hidden)")
      .getAttribute("data-type");
    this.sending = true;
    axios
      .post("/tasks", {
        name: nam,
        lat: this.parent.parent.location.coords.latitude,
        lng: this.parent.parent.location.coords.longitude,
        category: cat,
        fbid: fid
      })
      .then((response) => {
        this.parent.onCancel();
      })
      .catch((error) => {
        console.log(error);
        alert('Sorry! Something went wrong');
      })
      .then(() => {
        this.sending = false;
        console.log("sent");
      });
  }
}
Jelpi.iCanHelpButton = class {
  constructor(parent) {
    this.parent = parent;
  }
  init() {
    this.element() && this.element().addEventListener('click', this.onClick.bind(this));
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