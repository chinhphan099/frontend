"use strict";

/**
 * @name Site
 * @description Global variables and functions
 * @version 1.0
 */
// https://regex101.com/r/dkFASs/6
var Site = function ($, window, undefined) {
  'use strict';

  var win = $(window),
      doc = $(document),
      html = $('html'),
      body = $('body'),
      standarTransitionend = !!window.URL || !!window.webkitURL ? 'webkitTransitionEnd.transitionEnd' : 'transitionend.transitionEnd',
      resize = 'onorientationchange' in window ? 'orientationchange.resizeWindow' : 'resize.resizeWindow'; // http://codepen.io/chinhphan099/pen/WxrVyw

  var ua = navigator.userAgent,
      browser = /Edge\/\d+/.test(ua) ? 'ed' : /MSIE 9/.test(ua) ? 'ie9' : /MSIE 10/.test(ua) ? 'ie10' : /MSIE 11/.test(ua) ? 'ie11' : /MSIE\s\d/.test(ua) ? 'ie?' : /rv\:11/.test(ua) ? 'ie11' : /Firefox\W\d/.test(ua) ? 'ff' : /Chrome\W\d/.test(ua) ? 'gc' : /Chromium\W\d/.test(ua) ? 'oc' : /\bSafari\W\d/.test(ua) ? 'sa' : /\bOpera\W\d/.test(ua) ? 'op' : /\bOPR\W\d/i.test(ua) ? 'op' : typeof MSPointerEvent !== 'undefined' ? 'ie?' : '',
      os = /Windows NT 10/.test(ua) ? 'win10' : /Windows NT 6\.0/.test(ua) ? 'winvista' : /Windows NT 6\.1/.test(ua) ? 'win7' : /Windows NT 6\.\d/.test(ua) ? 'win8' : /Windows NT 5\.1/.test(ua) ? 'winxp' : /Windows NT [1-5]\./.test(ua) ? 'winnt' : /Mac/.test(ua) ? 'mac' : /Linux/.test(ua) ? 'linux' : /X11/.test(ua) ? 'nix' : '',
      mobile = /IEMobile|Windows Phone|Lumia/i.test(ua) ? 'w' : /iPhone|iP[oa]d/.test(ua) ? 'i' : /Android/.test(ua) ? 'a' : /BlackBerry|PlayBook|BB10/.test(ua) ? 'b' : /Mobile Safari/.test(ua) ? 's' : /webOS|Mobile|Tablet|Opera Mini|\bCrMo\/|Opera Mobi/i.test(ua) ? 1 : 0,
      tablet = /Tablet|iPad/i.test(ua),
      touch = 'ontouchstart' in document.documentElement;

  var globalFct = function globalFct() {};

  var scrollTopAfterCollapse = function scrollTopAfterCollapse(elmScroll, handle, isPos) {
    var spaceToTop = 0,
        offsetHandle = isPos ? handle.position().top : handle.offset().top;

    if (!isPos) {
      spaceToTop = 50;
    }

    elmScroll.stop().animate({
      scrollTop: offsetHandle - spaceToTop
    }, 400);
  };

  var customValid = function customValid() {
    // Change default Valid message
    jQuery.extend(jQuery.validator.messages, {
      required: L10n.validateMess.required
    }); // Valid Email

    $.validator.addMethod('cemail', function (value, element) {
      if (element.value !== '') {
        return this.optional(element) || /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.) {2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i.test(value);
      } else {
        return true;
      }
    }, L10n.validateMess.cemail);
    $.validator.addMethod('alpha', function (value, element) {
      if (element.value !== '') {
        return this.optional(element) || !/[\-\/_~+!@#$%^&*(),.?":`{}=0-9|<>]/.test(value);
      } else {
        return true;
      }
    }, L10n.validateMess.alpha); // Valid Number

    $.validator.addMethod('cnumber', function (value, element) {
      if (element.value !== '') {
        return this.optional(element) || /^[0-9 -]+$/.test(value);
      } else {
        return true;
      }
    }, L10n.validateMess.cnumber);
    $.validator.addMethod('checkValidDate', function (value, element, params) {
      var valueDay = $(params[0]),
          valueMonth = $(params[1]),
          valueYear = $(params[2]);
      var day = $.trim(valueDay.val()),
          month = $.trim(valueMonth.val()),
          year = $.trim(valueYear.val());

      if (day !== '' && month !== '' && year !== '') {
        var isOut = Site.checkDate(day, month, year);
        return isOut;
      } else {
        return true;
      }
    }, L10n.validateMess.checkValidDate);
  };

  var checkDate = function checkDate(day, month, year) {
    var mydate = new Date();

    if (day === '' || month === '' || year === '') {
      return false;
    }

    if (isNaN(day) || isNaN(month) || isNaN(year)) {
      return false;
    }

    if (year < 1901 || month > 12 || day > 31 || year > mydate.getFullYear() || month < 1 || day < 1) {
      return false;
    }

    if (year === '' || year % 4 === 0 && year % 100 !== 0 || year % 400 === 0) {
      if (month === 2 && day > 29) {
        return false;
      }
    } else {
      if (month === 2 && day > 28) {
        return false;
      }
    }

    if ((month === 4 || month === 6 || month === 9 | month === 11) && day > 30) {
      return false;
    }

    return true;
  };

  var callAjax = function callAjax(method, source, postData) {
    var deferred = $.Deferred();
    $.ajax({
      method: method,
      url: source,
      data: !!postData ? postData : null,
      beforeSend: function beforeSend() {// Loading
      },
      success: function success(data) {
        deferred.resolve([data]);
      },
      complete: function complete() {},
      error: function error(_error) {
        deferred.reject(_error);
      }
    });
    return deferred.promise();
  };

  var compileHandlebar = function compileHandlebar(method, source, datas) {
    var deferred = $.Deferred();
    callAjax(method, source, null).done(function (source) {
      var template = Handlebars.compile(source[0]);
      var html = template(datas);
      deferred.resolve(html);
    }).fail(function (error) {
      deferred.reject(error);
    });
    return deferred;
  };

  return {
    win: win,
    doc: doc,
    html: html,
    body: body,
    resize: resize,
    standarTransitionend: standarTransitionend,
    browser: browser,
    os: os,
    mobile: mobile,
    tablet: tablet,
    touch: touch,
    globalFct: globalFct,
    customValid: customValid,
    checkDate: checkDate,
    scrollTopAfterCollapse: scrollTopAfterCollapse,
    compileHandlebar: compileHandlebar
  };
}(jQuery, window);

jQuery(function () {
  Site.globalFct();
  Site.customValid();
  jQuery.ajax({
    url: 'data/data.json',
    type: 'GET'
  }).done(function (data) {
    if (data) {
      var template = 'data/handlebar.html';
      Site.compileHandlebar('GET', template, data).done(function (html) {
        Site.body.append(html);
      });
    }
  });
});
//# sourceMappingURL=scripts.js.map
