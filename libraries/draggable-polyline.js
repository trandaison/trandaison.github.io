L.EditDrag = L.EditDrag || {};

L.EditDrag.Polyline = L.Handler.extend({
  options: {
    distance: 1,
    tolerance: 5,
    icon: new L.DivIcon({
      iconSize: new L.Point(8, 8),
      className: 'leaflet-div-icon leaflet-editing-icon'
    })
  },

  initialize: function(poly) {
    this._poly = poly;
    this._marker = null;
    this._dragging = false;
    L.Util.setOptions(this, poly.options);
  },

  addHooks: function() {
    if (this._poly._map) {
      this._map = this._poly._map;
      this._map.on("mousemove", this._onMouseMove, this);
    }
  },

  removeHooks: function() {
    this._map.off('mousemove');
  },

  // private functions
  _onMouseMove: function(e) {
    if (this._dragging) {
      return;
    }

    var closest = L.GeometryUtil.closestLayerSnap(this._map, [this._poly], e.latlng, this.options.distance, false);

    if (closest && this._marker) {
      this._marker.addTo(this._map);
      L.extend(this._marker._latlng, closest.latlng);
      this._marker.options.draggable = true;
      this._marker.update();
    } else if (closest && !this._marker) {
      this._marker = L.marker(closest.latlng, {draggable: true, icon: this.options.icon}).addTo(map);
      this._marker
        .on("dragstart", this._markerDragStartHandler, this)
        .on("drag", this._markerDragHandler, this)
        .on("dragend", this._markerDragEndHandler, this);
    } else if (this._marker) {
      this._map.removeLayer(this._marker);
      this._marker = null;
    }
  },

  _markerDragStartHandler: function(e) {
    var newPoint = e.target.getLatLng();
    this.closest = L.GeometryUtil.closest(this._map, [this._poly], newPoint, true);
    
  },

  _markerDragHandler: function(e) {
    var newPoint = e.getLatLng();
    // var closestPontOnSegment = this._getClosestPointAndSegment(newPoint);
    // var segmentIndex = this._poly._latlngs.indexOf(closestPontOnSegment.segment[1]);
    this._poly._latlngs.splice(this._segmentIndex, 1, this.closest);
    this._poly.redraw();
  },

  _markerDragEndHandler: function(e) {
    this._dragging = false;
  },

  _getClosestPointAndSegment: function(latlng) {
    var distanceMin = Infinity;
    var segmentMin = null;
    for (var i = 0; i < this._poly._latlngs.length - 1; i++) {
      var segment = [this._poly._latlngs[i], this._poly._latlngs[i + 1]];
      var distance = L.GeometryUtil.distanceSegment(this._map, latlng, segment[0], segment[1]);
      if (distance < distanceMin) {
        distanceMin = distance;
        segmentMin = segment;
      }
    }
    return {
      point: L.GeometryUtil.closestOnSegment(this._map, latlng, segmentMin[0], segmentMin[1]),
      segment: segmentMin
    }
  }
});

L.Polyline.addInitHook(function() {
  if (this.free_drag) {
    return;
  }

  if (L.EditDrag.Polyline) {
    this.editingDrag = new L.EditDrag.Polyline(this);
    if (this.options.free_drag) {
      this.editingDrag.enable();
    }
  }

  this.on("add", function() {
    if (this.editDrag && this.editingDrag.enabled()) {
      this.editingDrag.addHooks();
    }
  });

  this.on("remove", function() {
    if (this.editDrag && this.editingDrag.enabled()) {
      this.editingDrag.removeHooks();
    }
  });
});
