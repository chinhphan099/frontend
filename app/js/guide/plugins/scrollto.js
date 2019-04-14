/**
 *  @name scrollto
 *  @description description
 *  @version 1.0
 *  @options
 *    option
 *  @events
 *    event
 *  @methods
 *    init
 *    publicMethod
 *    destroy
 */
;(function($, window, undefined) {
  'use strict';

  var pluginName = 'scrollto',
    win = $(window);

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options, this.element.data(pluginName));
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      var that = this,
        el = this.element,
        destination = this.options.handle,
        initUnder = this.options.initUnder;

      this.toggleShow();
      win.off('scroll.' + pluginName).on('scroll.' + pluginName, function() {
        that.toggleShow();
      });
      el.off('click.' + pluginName).on('click.' + pluginName, function(e) {
        e.preventDefault();
        e.stopPropagation();
        if(win.width() < initUnder && $(destination).length) {
          that.scrollTo(destination);
        }
      });
    },
    toggleShow: function() {
      if(this.options[pluginName].handle === 'body') {
        if(win.scrollTop() > 500) {
          this.element.fadeIn('slow');
        }
        else {
          this.element.fadeOut('slow');
        }
      }
    },
    scrollTo: function(elm) {
      var that = this,
        scrollTo = !!$(elm).length ? $(elm).offset().top : 0;

      $('html, body').animate({
        scrollTop: scrollTo
      }, that.options.duration, 'easeOutCubic'); // jquery.easing.1.3.js
    },
    destroy: function() {
      this.element.off('click.' + pluginName);
      $.removeData(this.element[0], pluginName);
    }
  };

  $.fn[pluginName] = function(options, params) {
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (!instance) {
        $.data(this, pluginName, new Plugin(this, options));
      } else if (instance[options]) {
        instance[options](params);
      }
    });
  };

  $.fn[pluginName].defaults = {
    duration: 600,
    initUnder: 9999
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));
