new class {
  constructor(parent) {
    this.slides = window.safety_page;
    this.slides.map( this.makeSlide.bind(this) );
  }
  hideSlider() {
    document.body.classList.remove('safetySliderVisible');
  }
  showSlider() {
    this.slider();
    document.body.classList.add('safetySliderVisible');
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
};