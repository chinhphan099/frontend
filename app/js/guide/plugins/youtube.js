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
