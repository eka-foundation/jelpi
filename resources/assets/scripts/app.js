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
    this.menu = new Jelpi.menu(this);
    this.asks = new Jelpi.asks(this);
    this.safety = new Jelpi.safety(this);
  }
  init() {
    this.frontPage.init();
    this.menu.init();
    this.asks.init();
    this.safety.init();
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
  page(value) {
    switch( value ){
      case 'givehelp':
        this.asks.update();
        break;
      case 'safety':
        this.safety.hideSlider()
        break;
    }
    let body = document.body,
    classname = value.length ? ` page-${value}` : ' ';
    body.className = body.className.replace( /(^|\s)page-[^\s]+|$/, classname );
  }
}

Jelpi.safety = class {
  constructor(parent) {
    this.slides = [
      { heading: 'Use Protective Gear',
        image: 'img/placeholder1.png',
        do: [
          'Use facemasks if you have them available.',
          'Use disposable gloves, but only if you know how to use them the proper way and for one-time usage.',
          'Learn the proper ways to use them, do not touch your face with your hands or gloves.',
          'If you do not have gloves, use eg. paper tissues for touching handles, etc. and throw them away after 1 use.',
          'If you do not have facemasks, use e.g. scarf in front of your mouth.',
        ],
        dont: [
          'Hoard for protection and thus deny it from others.',
          'Use disposable gloves long and thus spread the virus to many places.',
          'Touch your eyes of mouth when positioning your facemask or scarf.',
        ]
      },
      { heading: 'Minimize surface contact',
        image: 'img/placeholder1.png',
        do: [
          'Avoid touching things outside your home.',
          'Especially avoid touching the same things that many other people touch: handles, shopping trolleys, etc.',
          'Wear one-time protection (gloves or paper tissues) when you have to touch something.',
        ],
        dont: [
          'When coming to the home, use hands (or dirty gloves) to touch door handles before you have washed your hands.',
        ]
      },
      { heading: 'Keep physical distance with people',
        image: 'img/placeholder1.png',
        do: [
          'Keep a distance of minimally 2 meters or 6 feet in public places.',
          'Prefer staying home whenever you can.',
        ],
        dont: [
          'Spread the virus by having close contacts that you could avoid.',
        ]
      },
      { heading: 'Minimize leaving home',
        image: 'img/placeholder1.png',
        do: [
          'Keep your home clean from virus.',
          'Get food and essentials delivered.',
          'Understand that avoiding contacts protects yourself and also other people.',
        ],
        dont: [
          'Have visitors inside.',
          'Take packages from delivers’ hands, instead leave them to the floor for hours and handle with care.',
        ]
      },
      { heading: 'Know your facts',
        image: 'img/placeholder1.png',
        do: [
          'Learn about proper hygiene like hand washing routines.',
          'Teach others about how the virus can spread from surfaces and close contact.',
        ],
        dont: [
          'Spread misinformation or rumors.',
        ]
      },
      { heading: 'Quarantine immediately if in doubt',
        image: 'img/placeholder1.png',
        do: [
          'Keep yourself in more quarantine if you have mild symptoms like you were in flu.',
          'Contact healthcare, if you have bad symptoms, like shortness of breath.',
          'The quarantine should be at least 14 days from feeling sick.',
        ],
        dont: [
          'Go outside when you have even really mild symptoms, you might spread the virus.',
        ]
      },
      { heading: 'Stop touching your face',
        image: 'img/placeholder1.png',
        do: [
          'Understand that we have a habit of touching our faces.',
          'By becoming conscious of this habit you can minimize it.',
          'This is especially important outside your home.',
        ],
        dont: [
          'Think that wearing gloves or mask protects you from touching your face.',
        ]
      },
    ];
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
    window.scrollTo(0,0);
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