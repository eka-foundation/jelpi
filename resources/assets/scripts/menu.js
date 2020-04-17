new class {
  constructor(parent) {
    this.parent = parent;
    this._open = false;
    this.array = [];
    window.addEventListener( 'resize', this.onResize.bind(this) );
    document.querySelector('hamburger').addEventListener('click', this.toggle.bind(this));
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
};