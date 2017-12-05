/**
 * Leaflet freehand, a leafletjs's plugin allow draw a free polyline on the map.
 * Hold the control_key and move mouse to draw.
 * @author: Son Tran - https://trandaison.github.io
 */

L.Freehand = L.Freehand || {};

L.Freehand.Map = L.Handler.extend({
  options: {
    distance: 3, //distance from pointer to the polyline
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
    this._map.on('click', this._click, this);
    this._map.on('mousedown', this._mouseDown, this);
    this._map.on('mousemove', this._mouseMove, this);
    this._map.on('mouseup', this._mouseup, this);
  },

  removeHooks: function() {
    this._map.off('click');
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
  _click: function(e) {
    this._map.fire('beforeClick', {target: e.target, originalEvent: e});
    if (this._detectMouseMoved()) {
      return;
    }

    // Check if clicked on polyline or not.
    var polyClicked = this._detectPolyClick(e);
    if (polyClicked.value) {
      // Add memo
      this._insertLatLngToPolyline(polyClicked);
      var popupOpts = {
        closeOnClick: false,
        keepInView: true,
        autoClose: false,
        closeButton: false,
        minWidth: 110
      };
      var popup = L.popup(popupOpts)
        .setLatLng(polyClicked.point)
        .setContent(this._getDistance(polyClicked))
        .openOn(this._map);
    } else {
      // Continue draw route by clicking
      this._addLatLngToPolyline(e);
    }
    this._map.fire('afterClick', {target: e.target, originalEvent: e});
  },

  _mouseDown: function(e) {
    this._prvLatlng = e.latlng;
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
    this._currentLatlng = e.latlng;
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
  },

  _detectPolyClick: function(e) {
    var latlng = e.latlng;
    var distanceMin = Infinity;
    var segmentMin = null;

    if (this._poly._latlngs.length < 2) {
      return {value: false}
    } else {
      for (var i = 0, len = (this._poly._latlngs.length - 1); i < len; i++) {
        var segment = [this._poly._latlngs[i], this._poly._latlngs[i + 1]];
        var distance = L.GeometryUtil.distanceSegment(this._map, latlng, segment[0], segment[1]);
        if (distance < distanceMin) {
          distanceMin = distance;
          segmentMin = segment;
        }
      }
      return {
        value: distanceMin <= this.options.distance,
        point: L.GeometryUtil.closestOnSegment(this._map, latlng, segmentMin[0], segmentMin[1]),
        segment: segmentMin,
        distance: distanceMin
      }
    }

  },

  _detectMouseMoved: function() {
    return !this._detectMouseClicked();
  },

  _detectMouseClicked: function() {
    return this._prvLatlng.equals(this._currentLatlng);
  },

  _insertLatLngToPolyline: function(data) {
    var insertAt = this._poly._latlngs.indexOf(data.segment[1]);
    return this._poly._latlngs.splice(insertAt, 0, data.point);
  },

  _getDistance: function(data) {
    var distance = this._poly.lengthInKm(data.point);
    var content = `<div>
        <span>${distance}km / --:--</span>
        <span class="popup-control">
          <a href="javascript:void(0);" class="edit-note" data-title="${distance}km / --:--"><i class="fa fa-pencil"></i></a>
          <a href="#close" class="destroy-note"><i class="fa fa-trash"></i></a>
        </span>
      </div>
      <div class="note-content"></div>
    `
    return content;
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
