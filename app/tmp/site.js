/**
 * @name Site
 * @description Global variables and functions
 * @version 1.0
 */

var Site = (function($, window, undefined) {
  'use strict';

  var win = $(window),
    doc = $(document),
    html = $('html'),
    body = $('body'),
    standarTransitionend = (!!window.URL || !!window.webkitURL) ? 'webkitTransitionEnd.transitionEnd' : 'transitionend.transitionEnd',
    resize = ('onorientationchange' in window) ? 'orientationchange.resizeWindow' : 'resize.resizeWindow';

  var globalFct = function() {
    // to do
  };

  var customValidEmail = function() {
    $.validator.addMethod('cemail', function(value, element) {
      if (element.value !== '') {
        return this.optional(element) || /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.) {2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i.test(value);
      }
      else {
        return true;
      }
    }, L10n.validateMess.cemail);
  };

  return {
    win: win,
    doc: doc,
    html: html,
    body: body,
    resize: resize,
    standarTransitionend: standarTransitionend,
    globalFct: globalFct,
    customValidEmail: customValidEmail
  };

})(jQuery, window);

jQuery(function() {
  Site.globalFct();
  Site.customValidEmail();
});
