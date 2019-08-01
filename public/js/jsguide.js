/**
 * @name Guide
 * @description Global variables and functions
 * @version 1.0
 */

var Guide = (function($, window, undefined) {
  'use strict';

  var win = $(window),
    doc = $(document),
    html = $('html'),
    body = $('body'),
    resize = ('onorientationchange' in window) ? 'orientationchange.resizeWindow' : 'resize.resizeWindow';

  var globalFct = function() {
  };

  return {
    win: win,
    doc: doc,
    html: html,
    body: body,
    resize: resize,
    globalFct: globalFct
  };

})(jQuery, window);

jQuery(function() {
  Guide.globalFct();
});

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

/**
 *  @name cookies
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

  var pluginName = 'cookies';

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, this.element.data(), options, this.element.data(pluginName));
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      this.initialize();
      this.listener();
    },
    initialize: function() {
      // Check Cookie
      if(this.readCookie('showSticky')) {
        // Show sticky
      }
    },
    listener: function() {
      var that = this;
      $('.close').off('click.' + pluginName).on('click.' + pluginName, function() {
        that.createCookie('showSticky');
      });
      $(window).off('unload.' + pluginName).on('unload.' + pluginName, function() {
        that.eraseCookie('showSticky');
      });
    },
    createCookie: function(name, value, days) {
      var expires = '';
      if(days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = '; expires=' + date.toGMTString();
      }
      document.cookie = name + '=' + value + expires + '; path=/';
    },
    readCookie: function(name) {
      var nameEQ = name + '=',
        ca = document.cookie.split(';');

      for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
          c = c.substring(1,c.length);
        }
        if (c.indexOf(nameEQ) === 0) {
          return c.substring(nameEQ.length,c.length);
        }
      }
      return null;
    },
    eraseCookie: function(name) {
      this.createCookie(name, '', -1);
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

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));

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

  var pluginName = 'gmap',
    body = $('body'),
    win = $(window),
    styles = L10n.styles;

  var setScrollMap = function(isScroll) {
    if (this.vars.map) {
      this.vars.map.setOptions({scrollwheel: isScroll});
    }
  };

  var checkScrollMap = function() {
    var that = this;
    google.maps.event.addDomListener(document.getElementById(this.options.id), 'click', function() {
      setScrollMap.call(that, true);
    });
    google.maps.event.addDomListener(document.getElementById(this.options.id).childNodes, 'click', function() {
      setScrollMap.call(that, true);
    });
    google.maps.event.addListener(that.vars.map, 'mousedown', function(){
      setScrollMap.call(that, true);
    });
    body.on('mousedown.' + pluginName, function(e) {
      if (!$(e.target).closest('#' + that.options.id).length) {
        setScrollMap.call(that, false);
      }
    });
    win.on('scroll.' + pluginName, function() {
      setScrollMap.call(that, false);
    });
  };

  var changeZoom = function() {
    var that = this;
    this.vars.map.addListener('zoom_changed', function() {
      that.vars.zoomchanged = that.vars.map.getZoom();
    });
  };

  var initAutocomplete = function() {
    var that = this;
    var input = document.getElementById(this.options.input);
    if(input) {
      var searchBox = new google.maps.places.SearchBox(input);
      this.vars.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

      this.vars.map.addListener('bounds_changed', function() {
        searchBox.setBounds(that.vars.map.getBounds());
      });

      var markers = [];
      searchBox.addListener('places_changed', function() {
        var places = searchBox.getPlaces();
        var bounds = new google.maps.LatLngBounds();
        var infos;

        if (places.length === 0) {
          return;
        }

        markers.forEach(function(marker) {
          marker.setMap(null);
        });
        markers = [];

        places.forEach(function(place, i) {
          if (!place.geometry) {
            console.log('Returned place contains no geometry');
            return;
          }
          var icon = {
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchoPoint: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(25, 25)
          };

          // Create a marker for each place.
          markers.push(new google.maps.Marker({
            map: that.vars.map,
            icon: icon,
            title: place.name,
            position: place.geometry.location
          }));

          infos = '<strong style="display: block; text-align: center;">' + place.name + '</strong>' + place.formatted_address;

          google.maps.event.addListener(markers[i], 'click', function() {
            that.setCenter(markers[i]);
            that.showInfoWindow(markers[i], '<div class="noscrollbar">' + infos + '</>');
          });

          if (place.geometry.viewport) {
            bounds.union(place.geometry.viewport);
          } else {
            bounds.extend(place.geometry.location);
          }
        });
        changeZoom.call(that);
        that.vars.map.fitBounds(bounds);
      });
    }
  };

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options, this.element.data(pluginName));
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      this.vars = {};
      this.vars.marker = [],
      this.vars.locations = window[this.options.locations];
      this.vars.optMap = {
        center: {lat: this.vars.locations[0].lat, lng: this.vars.locations[0].lng},
        zoom: this.options.zoom[0],
        styles: styles,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
        streetViewControl: false,
        zoomControl: true,
        zoomControlOptions: {
          style: google.maps.ZoomControlStyle.DEFAULT,
          position: google.maps.ControlPosition.RIGHT_CENTER
        },
        panControl: false,
        scrollwheel: false,
        //draggable: Modernizr.mobile || Modernizr.tablet ? false : true,
        gestureHandling: 'cooperative'
      };

      this.initGmap();
    },
    initGmap: function() {
      this.vars.map = new google.maps.Map(document.getElementById(this.options.id), this.vars.optMap);

      this.setMarkers();
      this.listener();
    },
    listener: function() {
      checkScrollMap.call(this);
      initAutocomplete.call(this);
      this.changeLocation(this.vars.locations, this.options.initValue);
    },
    setMarkers: function() {
      var that = this,
        circle,
        position;
        this.vars.bound = new google.maps.LatLngBounds();

      this.vars.infowindow = new google.maps.InfoWindow();
      for (var i = 0, n = this.vars.locations.length; i < n; ++i) {
        that.vars.icon = {
          url: that.vars.locations[i].marker || that.options.icon //https://developers.google.com/maps/documentation/javascript/examples/icon-complex
        };
        this.vars.bound.extend(new google.maps.LatLng(that.vars.locations[i].lat, that.vars.locations[i].lng));
        position = new google.maps.LatLng(that.vars.locations[i].lat, that.vars.locations[i].lng);

        that.vars.marker[i] = new google.maps.Marker({
          position: position,
          title: that.vars.locations[i].name,
          map: that.vars.map,
          icon: that.vars.icon,
          animation: google.maps.Animation.DROP //https://developers.google.com/maps/documentation/javascript/examples/marker-animations
        });

        google.maps.event.addListener(that.vars.marker[i], 'click', (function(marker, mess) {
          return function() {
            changeZoom.call(that);
            that.setCenter(marker);
            that.showInfoWindow(marker, mess);
            $('#' + that.options.dropdown).val(marker.title);
            $('#' + that.options.dropdown).closest('[data-select]').addClass('selected').find('span').html(marker.title);
          };
        })(that.vars.marker[i], this.vars.locations[i].mess));

        circle = new google.maps.Circle({
          map: that.vars.map,
          radius: 4000,
          fillColor: '#AA0000',
          strokeWeight: 1
        });
        circle.bindTo('center', that.vars.marker[i], 'position');
      }
      this.boundAllPosition();
    },
    boundAllPosition: function() {
      this.vars.map.setCenter(this.vars.bound.getCenter());
      this.vars.map.fitBounds(this.vars.bound);
    },
    changeLocation: function(locations, initValue) {
      var that = this,
        opt = '';
      for (var i = 0, n = locations.length; i < n; ++i) {
        if(initValue === locations[i].name) {
          opt = '<option value="' + locations[i].name + '" selected="selected">' + locations[i].name + '</option>';
        }
        else {
          opt = '<option value="' + locations[i].name + '">' + locations[i].name + '</option>';
        }
        $('#' + this.options.dropdown).append(opt);
      }

      $('#' + this.options.dropdown).on('change.' + pluginName, function() {
        var name = $(this).val();
        for (var i = 0, n = that.vars.locations.length; i < n; ++i) {
          if(name === that.vars.locations[i].name) {
            google.maps.event.trigger(that.vars.marker[i], 'click');
          }
        }
        if(!name) {
          that.boundAllPosition();
          that.vars.infowindow.close();
          that.vars.zoomchanged = undefined;
        }
      });//.change();
      google.maps.event.addListenerOnce(this.vars.map, 'idle', function() {
        $('#' + that.options.dropdown).change();
      });
    },
    setCenter: function(marker) {
      var zoomchanged = this.options.zoom[1];
      if(!!this.vars.zoomchanged) {
        zoomchanged = this.vars.zoomchanged;
      }
      this.vars.map.setZoom(zoomchanged);
      this.vars.map.panTo(marker.getPosition());
    },
    showInfoWindow: function(marker, mess) {
      this.vars.infowindow.setContent(mess);
      this.vars.infowindow.open(this.vars.map, marker);
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
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]({
      icon: 'images/pink-marker.png'
    });
  });

}(jQuery, window));

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

/**
 *  @name pinchzoom
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

  var pluginName = 'pinchzoom',
    timeResize,
    win = $(window),
    resize = ('onorientationchange' in window) ? 'orientationchange.resize' + pluginName : 'resize.resize' + pluginName;

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options, this.element.data(pluginName));
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      this.handle = this.element.find(this.options.handle);
      this.closezoom = this.element.find(this.options.closezoom);
      this.img = this.options.img;
      this.initialize(this.options.img);
      this.listener();
    },
    listener: function() {
      var that = this;
      this.closezoom.off('mousedown.close' + pluginName).on('mousedown.close' + pluginName, function() {
        that.destroy();
      });

      win.on(resize, function() {
        if(timeResize) {
          clearTimeout(timeResize);
        }
        timeResize = setTimeout(function() {
          $('[data-' + pluginName + ']').each(function() {
            if($(this).css('opacity') !== '0') {
              $(this)[pluginName]('destroy');
              $(this)[pluginName]('initialize');
            }
          });
        }, 300);
      });
    },
    initialize: function(imgSrc) {
      if(this.img) {
        this.img = (imgSrc && this.img !== imgSrc) ? imgSrc : this.img;
      }
      else {
        this.img = imgSrc;
      }
      if(!!this.img) {
        if(this.options.initUnder) {
          if(win.width() < this.options.initUnder) {
            this.element.addClass('showZoomContainer');
            this.initSmoothZoom();
          }
          else {
            this.destroy();
          }
        }
        else if (this.options.initUpper) {
          if(win.width() > this.options.initUpper) {
            this.element.addClass('showZoomContainer');
            this.initSmoothZoom();
          }
          else {
            this.destroy();
          }
        }
        else {
          this.element.addClass('showZoomContainer');
          this.initSmoothZoom();
        }
      }
    },
    initSmoothZoom: function() {
      var that = this;

      this.handle.smoothZoom({
        image_url: that.img,
        initial_ZOOM: 500,
        zoom_BUTTONS_SHOW: false,
        pan_BUTTONS_SHOW: false,
        border_SIZE: 0,
        responsive: true,
        width: '100%',
        height: '100%'
      });
    },
    destroy: function() {
      this.handle.smoothZoom('destroy');
      this.handle.removeAttr('style');
      this.handle.removeAttr('class');
      this.element.removeClass('showZoomContainer');
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
    closezoom: '[data-closezoom]'
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));

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

/**
 *  @name sameheight
 *  @description Equal height of blocks on row
 *  @version 1.0
 *  @options
 *    parent: '[data-parent]'
 *    child: '[data-child]'
 *  @events
 *    Réize
 *  @methods
 *    init
 *    initialize
 *    checkImgLoad
 *    setSameHeight
 *    destroy
 */
