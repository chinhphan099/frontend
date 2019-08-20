/**
 *  @name plugin
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

  var pluginName = 'zoomer',
    win = $(window),
    zoomTimer,
    resize = ('onorientationchange' in window) ? 'orientationchange.resize' + pluginName : 'resize.resize' + pluginName;

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options, this.element.data(pluginName));
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      this.handle = this.element.find(this.options.handle);

      if(this.element.is(':visible') && win.width() > 767) {
        this.checkImgLoad();
      }
      win.off(resize).on(resize, function() {
        if(zoomTimer) {
          clearTimeout(zoomTimer);
        }
        zoomTimer = setTimeout(function() {
          if($('[data-' + pluginName + ']').is(':visible') && win.width() > 767) {
            $('[data-' + pluginName + ']')[pluginName]('destroy');
            $('[data-' + pluginName + ']')[pluginName]('init');
          }
          else {
            $('[data-' + pluginName + ']')[pluginName]('destroy');
          }
        }, 300);
      });
    },
    checkImgLoad: function() {
      var that = this,
        imagesLoaded = 0,
        totalImages = this.element.find('img').length;

      this.element.find('img').each(function() {
        var fakeSrc = $(this).attr('src');

        $('<img />')
          .attr('src', fakeSrc).css('display', 'none')
          .on('load.' + pluginName, function() {
            ++imagesLoaded;
            if (imagesLoaded === totalImages) {
              $.isFunction(that.defineOption) && that.defineOption();
            }
          })
          .on('error.' + pluginName, function() {
            ++imagesLoaded;
            if (imagesLoaded === totalImages) {
              $.isFunction(that.defineOption) && that.defineOption();
            }
          });
      });
    },
    defineOption: function() {
      var windowZoom = {},
        that = this;

      this.option = {
        borderSize: 1,
        borderColour: '#ddd',
        cursor: 'crosshair',
        easing: true,
        loadingIcon: 'images/loading.svg',
        responsive: true,
        zoomType: 'inner',
        lensColour: '#fff',
        lensOpacity: 0.4,
        zoomId: this.options.zoomId,
        onDestroy: function() {
          //console.log('onDestroy');
        },
        onImageClick: function() {
          //console.log('onImageClick');
        },
        onShow: function() {
          //console.log('onShow');
        },
        onZoomedImageLoaded: function() {
          //console.log('onZoomedImageLoaded');
          that.element.addClass('zoomLoaded');
        },
        onImageSwap: function() {
          //console.log('onImageSwap');
        },
        onImageSwapComplete: function() {
          //console.log('onImageSwapComplete');
        }
      };

      if(win.width() > 1023) {
        windowZoom = {
          zoomType: 'window',
          zoomWindowWidth: this.options.zoomWindowWidth,
          zoomWindowHeight: this.options.zoomWindowHeight,
          zoomWindowOffetx: this.options.zoomWindowOffetx,
          scrollZoom: true
        };
      }
      if(win.width() < 1024 && win.width() > 767) {// tablet
        windowZoom = {};
      }
      this.option = $.extend({}, this.option, windowZoom);
      this.initialized(this.option);
    },
    initialized: function(opts) {
      this.handle.ezPlus(opts);
    },
    destroy: function() {
      this.element.removeClass('zoomLoaded');
      this.handle.removeData('ezPlus');
      this.handle.removeData('zoomImage');
      this.handle.off('mouseleave mouseenter mouseover mousemove mouseout mousewheel touchend touchmove click DOMMouseScroll MozMousePixelScroll');
      $('.zoomContainer').filter('[uuid="' + this.options.zoomId + '"]').remove();
      // $.removeData(this.element[0], pluginName);
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
    handle: '.zoomer',
    zoomWindowWidth: 400,
    zoomWindowHeight: 400,
    zoomWindowOffetx: 100
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));
