L.FreeHand = L.FreeHand || {};

L.FreeHand.Polyline = L.Handler.extend({
  options: {},

  initialize: function(polyline) {
    this._poly = polyline;
    this._drawing = false;
    L.Util.setOptions(this, poly.options);
  },

  addHooks: function() {
    if (this._poly._map) {
      this._map = this._poly._map;
      this._map.on('mousemove', this._mouseMove, this);
    }
  },

  removeHooks: function() {

  },

  // Private
  _mouseMove: function(e) {
    debugger;
  }
});

L.Map.addInitHook(function() {
  if (this.freehand) {
    return;
  }

  if (L.FreeHand.Polyline) {
    this.editingFreeHand = new L.FreeHand.Polyline(this);
    if (this.options.freehand) {
      this.editingFreeHand.enable();
    }
  }

  this.on("add", function() {
    if (this.editingFreeHand && this.editingFreeHand.enable()) {
      this.editingFreeHand.addHooks();
    }
  });

  this.on("remove", function() {
    if (this.editingFreeHand && this.editingFreeHand.enable()) {
      this.editingFreeHand.removeHooks();
    }
  });
});