;(function($, window, undefined) {
  'use strict';

  var pluginName = 'sameheight',
    win = $(window),
    resize = ('onorientationchange' in window) ? 'orientationchange.resize' + pluginName : 'resize.resize' + pluginName;

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      this.parent = this.element.find(this.options.parent);
      this.childs = this.element.find(this.options.child);
      if(!this.parent.length) {return;}
      this.initialize();
      win.off(resize).on(resize, function() {
        $('[data-' + pluginName + ']')[pluginName]('initialize');
      });
    },
    initialize: function() {
      if(this.element.find('img').length) {
        this.checkImgLoad();
      }
      else {
        this.setSameHeight();
      }
    },
    checkImgLoad: function() {
      var that = this,
        imagesLoaded = 0,
        totalImages = this.element.find('img').length;

      this.element.find('img').each(function() {
        var fakeSrc = $(this).attr('src');

        $('<img />')
          .attr('src', fakeSrc).css('display', 'none')
          .on('load.' + pluginName, function() {
            ++imagesLoaded;
            if (imagesLoaded === totalImages) {
              $.isFunction(that.setSameHeight) && that.setSameHeight();
            }
          })
          .on('error.' + pluginName, function() {
            ++imagesLoaded;
            if (imagesLoaded === totalImages) {
              $.isFunction(that.setSameHeight) && that.setSameHeight();
            }
          });
      });
    },
    setSameHeight: function() {
      var perRow = Math.floor(this.element.width() / this.parent.width());

      this.parent.css('height', 'auto');
      this.childs.css('height', 'auto');

      if(perRow > 1) {
        for(var i = 0, n = this.parent.length; i < n; i += perRow) {
          var itemPerRow = this.parent.slice(i, i + perRow),
            totalPerRow = itemPerRow.length,
            child = '',
            maxHeight = 0,
            idx = 0,
            obj = {};

          itemPerRow.each(function(index) {
            idx = index;
            $(this).find('[data-child]').each(function() {
              child = $(this).attr('data-child');
              if(index % totalPerRow === 0 || obj[child] === undefined) {
                obj[child] = 0;
              }
              obj[child] = Math.max(obj[child], $(this).outerHeight());
            });
          });

          if(idx === totalPerRow - 1) {
            itemPerRow.each(function() {
              for (var key in obj) {
                $(this).find('[data-child="' + key + '"]').css('height', obj[key]);
              }
              maxHeight = Math.max(maxHeight, $(this).outerHeight());
            });

            if(this.options[pluginName] !== 'no4parent') {
              itemPerRow.css('height', maxHeight);
            }
          }
        }
      }
    },
    destroy: function() {
      this.parent.css('height', 'auto');
      this.childs.css('height', 'auto');
      win.off(resize);
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
    parent: '[data-parent]',
    child: '[data-child]'
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));

