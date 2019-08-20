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
