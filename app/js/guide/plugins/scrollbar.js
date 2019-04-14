/**
 *  @name scrollbar
 *  @description description
 *  @version 1.0
 *  @options
 *    option
 *  @events
 *    event
 *  @methods
 *    init
 *    initialized
 *    resizeEvent
 *    destroy
 */
;(function($, window, undefined) {
  'use strict';

  var pluginName = 'scrollbar',
    isTouch = 'ontouchstart' in document.documentElement;

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options, this.element.data(pluginName));
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      var that = this;
        this.vars = {
          theme: that.options.theme || 'dark',
          axis: that.options.axis || 'y',
          autoHideScrollbar: that.options.autoHideScrollbar || false,
          scrollAmount: that.options.scrollAmount || 'auto'
        };

      if(!isTouch) {
        this.defineOption();
      }
    },
    defineOption: function() {
      var that = this;
      this.option = {
        theme: this.vars.theme,
        axis: this.vars.axis,
        autoHideScrollbar: this.vars.autoHideScrollbar,
        autoExpandScrollbar: true,
        mouseWheel: {
          scrollAmount: this.vars.scrollAmount
        },
        callbacks: {
          onCreate: this.onCreate(that.element),
          onUpdate: this.onUpdate(that.element)
        }
      };

      if(!!this.options.scrollAmount) {
        this.option = $.extend({}, this.option, {
          snapAmount: this.vars.scrollAmount
        });
      }

      if(this.options.scrollButtons) {
        this.option = $.extend({}, this.option, {
          scrollButtons: {
            enable: true,
            scrollType: 'stepped'
          }
        });
      }

      if(this.options.autoHorizontal) {
        this.option = $.extend({}, this.option, {
          advanced: {
            autoExpandHorizontalScroll: true
          }
        });
      }

      // Call mCustomScrollbar
      this.initialized(this.option);
    },
    initialized: function(option) {
      this.element.mCustomScrollbar(option);
    },
    onCreate: function() {
      console.log('onCreate');
    },
    onUpdate: function() {
      console.log('onUpdate');
    },
    destroy: function() {
      this.element.mCustomScrollbar('destroy');
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

  $.fn[pluginName].defaults = {};

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));