/**
 *  @name scrollbar
 *  @description description
 *  @version 1.0
 *  @options
 *    option
 *  @events
 *    event
 *  @methods
 *    init
 *    initialized
 *    resizeEvent
 *    destroy
 */
;(function($, window, undefined) {
  'use strict';

  var pluginName = 'scrollbar',
    isTouch = 'ontouchstart' in document.documentElement;

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options, this.element.data(pluginName));
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      var that = this;
        this.vars = {
          theme: that.options.theme || 'dark',
          axis: that.options.axis || 'y',
          autoHideScrollbar: that.options.autoHideScrollbar || false,
          scrollAmount: that.options.scrollAmount || 'auto'
        };

      if(!isTouch) {
        this.defineOption();
      }
    },
    defineOption: function() {
      var that = this;
      this.option = {
        theme: this.vars.theme,
        axis: this.vars.axis,
        autoHideScrollbar: this.vars.autoHideScrollbar,
        autoExpandScrollbar: true,
        mouseWheel: {
          scrollAmount: this.vars.scrollAmount
        },
        callbacks: {
          onCreate: this.onCreate(that.element),
          onUpdate: this.onUpdate(that.element)
        }
      };

      if(!!this.options.scrollAmount) {
        this.option = $.extend({}, this.option, {
          snapAmount: this.vars.scrollAmount
        });
      }

      if(this.options.scrollButtons) {
        this.option = $.extend({}, this.option, {
          scrollButtons: {
            enable: true,
            scrollType: 'stepped'
          }
        });
      }

      if(this.options.autoHorizontal) {
        this.option = $.extend({}, this.option, {
          advanced: {
            autoExpandHorizontalScroll: true
          }
        });
      }

      // Call mCustomScrollbar
      this.initialized(this.option);
    },
    initialized: function(option) {
      this.element.mCustomScrollbar(option);
    },
    onCreate: function() {
      console.log('onCreate');
    },
    onUpdate: function() {
      console.log('onUpdate');
    },
    destroy: function() {
      this.element.mCustomScrollbar('destroy');
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

  $.fn[pluginName].defaults = {};

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));

