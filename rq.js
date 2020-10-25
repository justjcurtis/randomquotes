$("document").ready(function () {
    var isSafari = !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/);
    var q = {};
    var I = 0;
    var J = I;
    var Q = {};
    var url = "https://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=jsonp&jsonp=?";
    var rgb;

    setSafari();
    newQuote();

    $("body").click(function (e) {
        // check click for menu button
        if ($(e.target).closest(".menu-btn").length > 0) {
            return;
        }
        // Check click for #twitter
        if ($(e.target).closest("#tweet").length > 0) {
            twitterClick();
            return;
        }
        // Check click for #copy
        if ($(e.target).closest("#copy").length > 0) {
            copyClick();
            return;
        }
        //otherwise get new quote
        var x = e.pageX
        if (x > $(window).width() / 2) {
            //Right half goes forward
            $(".note").fadeTo(1000, 0);
            if (J < I - 1) {
                forwardClick();
            } else {
                newQuote();
            }
        } else {
            //Left half goes back
            backClick();
        }
    });

    function setSafari() {
        if (isSafari) {
            document.body.style.cursor = "pointer";
        }
    }

    function forwardClick() {
        //step J forward
        if (J < I) {

            J++;

            //set next quote
            $(".qq").html(Q[J].q);
            $(".qa").html(Q[J].a);
            rgb = Q[J].c;
            setColor(rgb);
        }

    }

    function newQuote() {
        getQuote();
        setColor(0);
    }

    function twitterClick() {
        q.q = '" ' + $(".qq").text() + ' " ';
        q.a = $(".qa").text();

        var t = "https://twitter.com/intent/tweet?text=" + q.q + q.a;

        window.open(t, '_blank');
    }

    function copyClick() {
        var text = (Q[J].q + "\n " + Q[J].a);
        if (window.clipboardData && window.clipboardData.setData) {
            // IE specific code path to prevent textarea being shown while dialog is visible.
            return clipboardData.setData("Text", text);

        } else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
            var textarea = document.createElement("textarea");
            textarea.textContent = text;
            textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in MS Edge.
            document.body.appendChild(textarea);
            textarea.select();
            try {
                return document.execCommand("copy");  // Security exception may be thrown by some browsers.
            } catch (ex) {
                console.warn("Copy to clipboard failed.", ex);
                return false;
            } finally {
                document.body.removeChild(textarea);
            }
        }
    }

    function backClick() {
        //step J back
        if (J > 0) {

            J--;

            //set previous quote
            $(".qq").html(Q[J].q);
            $(".qa").html(Q[J].a);
            rgb = Q[J].c;
            setColor(rgb);
        }

    }

    function setColor(rgb) {
        if (rgb == 0) {
            rgb = genColor(50, 150)
        } else {
            console.log(rgb);
        }
        $("body").animate({ backgroundColor: rgb }, {
            duration: 1000,
            queue: false
        });
        $(".fg").animate({ color: rgb }, {
            duration: 1000,
            queue: false
        });

    };

    function genColor(min, max) {

        var r = Math.floor(Math.random() * (max - min) + min);
        var g = Math.floor(Math.random() * (max - min) + min);
        var b = Math.floor(Math.random() * (max - min) + min);

        var res = "rgb(" + r + ", " + g + ", " + b + ")";
        rgb = res

        return res;
    };

    function logg() {
        Q[I] = {
            "a": q.a,
            "q": q.q,
            "c": rgb
        };
        J = I;
        I = I + 1;
    }

    function getQuote() {
        $.getJSON(url, function (data) {
            q.q = data.quoteText;
            q.a = "- " + data.quoteAuthor;
            if (q.a.length < 3) {
                q.a = "- Unknown";
            }
            $(".qq").html(q.q);
            $(".qa").html(q.a);
            logg();
        });
    };

});
