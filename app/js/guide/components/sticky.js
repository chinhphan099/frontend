/**
 *  @name sticky
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

  var pluginName = 'sticky',
    win = $(window),
    resizeTimeout,
    resize = ('onorientationchange' in window) ? 'orientationchange.resize' + pluginName : 'resize.resize' + pluginName;

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options, this.element.data(pluginName));
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      this.status = false;
      this.option = {
        offset_top: $('.nav-container').height()
      };
      if(win.width() > 767) {
        this.initialized();
      }
      this.listener();
    },
    listener: function() {
      win.off(resize).on(resize, function() {
        if(resizeTimeout) {
          clearTimeout(resizeTimeout);
        }
        resizeTimeout = setTimeout(function() {
          $('[data-' + pluginName + ']').each(function() {
            if(win.width() > 767 && !$(this).data()[pluginName].status) {
              $(this)[pluginName]('init');
            }
            else if(win.width() < 767 && $(this).data()[pluginName].status) {
              $(this)[pluginName]('destroy');
            }
          });
        }, 300);
      });
    },
    initialized: function() {
      this.status = true;
      this.element.stick_in_parent(this.option);
    },
    destroy: function() {
      this.status = false;
      this.element.trigger('sticky_kit:detach');
      //$.removeData(this.element[0], pluginName);
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
  };

  $(function() {
    if($('body').hasClass('catalog-category-view') || $('body').hasClass('catalogsearch-result-index')) {
      $('[data-' + pluginName + ']')[pluginName]();
    }
  });
}(jQuery, window));