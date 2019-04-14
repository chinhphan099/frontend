/**
 * @name Guide
 * @description Global variables and functions
 * @version 1.0
 */

var Guide = (function($, window, undefined) {
  'use strict';

  var win = $(window),
    doc = $(document),
    html = $('html'),
    body = $('body'),
    resize = ('onorientationchange' in window) ? 'orientationchange.resizeWindow' : 'resize.resizeWindow';

  var globalFct = function() {
  };

  return {
    win: win,
    doc: doc,
    html: html,
    body: body,
    resize: resize,
    globalFct: globalFct
  };

})(jQuery, window);

jQuery(function() {
  Guide.globalFct();
});
