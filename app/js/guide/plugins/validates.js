/**
 *  @name validates
 *  @description Use jQuery Validation
 *  @methods
 *    init
 *    reset
 */

;(function($, window, undefined) {
  'use strict';

  var pluginName = 'validates';
  var getRules = function(formId) {
    var rules = {};
    switch (formId) {
      case 'guide':
        rules = $.extend(rules, {
          guide_cb_group: {
            required: true,
            minlength: 2
          },
          horizontal_guide_cb_group: {
            required: true,
            minlength: 2
          }
        });
        break;
      default:
    }
    return rules;
  },
  messages = function(formId) {
    var messages = {};
    switch (formId) {
      case 'guide':
        messages = $.extend(messages, {
          guide_cb_group: {minlength: L10n.validateMess.minlengthcheckbox},
          horizontal_guide_cb_group: {minlength: L10n.validateMess.minlengthcheckbox}
        });
        break;
      default:
    }
    return messages;
  };

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options, this.element.data(pluginName));
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      var that = this;
      this.formId = this.element.find('form').attr('id');
      this.isHideMessage = this.options.isHideMessage;

      $('#' + this.formId).validate({
        rules: getRules.call(that, that.formId),
        messages: messages.call(that, that.formId),
        errorElement: 'p',
        highlight: function(element) {
          $(element).addClass('error').closest('.fieldset').addClass('errors');
        },
        unhighlight: function(element) {
          $(element).removeClass('error');
          if(!$(element).closest('.fieldset').find(that.options.groupCls).hasClass('error')) {
            $(element).removeClass('error').closest('.fieldset').removeClass('errors');
          }
        },
        invalidHandler: function(event, validator) {
          var errors = validator.numberOfInvalids();
          console.log(errors);
        },
        errorPlacement: function(error, element) {
          if(!that.isHideMessage) {
            if ($(element).is('select')) {
              error.insertAfter(element.closest('.custom-select'));
            }
            else if ($(element).closest('.custom-input').length) {
              error.insertAfter(element.closest('.custom-input'));
            }
            else if ($(element).closest('.radio-list').length) {
              error.insertAfter(element.closest('.radio-list'));
            }
            else if ($(element).closest('.checkbox-list').length) {
              error.insertAfter(element.closest('.checkbox-list'));
            }
            else if($(element).attr('type') === 'date') {
              error.insertAfter(element.closest('.custom-date'));
              return false;
            }
            else if($(element).attr('type') === 'file') {
              error.insertAfter(element.closest('.custom-file'));
              return false;
            }
            else if($(element).is(':checkbox')) {
              error.insertAfter(element.closest('.checkbox'));
            }
            else if($(element).is(':radio')) {
              error.insertAfter(element.closest('.radio'));
            }
            else {
              error.insertAfter(element);
            }
          }
        },
        submitHandler: function(form) {
          switch (that.formId) {
            case 'guide':
              console.log(123);
              form.submit();
              break;
            default:
              form.submit();
              return false;
          }
        }
      });
    },
    reset: function() {
      $('#' + this.formId).resetForm();
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
    groupCls: '.valid-group'
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));
