/**
 *  @name number
 *  @description description
 *  @version 1.0
 *  @events
 *    change
 *    keydown
 *  @methods
 *    init
 */
;(function($, window, undefined) {
  'use strict';

  var pluginName = 'number';

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      this.input = this.element.find(this.options.input);
      this.increase = this.element.find(this.options.increase);
      this.decrease = this.element.find(this.options.decrease);

      this.listener();
    },
    listener: function() {
      var that = this;
      this.handle = this.options[pluginName].handle;
      this.maxLength = this.options[pluginName].maxLength;
      this.input.off('keydown.typeText').on('keydown.typeText', function(e) {
        if(!(
          (e.keyCode > 95 && e.keyCode < 106) ||
          (e.keyCode > 47 && e.keyCode < 58) ||
          e.keyCode === 8 ||
          e.keyCode === 9 ||
          e.keyCode === 13 ||
          e.keyCode === 37 ||
          e.keyCode === 38 ||
          e.keyCode === 39 ||
          e.keyCode === 40 ||
          e.keyCode === 46)) {
          return false;
        }
        if($(this).val().length === that.maxLength) {
          if((e.keyCode > 95 && e.keyCode < 106) || (e.keyCode > 47 && e.keyCode < 58)) {
            return false;
          }
        }
      });

      this.input.off('keyup.typeText, change.changeValue').on('keyup.typeText, change.changeValue', function() {
        if(that.val !== $(this).val()) {
          that.val = $(this).val();
          that.updateValue(that.val < 1 ? 1 : that.val, that.handle);
        }
      });

      this.increase.off('click.increase' + pluginName).on('click.increase' + pluginName, function() {
        that.val = that.input.val();
        that.updateValue(++that.val, that.handle);
      });

      this.decrease.off('click.decrease' + pluginName).on('click.decrease' + pluginName, function() {
        that.val = that.input.val();
        if(that.val > 1) {
          that.updateValue(--that.val, that.handle);
        }
      });
    },
    updateValue: function(value, handle) {
      if(!!handle) {
        $('[data-' + pluginName + ']').filter(function() {
          return $(this).data()[pluginName].options[pluginName].handle === handle;
        }).find(this.options.input).val(value);
      }
    },
    destroy: function() {
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
    input: '[data-input]',
    increase: '[data-increase]',
    decrease: '[data-decrease]'
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));
