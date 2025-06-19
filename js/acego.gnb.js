// jQuery가 정상적으로 로드되어 있는지 확인
if (typeof jQuery === "undefined") {
    console.error("jQuery가 로드되지 않았습니다. 메뉴 스크립트가 동작하지 않습니다.");
} else {
    // 문서 준비 완료 시점에 실행
    $(function () {
        // 선택자 변수 선언
        var $param = $("#gnb_layout"),
            $btn = $param.find(".depth1_ul>li"),
            $obj = $param.find(".depth2_ul"),
            $wrap = $("#gnb_layout"),
            dur = 300,
            meth = "easeOutCubic";

        // gnb 함수 실행 (선택자 존재 여부 체크)
        if ($param.length && $btn.length && $obj.length) {
            gnb($param, $obj, $btn, $wrap, dur, meth);
        } else {
            console.warn("GNB 메뉴 구조가 올바르지 않습니다. 드롭다운 메뉴가 동작하지 않을 수 있습니다.");
        }
        // 모바일 메뉴 함수 실행
        gnb_open();
    });

    // GNB 드롭다운 함수
    function gnb($param, $obj, $btn, $wrap, dur, meth) {
        var th2 = $obj.find("> li");
        var new_h = 0;

        // 메뉴 높이 계산 및 적용
        function _open() {
            new_h = 0;
            $obj.each(function () {
                var ph = $(this).parent().outerHeight();
                if (new_h < ph) new_h = ph;
            });
            $obj.height(new_h);
        }
        _open();

        // 마우스 오버/포커스 시 메뉴 열기
        $btn.on('mouseenter focusin', function () {
            $(this).addClass('on').siblings().removeClass('on');
            $param.addClass('open');
            $param.css({ "height": new_h + 174 });
            $("#top_layout").addClass("on");
        });

        // 마우스 아웃/포커스 아웃 시 메뉴 닫기
        $btn.on('mouseleave focusout', function () {
            $btn.removeClass('on');
            $param.removeClass('open');
            $param.removeAttr("style");
            $("#top_layout").removeClass("on");
        });

        // 전체 GNB 영역에서 마우스가 벗어나면 메뉴 닫기
        $param.on('mouseleave', function () {
            $btn.removeClass('on');
            $param.removeClass('open');
            $param.removeAttr("style");
            $("#top_layout").removeClass("on");
        });

        // 하위 메뉴에 순번 클래스 부여
        th2.each(function (k) {
            $(this).addClass("no" + (k + 1));
        });
    }

    // 모바일 메뉴 오픈 함수
    function gnb_open() {
        var $param = $('#mobile-menu');
        if (!$param.length) return;

        $param.find(".item").hide();

        // 메뉴 클릭 시 슬라이드 토글
        $param.find(".depth1_ul>li>a").on("click", function (event) {
            var $this = $(this);
            var $next = $this.next(".item");
            if ($next.length) {
                if ($next.find(".depth2_ul").length && $next.find(".depth2_ul>li").length) {
                    if ($next.css("display") === "none") {
                        $param.find(".depth1_ul>li>a").not($this).removeClass("ov").next(".item").stop(true, true).delay(150).slideUp(150);
                        $this.addClass("ov").next(".item").stop(true, true).slideDown(150);
                    }
                    event.preventDefault();
                }
            }
        });

        // 3차 메뉴 토글
        $param.find(".depth2_ul>li>a").on("click", function (event) {
            var $t = $(this);
            var $next = $t.next(".depth3_ul");
            if ($next.length) {
                if ($next.css("display") !== "block") {
                    $t.addClass("ov");
                    $next.slideDown(150);
                } else {
                    $t.removeClass("ov");
                    $next.slideUp(150);
                }
                event.preventDefault();
            }
        });

        // 창 크기 변경 시 모바일 메뉴 닫기
        $(window).on('resize', function () {
            $('.mobile-close').click();
        });
    }

    // 브라우저 종류에 따라 html 클래스 지정
    (function () {
        var agent = navigator.userAgent.toLowerCase();
        if ((navigator.appName === 'Netscape' && navigator.userAgent.search('Trident') !== -1) || (agent.indexOf("msie") !== -1)) {
            $('html').attr("class", "userMs");
        } else {
            $('html').attr("class", "WebKit");
        }
    })();
}
