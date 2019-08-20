/**
 *  @name popup
 *  @description Use fancybox
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

  var pluginName = 'popup';

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options, this.element.data(pluginName));
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      this.vars = {
        handle: $(this.options.handle)
      };

      this.defineOption();
      this.listener();
    },
    defineOption: function() {
      this.vars.config = {
        type: this.options.type ? this.options.type : 'image',
        autoFocus: false,
        backFocus: false,
        trapFocus: false,
        transitionEffect: 'fade',
        caption: $.noop,
        afterLoad: this.afterLoad,
        beforeLoad: this.beforeLoad,
        beforeShow: this.beforeShow,
        beforeClose: this.beforeClose
      };
    },
    listener: function() {
      var that = this;
      this.vars.handle.off('click.open' + pluginName).on('click.open' + pluginName, function() {
        $.fancybox.open(that.vars.handle, that.vars.config, that.vars.handle.index(this));
        return false;
      });
    },
    beforeShow: function() {
    },
    beforeLoad: function() {
    },
    afterLoad: function() {
      $('[data-cslider]', '.fancybox-container').cslider('init');
    },
    beforeClose: function() {
    },
    closePopup: function() {
      $.fancybox.close('all');
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
