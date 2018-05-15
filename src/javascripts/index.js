// 'use strict';

$(function() {

// ==============================
// スクロールでヘッダーサイズを変更
// ==============================
var win = $(window),
    header = $('header'),
    animationClass = 'is-animation',
    startPos = 0,
    topHeaderNav = $('.header.top .header__nav'),
    topHeaderNavPos = 571,
    headerEle,
    scroolVal;

if (window.matchMedia('(max-width:769px)').matches) {
  headerEle = $('header__logo');
  scroolVal = 50;
} else {
  headerEle = $('header');
  scroolVal = 0;
}

var headerHeight = headerEle.outerHeight();

win.on('load scroll', function() {
  var value = $(this).scrollTop();

  if( value > topHeaderNavPos ) {
    topHeaderNav.addClass(animationClass);
  } else {
    topHeaderNav.removeClass(animationClass);
  }

  if ( value > scroolVal ) {
    header.addClass(animationClass);
  } else {
    header.removeClass(animationClass);
  }

  if ( value > startPos && value > headerHeight ) {
    header.addClass(animationClass);
  } else {
    header.removeClass(animationClass);
  }
  startPos = value;
  // footerThanHeader();
});

function footerThanHeader(){
	var point = $(window).scrollTop();		//スクロール位置
	var docHeight = $(document).height();	//ドキュメントの高さ
	var dispHeight = $(window).height();	//表示領域の高さ

	if(point > docHeight-dispHeight-300){	//計算式
		header.addClass("hide");
	} else {
    header.removeClass("hide");
  }
}

// ==============================
// 電話番号 PC版はspanに置き換え
// ==============================
if(!navigator.userAgent.match(/(iPhone|iPad|Android)/)){
  $("a.tel-link").each(function(){
    $(this).replaceWith("<span>" + $(this).html() + "</span>");
  });
}


// ==============================
// ページ内リンク
// ==============================
// スクロールのオフセット値
var offsetY = -100;
// スクロールにかかる時間
var time = 500;

$("a[href*='#']").on('click', (function() {
  var target = $(this.hash);
  if (!target.length) return ;
  var targetY = target.offset().top+offsetY;
  $("html,body").animate({scrollTop: targetY}, time, "swing");
  // $("html,body").delay(500).animate({scrollTop: targetY}, time, "swing");
  // window.history.pushState(null, null, this.hash);
  return false;
}));


$(document).one('ready', function(){

  var page_hash = window.location.hash || false;
  if (page_hash && page_hash.match(/^#_/)) {
    // スクロールのオフセット値
    if (window.matchMedia('(max-width:769px)').matches) {
      offsetY = -100;
    } else {
      offsetY = -150;
    }
    var target = $(page_hash);
    // console.log(this.hash);
    if (!target.length) return ;
    var targetY = target.offset().top+offsetY;
    $("html,body").delay(750).animate({scrollTop: targetY}, time, "swing");
    return false;
  }

});

// ==============================
// 入力フォーム 特定のラジオからプルダウン制御
// ==============================
var invoice = $('.invoiceDetail');
$("input[name='application_form[payment]']").click(function() {
  var num = $("input[name='application_form[payment]']").index(this);
  if (num == 2) {
    invoice.addClass("on");
    invoice.find("input").val('');
    invoice.find("input").attr("disabled", false);
  } else {
    invoice.removeClass("on");
    invoice.find("input").attr("disabled", true);
  }
});


// ==============================
// チェックしたら押下可能になるボタン
// ==============================
$('#submit').prop('disabled', true);
$('#check').on('change', function() {
	if ( $(this).prop('checked') == false ) {
		$('#submit').prop('disabled', true);
	} else {
		$('#submit').prop('disabled', false);
	}
});


// ==============================
// 入力フォームのデータピッカー
// ==============================
$( '.datepicker' ).pickadate({
  // Translations
  monthsFull: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  // monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  weekdaysFull: ['日', '月', '火', '水', '木', '金', '土'],
  weekdaysShort: ['日', '月', '火', '水', '木', '金', '土'],

  // Buttons
  today: '本日',
  clear: 'クリア',
  close: '閉じる',

  // Accessibility labels
  labelMonthNext: '次の月',
  labelMonthPrev: '前の月',
  labelMonthSelect: '月を選ぶ',
  labelYearSelect: '年を選ぶ',

  // Formats
  format: 'yyyy/mm/dd',
  formatSubmit: 'yyyy/mm/dd',
  disable: [
    { from: -1000, to: true }
  ],
  closeOnSelect: true,
  closeOnClear: true,
});


$( '.datepicker-time' ).pickatime({
  // Translations
  clear: 'クリア',

  // Formats
  format: 'HH:i',
  formatSubmit: 'HH:i',

  min: [10,0],
  max: [19,0]
});

});
