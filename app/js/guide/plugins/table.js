/**
 *  @name table
 *  @description description
 *  @version 1.0
 *  @options
 *    option
 *  @events
 *    click
 *  @methods
 *    init
 *    initialized
 *    destroy
 */
;(function($, window, undefined) {
  'use strict';

  var pluginName = 'table';

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options, this.element.data(pluginName));
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      if(this.element.find('tr').eq(0).find('td').length > 2) {
        this.initialized();
        this.listener();
      }
    },
    initialized: function() {
      this.element
        .find('tr')
        .find('td:last-child')
        .addClass('last');
      this.element
        .find('tr')
        .find('td:first-child')
        .next()
        .addClass('first');
      this.element
        .find('tr')
        .eq(0)
        .append('<td class="' + this.options.emptyTdCls + ' next-btn" data-next=""><a class="icon-angle-right"></a></td>')
        .find('.head-title')
        .after('<td class="' + this.options.emptyTdCls + ' prev-btn disabled" data-prev=""><a class="icon-angle-left"></a></td>');
      this.element
        .find('tr')
        .eq(0)
        .nextAll()
        .append('<td class="' + this.options.emptyTdCls + '"></td>')
        .find('.head-title')
        .after('<td class="' + this.options.emptyTdCls + '"></td>');

      this.curentItems = [];
      for(var i = 2, n = 2 + this.options.items; i < n; i++) {
        this.curentItems.push(i);
      }
      this.addClassHandler(this.curentItems);
    },
    listener: function() {
      this.element.find(this.options.prevBtn).off('click.prev' + pluginName).on('click.prev' + pluginName, $.proxy(this.prevEvent, this));
      this.element.find(this.options.nextBtn).off('click.next' + pluginName).on('click.next' + pluginName, $.proxy(this.nextEvent, this));
    },
    prevEvent: function() {
      if(!$(this.options.prevBtn).hasClass(this.options.disabledCls)) {
        $(this.options.nextBtn).removeClass(this.options.disabledCls);
        // Remove end
        this.curentItems.pop();
        // Add first
        this.curentItems.unshift(this.curentItems[0] - 1);
        this.addClassHandler(this.curentItems);
        if(this.element.find('td').eq(this.curentItems[0]).hasClass('first')) {
          $(this.options.prevBtn).addClass(this.options.disabledCls);
        }
      }
    },
    nextEvent: function() {
      if(!$(this.options.nextBtn).hasClass(this.options.disabledCls)) {
        $(this.options.prevBtn).removeClass(this.options.disabledCls);
        // Remove first
        this.curentItems.shift();
        // Add end
        this.curentItems.push(this.curentItems[this.curentItems.length - 1] + 1);
        this.addClassHandler(this.curentItems);
        if(this.element.find('td').eq(this.curentItems[this.curentItems.length-1]).hasClass('last')) {
          $(this.options.nextBtn).addClass(this.options.disabledCls);
        }
      }
    },
    addClassHandler: function(arr) {
      this.element.find('td.active').removeClass(this.options.activeCls);
      for(var i = 0, n = this.element.find('tr').length; i < n; i++) {
        for(var j = 0, m = arr.length; j < m; j++) {
          this.element.find('tr').eq(i).find('td').eq(arr[j]).addClass(this.options.activeCls);
        }
      }
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
    disabledCls: 'disabled',
    activeCls: 'active',
    emptyTdCls: 'empty',
    prevBtn: '[data-prev]',
    nextBtn: '[data-next]'
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));