/**
 *  @name scrollto
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

  var pluginName = 'scrollto',
    win = $(window);

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options, this.element.data(pluginName));
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      var that = this,
        el = this.element,
        destination = this.options.handle,
        initUnder = this.options.initUnder;

      this.toggleShow();
      win.off('scroll.' + pluginName).on('scroll.' + pluginName, function() {
        that.toggleShow();
      });
      el.off('click.' + pluginName).on('click.' + pluginName, function(e) {
        e.preventDefault();
        e.stopPropagation();
        if(win.width() < initUnder && $(destination).length) {
          that.scrollTo(destination);
        }
      });
    },
    toggleShow: function() {
      if(this.options[pluginName].handle === 'body') {
        if(win.scrollTop() > 500) {
          this.element.fadeIn('slow');
        }
        else {
          this.element.fadeOut('slow');
        }
      }
    },
    scrollTo: function(elm) {
      var that = this,
        scrollTo = !!$(elm).length ? $(elm).offset().top : 0;

      $('html, body').animate({
        scrollTop: scrollTo
      }, that.options.duration, 'easeOutCubic'); // jquery.easing.1.3.js
    },
    destroy: function() {
      this.element.off('click.' + pluginName);
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
    duration: 600,
    initUnder: 9999
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));

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

/**
 *  @name slider
 *  @version 1.0
 *  @events
 *    afterChange - Event of Slick slider
 *  @methods
 *    init
 *    initialize
 *    checkImgLoad
 *    initSlider
 *    setPositionArrows
 *    slickPause
 *    slickPlay
 *    destroy
 */
