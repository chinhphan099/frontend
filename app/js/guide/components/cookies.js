/**
 *  @name cookies
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

  var pluginName = 'cookies';

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, this.element.data(), options, this.element.data(pluginName));
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      this.initialize();
      this.listener();
    },
    initialize: function() {
      // Check Cookie
      if(this.readCookie('showSticky')) {
        // Show sticky
      }
    },
    listener: function() {
      var that = this;
      $('.close').off('click.' + pluginName).on('click.' + pluginName, function() {
        that.createCookie('showSticky');
      });
      $(window).off('unload.' + pluginName).on('unload.' + pluginName, function() {
        that.eraseCookie('showSticky');
      });
    },
    createCookie: function(name, value, days) {
      var expires = '';
      if(days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = '; expires=' + date.toGMTString();
      }
      document.cookie = name + '=' + value + expires + '; path=/';
    },
    readCookie: function(name) {
      var nameEQ = name + '=',
        ca = document.cookie.split(';');

      for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
          c = c.substring(1,c.length);
        }
        if (c.indexOf(nameEQ) === 0) {
          return c.substring(nameEQ.length,c.length);
        }
      }
      return null;
    },
    eraseCookie: function(name) {
      this.createCookie(name, '', -1);
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

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));
