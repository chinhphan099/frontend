/**
 *  @name pinchzoom
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

  var pluginName = 'pinchzoom',
    timeResize,
    win = $(window),
    resize = ('onorientationchange' in window) ? 'orientationchange.resize' + pluginName : 'resize.resize' + pluginName;

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options, this.element.data(pluginName));
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      this.handle = this.element.find(this.options.handle);
      this.closezoom = this.element.find(this.options.closezoom);
      this.img = this.options.img;
      this.initialize(this.options.img);
      this.listener();
    },
    listener: function() {
      var that = this;
      this.closezoom.off('mousedown.close' + pluginName).on('mousedown.close' + pluginName, function() {
        that.destroy();
      });

      win.on(resize, function() {
        if(timeResize) {
          clearTimeout(timeResize);
        }
        timeResize = setTimeout(function() {
          $('[data-' + pluginName + ']').each(function() {
            if($(this).css('opacity') !== '0') {
              $(this)[pluginName]('destroy');
              $(this)[pluginName]('initialize');
            }
          });
        }, 300);
      });
    },
    initialize: function(imgSrc) {
      if(this.img) {
        this.img = (imgSrc && this.img !== imgSrc) ? imgSrc : this.img;
      }
      else {
        this.img = imgSrc;
      }
      if(!!this.img) {
        if(this.options.initUnder) {
          if(win.width() < this.options.initUnder) {
            this.element.addClass('showZoomContainer');
            this.initSmoothZoom();
          }
          else {
            this.destroy();
          }
        }
        else if (this.options.initUpper) {
          if(win.width() > this.options.initUpper) {
            this.element.addClass('showZoomContainer');
            this.initSmoothZoom();
          }
          else {
            this.destroy();
          }
        }
        else {
          this.element.addClass('showZoomContainer');
          this.initSmoothZoom();
        }
      }
    },
    initSmoothZoom: function() {
      var that = this;

      this.handle.smoothZoom({
        image_url: that.img,
        initial_ZOOM: 500,
        zoom_BUTTONS_SHOW: false,
        pan_BUTTONS_SHOW: false,
        border_SIZE: 0,
        responsive: true,
        width: '100%',
        height: '100%'
      });
    },
    destroy: function() {
      this.handle.smoothZoom('destroy');
      this.handle.removeAttr('style');
      this.handle.removeAttr('class');
      this.element.removeClass('showZoomContainer');
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
    handle: '[data-handle]',
    closezoom: '[data-closezoom]'
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));
