/**
 * Leaflet freehand, a leafletjs's plugin allow draw a free polyline on the map.
 * Hold the control_key and move mouse to draw.
 * @author: Son Tran - https://trandaison.github.io
 */

L.Freehand = L.Freehand || {};

L.Freehand.Map = L.Handler.extend({
  options: {
    // control_key: "none" || "ctrl" || "alt" || "win"
  },

  initialize: function(map) {
    this._map = map;
    this._drawing = false;
    this._polyColor = "red"
    L.Util.setOptions(this, map.options);
    this._poly = L.polyline([], {color: this._polyColor, weight: 4, opacity: 0.9}).addTo(this._map);
  },

  addHooks: function() {
    this._map.on('mousedown', this._mousedown, this);
    this._map.on('mousemove', this._mouseMove, this);
    this._map.on('mouseup', this._mouseup, this);
  },

  removeHooks: function() {
    this._map.off('mousedown');
    this._map.off('mousemove');
    this._map.off('mouseup');
  },

  setPolyColor: function(color) {
    this._polyColor = color;
    this._poly.setStyle({color: this._polyColor});
    return this;
  },

  setPolyStyle: function(style) {
    this._poly.setStyle(style);
    return this;
  },

  setPoly: function(polyline) {
    this._poly = polyline;
    return this;
  },

  getPoly: function() {
    return this._poly;
  },

  // Private functions
  _mousedown: function(e) {
    if (this._detectCtrlKey(e, false)) {
      this._map.dragging.disable();
      this._drawing = true;
      this._map.fire('freehandStart', {target: e.target, originalEvent: e});
    }
  },

  _mouseMove: function(e) {
    if (this._detectCtrlKey(e, false) && this._drawing) {
      this._addLatLngToPolyline(e);
      this._map.fire('freehand', {target: e.target, originalEvent: e});
    }
  },

  _mouseup: function(e) {
    var wasDrawing = this._drawing;
    this._drawing = false;
    this._map.dragging.enable();
    if (wasDrawing) {
      this._map.fire('freehandEnd', {target: e.target, originalEvent: e});
    }
  },

  _detectCtrlKey: function(e, isOriginalEvent) {
    isOriginalEvent = isOriginalEvent === undefined ? true : isOriginalEvent;
    e = isOriginalEvent ? e : e.originalEvent;
    var controlKey = this.options.control_key;
    if (controlKey === undefined) {
      return true;
    } else {
      var method = this._getKeyMethod(controlKey);
      return e[method];
    }
  },

  _getKeyMethod: function(key) {
    var methods = {ctrl: "ctrlKey", alt: "altKey", win: "metaKey", none: null}
    return methods[key.toLowerCase()];
  },

  _addLatLngToPolyline: function(e) {
    this._poly.addLatLng(e.latlng);
  }
});

L.Map.addInitHook(function() {
  if (this.freehand) {
    return;
  }

  if (L.Freehand.Map) {
    this.editingFreehand = new L.Freehand.Map(this);
    if (this.options.freehand) {
      this.editingFreehand.enable();
    }
  }

  this.on("add", function() {
    if (this.editingFreehand && this.editingFreehand.enable()) {
      this.editingFreehand.addHooks();
    }
  });

  this.on("remove", function() {
    if (this.editingFreehand && this.editingFreehand.enable()) {
      this.editingFreehand.removeHooks();
    }
  });
});
