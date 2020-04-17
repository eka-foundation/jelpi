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
};
Jelpi.main = class {
  constructor() {
    this.asks = new Jelpi.asks(this);
  }
  init() {
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
Jelpi.asks = class {
  constructor(parent) {
    this.parent = parent;
    this.data = [];
    this.array = [];
    // this.filters = new Jelpi.asksFilters(this);
    this.element = document.querySelector('asks');
  }
  init() {
    // this.filters.init();
    this.update();
  }
  update() {
    this.parent.locate( this.render.bind(this) );
  }
  render(locationResult) {
    axios.get("/tasks").then(res => {
      this.data = [];
      for (let i = 0; i <= res.data.length; i++) {
        if (res.data[i]) {
          this.data.push({
            type: res.data[i].category,
            timeStamp: res.data[i].created_at,
            latitude:  res.data[i].lat,
            longitude: res.data[i].lng,
            fbid: res.data[i].fbid
          });
        }
      }
      this.array.map(ask => { ask.destroy() });
      this.array = [];
      this.data.map( this.initAsk.bind(this, locationResult) );
      this.sort();
      this.array.map(ask => { ask.init() });
    });
  }
  initAsk(locationResult, properties) {
    let ask = new Jelpi.ask(this, properties, locationResult);
    ask.match() && this.array.push( ask );
  }
  sort() {
    let calculateDistance = (coordinates) => {
      return Jelpi.helper.crowFlightBetweenCoordinates( this.parent.location.coords, coordinates );
    },
    compareDistance = (a, b) => {
      let aDistance = calculateDistance( a.properties ),
      bDistance = calculateDistance( b.properties );
      return aDistance - bDistance;
    };
    this.array.sort( compareDistance );
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
    // l('FILTER');
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
    let diff = Date.now() - Date.parse(this.parent.properties.timeStamp),
      seconds = diff / 1000,
      minutes = seconds / 60,
      hours = minutes / 60,
      days = hours / 24,
      months = (days / 365) * 12;
    if( seconds < 59 ){
      return window.translations.right_now || 'Right now';
    }
    if( minutes < 59 ){
      return `${Math.round(minutes)}m ${window.translations.ago}`;
    }
    if( hours < 23 ){
      return `${Math.round(hours)}h ${window.translations.ago}`;
    }
    days = Math.round( days );
    return `${days} ${
      days > 1 ? window.translations.days : window.translations.day
    } ${window.translations.ago}`;

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
      texts.push( window.translations.today || 'Today' );
    } else if( date.isYesterday() ){
      texts.push( window.translations.yesterday || 'Yesterday' );
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
    if (this.parent.properties.fbid) {
      window.open(`https://m.me/${this.parent.properties.fbid}`, "_blank");
    }
    l(`CONTACT FB ID: ${this.parent.properties.fbid} `);
  }
  element() {
    if( this.hasOwnProperty('_element') ){
      return this._element;
    }
    console.log(window.translations.do_not);
    let element = document.createElement('askcontactbutton');
    this._element = element;
    element.innerText = window.translations.contact;
    element.addEventListener('click', this.onClick.bind(this));
    return element;
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