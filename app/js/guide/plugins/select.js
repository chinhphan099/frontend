/**
 *  @name select
 *  @version 1.0
 *  @options
 *    option
 *  @events
 *    event
 *  @methods
 *    init
 *    updateValue
 *    destroy
 */
;(function($, window, undefined) {
  'use strict';

  var pluginName = 'select';

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      var that = this;
        this.valueContainer = this.element.find(this.options.valueContainer);
        this.selectElm = this.element.find(this.options.selectElm);

      this.updateValue();
      this.selectElm.off('change.changeValue').on('change.changeValue', function() {
        var idSelectbox = $(this).attr('id');
        that.updateValue();
        if($(this).prop('required') && $(this).is('[aria-describedby]')) {
          $(this).closest('form').validate().element('#' + idSelectbox);
        }
      });
    },
    updateValue: function() {
      var getValue = this.selectElm.find('option:selected').text();

      this.valueContainer.text(getValue);
      if(this.selectElm.val() !== '') {
        this.element.addClass(this.options.selectedCls);
      }
      else {
        this.element.removeClass(this.options.selectedCls);
      }
    },
    destroy: function() {
      this.fileInput.off('click.' + pluginName);
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
    valueContainer: 'span',
    selectElm: 'select',
    selectedCls: 'selected'
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));