;(function($, window, undefined) {
  'use strict';

  var pluginName = 'cslider',
    timeResize,
    win = $(window),
    resize = ('onorientationchange' in window) ? 'orientationchange.resize' + pluginName : 'resize.resize' + pluginName,
    TypeSliders = {
      SINGLE: 'single',
      CAROUSEL: 'carousel',
      CENTERMODE: 'centerMode',
      VIDEOSLIDE: 'videoSlide',
      VARIABLEWIDTH: 'variableWidth',
      VERTICAL: 'vertical',
      SYNCING: 'syncing'
    },
    States = {
      BEFORECHANGE: 'beforechange',
      AFTERCHANGE: 'afterchange',
      RESIZE: 'resize'
    };

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options, this.element.data(pluginName));
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      this.handle = this.element.find(this.options.handle);
      this.smoothZoom = this.element.find(this.options.smoothZoom);
      if(this.handle.is(':visible')) {
        if(this.options.initUnder) {
          if(win.width() <= this.options.initUnder) {
            this.handle.removeClass('no-slide');
            this.initialize();
          }
          else {
            this.handle.addClass('no-slide');
          }
        }
        else {
          this.initialize();
        }

        win.on(resize, function() {
          if(timeResize) {
            clearTimeout(timeResize);
          }
          timeResize = setTimeout(function() {
            $('[data-' + pluginName + ']').each(function() {
              if($(this).data()[pluginName].options[pluginName].hasZoom) {
                $(this)[pluginName]('zoomEffect', States.RESIZE);
              }
              if($('.slick', this).is(':visible')) {
                if($(this).data()[pluginName].options[pluginName].initUnder) {
                  if(win.width() < $(this).data()[pluginName].options[pluginName].initUnder) {
                    $('.slick', this).removeClass('no-slide');
                    if(!$('.slick', this).hasClass('slick-initialized')) {
                      $(this)[pluginName]('initialize');
                    }
                    else {
                      $(this)[pluginName]('setPositionArrows');
                    }
                  }
                  else if($('.slick', this).hasClass('slick-initialized')) {
                    $('.slick', this).addClass('no-slide');
                    $(this)[pluginName]('destroy');
                  }
                }
                else {
                  $(this)[pluginName]('setPositionArrows');
                  $(this)[pluginName]('slickNoSlide');

                  // Just only have on Resize event.
                  if($('.slick', this).hasClass('no-slide')) {
                    $(this)[pluginName]('destroy');
                    $(this)[pluginName]('init');
                  }
                }
              }
            });
          }, 600);
        });
      }
    },
    initialize: function() {
      if(this.element.find('img').length) {
        this.checkImgLoad();
      }
      else {
        this.initSlider();
      }
    },
    checkImgLoad: function() {
      var that = this,
        fakeSrc = this.element.find('img:visible').first().attr('src');

      $('<img />')
        .attr('src', fakeSrc).css('display', 'none')
        .on('load.' + pluginName, function() {
          that.initSlider();
        })
        .on('error.' + pluginName, function() {
          that.initSlider();
        });
    },
    initSlider: function() {
      var that = this,
        option,
        navFor = {};

      this.handle.on('init.' + pluginName, function(event, slick) {
        that.onInitSlick(event, slick);
      });

      switch(this.options.type) {
        case TypeSliders.SINGLE:
          option = this.options.singleSlider;
          break;
        case TypeSliders.CAROUSEL:
          option = this.options.carousel;
          break;
        case TypeSliders.CENTERMODE:
          option = this.options.centerMode;
          break;
        case TypeSliders.VIDEOSLIDE:
          option = this.options.videoSlide;
          break;
        case TypeSliders.VARIABLEWIDTH:
          option = $.extend(this.options.variableWidth, {
            slidesToShow: that.element.find('.item').length - 1
          });
          break;
        case TypeSliders.VERTICAL:
          option = this.options.vertical;
          break;
        case TypeSliders.SYNCING:
          if(this.options.view) {
            navFor.asNavFor = this.options.navFor;
            option = $.extend(this.options.sycingView, navFor);
          }
          else {
            navFor.asNavFor = this.options.navFor;
            option = $.extend(this.options.sycingThumb, navFor);
          }
          break;
        default:
          option = this.options.singleSlider;
      }
      // Dots
      if(typeof this.options.dots !== 'undefined') {
        option = $.extend(option, {dots: this.options.dots});
      }
      // Arrows
      if(typeof this.options.arrows !== 'undefined') {
        option = $.extend(option, {arrows: this.options.arrows});
      }
      // fade : true / false
      if(typeof this.options.fade !== 'undefined') {
        option = $.extend(option, {fade: this.options.fade});
      }
      // Autoplay
      if(typeof this.options.autoplay !== 'undefined') {
        option = $.extend(option, {
          autoplay: this.options.autoplay,
          autoplaySpeed: 3000,
        });
      }
      // Control
      this.handle.slick(option);

      this.handle.on('beforeChange.' + pluginName, function() {
        that.zoomEffect(States.BEFORECHANGE);

        if(typeof YT === 'object') {
          that.element.find('[data-youtube]').youtube('pauseClip');
          that.element.find('[data-video]').video('pauseClip');
        }
      });
      this.handle.on('afterChange.' + pluginName, function() {
        that.setPositionArrows();
        that.zoomEffect(States.AFTERCHANGE);

        // Auto play after Paused youtube/video
        if(typeof YT === 'object') {
          $('.slick-current', that.element).find('[data-youtube]').youtube('playClip');
          $('.slick-current', that.element).find('[data-video]').video('playClip');
        }
      });
      this.hoverBulletEvent();
      this.setPositionArrows();
      this.slickNoSlide();
    },
    onInitSlick: function() {
      var that = this;
      this.zoomEffect();
      this.handle.off('click.currentItemEvents', '.slick-current').on('click.currentItemEvents', '.slick-current', function() {
        if(that.options.hasPopup && win.width() > 767) {
          that.turnOnPopup($(this));
          return false;
        }
        if(that.options.smoothZoom && win.width() < 768) {
          that.callSmoothZoom($(this).find('img').data('zoomImage'));
        }
      });
    },
    callSmoothZoom: function(imgSrc) {
      this.element.find('[data-pinchzoom]').pinchzoom('initialize', imgSrc);
    },
    turnOnPopup: function(currentSlide) {
      $.fancybox.open(
        this.getGalleryList(currentSlide),
        {
          loop: false,
          slideShow: false,
          fullScreen: false,
          thumbs: false
        }
      );
    },
    getGalleryList: function(currentSlide) {
      var galleryList = [],
        imgSrc,
        list = this.handle.find('.slick-slide').not('.slick-cloned').find('img'),
        currentImage = currentSlide.find('img').data('zoomImage'),
        obj;

      list.each(function() {
        obj = {};
        imgSrc = $(this).data('zoomImage');
        obj.src = imgSrc;
        if(imgSrc === currentImage) {
          galleryList.unshift(obj);
        }
        else {
          galleryList.push(obj);
        }
      });
      return galleryList;
    },
    zoomEffect: function(stateSlider) {
      if(this.options.hasZoom) {
        switch(stateSlider) {
          case States.BEFORECHANGE:
            $('.slick-current', this.element).zoomer('destroy');
            break;
          case States.AFTERCHANGE:
            $('.slick-current', this.element).zoomer('destroy');
            $('.slick-current', this.element).zoomer('init');
            break;
          case States.RESIZE:
            $('.slick-current', this.element).zoomer('destroy');
            $('.slick-current', this.element).zoomer('init');
            break;
          default:
            $('.slick-current', this.element).zoomer('init'); // First call zoomer of slider
            break;
        }
      }
    },
    hoverBulletEvent: function() {
      if(this.options[pluginName].slideOnHover) {
        this.handle.find('.slick-dots').on('mouseenter.bullet', 'li', function() {
          $(this).trigger('click');
        });
      }
    },
    setPositionArrows: function() {
      var arrowControl = this.handle.find('.slick-arrow'),
        imgVisible = this.handle.find('[aria-hidden="false"] .img-view'),
        maxHeight = 0,
        posTop = 0;

      if(this.options.setPositionArrows) {
        $(imgVisible).each(function() {
          maxHeight = Math.max($(this).height(), maxHeight);
        });
        posTop = (maxHeight / 2);
        arrowControl.animate({'top': posTop}, 300);
      }
    },
    slickNoSlide: function() {
      var getSlick = this.handle.slick('getSlick');

      if(getSlick.slideCount <= getSlick.options.slidesToShow) {
        this.element.addClass('no-slide');
      }
      else {
        this.element.removeClass('no-slide');
      }
    },
    slickPause: function() {
      this.handle.slickPause();
    },
    slickPlay: function() {
      this.handle.slickPlay();
    },
    destroy: function() {
      this.handle
        .slick('unslick')
        .off('afterChange.' + pluginName);
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
    handle: '.slick',
    singleSlider: {
      infinite: true,
      speed: 600,
      slidesToShow: 1,
      zIndex: 5,
      accessibility: false, // Disable Slide go to top on after change
      rtl: $('html').attr('dir') === 'rtl' ? true : false
    },
    carousel: {
      infinite: true,
      speed: 600,
      slidesToShow: 6,
      slidesToScroll: 2,
      // autoplay: true,
      // autoplaySpeed: 3000,
      zIndex: 5,
      rtl: $('html').attr('dir') === 'rtl' ? true : false,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 4
          }
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 3
          }
        },
        {
          breakpoint: 544,
          settings: {
            slidesToShow: 2
          }
        }
      ]
    },
    centerMode: {
      centerMode: true,
      slidesToShow: 1,
      focusOnSelect: false,
      centerPadding: '0',
      zIndex: 5,
      rtl: $('html').attr('dir') === 'rtl' ? true : false,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 1,
            centerPadding: '25%'
          }
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 1,
            centerPadding: 0
          }
        }
      ]
    },
    videoSlide: {
      centerMode: true,
      slidesToShow: 1,
      focusOnSelect: false,
      centerPadding: '0',
      zIndex: 5,
      rtl: $('html').attr('dir') === 'rtl' ? true : false,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 1,
            centerPadding: 0
          }
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 1,
            centerPadding: 0
          }
        }
      ]
    },
    sycingView: {
      infinite: true,
      speed: 600,
      slidesToShow: 1,
      zIndex: 5,
      rtl: $('html').attr('dir') === 'rtl' ? true : false
    },
    sycingThumb: {
      infinite: true,
      speed: 600,
      slidesToShow: 5,
      slidesToScroll: 1,
      centerMode: true,
      centerPadding: 0,
      focusOnSelect: true,
      // autoplay: true,
      // autoplaySpeed: 3000,
      zIndex: 5,
      rtl: $('html').attr('dir') === 'rtl' ? true : false,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1
          }
        }
      ]
    },
    variableWidth: {
      speed: 600,
      variableWidth: true,
      infinite: true,
      zIndex: 5
    },
    vertical: {
      vertical: true,
      verticalSwiping: true,
      slidesToShow: 3,
      slidesToScroll: 1,
      zIndex: 5
    }
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));

