(function() {
	var agent = navigator.userAgent;
	window.OS_ANDROID = /Android/.test( agent );
	window.OS_IOS = /OS ([_\d]+) like Mac OS X/.test( agent );
	window.DEVICE_IPHONE = /\(iPhone;/.test( agent ); // iPhone
	window.DEVICE_IPAD = /\(iPad;/.test( agent );

})();
var idvUserinfo = (function() {
	function UserInfo() {
		if (!( this instanceof UserInfo )) return new UserInfo();
		this.init();
	}
	UserInfo.prototype.init = function() {
		var ua = navigator.userAgent;
		/** for Desktop */
		this.CHROME  = UserInfo.parseVers( "Chrome" );
		this.SAFARI  = UserInfo.parseVers( "Safari" );
		this.FIREFOX = UserInfo.parseVers( "Firefox" );
		this.WEBKIT  = UserInfo.parseVers( "AppleWebKit" );
		this.OPERA   = UserInfo.parseVers( "Opera" ) || UserInfo.parseVers( "OPR" ); // 최근에 Opera가 새로이 업데이트 되면서 userAgent가 바뀜. (마치 크롬처럼...)
		this.TRIDENT = UserInfo.parseVers( "Trident" );
		this.MSIE    = checkTridentForIE( this.TRIDENT ); // MSIE
		this.LINUX   = /\(Linux;/.test( ua );             // Lunux
		/** for Mobile devices */
		this.ANDROID   = UserInfo.parseVers2( "Android" );
		this.MACINTOSH = /\(Macintosh;/.test( ua ); // Macintosh
		this.MAC_OS    = checkMacOS();              // Mac OS X
		this.IPHONE    = /\(iPhone;/.test( ua );    // iPhone
		this.IPAD      = /\(iPad;/.test( ua );      // iPad
		this.I_OS      = checkIOS();                // iOS
		/** CSS3 supportability */
		this.CSS = {
			transform     : UserInfo.testCss( "transform" ),
			transition    : UserInfo.testCss( "transition" ),
			backgroundSize: UserInfo.testCss( "backgroundSize" ),
			blendMode     : UserInfo.testCss( "mixBlendMode" ),
			bgBlendMode   : UserInfo.testCss( "backgroundBlendMode" )
		};
		/** HTML5 supportability */
		this.HTML5 = {
			video : typeof ( document.createElement("video")  )[ "play"       ] == "function",
			canvas: typeof ( document.createElement("canvas") )[ "getContext" ] == "function"
		};
		/** AnimationFrame supportability */
		var af = window.requestAnimationFrame       ||
				 window.webkitRequestAnimationFrame ||
				 window.mozRequestAnimationFrame    ||
				 window.msRequestAnimationFrame     ||
				 window.oRequestAnimationFrame;
		this.animationFrame = !!af;
	};	
	UserInfo.parseVers = function(name) {
		var reg = new RegExp(name + "\\/(\\d[\\d\\.]+)");
		var match = navigator.userAgent.match(reg);
		if (match) return match[1];
		return null;
	};	
	UserInfo.parseVers2 = function(name) {
		var reg = new RegExp(name + " (\\d[\\d\\.]+)");
		var match = navigator.userAgent.match(reg);
		if (match) return match[1];
		return null;
	};
	UserInfo.testCss = function(prop) {
		var flag = false;
		var vendors = ["webkit", "moz", "ms", "o"];
		if (prop && typeof prop == "string") {
			var div = document.createElement("div");
			if (prop in div.style) {
				flag = true;
			} else {
				var cased = prop.substr(0, 1).toUpperCase() + prop.substr(1); // text transform : "background" -> "Background"
				for (var k = 0 ; k < vendors.length ; k++) {
					if ((vendors[k] + cased) in div.style) {
						flag = true;
						break;
					}
				}
			}
			div = null;
		}
		return flag;
	};	
	function checkTridentForIE( trident ) {
		var rRv   = /; rv:([\d\.]+)$/;
		var rMSIE = /MSIE ([\d\.]+)/i;
		var ua    = navigator.userAgent.match(/^[^\(]+\(([^\(]+)\)/)[1];
		if ( rMSIE.test(ua) ) return ua.match( rMSIE )[1];        // pattern is "MSIE x.x"
		if ( trident && rRv.test(ua) ) return ua.match( rRv )[1]; // pattern is "vr:x.x"
		return null; // unknown pattern
	}	
	function checkMacOS() {
		var match = navigator.userAgent.match(/Mac OS X ([_\d]+)/);
		if (!match) return null;
		return match[1].replace(/_/g, ".");
	}
	function checkIOS() {
		var match = navigator.userAgent.match(/OS ([_\d]+) like Mac OS X/);
		if (!match) return null;
		return match[1].replace(/_/g, ".");
	}
	return UserInfo();
})();
(function() {
	if ( !idvUserinfo.MSIE ) return;
	var IE = parseInt( idvUserinfo.MSIE );
	document.documentElement.className = document.documentElement.className + " msie msie" + IE;

	if( IE >= 9 ) document.documentElement.className = document.documentElement.className + " msest";
})();

$(function() {

	var CreateShare = function(element, options) {
	   this.init(element, options)
	};
    CreateShare.prototype.init = function(element, options){
        this.element        = $(element);
        this.options        = options;
        this.bindInEvents();
    };
    CreateShare.prototype.bindInEvents = function(){
    	 var Sharelink = this.element;
    	 var target = this.element.data('target');
    	 var obj = this.element.next();
    	 var opt = obj.data('id');
    	 var Closelink = this.element.next().find("[data-target=ui-close]");
    	 Sharelink.on("click", function () {
    		 if (target === opt ) {
    			 if (obj.css("display") === "none") {
    				 Sharelink.addClass('ov');
    				 obj.show().delay(150).animate({ 'opacity': '1' }, 300, 'easeOutCubic');
    			 } else {
    				 Sharelink.removeClass('ov');
    				 obj.hide().delay(150).animate({ 'opacity': '0' }, 300, 'easeOutCubic');
    			}
    		 }
    	 });
    	 Closelink.on("click", function () {
    		 Sharelink.removeClass('ov');
    		 obj.hide().delay(150).animate({ 'opacity': '0' }, 300, 'easeOutCubic');
    	 });
    };
	function checkSharePlugin(option){
        var $this = $(this);
        var data  = $this.data('target');
        var options = $.extend({}, $this.data(), typeof option === 'object' && option);
        $this.data('target', (data = new CreateShare(this, options)));
        if (typeof option === 'string') data[option]()
    }
    $.fn.checkShare = checkSharePlugin;
	$(window).on("load",function(){
        $("[data-target=\"ui-open\"]").each(function () {
            var $this = $(this);   //버튼
            var option = $this.data();
            checkSharePlugin.call($this, option);
        });
    });

});

function GetIEVersion() {
    var sAgent = window.navigator.userAgent;
    var Idx = sAgent.indexOf("MSIE");
    if (Idx > 0)
        return parseInt(sAgent.substring(Idx+ 5, sAgent.indexOf(".", Idx)));
    else if (!!navigator.userAgent.match(/Trident\/7\./))
        return 11;

    else
        return 99; //It is not IE
}
if (GetIEVersion() === 9) {
    $("body").addClass("ie9");
}
if (GetIEVersion() <= 8) {
    $("body").addClass("ie8");
}

/* 프로그램 */
/* Validate check */
function checkValidate() {
var indTags = document.getElementsByClassName("indispensable");
	for (var i = 0; i < indTags.length; i ++) {
		var indTag = indTags[i];
		if (indTag.value == "") {
			alert(indTag.title + "해주세요");
			//alert(fn_getMessage("INPUT", indTag.title + "해주세요"));
			//fn_setFocus(form, indTag);
			indTag.focus();
			return false;
		}
	}
	return true;
}
/* 한글 입력방지 */
$(".not-kor").keyup(function(e) {
	if (!(e.keyCode >=37 && e.keyCode<=40)) {
		var v = $(this).val();
		$(this).val(v.replace(/[^a-z0-9]/gi,''));
	}
});
/* 비밀번호 입력체크 */
/*
$("#password").change(function(){
    checkPassword($('#password').val());
});
*/

function checkPassword(password){
    if(!/^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/.test(password)){
        alert('숫자+영문자+특수문자 조합으로 8자리 이상 사용해야 합니다.');
        $('#password').val('').focus();
        return false;
    }
    var checkNumber = password.search(/[0-9]/g);
    var checkEnglish = password.search(/[a-z]/ig);
    if(checkNumber <0 || checkEnglish <0){
        alert("숫자와 영문자를 혼용하여야 합니다.");
        $('#password').val('').focus();
        return false;
    }

    if(/(\w)\1\1\1/.test(password)){
        alert('같은 문자를 4번 이상 사용하실 수 없습니다.');
        $('#password').val('').focus();
        return false;
    }
    return true;
}
/* 비밀번호 보이고 안보이고 */
$(".toggle-password").click(function() {
  $(this).toggleClass("fa-eye fa-eye-slash");
  var input = $($(this).attr("toggle"));
  if (input.attr("type") == "password") {
    input.attr("type", "text");
  } else {
    input.attr("type", "password");
  }
});
// 파라미터 받아오기
function getParameter(strParamName){
    var arrResult = null;
    if(strParamName){
        arrResult = location.search.match(new RegExp("[&?]" + strParamName + "=(.*?)(&|$)"));
    }
    return arrResult && arrResult[1] ? arrResult[1] : null;
}
//sns공유 시작
function snswindowOpen () {
  var nUrl; var nWidth; var nHeight; var nLeft; var nTop; var nScroll;
  nUrl = arguments[0];
  nWidth = arguments[1];
  nHeight = arguments[2];
  nScroll = (arguments.length > 3 ? arguments[3] : "no");
  nLeft = (arguments.length > 4 ? arguments[4] : (screen.width/2 - nWidth/2));
  nTop = (arguments.length > 5 ? arguments[5] : (screen.height/2 - nHeight/2));
  winopen=window.open(nUrl, 'SNS', "left="+nLeft+",top="+nTop+",width="+nWidth+",height="+nHeight+",scrollbars="+nScroll+",toolbar=no,location=no,directories=no,status=no,menubar=no,resizable=no");
}
$(document).ready(function(){
   $("[data-button='sns_share']").on("click", function(e){
		e.preventDefault();
		var $this = $(this);
		var sns_type = $this.attr('data-service');
		var href = encodeURIComponent(location.href);
		var title = $this.attr('data-title');
		var loc = "";
		var img = $("meta[name='og:image']").attr('content');
		
		if( ! sns_type || !href || !title) return;
		
		if( sns_type == 'facebook' ) {
			loc = '//www.facebook.com/sharer/sharer.php?u='+href+'&t='+title;
			snswindowOpen (loc, 900, 450, 'no');
		}
		else if ( sns_type == 'twitter' ) {
			loc = '//twitter.com/home?status='+encodeURIComponent(title)+' '+href;
			snswindowOpen (loc, 800, 400, 'yes');
		}
		else if ( sns_type == 'pinterest' ) {
			
			loc = '//www.pinterest.com/pin/create/button/?url='+href+'&media='+img+'&description='+encodeURIComponent(title);
			snswindowOpen (loc, 900, 550, 'no');
		}
		else if ( sns_type == 'kakaostory') {
			loc = 'https://story.kakao.com/share?url='+href;
			snswindowOpen (loc, 900, 450, 'no');
		}
		else if ( sns_type == 'band' ) {
			loc = 'http://www.band.us/plugin/share?body='+encodeURIComponent(title)+'%0A'+href;
			snswindowOpen (loc, 800, 400, 'yes');
		}
		else if ( sns_type == 'naver' ) {
			loc = "http://share.naver.com/web/shareView.nhn?url="+href+"&title="+encodeURIComponent(title);
			snswindowOpen (loc, 800, 400, 'yes');
		}
		else {
			return false;
		}
		
		return false;
	});
});

/* flow label */
$(document).ready(function(){
	if(!$("label").is(".flow")) return false;
	var o1 = $("label.flow");
	var o2 = $("label.flow").next();
	o1.css({"position":"absolute"});
	o1.bind("click focusin",function(){
		$(this).css({"visibility":"hidden"});
	});
	o2.bind("click focusin",function(){
		$(this).prev().css({"visibility":"hidden"});
	});
	o2.bind("focusout",function(){
		if($(this).val() == ""){
			$(this).prev().css({"visibility":"visible"});
		}
	});
	if(o2.val() != ""){ o1.css({"visibility":"hidden"}); }
});
/* OS 체크 불린값 전달 window 폰, window 기반 태블릿pc 에서 테스트가 필요함 */
function chaked_OS(){
	var device = navigator.userAgent;
	var str = device.split(";");
		str = str[0].split("(");
		str = str[1].split(" ");
	var chkOS = false;
	if(str[0] != "Windows" && str[0] != "Macintosh" && str[0] != "compatible"){
		chkOS = true; // 데스크탑이 아닐 때 true
	}
	return chkOS;
}
function return_width(){
	var w = $(window).width(); return w;
}
/* MSIE 9이하 버전체크 */
function ms_ver(){
	if(navigator.userAgent.match('MSIE')){
		var msie = navigator.userAgent;
		var ms_ver = msie.substr(msie.lastIndexOf('MSIE')).split('MSIE')[1];
			ms_ver = Number(ms_ver.split('.')[0]);
		return ms_ver;
	}else{
		return null;
	}
}
//쿠키저장
function setCookie( name, value, expiredays ) {
 var todayDate = new Date();
 todayDate.setDate( todayDate.getDate() + expiredays );
 document.cookie = name + "=" + escape( value ) + "; path=/; expires=" + todayDate.toGMTString() + ";"
}
function getCookie(name)
{
	var arg = name + "=";
	var alen = arg.length;
	var clen = document.cookie.length;
	var i = 0; while(i< clen)
	{
		var j = i + alen;
		if(document.cookie.substring(i,j)==arg)
			{
			var end = document.cookie.indexOf(";",j);
			if(end == -1) end = document.cookie.length;
			return unescape(document.cookie.substring(j,end));
			}
		i=document.cookie.indexOf(" ",i)+1;
		if (i==0) break;
	}
	return null;
}
/*********팝업관련 자바스크립트 소스****************/
function close_layer(num){
	document.getElementById(num).style.display = 'none';
	//쿠키굽기
	setCookie(num, 'done' , 1);
}
function close_layer2(num){
	document.getElementById(num).style.display = 'none';
}
function link_target(url,target){
	if(target=='_blank'){
		window.open(url);
	}else if(target=='_self'){
		location.href=url;
	}else{
		opener.location.href=url;
	}
}
function admissionFormCheck()
{
	var f = document.admissionForm;
	if(f.n_name.value.length<1)
	{
		alert("이름을 입력해 주세요");
		f.n_name.focus();
		return false;
	}
	if(f.jumin_num.value.length != 13)
	{
		alert("주민번호는 숫자만 입력해 주세요");
		f.jumin_num.focus();
		return false;
	}
	return true;
}
function message()
{
	alert("서비스준비중입니다.");
	return false;
}
$(function(){
    var showToggle = function(element, options) {
        $element            = $(element);
        this.element        = element;
        this.options        = options;
        $element.on('click mouseenter',  $.proxy(this.show, this));
        $element.on('click.close mouseleave',  $.proxy(this.hide, this));
        //$originalinput.on('change',  $.proxy(this.change, this));
    };
    showToggle.prototype.show = function(){
        $target = $(this.options.target);
        $target.show();
    };
    showToggle.prototype.hide = function(){
        $target = $(this.options.target);
        $target.hide();
    };
    function showTogglePlugin(option){
        var $this = $(this);
        var data  = $this.data('button');
        var options = typeof option === 'object' && option;
        $this.data('map', (data = new showToggle(this, options)));
        if (typeof option === 'string') data[option]()
    }
    $.fn.showToggle             =  showTogglePlugin;

    $(window).on("load",function(){
        $("[data-button=\"showToggle\"]").each(function () {
            var $this = $(this);   //버튼
            var option = $this.data();
            showTogglePlugin.call($this, option);
        });
    });
});
/* mobile select */
function tab_mobile() {
    var window_w = $(window).width();
    tab = $("#tab_moType1,#tab_moType_part");
    tab_li = tab.find(">ul>li");
    tab_on = tab.find(">ul>li.on");
    if (tab.find(">.title").size() == 0) {
        $('<strong class="title"><i class="arrow"></i></strong>').prependTo(tab);
    }
    var tab_tit = tab.find(">.title");
    if (tab_on.size() != 0) {
        tab_tit.html(tab_on.find(">a").clone());
    } else {
        tab_tit.html(tab_li.eq(0).find(">a").clone());
    }
    var tab_btn = tab_tit.find(">a");
    tab_btn.click(function () {
        if (tab_li.eq(0).is(":hidden")) {
            tab_tit.find(">a").addClass("on");
            tab_li.slideDown();
        } else {
            tab_tit.find(">a").removeClass("on");
            tab_li.slideUp();
        }
        return false;
    });
    if (window_w < 768) {
        if (tab.hasClass("mobile")) return false;
        tab.removeClass("pc").addClass("mobile");
        tab_li.find("a").click(function () { tab_li.slideUp();});
    } else {
        if (!tab.hasClass("mobile")) return false;
        tab.removeClass("mobile").addClass("pc");
        tab_li.removeAttr("style");
    }
}
/* table swipe */
function table_mobile(){
  $(".table-responsive").each(function () {
      var $this = $(this);   //버튼
      var option = $this.find(".table-icon");
      var window_w = $(window).width();
      if(option.size() == 0){
        var icon = $('<button class="table-icon icon--hide"><svg class="swipe-icon" xmlns="http://www.w3.org/2000/svg"><g fill="#F0542B"><path d="M17.506 12.59c-.452-2.69-2.19-3.17-3.018-3.245-.624-.816-1.514-1.262-2.54-1.262-.22 0-.443.02-.668.06-.607-.725-1.444-1.12-2.397-1.12-.72 0-1.355.225-1.793.482l-1.785-5.61C4.94.732 3.975 0 2.792 0 1.897 0 1.056.427.542 1.128c-.5.677-.625 1.525-.357 2.38l2.253 7.088c-.32.184-.604.43-.84.727-.46.58-.737 1.347-.82 2.28-.124 1.387.335 2.933 1.363 4.595.7 1.12 1.47 1.994 1.79 2.334l1.06 2.48c.26.606.85.988 1.51.988h7.05c.806 0 1.487-.563 1.62-1.354l.01-.05.297-2.468.048-.108c1.58-3.596 2.23-6.025 1.997-7.43zm-3.118 7.18c-.015.037-.026.075-.033.114l-.31 2.57c-.04.247-.255.417-.504.417H6.5c-.205 0-.39-.11-.472-.3L4.92 19.99c-.023-.057-.057-.106-.1-.15-.452-.475-3.158-3.432-2.918-6.13.143-1.597.92-2.114 1.45-2.28.268-.085.413-.373.33-.64l-2.42-7.61c-.38-1.21.584-2.026 1.53-2.026.6 0 1.195.33 1.436 1.097l2.07 6.5c.073.23.284.36.495.36.148 0 .297-.06.4-.2.085-.113.188-.222.31-.316.272-.21.8-.432 1.38-.432.594 0 1.24.237 1.707.96.1.15.264.24.437.24.048 0 .095-.007.143-.02.205-.06.478-.116.78-.116.58 0 1.268.21 1.773 1.01.095.15.258.24.434.24h.07c.607 0 1.822.266 2.166 2.316.32 1.903-1.766 6.43-2.004 6.992z" fill="#F0542B"></path><path class="swipe-arrow" d="M9.766 3.294h5.505l-1.21 1.213c-.22.22-.22.578 0 .8.11.11.26.164.4.164.15 0 .29-.05.4-.16l2.11-2.11c.22-.22.22-.58 0-.8L14.8.24c-.22-.22-.577-.22-.797 0-.22.22-.22.578 0 .798l1.128 1.13H9.77c-.312 0-.564.252-.564.563 0 .31.252.56.564.56z" fill="#F0542B"></path></g></svg></button>').prependTo($(this));
      }
      if(window_w < 768){
        $this.removeClass("table-pc").addClass("table-responsive");
        option.removeClass('icon--hide');
      } else {
        $this.addClass("table-pc");
        option.addClass('icon--hide');
      }
    });
}
function table_mobile1(){
  $(".flip-scroll").each(function () {
      var $this = $(this);   //버튼
      var option = $this.find(".table-icon");
      var window_w = $(window).width();
      if(option.size() == 0){
        var icon = $('<button class="table-icon icon--hide"><svg class="swipe-icon" xmlns="http://www.w3.org/2000/svg"><g fill="#F0542B"><path d="M17.506 12.59c-.452-2.69-2.19-3.17-3.018-3.245-.624-.816-1.514-1.262-2.54-1.262-.22 0-.443.02-.668.06-.607-.725-1.444-1.12-2.397-1.12-.72 0-1.355.225-1.793.482l-1.785-5.61C4.94.732 3.975 0 2.792 0 1.897 0 1.056.427.542 1.128c-.5.677-.625 1.525-.357 2.38l2.253 7.088c-.32.184-.604.43-.84.727-.46.58-.737 1.347-.82 2.28-.124 1.387.335 2.933 1.363 4.595.7 1.12 1.47 1.994 1.79 2.334l1.06 2.48c.26.606.85.988 1.51.988h7.05c.806 0 1.487-.563 1.62-1.354l.01-.05.297-2.468.048-.108c1.58-3.596 2.23-6.025 1.997-7.43zm-3.118 7.18c-.015.037-.026.075-.033.114l-.31 2.57c-.04.247-.255.417-.504.417H6.5c-.205 0-.39-.11-.472-.3L4.92 19.99c-.023-.057-.057-.106-.1-.15-.452-.475-3.158-3.432-2.918-6.13.143-1.597.92-2.114 1.45-2.28.268-.085.413-.373.33-.64l-2.42-7.61c-.38-1.21.584-2.026 1.53-2.026.6 0 1.195.33 1.436 1.097l2.07 6.5c.073.23.284.36.495.36.148 0 .297-.06.4-.2.085-.113.188-.222.31-.316.272-.21.8-.432 1.38-.432.594 0 1.24.237 1.707.96.1.15.264.24.437.24.048 0 .095-.007.143-.02.205-.06.478-.116.78-.116.58 0 1.268.21 1.773 1.01.095.15.258.24.434.24h.07c.607 0 1.822.266 2.166 2.316.32 1.903-1.766 6.43-2.004 6.992z" fill="#F0542B"></path><path class="swipe-arrow" d="M9.766 3.294h5.505l-1.21 1.213c-.22.22-.22.578 0 .8.11.11.26.164.4.164.15 0 .29-.05.4-.16l2.11-2.11c.22-.22.22-.58 0-.8L14.8.24c-.22-.22-.577-.22-.797 0-.22.22-.22.578 0 .798l1.128 1.13H9.77c-.312 0-.564.252-.564.563 0 .31.252.56.564.56z" fill="#F0542B"></path></g></svg></button>').prependTo($(this));
      }
      if(window_w < 768){
        $this.removeClass("table-pc").addClass("flip-scroll");
        option.removeClass('icon--hide');
      } else {
        $this.addClass("flip-scroll");
        option.addClass('icon--hide');
      }
    });
}
$(document).ready(function(){
    	table_mobile();
    	$(window).resize(function(){table_mobile();});
      table_mobile1();
      $(window).resize(function(){table_mobile1();});
      $(".table-responsive").on("click", function() {
        $(this).find(".table-icon").addClass('icon--hide');
      });
      $(".flip-scroll").on("click", function() {
        $(this).find(".table-icon").addClass('icon--hide');
      });
});
/* return_top */
$(document).ready(function(){
    $('.return_top').click(function(){
        $('html, body').animate({scrollTop : 0},800);
        return false;
    });
});
//TabMenu
$(function(){
  var tab = function (element) {
      this.element = $(element);
  };
  tab.prototype.show = function () {
      var $this    = this.element,
          $ul      = $this.closest("ul"),
          $target,
          $targetGroup,
          selector = $this.attr("href");
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, ""); // strip for ie7

      if ($this.parent("li").hasClass("active")) {
          return;
      }
      $target = $(selector);
      $targetGroup = $(selector).parent().closest("div");

      this.activate($this.closest("li"), $ul, "> .active", "nav");
      this.activate( $target, $targetGroup, ".active");
      //this.activate( $target, $targetGroup, ".tab__body.active");
  };
  tab.prototype.activate = function (element, container, cts, area) {
      var $ov    = container.find(cts);
      if ($ov.hasClass("tab__body")) {
          $ov
              .stop()
              .hide()
              .removeClass("active")
              .end();
          element
              .stop()
              .slideDown(500, function () {
                  $(this).addClass("active");
              });
      }
      else if ($ov.hasClass("fade")) {
          $ov
              .stop()
              .hide()
              .removeClass("active")
              .end();
          element
              .stop()
              .fadeIn(300, function () {
                  $(this).addClass("active");
              });
      }
      else {
          $ov
              .removeClass("active")
              .end();
          element
              .addClass("active");
      }
      if(area === "nav"){
          $ov.find("a, button")
              .attr("title","");
          element.find("a, button")
              .attr("title","선택됨");
      }
      if(area !== "nav"){
          $ov
              .attr("title","숨김");
          element
              .attr("title","열림");
      }
  };
  $(document).on("click", "[data-button='tab']", function (e) {
      if( !$(this).data("url") ){
          e.preventDefault();
          $(this).each(function () {
              var $this, data, option;
              $this = $(this);
              data = $this.data("tab");
              option = "show";
              if (!data) {
                  $this.data("tab", (data = new tab(this)));
              }

              if (typeof option === "string") {
                  data[option]();
              }
              this.options = $this.data();
              if(this.options.dropdown){
                  Dropdown(); // tab 내  dropdown 실행
              }
          });
      }
  });
});
//Accordion
$(function(){
  var Accordion = function (element,option,options) {
      this.element = $(element);
      this.option = option;
      this.options = options;
  };

  Accordion.prototype.show = function () {
      var $this    = this.element,
          selector = $this.attr("href"),
          $target = $(selector);
      if(this.options.arange){
          this.openToggle(this.options.arange);
          return;
      }
      if ($this.hasClass("ov")) {
         this.disabled($this);
         this.disabled($target, "display");
         return;
      }
      this.activate($this);
      this.activate($target, "display");
  };

  Accordion.prototype.activate = function (element, display) {
      element.addClass("ov");
      if(display){
          element.show();
          element.attr("title","열림");
      }

  };
  Accordion.prototype.disabled = function (element, display) {
      element.removeClass("ov");
      if(display){
          element.hide();
          element.attr("title","숨김");
      }
  };
  Accordion.prototype.openToggle= function (status) {
      var $target    = $(this.options).find('[data-accordion]');
      $target.each(function () {
          var ov = $(this).attr("href");

          if(status === "open"){
        	  $(this).parent().addClass("ov");
              $(this).addClass("ov");
              $(ov)
              .addClass("ov")
              .show()
              .attr("title","열림");
          } else{
        	  $(this).parent().removeClass("ov");
              $(this).removeClass("ov");
              $(ov)
              .removeClass("ov")
              .hide()
              .attr("title","숨김");
          }
      });
  };
  $(document).on("click", "[data-accordion]", function (e) {
      e.preventDefault();
      $(this).each(function () {
          var $this = $(this);
          var data  = $this.data("accordion");
          var option = "show";
          var options = $this.data();
          if (!data) {
              $this.data("accordion", (data = new Accordion(this, option, options)));
          }
          if (typeof option === "string") {
              data[option]();
          }
          this.options = $this.data();
      });

  });
});
/// basic tab (WAI-ARIA Roles)
$(document).ready(function(){
	$(".tabpanel:first-of-type").addClass("on").attr("tabindex", "0");
	$(".js-tab").eq(0).addClass("on");
	$(".js-tab").eq(0).find('a').attr("tabindex", "0").attr("aria-selected", "true");
	$(".js-tab a").on("click", function(event){
		  if (event.preventDefault) {
		      event.preventDefault()
		    } else {
		      event.returnValue = false
		    }
		  var $this = $(this),
		      $scope = $this.parents('.ui-tablist'),
		      $tabButtons = $scope.find('.js-tab'),
		      $ovTab = $tabButtons.filter('.on')
		  if ($ovTab[0] !== $this[0]) {
		    var $tabPanels = $scope.find('.tabpanel'),
		        $ovPanel = $tabPanels.filter('.on')
		    $ovTab.removeClass('on');
						$ovTab.children('a').attr('aria-selected', 'false');
		    $this.parent('li').addClass('on');
						$this.attr('aria-selected', 'true')
						var href = $this.attr("aria-controls");
						$ovPanel.removeClass('on');
						$("[id="+href+"]").addClass('on');
		  }
		  event.preventDefault()

	});
});
$(function(){
	$('.ui-tab_scroll').each(function(){
		var $this = $(this),
			$Tab = $this.find('[data-button="scroll"]'),
			moveTarget = $(this).find('.move_point');
			$Tab.on('click',function(){
			var thisIndex = $(this).parent('li').index(),
				movePoint = moveTarget.eq(thisIndex).offset().top,
				wWidth = $(window).width();
				//alert('a');
			if(wWidth>1201){ movePoint = movePoint-100 };
			$('html, body' ).stop().animate( { scrollTop : movePoint}) ;
		})
	});
});
var Common = {};
Common.Dialog = {
    /**
    * Dialog Id
    */
    DialogInfo: {
        titleId: 'common-modal-title',
        okBtnId: 'common-modal-ok-btn',
    },
    /**
    * Default Item Message
    */
    Message: {
        title: '알림',
        ok: '확인',
        cancel: '취소'
    },
    /**
    * Element 생성
    * @param elementTag Element Tag
    * @param attributeData Set Attribute Object
    * @param appendElement AppendChild Element Object
    * @return Element Object    
    */
    createElement: function(elementTag, attributeData, appendElement){
        // Element 생성
        var elementObj = document.createElement(elementTag);
        // Attrbute 추가
        for(var key in attributeData){
            //console.log(key, attrbutes[key]);
            elementObj.setAttribute(key, attributeData[key]);
        };
        // Element Append        
        if(appendElement){
            appendElement.appendChild(elementObj);
        }
        
        return elementObj;
    },
    
    /**
    * Modal Dialog Make
    */
    makeModalDialog: function(data){
        // UUID 생성
        var uuid;
        if(typeof(Util) === 'object' && typeof(Util.uuid) === 'function'){
            uuid = Util.uuid();
        }else{
            uuid = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                return v.toString(16);
            });
        }
        
        // Dialog Id
        data.dialogId = 'common-modal-dialog-' + data.dialogType + '-' + uuid;
        
        /***************************************************************************/
        // ---------------- Modal Main Div ----------------
        var modalDiv = this.createElement('div'
            , {'id': data.dialogId,'class': 'modal fase','tabindex': '-1','role': 'dialog','aria-labelledby': this.DialogInfo.titleId,'aria-hidden': 'true'}
            , document.body);
        var modalDialogDiv = this.createElement('div', {'class': 'modal__dialog'}, modalDiv);
        var modalContentDiv = this.createElement('div', {'class': 'modal__body'}, modalDialogDiv);
        
        // ---------------- Modal Header ----------------
        var modalHeaderDiv = this.createElement('div', {'class': 'modal__header'}, modalContentDiv);
        // Close Header
        if(data.closeBtn){
            var modalHeaderCloseBtn = this.createElement('button', {'type': 'button', 'class': 'close', 'data-dismiss': 'modal', 'aria-hidden': 'true'}, modalHeaderDiv);
            modalHeaderCloseBtn.innerHTML ='x';
        }
        // title
        var modalHeaderTitle = this.createElement('h4', {'class': 'modal__title', 'id': this.DialogInfo.titleId}, modalHeaderDiv);
        modalHeaderTitle.innerHTML = data.title ? data.title : this.Message.title;
        // ---------------- Modal Body ----------------
        var modalBodyDiv = this.createElement('div', {'class': 'modal__content', 'style': 'word-break: break-all'}, modalContentDiv);;
        modalBodyDiv.innerHTML = data.content ? data.content : '';
        
        // ---------------- Modal Footer ----------------
        var modalFooterDiv = this.createElement('div', {'class': 'modal__footer'}, modalContentDiv);
        // Cancle Button
        if(data.dialogType == 'confirm'){
            var modalFooterCancleBtn = this.createElement('button', {'type': 'button', 'class': 'btn btn-default', 'data-dismiss': 'modal'}, modalFooterDiv);
            modalFooterCancleBtn.innerHTML = this.Message.cancel;            
        }
        // Ok Button
        var modalFooterOkAttr = {'type': 'button', 'class': 'btn btn-primary', 'id': this.DialogInfo.okBtnId};
        if(data.dialogType == 'alert'){
            modalFooterOkAttr['data-dismiss'] = 'modal';
        }
        var modalFooterOkBtn = this.createElement('button', modalFooterOkAttr, modalFooterDiv);
        modalFooterOkBtn.innerHTML = this.Message.ok;
        /***************************************************************************/
        // Modal Default option Setting        
        var modalOption = {
            keyboard: true // ESC 키 눌렀을때 모달을 닫음
            ,backdrop: 'static' // 모달의 배경을 포함. 클릭 시 모달을 닫지 않을 시 'static'
            ,show: false // 초기화 시 모달을 보여줍니다.
        }
        // 사용자 지정 정보 설정
        $.extend(modalOption, data);
        
        // Jquery Dialog 변수 선언
        var dialog = $('#' + data.dialogId);
        
        // Bootstrap Modal Setting
        dialog.modal(modalOption)        
        
        // Modal의 hide가 완료된 이후 Event 실행
        dialog.on('hidden.bs.modal', function(e){
            // Modal Element 제거
            dialog.remove();
            $("html,body").removeClass("modal__open");
        });
        // Confirm 일 경우 확인 버튼 클릭 이벤트 지정
        if(data.dialogType == 'confirm'){
            dialog.find(" #" + this.DialogInfo.okBtnId).on('click', function(){
                // ok button event function 실행
                if(data.ok && typeof(data.ok) === 'function'){
                    data.ok();
                }else{
                    console.warn('not function ok event. dialogId: ' + data.dialogId);
                }
                // Modal 창 닫기
                dialog.modal('hide');
                // click enevt 제거
                $(this).off('click');
                $("html,body").removeClass("modal__open");
            });    
        }
        // Modal Dialog Show
        dialog.modal('show');
    },        
    /**
    * Modal Dialog Show
    */
    show: function(type, data){
        if(!data){data = {};}
        data.dialogType = type ? type : 'alert';
        this.makeModalDialog(data);
    },
    /**
    * Alert Modal Dialog
    * data: 
    *  title: Dialog Title Message
    *  content: Dialog Content Message
    *  closeBtn: Header Close Btn(x)
    *  
    */    
    alert: function(data){
        // data가 Object 가 아닌 경우 content 로 설정한다.
        if(typeof(data) != 'object'){
            var content = data;
            data = {content: content};
        }
        this.show('alert', data);
    },
    /**
    * data: 
    *  title: Dialog Title Message
    *  content: Dialog Content Message
    *  ok: Ok Button Click Event function
    *  closeBtn: Header Close Btn(x)
    *  
    */
    confirm: function(data){
        this.show('confirm', data);
    }
};
$(function() {
    var Modal = function(btn, options) {
        this.options            = options;
        this.$body              = $(document.body);
        this.$button            = $(btn);
        this.href = this.$button.attr("href");
        this.$element           = $(this.options.target || (this.href && this.href.replace(/.*(?=#[^\s]+$)/, ""))); //button-target or a href
        //this.$element           = $(this.options.target);
        this.backdropselector   = "modal__backdrop";
        this.widthtselector    = "modal__body";
        this.heightselector    = "modal__content";
        this.isShown            = null;

        if(this.options.contentSousrce){
            this.contentReplace();
        }
    };

    Modal.DEFAULTS = {
        backdrop    : true,
        show        : true,
        keyboard    : true,
        width: 600
    };

    Modal.prototype.show = function () {
        var element = this.$element,
            modalBtn = this.button,
            modalBodyWidth = this.options.width;

        this.isShown = true;
        this.$body.addClass("modal__open");
        $("html").addClass("modal__open");

        //크기 조정 및 보이기
        this.setSize();
        element.show();

        var transition = element.hasClass("fade");
        if (transition) {
            element[0].offsetWidth; // force reflow
        }

        element.addClass("active");

        //모달 뒤 검은 배경
        if(this.options.backdrop){
            this.backdrop();
        }

        //닫기 버튼
        element.on('click.close', '[data-close=\'modal\']', $.proxy(this.hide, this));

        $(document)  //  모달 포커스 이동
        .off("focusin.modal") // guard against infinite focus loop
        .on("focusin.modal", function (e) {
            if (element[0] !== e.target && !element.has(e.target).length) {
                element.trigger("focus");
            }
        });

        this.escape();

        //브라우저 리사이즈
        this.resize();

        this.enforceFocus()
    };

    Modal.prototype.enforceFocus = function () {
        $(document)
            .off('focusin.modal') // guard against infinite focus loop
            .on('focusin.modal', $.proxy(function (e) {
                if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
                    this.$element.trigger('focus')
                }
            }, this))
    }


    Modal.prototype.hide = function(e){
        var element = this.$element,
            backdrop = "." + this.backdropselector,
            modalbtn = this.$button ;

        this.isShown = false;

        if (e) e.preventDefault();
        element.hide().removeClass("active");
        $(document.body).removeClass("modal__open");
        $("html").removeClass("modal__open");

        element.find(backdrop).remove();
        modalbtn.trigger("focus");

        this.escape();
        this.resize();

        if(this.options.file){
            $("#txt").find("a[href='" + this.options.file + "']").focus();
        }

    };
    Modal.prototype.contentReplace = function(){
        //console.log(this.options.contentSousrce);
        $("." + this.heightselector).html(this.options.contentSousrce);
    };
    //검은 배경
    Modal.prototype.backdrop = function(){
        var element = this.$element,
            backdrop = $("<div class='" + this.backdropselector + "'></div>")
        .prependTo(element)
        .css("height", 0)
        .css("height", '100%')
        .on("click", $.proxy(this.hide, this));

    };
    Modal.prototype.adjustBackdrop = function () {
        this.$element.find("."+this.backdropselector)
        .css('height', 0)
        .css('height', this.$element[0].scrollHeight)
    };
    Modal.prototype.setSize = function (width, height) {
        var element = this.$element,
            modalWidth = this.options.width,
            modalHeight = this.options.height;

        if( modalWidth > $(window).width() ){
            modalWidth = $(window).width() - 50;
        }
        element.find("." + this.widthtselector).css({
            width : modalWidth
        });

        //console.log(modalHeight);
        if(modalHeight){
            element.find("." + this.heightselector).css({
                height : modalHeight
            });
        }
    };

    Modal.prototype.resize = function(){
         if (this.isShown) {
            $(window).on('resize.modal', $.proxy(this.adjustBackdrop, this))
        } else {
            $(window).off('resize.modal')
        }
    };

    Modal.prototype.escape = function () {

        if (this.isShown && this.options.keyboard) {
            this.$element.on('keyup', $.proxy(function (e) {
                e.which == 27 && this.hide()
            }, this))
        } else if (!this.isShown) {
            this.$element.off('keydown')
        }
    };

    function modalPlugin(option){
        return this.each(function(){
            var $this = $(this);
            var data  = $this.data("modal");
            var href = $this.attr("href");
            var $target = $($this.attr("data-target") || (href && href.replace(/.*(?=#[^\s]+$)/, ""))); // strip for ie7

            var options = $.extend({ remote: !/#/.test(href) && href }, Modal.DEFAULTS, $this.data(), $target.data(), typeof option === 'object' && option);

            if (!data) {
                $this.data("modal", (data = new Modal(this, options)));
            }

            if (typeof option === "string") {
                data[option]()
            }
            else if (options.show) {
                data.show()
            }
        });
    }

    $.fn.madalPop                   = modalPlugin;

    $(document).on("click.modal", "[data-button='modal']",function(e){
        e.preventDefault();
        var $this = $(this);   //버튼
        var option = $this.data();

        if ($this.is("button") || $this.is("a")) {
            e.preventDefault();
        }
        modalPlugin.call($this, option);
    });

});

(function($){

	  var $fileBox = null;

	  $(function() {
		  inits();
	  })

	  function inits() {
	    $fileBox = $('.form-upload');
	    fileLoad();
	  }

	  function fileLoad() {
	    $.each($fileBox, function(idx){
	      var $this = $fileBox.eq(idx),
	          $btnUpload = $this.find('[type="file"]'),
	          $label = $this.find('[data-button="upload"]');

	      $btnUpload.on('change', function() {
	        var $target = $(this),
	            fileName = $target.val(),
	            $fileText = $target.siblings('[type="text"]');
	        $fileText.val(fileName);
	      })

	      $btnUpload.on('focusin focusout', function(e) {
	        e.type == 'focusin' ?
	          $label.addClass('focus') : $label.removeClass('focus');
	      })

	    })
	  }


	})(jQuery);

//chekcbox  전체 선택, 해제
$(function(){
  var checkedall = function(el, options) {
      $element            = $(el);
      this.element        = el;
      this.options        = options;
      this.checkBtn       =  $element.find(this.options.checkallid);  //전체선택 checkbox
      this.checkItemName  = 'input[name=\"' + this.options.checkname +'\"]';
      this.checkItem      = $element.find(this.checkItemName); //각 checkbox name
      this.checkItemNum   = this.checkItem.length;

      this.checkBtn.on('change',  $.proxy(this.changeall, this));
      this.checkItem.on('change',  $.proxy(this.changeitem, this));
  };

  checkedall.prototype.changeall = function(){
      this.checkItem .prop('checked', this.checkBtn.prop("checked"));
      var checkItemStatus = $(this.checkItem).is(":checked");
      if(this.options.visibletarget){
          this.displayTarget(checkItemStatus);
      }
  };

  checkedall.prototype.changeitem = function(){

      this.checkedItem = $(this.element).find(this.checkItemName + ":checked").length;
      //checkItem 체크, 해제 되면
      if(false === this.checkItem.prop("checked")){
          this.checkBtn.prop('checked', false);
      }

      if( this.checkedItem > 0 &&  this.checkedItem < this.checkItemNum){ //checkedItem 1개이상 체크되면
          this.checkBtn.prop('checked', false);
          this.targetStatus = true;
      }
      else if (this.checkedItem === this.checkItemNum ){ //checkedItem 모두 체크되면
          this.checkBtn.prop('checked', true);
          this.targetStatus = true;
      }
      else{
          this.checkBtn.prop('checked', false);  //checked 없으면
          this.targetStatus = false;
      }

      if(this.options.visibletarget){
          this.displayTarget(this.targetStatus);
      }
  };


  checkedall.prototype.displayTarget = function(visible){
      var visibleStatus = $(this.options.visibletarget).is(":visible");
      if(visible === true){
          if(!visibleStatus){
              $(this.options.visibletarget).show();
          }
      } else{
          if(visibleStatus) {
              $(this.options.visibletarget).hide();
          }
      }
  };

  function checkAll(option){
      var $this = $(this);
      var data  = $this.data("select");
      var options = typeof option === 'object' && option;

      if (data) $this.data('select', (data = new checkedall(this, options)));
      if (typeof option === 'string') data[option]()

  }
  $(window).on("load",function(){
      $("[data-select=\"checkall\"]").each(function () {
          var $this = $(this);   //버튼
          var option = $this.data();
          checkAll.call($this, option);
      });
  });


});


$(function(){
    var CreateMap = function(element, options) {
        this.init(element, options)
    };
    CreateMap.DEFAULTS = {
        level : 3,
        draggable : true,
        zoomable : true,
        typecontrol : false
    };
    CreateMap.prototype.init = function(element, options){
        this.element        = $(element);
        this.options        = options;
        this.addMarker();
    };
    CreateMap.prototype.addMarker = function(){
        var mapContainer = this.element[0],
            mapOption = {
                center: new daum.maps.LatLng(this.options.lat, this.options.lng), // 지도의 중심좌표
                level: this.options.level // 지도의 확대 레벨
            };

        var map = new daum.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

        map.setDraggable(this.options.draggable); //지도  drag 제어
        map.setZoomable(this.options.zoomable);   //지도 확대,축소 제어

        if(this.options.typecontrol) {
            var mapTypeControl = new daum.maps.MapTypeControl();
            map.addControl(mapTypeControl, daum.maps.ControlPosition.TOPRIGHT);

            var zoomControl = new daum.maps.ZoomControl();
            map.addControl(zoomControl, daum.maps.ControlPosition.RIGHT);
        }

        var imageSrc = '/pcms/common/images/marker.png',
            imageSize = new daum.maps.Size(40, 42), // 마커이미지의 크기
            imageOption = {offset: new daum.maps.Point(40, 42)}; // 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정

        // 마커가 표시될 위치
        var markerImage = new daum.maps.MarkerImage(imageSrc, imageSize, imageOption),
            markerPosition = new daum.maps.LatLng(this.options.lat, this.options.lng);


        // 마커를 생성
        var marker = new daum.maps.Marker({
            position: markerPosition,
            image: markerImage
        });

        // 마커가 지도 위에 표시되도록 설정
        marker.setMap(map);

        if(this.options.title || this.options.info ){
            var customOverlay = new daum.maps.CustomOverlay({
                position: markerPosition
            });

            var content = document.createElement('div');
            content.className = "ui-map-info";


            var title = document.createElement('div');
            title.className ="ui-map-info__title";
            title.appendChild(document.createTextNode(this.options.title));
            content.appendChild(title);

            if(this.options.info){
                var info = document.createElement('div');
                info.className ="ui-map-info__content";
                info.appendChild(document.createTextNode(this.options.info));
                content.appendChild(info);

                content.className = "ui-map-info--multi";
            }
            customOverlay.setContent(content);
            customOverlay.setMap(map);
        }
    };

    function checkMapPlugin(option){
        var $this = $(this);
        var data  = $this.data('map');
        //var options = typeof option === 'object' && option;
        var options = $.extend({}, CreateMap.DEFAULTS, $this.data(), typeof option === 'object' && option);
        $this.data('map', (data = new CreateMap(this, options)));
        if (typeof option === 'string') data[option]()
    }
    $.fn.checkMap             = checkMapPlugin;


        $("[data-map=\"map\"]").each(function () {
            var $this = $(this);   //버튼
            var option = $this.data();
            checkMapPlugin.call($this, option);
        });
});


function CopyUrl(event){
	
	var data =  document.location.href;
	var str = "";
	var IE= false;
	var agent = navigator.userAgent.toLowerCase();
	
	if ( (navigator.appName == 'Netscape' && agent.indexOf('trident') != -1) || (agent.indexOf("msie") != -1)) {
		IE = true;
	}else{
	    IE = false;
	}
	
	if(document.location.href.indexOf('bbs') > -1 && document.location.href.indexOf('view') > -1){
    	str = "?nttId=" + document.searchForm.nttId.value;
    	data =  document.location.href + str;
    }
	if (IE) {
		if(confirm("이 글의 URL 주소를 클립보드에 복사하시겠습니까?"))
			window.clipboardData.setData("Text", data);
	} else {
		temp = prompt("이 글의 URL 주소입니다. Ctrl+C를 눌러 클립보드로 복사하세요", data);
	}
	
    
}

/* Hover - add/remove Class  */
$(function(){
    var manageButton =  {
        body : $("tr"),
        buttons : $(".manage__show, .manage__body"),
        ovClass : "ov"
    };
    manageButton.buttons.each(function(i){
        var area = manageButton.buttons.eq(i).closest(manageButton.body);

        var buttonHeight = area.outerHeight();
        $(this).css({height : buttonHeight-1});

        $(this).hover(function () {
            area.stop(true,true).addClass(manageButton.ovClass);
        }, function () {
            area.stop(true,true).removeClass(manageButton.ovClass);
        });
    });
});


$(function() {
    var Tooltip = function (element, options) {
        this.init("tooltip", element, options)
    };
    Tooltip.DEFAULTS = {
        placement: "top",
        selector: false,
        template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
        trigger: "hover focus",
        title: "",
        delay: 0,
        container: false,  //툴팁을 특정 요소에 넣을 것인지 지정
        viewport: {
            selector: "body",
            padding: 0
        }
    };

    Tooltip.prototype.init = function (type, element, options) {
        this.enabled   = true;
        this.type      = type;
        this.$element  = $(element);
        this.options   = this.getOptions(options);
        this.$viewport = this.options.viewport && $(this.options.viewport.selector || this.options.viewport);

        var triggers = this.options.trigger.split(" ");

        for (var i = triggers.length; i--;) {
            var trigger = triggers[i];

            if (trigger !== "manual") {
                var eventIn  = trigger === "hover" ? "mouseenter" : "focusin";
                var eventOut = trigger === "hover" ? "mouseleave" : "focusout";

                this.$element.on(eventIn  + "." + this.type, this.options.selector, $.proxy(this.enter, this));
                this.$element.on(eventOut + "." + this.type, this.options.selector, $.proxy(this.leave, this));
            }
        }
        if(this.options.selector) {
            //data-selector 있으면
            this._options = $.extend({}, this.options, { trigger: "manual", selector: "" });
        } else{
            this.fixTitle()
        }
    };

    Tooltip.prototype.getDefaults = function () {
        return Tooltip.DEFAULTS
    };
    //옵션과 기본옵션 머지
    Tooltip.prototype.getOptions = function (options) {
        options = $.extend({}, this.getDefaults(), this.$element.data(), options);
        return options
    };
    Tooltip.prototype.getDelegateOptions = function () {
        var options  = {};
        var defaults = this.getDefaults();
        this._options && $.each(this._options, function (key, value) {
            if (defaults[key] !== value) options[key] = value
        });
        return options
    };
    Tooltip.prototype.enter = function (obj) {
        var self = $(obj.currentTarget).data(this.type);  //선택(?)한 이벤트 버튼 =>  target : 이벤트 받는곳 / currentTarget : 이벤트리스너를 받았던 곳
        self.hoverState = "in";
        if (self.hoverState === "in") {
            self.show()
        }
    };
    Tooltip.prototype.leave = function (obj) {
        var self = $(obj.currentTarget).data(this.type);
        self.hoverState = "out";
        if (self.hoverState === "out") {
           self.hide()
        }
    };
    Tooltip.prototype.show = function () {
        var e = $.Event("show." + this.type);  //tooltip show 이벤트, 대상은 버튼
        if (this.hasContent() && this.enabled) {  //표시할 내용이 있는지, 표시 여부 설정이 되어 있는지
            var that = this;
            var $tip = this.tip(); //tooltip 으로 표시될 영역 요소 생성 => $(this.options.template) 생성
            var tipId = this.getUID(this.type); ////aria role, describedby 값(id) 생성을 위한 랜덤 수 생성
            this.setContent();  //ata-original_title 값 가져옴
            $tip.attr("id", tipId);  // tooltip에 aria용 id적용
            this.$element.attr("aria-describedby", tipId); // 버튼에  aria-describedby id값 적용
            // 위치 지정 -
            var placement = this.options.placement;
            var autoToken = /\s?auto?\s?/i;
            var autoPlace = autoToken.test(placement); //위치값에 auto 가 있는지 확인
            if (autoPlace) placement = placement.replace(autoToken, "") || "top";  // auto와 동시 사용된 위치 정보
            $tip
            .detach() //중복요소 제거
            .css({ top: 0, left: 0, display: "block" })
            .addClass(placement)
            .data(this.type, this);
            //툴팁 표시할 내용
            if(this.options.container){   //툴팁을 특정 요소에 넣을 것이면
                $tip.appendTo(this.options.container)
            } else{
                $tip.insertAfter(this.$element);  //버튼요소 뒤에 툴팁 요소 추가
            }
            var pos          = this.getPosition();
            var actualWidth  = $tip[0].offsetWidth;  //tooltip 크기
            var actualHeight = $tip[0].offsetHeight;
            if (autoPlace) {  //auto 일때
                var orgPlacement = placement;
                var $container   = this.options.container ? $(this.options.container) : this.$element.parent();
                var containerDim = this.getPosition($container);
                placement = placement === "bottom" && pos.bottom + actualHeight > containerDim.bottom ? "top"    :
                placement === "top"    && pos.top    - actualHeight < containerDim.top    ? "bottom" :
                placement ==="right"  && pos.right  + actualWidth  > containerDim.width  ? "left"   :
                placement === "left"   && pos.left   - actualWidth  < containerDim.left   ? "right"  :
                placement;
                $tip
                .removeClass(orgPlacement)
                .addClass(placement)
            }
            //툴팀 표시 위치 계산 됨 - left, top 위치 값
            var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight);
            this.applyPlacement(calculatedOffset, placement);
        }
    };
    Tooltip.prototype.applyPlacement = function (offset, placement) {
        var $tip   = this.tip();
        var width  = $tip[0].offsetWidth;
        var height = $tip[0].offsetHeight;
        // getBoundingClientRect에는 차이가 있기 때문에 수동으로 여백을 읽는다.
        var marginTop = parseInt($tip.css("margin-top"), 10);
        var marginLeft = parseInt($tip.css("margin-left"), 10);
        // ie8 / 9에 대한 NaN을 확인.
        if (isNaN(marginTop))  marginTop  = 0;
        if (isNaN(marginLeft)) marginLeft = 0;
        offset.top  = offset.top  + marginTop;
        offset.left = offset.left + marginLeft;
        // $.fn.offset 은 픽셀을 반올림 하지 않음
        $.offset.setOffset($tip[0], $.extend({
            using: function (props) {
                $tip.css({
                    top: Math.round(props.top),
                    left: Math.round(props.left)
                })
            }
        }, offset), 0);
        $tip.addClass("active");
        // tip을 새 offset에 배치하면 tip의 크기가 자동으로 조정되는지 확인
        var actualWidth  = $tip[0].offsetWidth;
        var actualHeight = $tip[0].offsetHeight;
        if (placement === "top" && actualHeight !== height) {
            offset.top = offset.top + height - actualHeight;
        }
        var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight);
        if (delta.left) offset.left += delta.left;
        else offset.top += delta.top;
        var isVertical          = /top|bottom/.test(placement);  //top,bottom 이면 true
        var arrowDelta          = isVertical ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight;
        var arrowOffsetPosition = isVertical ? "offsetWidth" : "offsetHeight";
        $tip.offset(offset);
        this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], isVertical)
    };

    Tooltip.prototype.replaceArrow = function (delta, dimension, isHorizontal) {
        this.arrow()
        .css(isHorizontal ? "left" : "top", 50 * (1 - delta / dimension) + "%")
        .css(isHorizontal ? "top" : "left", "")
    };
    Tooltip.prototype.setContent = function () {
        var $tip  = this.tip();
        var title = this.getTitle();
        $tip.find(".tooltip-inner")["text"](title);
        $tip.removeClass("fade in top bottom left right ov")
        //tip-inner maxwidth 지정
        if(this.options.maxwidth){
            $tip.find(".tooltip-inner").css({
                maxWidth: this.options.maxwidth
            });
        }
    };
    Tooltip.prototype.hide = function (callback) {
        var that = this;
        var $tip = this.tip();
        var e    = $.Event("hide." + this.type);

        function complete() {
            if (that.hoverState !== "in") $tip.detach();
            that.$element
            .removeAttr("aria-describedby")
            .trigger("hidden." + that.type);
            callback && callback()
        }

        this.$element.trigger(e);

        if (e.isDefaultPrevented()) return;

        $tip.removeClass("active");

        complete();

        this.hoverState = null;

        return this
    };

    // title이 있는 경우에는 data-original_title을 title내용을 표시.
    // title 사용시 data-original_title 속성 없어도 됨.
    Tooltip.prototype.fixTitle = function () {
        var $e = this.$element;
        if ($e.attr("title") || typeof (this.options.original_title) !== "string") {
            $e.attr("data-original_title", $e.attr("title") || "").attr("title", "")
        }

    };

    //data-original_title 값 가져옴
    Tooltip.prototype.hasContent = function () {
        return this.getTitle()
    };

    //요소의 크기, 여백, xy
    Tooltip.prototype.getPosition = function ($element) {
        $element   = $element || this.$element;

        var el     = $element[0];
        var isBody = el.tagName === "BODY";

        var elRect    = el.getBoundingClientRect();   //ie9부터 지원하며 요소의 크기, 상하와우 여백, x,y를 가져온다  //ie9부터 지원됨

        if (elRect.width == null) {
            // ie8 이하는 수동으로 width, height 계산한다.
            elRect = $.extend({}, elRect, { width: elRect.right - elRect.left, height: elRect.bottom - elRect.top })
        }
        var elOffset  = isBody ? { top: 0, left: 0 } : $element.offset();
        var scroll    = { scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop() };
        var outerDims = isBody ? { width: $(window).width(), height: $(window).height() } : null;

        return $.extend({}, elRect, scroll, outerDims, elOffset)
    };

    //툴팀 표시 위치 계산 : pos - 버튼요소, actual~ - 툴팁 크기
    Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
        return placement === "bottom" ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2 } :
                placement === "top"    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2 } :
                placement === "left"   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
                /* placement === "right" */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width }

    };

    //영역을 벗어나면 위치 변경
    Tooltip.prototype.getViewportAdjustedDelta = function (placement, pos, actualWidth, actualHeight) {
        var delta = { top: 0, left: 0 };
        if (!this.$viewport) return delta;

        var viewportPadding = this.options.viewport && this.options.viewport.padding || 0;
        var viewportDimensions = this.getPosition(this.$viewport);

        if (/right|left/.test(placement)) {
            var topEdgeOffset    = pos.top - viewportPadding - viewportDimensions.scroll;
            var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight;
            if (topEdgeOffset < viewportDimensions.top) { // top overflow
                delta.top = viewportDimensions.top - topEdgeOffset
            } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) { // bottom overflow
                delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset
            }
        } else {
            var leftEdgeOffset  = pos.left - viewportPadding;
            var rightEdgeOffset = pos.left + viewportPadding + actualWidth;
            if (leftEdgeOffset < viewportDimensions.left) { // left overflow
                delta.left = viewportDimensions.left - leftEdgeOffset
            } else if (rightEdgeOffset > viewportDimensions.width) { // right overflow
                delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset
            }
        }

        return delta
    };

    Tooltip.prototype.getTitle = function () {
        var title;
        var $e = this.$element;
        title = $e.attr("data-original_title");
        if(!title){
            title = this.options.original_title;
        }
        return title
    };

    //aria role, describedby 값(id) 생성을 위한 랜덤 수 생성
    Tooltip.prototype.getUID = function (prefix) {
        do prefix += ~~(Math.random() * 1000000);
        while (document.getElementById(prefix));
        return prefix
    };

    //tooltip 표시 영역 요소 생성 => this.options.template
    Tooltip.prototype.tip = function () {
        return (this.$tip = this.$tip || $(this.options.template))
    };

    Tooltip.prototype.arrow = function () {
        return (this.$arrow = this.$arrow || this.tip().find(".tooltip-arrow"))
    };

    Tooltip.prototype.toggle = function (e) {

        var self = this;
        if (e) {
            self = $(e.currentTarget).data(this.type);
            if (!self) {
                self = new this.constructor(e.currentTarget);
                //self = new this.constructor(e.currentTarget, this.getDelegateOptions());
                $(e.currentTarget).data(this.type, self)
            }
        }
        if (self.tip().hasClass("active")) {
            self.leave(self)
        } else {
            self.enter(self)
        }
    };
    function tooltipPlugin(option) {
        return this.each(function () {
            var $this   = $(this);
            var data    = $this.data("tooltip");
            var options = typeof option === "object" && option;
            if (!data) {
                $this.data("tooltip", (data = new Tooltip(this, options)));
            }

        })
    }
    $.fn.tooltip             = tooltipPlugin;
    $.fn.tooltip.Constructor = Tooltip;  //popover와 연계
    //Popover
    var Popover = function (element, options) {
        this.init('popover', element, options)
    };

    if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js');

    Popover.DEFAULTS = $.extend({}, $.fn.tooltip.Constructor.DEFAULTS, {
        placement: 'right',
        trigger: 'hover focus',
        content: '',
        template: '<div class="popover" role="tooltip"><div class="arrow"></div><div class="popover-title"></div><div class="popover-content"></div></div>'
    });
    // popOver - tooltip 연결
    Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype);
    Popover.prototype.constructor = Popover;
    Popover.prototype.getDefaults = function () {
        return Popover.DEFAULTS
    };

    Popover.prototype.setContent = function () {
        var $tip    = this.tip();
        var title   = this.getTitle();
        var content = this.getContent();

        $tip.find('.popover-title')["text"](title);
        $tip.find('.popover-content').children().detach().end()["text"](content);
        $tip.removeClass('fade top bottom left right in ov');

        // IE8 지원을 위해 수동으로 체크
        if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide();


        //tip max-width 지정
        if(this.options.maxwidth){
            $tip.css({
                maxWidth: this.options.maxwidth
            });
        }

    };

    Popover.prototype.hasContent = function () {
        return this.getTitle() || this.getContent()
    };

    Popover.prototype.getContent = function () {
        var $e = this.$element;

        return $e.attr('data-content') || (typeof this.options.content === 'function' ?
                this.options.content.call($e[0]) :
                this.options.content)
    };

    Popover.prototype.arrow = function () {
        return (this.$arrow = this.$arrow || this.tip().find('.arrow'))
    };

    Popover.prototype.tip = function () {
        if (!this.$tip) this.$tip = $(this.options.template);
        return this.$tip
    };

    function popoverPulgin(option) {
        return this.each(function () {
            var $this   = $(this);
            var data    = $this.data('popover');
            var options = typeof option === 'object' && option;

            //if (!data && option === 'destroy') return;
            if (!data) $this.data('popover', (data = new Popover(this, options)));
            if (typeof option === 'string') data[option]()

        })
    }

    $.fn.popover             = popoverPulgin;
    $.fn.popover.Constructor = Popover;

    /*
    * tootip/popover
    */
    $(window).on("load",function(e){
        $("[data-button=\"tooltip\"]").each(function () {
            if($(this).is('a')) {
                $(this).on("click",function(e){
                    e.preventDefault();
                });
            }
            var allTooltip = $(this);
            var data = allTooltip.data();
            tooltipPlugin.call(allTooltip,data);

        });
    });

    $(window).on("load",function(e){
        $("[data-button=\"popover\"]").each(function () {
            if($(this).is('a')) {
                $(this).on("click",function(e){
                    e.preventDefault();tabt
                });
            }
            var allPopover = $(this);
            var data = allPopover.data();
            popoverPulgin.call(allPopover,data);
        });

    });

});

function ajaxprototyOpen(t,m){
    var t = $(t);
    var m = $(m);
    var winHeight = $("html").height();
    t.url = t.attr("href");
    $.get(t.url,function(msg){
        $("html").css({"height":winHeight});
        $("html,body").css("overflow","hidden");
        t.msg = $(msg);
        t.content = t.msg.html();
        m.layer = $("#ajaxLayer");
        if(m.layer.size() > 0){
            m.layer.html(t.content);
            //m.layer.find(".modal__close>button").trigger("focus");
        }else{
            m.append("<div id=\"ajaxLayer\" style=\"display:none;overflow:auto\">"+t.content+"</div>");
            m.layer = $("#ajaxLayer");
            m.layer.fadeIn(300);
		   	m.layer.find(".modal__close2>button").trigger("focus");

            $(".site_pop .modal__close button , .site_pop .modal__close button2").on("click",function(){
                $("#top_layout .top_wrap .utile_wrap li.n3 a").focus();
            });
        }
    });
    return true;
}
function ajaxprototypExit(t){
    var t = $(t);
    t.fadeOut(300,
        function(){
            $("html,body").removeAttr("style");
            t.remove();
        }
    );
    return true;
}

$(document).ready(function(){
 	$(".tab-ul li a").removeAttr("title");
    $(".tab-ul li.on a").attr("title","선택됨");

    $(".sch_box li a").removeAttr("title");
    $(".sch_box li .active a").attr("title","선택됨");

});
