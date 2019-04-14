/**
 *  @name collapse(both Tabs & Accordion)
 *  @version 1.0
 *  @author: Phan Chinh
 *  @options
 *    handle: '[data-handle]'
 *    content: '[data-content]'
 *    activeEl: '[data-active]'
 *    initEl: '[data-init]'
 *    closeEl: '[data-close]'
 *    duration: 300
 *    beforeOpen: $.noop
 *    afterOpen: $.noop
 *    beforeClose: $.noop
 *    afterClose: $.noop
 *  @events
 *    Handle click
 *    CloseEl click
 *    Window resize
 *  @methods
 *    init
 *    initialized
 *    listener
 *    close
 *    destroy
 */

;(function($, window, undefined) {
  'use strict';
  var pluginName = 'collapse',
    win = $(window),
    collapseTimeout,
    resize = ('onorientationchange' in window) ? 'orientationchange.resize' + pluginName : 'resize.resize' + pluginName;

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options, this.element.data(pluginName));
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      this.activeEl = this.element.find(this.options.activeEl);
      this.handles = this.element.find(this.options.handle);
      this.initEl = this.element.find(this.options.initEl);
      this.contents = this.element.find(this.options.content);
      this.activeContent = [];
      this.closeEl = this.options.closeEl;
      this.duration = this.options.duration;
      this.isAnimating = false;
      this.show = 'slideDown';
      this.hide = 'slideUp';
      this.initCls = this.options.initCls;
      this.initSuccess = false;

      if(this.options.effect === 'fade') {
        this.show = 'fadeIn';
        this.hide = 'fadeOut';
      }
      if(this.options.effect === 'slide') {
        this.show = 'slideDown';
        this.hide = 'slideUp';
      }

      this.checkEmptyContent();
      this.resizeWindow();
    },
    checkEmptyContent: function() {
      var that = this;
      this.contents.each(function() {
        var self = $(this),
          handle = that.element.find('[data-handle="' + self.data('content') + '"]');
        if(!self.text().trim().length) {
          handle.closest('[data-active]').remove();
          self.remove();
        }
      });
      this.initialized();
    },
    initialized: function() {
      var that = this;

      if(!!this.options.breakpoint) {
        if(win.width() <= this.options.breakpoint) {
          this.options.type = '';
        }
        else {
          this.options.type = 'tab';
        }
      }

      if(!!this.options.initUnder) {
        if(win.width() <= this.options.initUnder) {
          this.listener();
          if(this.initEl.length) {
            if(this.options.type === 'toggleSelf') {
              this.initEl.each(function() {
                that.toggleSelfEvent($(this));
              });
            }
            else {
              this.collapseContent(this.initEl);
            }
          }
        }
      }
      else {
        this.listener();
        if(this.initEl.length) {
          if(this.options.type === 'toggleSelf') {
            this.initEl.each(function() {
              that.toggleSelfEvent($(this));
            });
          }
          else {
            this.collapseContent(this.initEl);
          }
        }
      }
    },
    listener: function() {
      var that = this;

      this.element.addClass(this.initCls);

      this.handles.off('click.changeTab' + pluginName).on('click.changeTab' + pluginName, function(e) {
        var handle = $(this).closest(that.element).find('[data-handle="' + $(this).data('handle') + '"]');

        if($(this).data('active') === 'linkout' && $(this).hasClass('active')) {
          return;
        }
        else if($(e.target).is('a') || $(e.target).parent().is('a')) {
          e.preventDefault();
        }

        if(!that.isAnimating) {
          if(that.options.type === 'toggleSelf') {
            that.toggleSelfEvent(handle);
          }
          else {
            that.collapseContent(handle);
          }
        }
      });

      that.contents.off('click.closeTab' + pluginName, this.closeEl).on('click.closeTab' + pluginName, this.closeEl, function(e) {
        e.preventDefault();

        if(!that.isAnimating) {
          var childContentVisible = that.activeContent.find(that.options.content).not(':hidden');

          if(childContentVisible.length) {
            console.log('--- Close child Tabs - Button Close click ---');
            childContentVisible.closest('[data-' + pluginName + ']')[pluginName]('close');
          }

          console.log('--- Close current tab ---');
          that.close();
        }
        return false;
      });
    },
    resizeWindow: function() {
      var that = this;
      win.off(resize).on(resize, function() {
        if(collapseTimeout) {
          clearTimeout(collapseTimeout);
        }
        collapseTimeout = setTimeout(function() {
          $('[data-' + pluginName + ']').each(function() {
            var breakpoint = $(this).data(pluginName).options.breakpoint,
              initUnder = $(this).data(pluginName).options.initUnder;

            if(!!breakpoint) {
              if(win.width() <= breakpoint) {
                $(this).data(pluginName).options.type = '';
              }
              else {
                $(this).data(pluginName).options.type = 'tab';
                if(!$(this).data(pluginName).activeContent.length && $(this).data(pluginName).initEl.length) {
                  $(this).filter('[data-' + pluginName + ']')[pluginName]('collapseContent', $(this).data(pluginName).initEl);
                }
              }
            }

            if(!!initUnder) {
              if(win.width() <= initUnder) {
                if(!$(this).hasClass(that.initCls)) {
                  $(this).filter('[data-' + pluginName + ']')[pluginName]('init');
                }
              }
              else {
                if($(this).hasClass(that.initCls)) {
                  $(this).filter('[data-' + pluginName + ']')[pluginName]('destroy');
                }
              }
            }
          });
        }, 300);
      });
    },
    toggleSelfEvent: function(handle) {
      var that = this,
        content = handle.closest(this.element).find('[data-content="' + handle.data('handle') + '"]');

      that.isAnimating = true;
      if(!handle.closest(this.activeEl).hasClass('active')) {
        handle.addClass('active');
        content.addClass('active')[that.show](this.duration, function() {
          if($.isFunction(that.options.afterOpen)) {that.options.afterOpen(content, handle, that);}
          that.isAnimating = false;
        });
      }
      else {
        handle.removeClass('active');
        content.removeClass('active')[that.hide](this.duration, function() {
          if($.isFunction(that.options.afterClose)) {that.options.afterClose(content, handle);}
          that.isAnimating = false;
        });
      }
    },
    collapseContent: function(handle) {
      var content = handle.closest(this.element).find('[data-content="' + handle.data('handle') + '"]');

      handle.find('input[type="radio"]').prop('checked', true);
      if(!content.length) {
        this.noContent(handle);
      }
      else {
        this.hasContent(handle, content);
      }
    },
    noContent: function(handle) {
      var that = this;
      console.log('--- No Content ---');
      this.activeEl.removeClass('active');
      handle.closest(this.activeEl).addClass('active');

      if(this.activeContent.length) {
        this.isAnimating = true;
        //- Before Close
        if($.isFunction(that.options.beforeClose)) {that.options.beforeClose(that.activeContent);}
        this.activeContent.removeClass('active')[this.hide](this.duration, function() {
          //- After Close
          if($.isFunction(that.options.afterClose)) {that.options.afterClose(that.activeContent);}
          //- Remove activeContent
          that.activeContent = [];
          that.isAnimating = false;
        });
      }
    },
    hasContent: function(handle, content) {
      if(this.activeContent.length) {
        if(this.activeContent[0] !== content[0]) {
          this.changeTab(handle, content);
        }
        else if(this.options.type !== 'tab') {
          this.closeCurrentTab(handle);
        }
      }
      else {
        this.firstOpen(handle, content);
      }
    },
    changeTab: function(handle, content) {
      var that = this,
        childContentVisible = this.activeContent.find(this.options.content).not(':hidden');

      if(childContentVisible.length) {
        console.log('--- Close child Tabs - Tab click ---');
        childContentVisible.closest('[data-' + pluginName + ']')[pluginName]('close');
      }

      console.log('--- Change Tab ---');
      //- Before Close
      if($.isFunction(that.options.beforeClose)) {that.options.beforeClose(that.activeContent);}

      this.isAnimating = true;
      this.activeEl.removeClass('active');
      this.activeContent.removeClass('active')[this.hide](this.duration, function() {
        //- After Close
        if($.isFunction(that.options.afterClose)) {that.options.afterClose(that.activeContent);}

        //- Set new activeContent
        that.activeContent = content;
        //- Before Open
        if($.isFunction(that.options.beforeOpen)) {that.options.beforeOpen(that.activeContent);}

        handle.closest(that.activeEl).addClass('active');
        that.activeContent.addClass('active')[that.show](this.duration, function() {
          //- After Open
          if($.isFunction(that.options.afterOpen)) {that.options.afterOpen(that.activeContent, handle, that);}
          that.isAnimating = false;
        });
      });
    },
    closeCurrentTab: function(handle) {
      var that = this,
        childContentVisible = this.activeContent.find(this.options.content).not(':hidden');
      if(childContentVisible.length) {
        console.log('--- Close child Tabs - Tab click ---');
        childContentVisible.closest('[data-' + pluginName + ']')[pluginName]('close');
      }

      console.log('--- Close current tab ---');
      //- Before Close
      if($.isFunction(that.options.beforeClose)) {that.options.beforeClose(that.activeContent);}

      this.isAnimating = true;
      handle.closest(this.activeEl).removeClass('active');
      this.activeContent.removeClass('active')[this.hide](this.duration, function() {
        //- After Close
        if($.isFunction(that.options.afterClose)) {that.options.afterClose(that.activeContent);}
        //- Remove activeContent
        that.activeContent = [];
        that.isAnimating = false;
      });
    },
    firstOpen: function(handle, content) {
      var that = this;
      console.log('--- First open ---');

      //- Set new activeContent
      that.activeContent = content;
      //- Before Open
      if($.isFunction(that.options.beforeOpen)) {that.options.beforeOpen(that.activeContent);}

      this.isAnimating = true;
      this.activeEl.removeClass('active');
      //handle.closest(this.activeEl).addClass('active');
      this.element.find('[data-handle="' + handle.data('handle') + '"]').closest(this.activeEl).addClass('active');
      that.activeContent.addClass('active')[this.show](this.duration, function() {
        //- After Open
        if($.isFunction(that.options.afterOpen)) {that.options.afterOpen(that.activeContent, handle, that);}
        that.isAnimating = false;
      });
    },
    close: function() {
      var that = this;

      //- Before Close
      if($.isFunction(that.options.beforeClose)) {that.options.beforeClose(that.activeContent);}

      this.isAnimating = true;
      this.activeEl.removeClass('active');
      this.activeContent.removeClass('active')[this.hide](function() {
        //- After Close
        if($.isFunction(that.options.afterClose)) {that.options.afterClose(that.activeContent);}
        //- Remove ActiveContent
        that.activeContent = [];
        that.isAnimating = false;
      });
    },
    destroy: function() {
      this.element.removeClass(this.initCls);
      this.element.find(this.options.content).removeAttr('style').removeClass('active');
      this.element.find(this.options.handle).removeClass('active');
      this.activeContent = [];
      this.isAnimating = false;
      this.handles.off('click.changeTab' + pluginName);
      //win.off(resize);
      //$.removeData(this.element[0], pluginName);
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
    handle: '[data-handle]',
    content: '[data-content]',
    activeEl: '[data-active]',
    initEl: '[data-init]',
    closeEl: '[data-close]',
    initCls: 'initCollapse',
    duration: 300,
    htmlClass: '',
    beforeClose: function(activeContent) {
      console.log('beforeClose');
      console.log(activeContent);
    },
    afterClose: function(activeContent) {
      console.log('afterClose');
      console.log(activeContent);
      $('html').removeClass(this.htmlClass);
      console.log(this.htmlClass);
    },
    beforeOpen: function(activeContent) {
      $('html').addClass(this.htmlClass);
      console.log('beforeOpen');
      console.log(activeContent);
    },
    afterOpen: function(activeContent, handle, plugin) {
      var topHandle = handle.offset().top,
        topWindow = win.scrollTop();

      if(activeContent.closest('.navigation .inner').length) {
        Site.scrollTopAfterCollapse(activeContent.closest('.navigation .inner'), handle, true);
      }
      if(plugin.initSuccess) {
        var gotop = handle.data('active');
        if(gotop === 'gotop' &&
          (topHandle < topWindow || topHandle > topWindow + win.height() / 1.25)) {
          Site.scrollTopAfterCollapse($('html, body'), handle, false);
        }
      }
      else {
        plugin.initSuccess = true;
      }
    }
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));