/**
 *  @name sticky
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

  var pluginName = 'sticky',
    win = $(window),
    resizeTimeout,
    resize = ('onorientationchange' in window) ? 'orientationchange.resize' + pluginName : 'resize.resize' + pluginName;

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options, this.element.data(pluginName));
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      this.status = false;
      this.option = {
        offset_top: $('.nav-container').height()
      };
      if(win.width() > 767) {
        this.initialized();
      }
      this.listener();
    },
    listener: function() {
      win.off(resize).on(resize, function() {
        if(resizeTimeout) {
          clearTimeout(resizeTimeout);
        }
        resizeTimeout = setTimeout(function() {
          $('[data-' + pluginName + ']').each(function() {
            if(win.width() > 767 && !$(this).data()[pluginName].status) {
              $(this)[pluginName]('init');
            }
            else if(win.width() < 767 && $(this).data()[pluginName].status) {
              $(this)[pluginName]('destroy');
            }
          });
        }, 300);
      });
    },
    initialized: function() {
      this.status = true;
      this.element.stick_in_parent(this.option);
    },
    destroy: function() {
      this.status = false;
      this.element.trigger('sticky_kit:detach');
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
  };

  $(function() {
    if($('body').hasClass('catalog-category-view') || $('body').hasClass('catalogsearch-result-index')) {
      $('[data-' + pluginName + ']')[pluginName]();
    }
  });
}(jQuery, window));
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

/**
 *  @name Video
 *  @description Control Play/Pause/Ended Video HTML5
 *  @version 1.0
 */
