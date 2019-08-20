/**
 *  @name date
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

  var pluginName = 'date';
  var convertToDMY = function(date) {
    var day = date.getDate(),
      month = date.getMonth() + 1,
      year = date.getFullYear();

    if(day < 10) {day = '0' + day;}
    if(month < 10) {month = '0' + month;}
    return day + '/' + month + '/' + year;
  };

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      var that = this;
        this.valueContainer = this.element.find(this.options.valueContainer);
        this.inputElm = this.element.find(this.options.inputElm);

      this.updateValue();
      this.inputElm.off('change.changeValue').on('change.changeValue', function() {
        var idDate = $(this).attr('id');
        that.updateValue();
        if($(this).prop('required')) {
          $(this).closest('form').validate().element('#' + idDate);
        }
      });
    },
    updateValue: function() {
      var date = this.inputElm.val();
      if(date === '') {
        this.valueContainer.text(this.inputElm.attr('placeholder'));
        this.element.removeClass(this.options.selectedCls);
      }
      else {
        this.valueContainer.text(convertToDMY.call(this, new Date(date)));
        this.element.addClass(this.options.selectedCls);
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
    valueContainer: 'span',
    inputElm: 'input',
    selectedCls: 'selected'
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));
