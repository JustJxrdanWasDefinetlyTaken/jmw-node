    const _0x4ce222 = _0x3fd6;
    (function (_0xa51863, _0x77d095) {
      const _0x1bc52b = _0x3fd6,
        _0x46fbf4 = _0xa51863();
      while (!![]) {
        try {
          const _0x562add =
            parseInt(_0x1bc52b(0x207)) / 0x1 +
            -parseInt(_0x1bc52b(0x1ed)) / 0x2 +
            (parseInt(_0x1bc52b(0x1f0)) / 0x3) *
            (-parseInt(_0x1bc52b(0x1e2)) / 0x4) +
            (parseInt(_0x1bc52b(0x1f2)) / 0x5) *
            (parseInt(_0x1bc52b(0x1f4)) / 0x6) +
            -parseInt(_0x1bc52b(0x20b)) / 0x7 +
            (-parseInt(_0x1bc52b(0x1f3)) / 0x8) *
            (parseInt(_0x1bc52b(0x1f7)) / 0x9) +
            (-parseInt(_0x1bc52b(0x1ef)) / 0xa) *
            (-parseInt(_0x1bc52b(0x1e1)) / 0xb);
          if (_0x562add === _0x77d095) break;
          else _0x46fbf4["push"](_0x46fbf4["shift"]());
        } catch (_0x2f3c7b) {
          _0x46fbf4["push"](_0x46fbf4["shift"]());
        }
      }
    })(_0x211c, 0x44fa2);
    var isAboutBlankEnabled = localStorage[_0x4ce222(0x1f5)]("aboutBlank");
    if (isAboutBlankEnabled === _0x4ce222(0x1eb)) {
      let inFrame;
      try {
        inFrame = window !== top;
      } catch (_0x295928) {
        inFrame = !![];
      }
      if (
        !inFrame &&
        !navigator[_0x4ce222(0x1e7)][_0x4ce222(0x206)](_0x4ce222(0x209))
      ) {
        const popup = open("about:blank", "_blank");
        if (!popup || popup["closed"]) alert(_0x4ce222(0x1fb));
        else {
          const doc = popup["document"],
            iframe = doc[_0x4ce222(0x1ee)](_0x4ce222(0x1f1)),
            style = iframe["style"],
            link = doc[_0x4ce222(0x1ee)](_0x4ce222(0x202)),
            name =
              localStorage[_0x4ce222(0x1f5)](_0x4ce222(0x1fa)) || _0x4ce222(0x1df),
            icon = localStorage[_0x4ce222(0x1f5)]("icon") || _0x4ce222(0x201);
          (doc["title"] = name),
            (link[_0x4ce222(0x1ea)] = "icon"),
            (link["href"] = icon),
            (iframe[_0x4ce222(0x1fd)] = location[_0x4ce222(0x1f6)]),
            (style[_0x4ce222(0x1e0)] = "fixed"),
            (style[_0x4ce222(0x1e6)] =
              style[_0x4ce222(0x205)] =
              style[_0x4ce222(0x200)] =
              style[_0x4ce222(0x20c)] =
              0x0),
            (style[_0x4ce222(0x1e8)] = style[_0x4ce222(0x1f9)] = _0x4ce222(0x1e9)),
            (style[_0x4ce222(0x1ec)] = style[_0x4ce222(0x208)] = "100%"),
            doc[_0x4ce222(0x1e3)][_0x4ce222(0x204)](link),
            doc[_0x4ce222(0x1fc)][_0x4ce222(0x204)](iframe),
            location["replace"](_0x4ce222(0x1ff));
        }
      }
    }
    var leaveConf = localStorage["getItem"](_0x4ce222(0x1f8));
    function _0x211c() {
      const _0x137107 = [
        "History\x20Hider\x20failed\x20to\x20cloak\x20this\x20site,\x20allow\x20popups\x20and\x20reload.",
        "body",
        "src",
        "onbeforeunload",
        "https://www.google.com/search?q=ixl",
        "left",
        "https://ssl.gstatic.com/classroom/favicon.png",
        "link",
        "reload",
        "appendChild",
        "bottom",
        "includes",
        "168090regBHH",
        "height",
        "Firefox",
        "setItem",
        "3107223BrGfHf",
        "right",
        "Home",
        "position",
        "10193194XiRXBq",
        "52968pabuvm",
        "head",
        "location",
        "disabled",
        "top",
        "userAgent",
        "border",
        "none",
        "rel",
        "enabled",
        "width",
        "169852yoRJJD",
        "createElement",
        "10WGzfqh",
        "27ugFxYm",
        "iframe",
        "15DtwlPr",
        "16kqVmcO",
        "465162VGIOoQ",
        "getItem",
        "href",
        "1785609ElyabJ",
        "leaveConfirmation",
        "outline",
        "name",
      ];
      _0x211c = function () {
        return _0x137107;
      };
      return _0x211c();
    }
    if (leaveConf === _0x4ce222(0x1eb)) {
      window[_0x4ce222(0x1fe)] = function () {
        return "";
      };
      function conf2() {
        return "";
      }
      conf2();
    }
    function _0x3fd6(_0x3ab8e5, _0x1b7485) {
      const _0x211ceb = _0x211c();
      return (
        (_0x3fd6 = function (_0x3fd6b0, _0x5f3d18) {
          _0x3fd6b0 = _0x3fd6b0 - 0x1df;
          let _0x125f72 = _0x211ceb[_0x3fd6b0];
          return _0x125f72;
        }),
        _0x3fd6(_0x3ab8e5, _0x1b7485)
      );
    }
    function enableAboutBlank() {
      const _0xdd4460 = _0x4ce222;
      localStorage[_0xdd4460(0x20a)]("aboutBlank", _0xdd4460(0x1eb)),
        window[_0xdd4460(0x1e4)][_0xdd4460(0x203)]();
    }
    function disableAboutBlank() {
      const _0x1cf642 = _0x4ce222;
      localStorage[_0x1cf642(0x20a)]("aboutBlank", _0x1cf642(0x1e5)),
        window["location"][_0x1cf642(0x203)]();
    }