;(function($, window, undefined) {
  'use strict';

  var pluginName = 'video';
  var Statuses = {
    PAUSED: 'paused',
    PLAYING: 'playing',
    LOADING: 'loading',
    ENDED: 'ended'
  };
  var ClassNames = {
    PAUSED: 'paused',
    PLAYING: 'playing',
    LOADING: 'loading',
    ENDED: 'ended'
  };

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options, this.element.data(pluginName));
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      var that = this;
      this.status = Statuses.PAUSED;
      this.handle = this.element.find(this.options.handle);
      this.video = this.element.find('video');
      var isClick = false;
      this.handle
      .off('mousedown.' + pluginName).on('mousedown.' + pluginName, function() {
        isClick = true;
      }).off('mousemove.' + pluginName).on('mousemove.' + pluginName, function() {
        isClick = false;
      }).off('click.' + pluginName).on('click.' + pluginName, function(e) {
        e.preventDefault();
        e.stopPropagation();
        if(isClick) {
          switch(that.status) {
            case Statuses.PAUSED:
            case Statuses.ENDED:
              that.firstPlay = true;
              that.playClip(that.firstPlay);
              break;
            case Statuses.PLAYING:
              that.pauseClip();
              break;
          }
        }
      });

      this.video.get(0).addEventListener('waiting', this.waitingLoad, false);
      this.video.get(0).addEventListener('pause', this.onPausing, false);
      this.video.get(0).addEventListener('playing', this.onPlaying, false);
      this.video.get(0).addEventListener('ended', this.endVideo, false);
    },
    playClip: function() {
      if(this.firstPlay) {
        $('[data-youtube]').length && $('[data-youtube]').youtube('pauseClip');
        $('[data-video]').video('pauseClip');
        this.element.removeClass(ClassNames.PAUSED + ' ' + ClassNames.LOADING + ' ' + ClassNames.ENDED).addClass(ClassNames.PLAYING);
        this.status = Statuses.PLAYING;
        this.video.get(0).play();
      }
    },
    pauseClip: function() {
      if(this.status === Statuses.PLAYING) {
        this.element.removeClass(ClassNames.PLAYING + ' ' + ClassNames.LOADING + ' ' + ClassNames.ENDED).addClass(ClassNames.PAUSED);
        this.status = Statuses.PAUSED;
        this.video.get(0).pause();
      }
    },
    waitingLoad: function() {
      $(this).closest('[data-' + pluginName + ']').addClass(ClassNames.LOADING);
      $(this).closest('[data-' + pluginName + ']').data('video').status = Statuses.LOADING;
    },
    onPausing: function() {
      $(this).closest('[data-' + pluginName + ']').removeClass(ClassNames.PLAYING + ' ' + ClassNames.LOADING + ' ' + ClassNames.ENDED).addClass(ClassNames.PAUSED);
      $(this).closest('[data-' + pluginName + ']').data('video').status = Statuses.PAUSED;
    },
    onPlaying: function() {
      $(this).closest('[data-' + pluginName + ']').removeClass(ClassNames.PAUSED + ' ' + ClassNames.LOADING + ' ' + ClassNames.ENDED).addClass(ClassNames.PLAYING);
      $(this).closest('[data-' + pluginName + ']').data('video').status = Statuses.PLAYING;
    },
    endVideo: function() {
      $(this).closest('[data-' + pluginName + ']').removeClass(ClassNames.PAUSED + ' ' + ClassNames.PLAYING).addClass(ClassNames.ENDED);
      $(this).closest('[data-' + pluginName + ']').data('video').status = Statuses.ENDED;
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
    handle: '[data-handle]'
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));

/**
 *  @name youtube
 *  @description Control play/pause/end youtube, using youtube API
 *  @version 1.0
 */
