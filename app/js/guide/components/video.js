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
