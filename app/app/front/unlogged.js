"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  template: "<font-awesome-icon id='log_button' icon='user' @click=\"$emit( 'show_identification_div' )\" size='2x' />",
  created: function created() {
    console.log("UNLOGGED");
    console.dir(this);
    console.dir(parent.a);
  }
};
exports.default = _default;