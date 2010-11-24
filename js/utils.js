Element.prototype.hasClassName = function (a) {
    return new RegExp("(?:^|\\s+)" + a + "(?:\\s+|$)").test(this.className)
};

Element.prototype.addClassName = function (a) {
    if (!this.hasClassName(a)) {
        this.className = [this.className, a].join(" ")
    }
};

Element.prototype.removeClassName = function (b) {
    if (this.hasClassName(b)) {
        var a = this.className;
        this.className = a.replace(new RegExp("(?:^|\\s+)" + b + "(?:\\s+|$)", "g"), " ")
    }
};

Element.prototype.toggleClassName = function (a) {
  this[this.hasClassName(a) ? "removeClassName" : "addClassName"](a)
};


// ======================= slider =============================== //

var Tangibles = {};
Tangibles.isTangible = !!('createTouch' in document);
Tangibles.CursorStartEvent = Tangibles.isTangible ? 'touchstart' : 'mousedown';
Tangibles.CursorMoveEvent = Tangibles.isTangible ? 'touchmove' : 'mousemove';
Tangibles.CursorEndEvent = Tangibles.isTangible ? 'touchend' : 'mouseup';

function ProxyRange ( el, input ) {
  this.element = el;
  this.input = input;
  this.width = this.element.offsetWidth;
  this.slider = this.element.children[0];
  
  this.x = this.element.offsetLeft;
  
  this.element.addEventListener( Tangibles.CursorStartEvent, this, false );
  this.slider.addEventListener( Tangibles.CursorStartEvent, this, false );
};

ProxyRange.prototype.moveSlider = function( event ) {
  var cursor = Tangibles.isTangible ? event.touches[0] : event,
      x = cursor.pageX - this.x;
  x = Math.max( 0, Math.min( this.width, x ) );
  
  this.slider.style.webkitTransform = 'translate3d(' + x + 'px,0,0)';
  
  this.input.value = x;
  
  // trigger change event
  var evt = document.createEvent("Event");
  evt.initEvent("change", true, true);
  this.input.dispatchEvent( evt );
}

ProxyRange.prototype.handleEvent = function(event) {
  if ( this[event.type] ) {
    this[event.type](event);
  }
};

ProxyRange.prototype[ Tangibles.CursorStartEvent ] = function( event ) {
  this.element.addClassName('highlighted');
  
  this.moveSlider( event );
  
  window.addEventListener( Tangibles.CursorMoveEvent, this, false );
  window.addEventListener( Tangibles.CursorEndEvent, this, false );
  
  event.preventDefault();
};

ProxyRange.prototype[ Tangibles.CursorMoveEvent ] = function( event ) {
  
  this.moveSlider( event );
  
  event.preventDefault();
};

ProxyRange.prototype[ Tangibles.CursorEndEvent ] = function( event ) {
  
  this.element.removeClassName('highlighted');
  
  window.removeEventListener( Tangibles.CursorMoveEvent, this, false );
  window.removeEventListener( Tangibles.CursorEndEvent, this, false );
};