;(function($, window, undefined) {
  'use strict';

  var pluginName = 'youtube';
  var Statuses = {
    UNLOAD: 'unload',
    PAUSED: 'paused',
    PLAYING: 'playing',
    LOADING: 'loading',
    ENDED: 'ended'
  };
  var ClassNames = {
    PAUSED: 'paused',
    PLAYING: 'playing',
    LOADING: 'loading',
    ENDED: 'ended'
  };
  var getYoutubeId = function(url) {
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/,
      match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : false;
  };

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options, this.element.data(pluginName));
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      this.handle = this.element.find(this.options.handle);
      this.iframeCls = this.element.find(this.options.iframeCls);
      this.idVideo = !!getYoutubeId.call(this, this.options.idOrLink) ? getYoutubeId.call(this, this.options.idOrLink) : this.options.idOrLink;
      this.status = Statuses.UNLOAD;
      this.autoplay = this.options.autoplay ? this.options.autoplay : 0;
      if(typeof YT === 'object') {
        this.initYoutube();
      }
    },
    initYoutube: function() {
      var that = this;

      that.player = new YT.Player(this.iframeCls.get(0), {
        videoId: that.idVideo,
        playerVars: {
          'autoplay': that.autoplay,
          'rel': 1,
          'showinfo': 0,
          'controls': 1,
          'modestbranding': 0
        },
        events: {
          onReady: function() {
            that.listener();
          },
          onStateChange: function(event) {
            that.onPlayerStateChange(event, that);
          }
        }
      });
    },
    listener: function() {
      var that = this,
        isClick = false;
      this.handle
      .off('mousedown.' + pluginName).on('mousedown.' + pluginName, function() {
        isClick = true;
      }).off('mousemove.' + pluginName).on('mousemove.' + pluginName, function() {
        isClick = false;
      }).off('click.' + pluginName).on('click.' + pluginName, function(e) {
        e.preventDefault();
        e.stopPropagation();
        if(isClick) { // Check for touchmouve on slider
          switch(that.status) {
            case Statuses.UNLOAD:
            case Statuses.ENDED:
              that.playClip(true);
              break;
            case Statuses.PAUSED:
              that.playClip();
              break;
            case Statuses.PLAYING:
              that.pauseClip();
              break;
            case Statuses.LOADING:
              break;
          }
        }
      });
    },
    playClip: function(isUnload) {
      if(isUnload || this.status === Statuses.PAUSED) {// Use on case use: $('[data-youtube]').youtube('pauseClip');
        $('[data-video]').length && $('[data-video]').video('pauseClip');
        $('[data-youtube]').youtube('pauseClip');
        this.player.playVideo();
        this.element
          .addClass(ClassNames.PLAYING)
          .removeClass(ClassNames.PAUSED + ' ' + ClassNames.LOADING + ' ' + ClassNames.ENDED);
      }
    },
    pauseClip: function() {
      if(this.status === Statuses.PLAYING) {// Use on case use: $('[data-youtube]').youtube('pauseClip');
        this.player.pauseVideo();
        this.element
          .addClass(ClassNames.PAUSED)
          .removeClass(ClassNames.PLAYING + ' ' + ClassNames.LOADING + ' ' + ClassNames.ENDED);
      }
    },
    onPlayerStateChange: function(event, plugin) {
      switch (event.data) {
        case YT.PlayerState.PAUSED:
          plugin.status = Statuses.PAUSED;
          plugin.element
            .addClass(ClassNames.PAUSED)
            .removeClass(ClassNames.PLAYING + ' ' + ClassNames.LOADING + ' ' + ClassNames.ENDED);
          break;
        case YT.PlayerState.PLAYING:
          plugin.status = Statuses.PLAYING;
          plugin.element
            .addClass(ClassNames.PLAYING)
            .removeClass(ClassNames.PAUSED + ' ' + ClassNames.LOADING + ' ' + ClassNames.ENDED);
          break;
        case YT.PlayerState.BUFFERING:
          plugin.status = Statuses.LOADING;
          break;
        case YT.PlayerState.ENDED:
          plugin.status = Statuses.ENDED;
          plugin.element
            .addClass(ClassNames.ENDED)
            .removeClass(ClassNames.PLAYING + ' ' + ClassNames.LOADING + ' ' + ClassNames.PAUSED);
          break;
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
    handle: '[data-handle]',
    iframeCls: '.iframeYoutube'
  };

  $(function() {
    var tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    window.onYouTubeIframeAPIReady = function() {
      $('[data-' + pluginName + ']')[pluginName]();
    };
  });

}(jQuery, window));

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

  var pluginName = 'zoomer',
    win = $(window),
    zoomTimer,
    resize = ('onorientationchange' in window) ? 'orientationchange.resize' + pluginName : 'resize.resize' + pluginName;

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options, this.element.data(pluginName));
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      this.handle = this.element.find(this.options.handle);

      if(this.element.is(':visible') && win.width() > 767) {
        this.checkImgLoad();
      }
      win.off(resize).on(resize, function() {
        if(zoomTimer) {
          clearTimeout(zoomTimer);
        }
        zoomTimer = setTimeout(function() {
          if($('[data-' + pluginName + ']').is(':visible') && win.width() > 767) {
            $('[data-' + pluginName + ']')[pluginName]('destroy');
            $('[data-' + pluginName + ']')[pluginName]('init');
          }
          else {
            $('[data-' + pluginName + ']')[pluginName]('destroy');
          }
        }, 300);
      });
    },
    checkImgLoad: function() {
      var that = this,
        imagesLoaded = 0,
        totalImages = this.element.find('img').length;

      this.element.find('img').each(function() {
        var fakeSrc = $(this).attr('src');

        $('<img />')
          .attr('src', fakeSrc).css('display', 'none')
          .on('load.' + pluginName, function() {
            ++imagesLoaded;
            if (imagesLoaded === totalImages) {
              $.isFunction(that.defineOption) && that.defineOption();
            }
          })
          .on('error.' + pluginName, function() {
            ++imagesLoaded;
            if (imagesLoaded === totalImages) {
              $.isFunction(that.defineOption) && that.defineOption();
            }
          });
      });
    },
    defineOption: function() {
      var windowZoom = {},
        that = this;

      this.option = {
        borderSize: 1,
        borderColour: '#ddd',
        cursor: 'crosshair',
        easing: true,
        loadingIcon: 'images/loading.svg',
        responsive: true,
        zoomType: 'inner',
        lensColour: '#fff',
        lensOpacity: 0.4,
        zoomId: this.options.zoomId,
        onDestroy: function() {
          //console.log('onDestroy');
        },
        onImageClick: function() {
          //console.log('onImageClick');
        },
        onShow: function() {
          //console.log('onShow');
        },
        onZoomedImageLoaded: function() {
          //console.log('onZoomedImageLoaded');
          that.element.addClass('zoomLoaded');
        },
        onImageSwap: function() {
          //console.log('onImageSwap');
        },
        onImageSwapComplete: function() {
          //console.log('onImageSwapComplete');
        }
      };

      if(win.width() > 1023) {
        windowZoom = {
          zoomType: 'window',
          zoomWindowWidth: this.options.zoomWindowWidth,
          zoomWindowHeight: this.options.zoomWindowHeight,
          zoomWindowOffetx: this.options.zoomWindowOffetx,
          scrollZoom: true
        };
      }
      if(win.width() < 1024 && win.width() > 767) {// tablet
        windowZoom = {};
      }
      this.option = $.extend({}, this.option, windowZoom);
      this.initialized(this.option);
    },
    initialized: function(opts) {
      this.handle.ezPlus(opts);
    },
    destroy: function() {
      this.element.removeClass('zoomLoaded');
      this.handle.removeData('ezPlus');
      this.handle.removeData('zoomImage');
      this.handle.off('mouseleave mouseenter mouseover mousemove mouseout mousewheel touchend touchmove click DOMMouseScroll MozMousePixelScroll');
      $('.zoomContainer').filter('[uuid="' + this.options.zoomId + '"]').remove();
      // $.removeData(this.element[0], pluginName);
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
    handle: '.zoomer',
    zoomWindowWidth: 400,
    zoomWindowHeight: 400,
    zoomWindowOffetx: 100
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));
