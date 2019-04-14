/**
 *  @name copies
 *  @description Click to copy
 *  @version 1.0
 *  @options
 *    option
 *  @events
 *    click
 *  @methods
 *    init
 *    selectContent
 *    destroy
 */
;(function($, window, undefined) {
  'use strict';

  var pluginName = 'copies';

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      var that = this;
      this.handle = this.element.find(this.options.handle);
      this.copy = this.options.copy;
      this.isAnimating = false;

      this.handle.off('click.copies').on('click.copies', function() {
        if(!that.isAnimating) {
          that.selectContent($(this).find(that.copy));
        }
      });
    },
    selectContent: function(element) {
      var $temp = $('<input>'),
        that = this,
        value = element.data('copy') || element.text();

      this.isAnimating = true;
      element.after($temp);
      $temp.val(value);
      $temp.focus();
      document.execCommand('SelectAll');
      document.execCommand('Copy', false, null);
      $('.copied').html(value).show().delay(1000).fadeOut(300, function() {
        that.isAnimating = false;
      });
      $temp.remove();
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
    handle: '[data-handler]',
    copy: '[data-copy]'
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));
