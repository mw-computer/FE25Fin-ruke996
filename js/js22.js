// GNB(메뉴) 드롭다운 동작
$(function(){
    var param = "#gnb_layout",
        obj = ".depth2_ul",
        btn = ".depth1_ul>li",
        wrap = "#gnb_layout",
        dur = 300,
        meth = "easeOutCubic";
    gnb(param,obj,btn,wrap,dur,meth);
    gnb_open();
}());

// 퀵메뉴(플로팅 메뉴) 동작
$(document).ready(function() {
    var floatPosition = parseInt($("#floatMenu").css('top'));
    $(window).scroll(function() {
        var scrollTop = $(window).scrollTop();
        var newPosition = scrollTop + floatPosition + "px";
        $("#floatMenu").stop().animate({
            "top" : newPosition
        }, 500);
    }).scroll();
});
$(".clickOpen > button").on("click",function(){
    $(".quick.on").removeClass("on");
    $(this).parent().addClass("on");
});
$(".clickOpen button.clickClose").on("click",function(){
    $(this).parents(".clickOpen").removeClass("on");
});
$(document).click(function(e){
    var cnt = $(e.target).parents(".quick").size();
    if(cnt == 0){
        $(".quick").removeClass("on");
    }
});
$(".move_top").click(function(){
    $("html, body").animate({"scrollTop":0},500);
});

// 팝업 슬라이더, 탭, 기타 인라인 스크립트(생략)
