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

  var pluginName = 'plugin';
  var privateVar = null;
  var privateMethod = function(el, options) {
    // to do
  };

  function Plugin(element, options) {
    this.element = $(element);
    // this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options, this.element.data(pluginName));
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      var that = this;
      this.vars = {
        key: 'value'
      };
      privateMethod.call(this);
      this.listener();
    },
    publicMethod: function(params) {
      this.fileInput.off('click.' + pluginName).on('click.' + pluginName, $.proxy(this.publicMethod, this));
      $.isFunction(this.options.onCallback) && this.options.onCallback();
      this.element.trigger('customEvent');
    },
    destroy: function() {
      // remove events
      this.fileInput.off('click.' + pluginName);
      // deinitialize
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
    key: 'value',
    onCallback: null
  };

  $(function() {
    $('[data-' + pluginName + ']').on('customEvent', function() {
      // to do
    });

    $('[data-' + pluginName + ']')[pluginName]({
      key: 'custom'
    });
  });

}(jQuery, window));
