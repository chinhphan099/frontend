/**
 *  @name slidemenu
 *  @version 1.0
 *  @options
 *    option
 *  @events
 *    event
 *  @methods
 *    init
 *    destroy
 */
;(function($, window, undefined) {
  'use strict';

  var pluginName = 'slidemenu',
    win = $(window),
    userAgent = navigator.userAgent,
    isDevice = /IEMobile|Windows Phone|Lumia|iPhone|iP[oa]d|Android|BlackBerry|PlayBook|BB10|Mobile Safari|webOS|Mobile|Tablet|Opera Mini|\bCrMo\/|Opera Mobi/i.test(userAgent) ? 1 : 0;

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      this.vars = {
        isAnimating: false,
        isClose: true,
        handler: this.element.find(this.options.handler),
        mainContainer: this.element.find(this.options.mainContainer),
        header: this.element.find(this.options.header),
        inner: $(this.options.mainContainer).find(this.options.inner),
        lNav: this.element.find(this.options.lNav),
        rNav: this.element.find(this.options.rNav),
        dummyLayer: this.element.find(this.options.dummyLayer),
        leftNavCls: this.options.leftNavCls,
        rightNavCls: this.options.rightNavCls,
        duration: this.options.duration,
        sizePull: this.options.sizePull,
        sizePush: this.options.sizePush,
        topInner: 0
      };
      this.listener();
    },
    listener: function() {
      var that = this;

      if(this.options[pluginName].headerFixedOnFocus) {
        this.handleInputFocusAndBlur();
      }

      this.vars.handler.off('click.toggle' + pluginName).on('click.toggle' + pluginName, function() {
        if(!that.vars.isAnimating) {
          that.vars.openingCls = $(this).data('nav');
          that.vars.isAnimating = true;
          if(that.vars.isClose) {
            that.openMenu(that.vars.openingCls);
          }
          else {
            that.closeMenu(that.vars.openingCls);
          }

          // dummyLayer Event
          that.vars.dummyLayer.off('touchstart.' + pluginName).on('touchstart.' + pluginName, function() {
            that.closeMenu(that.vars.openingCls);
          });
        }
      });
    },
    openMenu: function(openingCls) {
      var that = this;

      if($.isFunction(that.options.beforeOpen)) {that.options.beforeOpen();}
      this.vars.topInner = win.scrollTop();
      this.vars.inner.css('top', -(this.vars.topInner - this.vars.header.height()));
      $('html').addClass(this.vars.openingCls);
      that.vars.dummyLayer.fadeIn(that.vars.duration);

      switch(openingCls) {
        case this.vars.leftNavCls:
          //Slide Hide Main Container
          this.hideMainContainer('100%', this.vars.sizePush);

          //Slide Open Left Navigation
          this.vars.lNav.animate({
            left: '0%',
            right: '0%',
            opacity: 1,
            marginRight: this.vars.sizePull
          }, this.vars.duration);
          break;

        case this.vars.rightNavCls:
          //Slide Hide Main Container
          this.hideMainContainer('-100%', this.vars.sizePull);

          //Slide Open Right Navigation
          this.vars.rNav.animate({
            left: '0%',
            right: '0%',
            opacity: 1,
            marginLeft: this.vars.sizePull
          }, this.vars.duration);
          break;
        default:
      }

      this.vars.dummyLayer.on('touchstart.' + pluginName + ' click.' + pluginName, function() {
        that.closeMenu(openingCls);
      });
    },
    closeMenu: function(openingCls) {
      var that = this;
      that.vars.dummyLayer.fadeOut(that.vars.duration);

      // Show Main Container
      this.showMainContainer();
      switch(openingCls) {
        case this.vars.leftNavCls:
          //Slide Close Left Navigation
          this.vars.lNav.animate({
            left: '-100%',
            right: '100%',
            opacity: 0.5,
            marginRight: 0
          }, {
            duration: this.vars.duration,
            complete: function() {
              $(this).removeAttr('style');
            }
          });
          break;
        case this.vars.rightNavCls:
          //Slide Close Right Navigation
          this.vars.rNav.animate({
            left: '100%',
            right: '-100%',
            opacity: 0.5,
            marginLeft: 0
          }, {
            duration: this.vars.duration,
            complete: function() {
              $(this).removeAttr('style');
            }
          });
          break;
        default:
      }

      that.vars.dummyLayer.off('touchstart.' + pluginName + ' click.' + pluginName);
    },
    hideMainContainer: function(leftValue, marginLeft) {
      var that = this;
      this.vars.mainContainer.animate({
        left: leftValue,
        marginLeft: marginLeft
      },
      {
        duration: that.vars.duration,
        complete: function() {
          that.afterAnimate(false);
        }
      });
    },
    showMainContainer: function() {
      var that = this;
      this.vars.mainContainer.animate({
        left: '0%',
        marginLeft: '0%'
      },
      {
        duration: this.vars.duration,
        complete: function() {
          $('html').removeClass(that.vars.openingCls);
          $(this).removeAttr('style');
          that.vars.inner.removeAttr('style');
          window.scrollBy(0, that.vars.topInner);
          that.afterAnimate(true);
          if($.isFunction(that.options.afterClose)) {that.options.afterClose();}
        }
      });
    },
    afterAnimate: function(isClose) {
      this.vars.isClose = isClose;
      this.vars.isAnimating = false;
    },
    handleInputFocusAndBlur: function() {
      if(isDevice) {
      // if(Detectizr.device.type === 'tablet' || Detectizr.device.type === 'mobile') {
        var that = this, focusing;

        $('input[type="text"], input[type="number"], input[type="tel"], input[type="email"], input[type="search"], select, textarea').off('focus.' + pluginName).on('focus.' + pluginName, function() {
          that.vars.header.find('.header-inner').css('position', 'relative');
          that.vars.header.css({
            //'position': 'absolute',
            'top': $(document).scrollTop()
          });
          $('html').addClass('inputFocusing');
          focusing = true;
        });

        $('input[type="text"], input[type="number"], input[type="tel"], input[type="email"], input[type="search"], select, textarea').off('blur.' + pluginName).on('blur.' + pluginName, function() {
          that.vars.header.find('.header-inner').removeAttr('style');
          that.vars.header.removeAttr('style');
          $('html').removeClass('inputFocusing');
          focusing = false;
        });

        win.off('scroll.scroll' + pluginName).on('scroll.scroll' + pluginName, function() {
          if (focusing) {
            that.vars.header.css({
              'opacity': 0,
              'top': $(document).scrollTop()
            });
          }
          clearTimeout($.data( this, 'scrollCheck' ));
          $.data(this, 'scrollCheck', setTimeout(function() {
            if (focusing) {
              that.vars.header.css('opacity', 1);
              that.vars.lNav.css('opacity', 1);
            }
          }, 250));
        });
      }
    },
    destroy: function() {
      $('html').removeClass(this.vars.openingCls);
      this.vars.mainContainer.removeAttr('style');
      this.vars.dummyLayer.removeAttr('style');
      this.vars.inner.removeAttr('style');
      this.vars.handler.off('click.toggle' + pluginName);
      $('input, select, textarea').off('focus.' + pluginName);
      $('input, select, textarea').off('blur.' + pluginName);
      $(window).off('scroll.' + pluginName);
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
    handler: '[data-nav]',
    mainContainer: '.main-container',
    header: '.header',
    inner: '.inner',
    lNav: '.navigation',
    rNav: '.right-navigation',
    dummyLayer: '.dummy-layer',
    leftNavCls: 'open-left-nav',
    rightNavCls: 'open-right-nav',
    duration: 200,
    sizePull: '25%',
    sizePush: '-25%',
    beforeOpen: $.noop,
    afterClose: $.noop
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));
