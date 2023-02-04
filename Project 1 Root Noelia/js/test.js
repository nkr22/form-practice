var $jscomp = {
    scope: {},
};
$jscomp.defineProperty =
    "function" == typeof Object.defineProperties
        ? Object.defineProperty
        : function (a, h, g) {
              if (g.get || g.set)
                  throw new TypeError(
                      "ES3 does not support getters and setters."
                  );
              a != Array.prototype && a != Object.prototype && (a[h] = g.value);
          };
$jscomp.getGlobal = function (a) {
    return "undefined" != typeof window && window === a
        ? a
        : "undefined" != typeof global && null != global
        ? global
        : a;
};
$jscomp.global = $jscomp.getGlobal(this);
$jscomp.SYMBOL_PREFIX = "jscomp_symbol_";
$jscomp.initSymbol = function () {
    $jscomp.initSymbol = function () {};
    $jscomp.global.Symbol || ($jscomp.global.Symbol = $jscomp.Symbol);
};
$jscomp.symbolCounter_ = 0;
$jscomp.Symbol = function (a) {
    return $jscomp.SYMBOL_PREFIX + (a || "") + $jscomp.symbolCounter_++;
};
$jscomp.initSymbolIterator = function () {
    $jscomp.initSymbol();
    var a = $jscomp.global.Symbol.iterator;
    a ||
        (a = $jscomp.global.Symbol.iterator =
            $jscomp.global.Symbol("iterator"));
    "function" != typeof Array.prototype[a] &&
        $jscomp.defineProperty(Array.prototype, a, {
            configurable: !0,
            writable: !0,
            value: function () {
                return $jscomp.arrayIterator(this);
            },
        });
    $jscomp.initSymbolIterator = function () {};
};
$jscomp.arrayIterator = function (a) {
    var h = 0;
    return $jscomp.iteratorPrototype(function () {
        return h < a.length
            ? {
                  done: !1,
                  value: a[h++],
              }
            : {
                  done: !0,
              };
    });
};
$jscomp.iteratorPrototype = function (a) {
    $jscomp.initSymbolIterator();
    a = {
        next: a,
    };
    a[$jscomp.global.Symbol.iterator] = function () {
        return this;
    };
    return a;
};
$jscomp.array = $jscomp.array || {};
$jscomp.iteratorFromArray = function (a, h) {
    $jscomp.initSymbolIterator();
    a instanceof String && (a += "");
    var g = 0,
        f = {
            next: function () {
                if (g < a.length) {
                    var k = g++;
                    return {
                        value: h(k, a[k]),
                        done: !1,
                    };
                }
                f.next = function () {
                    return {
                        done: !0,
                        value: void 0,
                    };
                };
                return f.next();
            },
        };
    f[Symbol.iterator] = function () {
        return f;
    };
    return f;
};
$jscomp.polyfill = function (a, h, g, f) {
    if (h) {
        g = $jscomp.global;
        a = a.split(".");
        for (f = 0; f < a.length - 1; f++) {
            var k = a[f];
            k in g || (g[k] = {});
            g = g[k];
        }
        a = a[a.length - 1];
        f = g[a];
        h = h(f);
        h != f &&
            null != h &&
            $jscomp.defineProperty(g, a, {
                configurable: !0,
                writable: !0,
                value: h,
            });
    }
};
$jscomp.polyfill(
    "Array.prototype.keys",
    function (a) {
        return a
            ? a
            : function () {
                  return $jscomp.iteratorFromArray(this, function (a) {
                      return a;
                  });
              };
    },
    "es6-impl",
    "es3"
);
$jscomp.findInternal = function (a, h, g) {
    a instanceof String && (a = String(a));
    for (var f = a.length, k = 0; k < f; k++) {
        var q = a[k];
        if (h.call(g, q, k, a))
            return {
                i: k,
                v: q,
            };
    }
    return {
        i: -1,
        v: void 0,
    };
};
$jscomp.polyfill(
    "Array.prototype.find",
    function (a) {
        return a
            ? a
            : function (a, g) {
                  return $jscomp.findInternal(this, a, g).v;
              };
    },
    "es6-impl",
    "es3"
);
$jscomp.checkStringArgs = function (a, h, g) {
    if (null == a)
        throw new TypeError(
            "The 'this' value for String.prototype." +
                g +
                " must not be null or undefined"
        );
    if (h instanceof RegExp)
        throw new TypeError(
            "First argument to String.prototype." +
                g +
                " must not be a regular expression"
        );
    return a + "";
};
$jscomp.polyfill(
    "String.prototype.includes",
    function (a) {
        return a
            ? a
            : function (a, g) {
                  return (
                      -1 !==
                      $jscomp
                          .checkStringArgs(this, a, "includes")
                          .indexOf(a, g || 0)
                  );
              };
    },
    "es6-impl",
    "es3"
);
$jscomp.polyfill(
    "Number.isNaN",
    function (a) {
        return a
            ? a
            : function (a) {
                  return "number" === typeof a && isNaN(a);
              };
    },
    "es6-impl",
    "es3"
);
var Scriptures = (function () {
    var a = /^\?book=(.*)&chap=(.*)&verses=(.*)&jst=(.*)$/i,
        h = /\((.*),'(.*)',(.*),(.*),(.*),(.*),(.*),(.*),(.*),(.*),(.*)\)/,
        g = {},
        f,
        k,
        q,
        u,
        d = {},
        v = [],
        l = [],
        I,
        B,
        w = 500,
        m,
        J,
        K,
        L,
        x,
        C,
        M,
        N,
        D,
        O,
        P,
        Q,
        R,
        S,
        T,
        E,
        U,
        V,
        W,
        X,
        y,
        r,
        Y,
        n,
        Z,
        aa,
        F,
        ba,
        G,
        ca,
        da,
        t,
        z,
        H,
        A;
    J = function (b, c, e) {
        var a = V(c, e);
        0 <= a
            ? W(b, a)
            : ((b = new google.maps.Marker({
                  position: {
                      lat: Number(c),
                      lng: Number(e),
                  },
                  map: map,
                  title: b,
                  animation: google.maps.Animation.DROP,
              })),
              l.push(b),
              (c = new MapLabel({
                  text: b.getTitle(),
                  position: new google.maps.LatLng(Number(c), Number(e)),
                  map: map,
                  fontSize: 16,
                  fontColor: "#201000",
                  strokeColor: "#fff8f0",
                  align: "left",
              })),
              v.push(c));
    };
    K = function (b) {
        void 0 === k &&
            ((k = {}),
            Object.keys(f).forEach(function (b) {
                b = f[b];
                k[b.abbr] = b;
            }));
        return k[b];
    };
    L = function (b, c) {
        var e = f[b];
        return void 0 === e ||
            0 > c ||
            c > e.numChapters ||
            (0 === c && 0 < e.numChapters)
            ? !1
            : !0;
    };
    x = function (b, c, e) {
        var a = "<ul><li>";
        void 0 === b
            ? (a += "The Scriptures</li>")
            : ((a +=
                  '<a href="javascript:void(0);" onclick="Scriptures.hash()">The Scriptures</a></li>'),
              void 0 === c
                  ? (a += "<li>" + b.fullName + "</li>")
                  : ((a +=
                        '<li><a href="javascript:void(0);" onclick="Scriptures.hash(' +
                        b.id +
                        ')">' +
                        b.fullName +
                        "</a></li>"),
                    void 0 === e || 0 === e
                        ? (a += "<li>" + c.tocName + "</li>")
                        : ((a +=
                              '<li><a href="javascript:void(0);" onclick="Scriptures.hash(0, ' +
                              c.id +
                              ')">' +
                              c.tocName +
                              "</a></li>"),
                          (a += "<li>" + e + "</li>"))));
        return a + "</ul>";
    };
    C = function () {
        m.forEach(function (b) {
            b.books = Q(f, function (c) {
                return c.parentBookId === b.id;
            });
        });
    };
    M = function () {
        $("#suggestion").modal("close");
    };
    N = function () {
        D(l);
        D(v);
        l = [];
        v = [];
        d = {};
    };
    D = function (b) {
        b.forEach(function (b) {
            b.setMap(null);
        });
    };
    O = function () {
        $("#placename").val(d.placename);
        $("#latitude").val(d.latitude);
        $("#longitude").val(d.longitude);
        $("#view_latitude").val(d.viewLatitude);
        $("#view_longitude").val(d.viewLongitude);
        $("#view_tilt").val("0");
        $("#view_roll").val("0");
        $("#view_altitude").val(d.viewAltitude);
        $("#view_heading").val("0");
        $("#suggestion").modal("open");
    };
    P = function (b, c, a, d) {
        if (void 0 !== b && void 0 !== c) {
            var e = "";
            void 0 !== a && (e += a);
            void 0 !== d && d && (e += "&jst=JST");
            return (
                "https://scriptures.byu.edu/mapscrip/mapgetscrip.php?book=" +
                b +
                "&chap=" +
                c +
                "&verses=" +
                e
            );
        }
    };
    Q = function (b, c) {
        var a = [];
        Object.keys(b).forEach(function (e) {
            e = b[e];
            c(e) && a.push(e);
        });
        return a;
    };
    R = function (b) {
        if ((b = a.exec(b))) {
            var c = K(b[1]);
            void 0 !== c && E(c.parentBookId, c.id, b[2], b[3], b[4]);
        }
    };
    S = function (b) {
        b = $(b);
        b.find(".navheading").append('<div class="nextprev">' + B + "</div>");
        A(b);
        z(I);
    };
    T = function () {
        n("Warning: scripture request from server failed.");
    };
    E = function (b, c, a, d, p) {
        var e = "";
        void 0 !== b &&
            ((e += b),
            void 0 !== c &&
                ((e += ":" + c),
                void 0 !== a &&
                    ((e += ":" + a),
                    void 0 !== d &&
                        ((e += ":" + d),
                        void 0 !== p && 0 < p.length && (e += ":j")))));
        window.location.hash = e;
    };
    U = function (b) {
        var c = !1,
            a = !1;
        $.ajax({
            url: "https://scriptures.byu.edu/mapscrip/model/books.php",
            dataType: "json",
            success: function (e) {
                f = e;
                c = !0;
                a && (C(), "function" === typeof b && b());
            },
        });
        $.ajax({
            url: "https://scriptures.byu.edu/mapscrip/model/volumes.php",
            dataType: "json",
            success: function (e) {
                m = e;
                a = !0;
                c && (C(), "function" === typeof b && b());
            },
        });
    };
    V = function (b, a) {
        for (var c = l.length - 1; 0 <= c; ) {
            var d = l[c];
            if (
                1e-7 > Math.abs(d.getPosition().lat() - b) &&
                1e-7 > Math.abs(d.getPosition().lng() - a)
            )
                return c;
            --c;
        }
        return -1;
    };
    W = function (b, a) {
        var c = l[a],
            d = v[a],
            p = c.getTitle();
        p.includes(b) || ((p += ", " + b), c.setTitle(p), (d.text = p));
    };
    X = function (b) {
        b = f[b];
        var a = m[b.parentBookId - 1];
        if (0 >= b.numChapters) y(b.id, 0);
        else if (1 === b.numChapters) y(b.id, 1);
        else {
            for (
                var e = 1,
                    d =
                        '<div id="scripnav"><div class="volume"><h5>' +
                        b.fullName +
                        '</h5></div><div class="books">';
                e <= b.numChapters;

            )
                (d +=
                    '<a class="waves-effect waves-custom waves-ripple btn chapter" id="' +
                    e +
                    '" href="#0:' +
                    b.id +
                    ":" +
                    e +
                    '">' +
                    e +
                    "</a>"),
                    (e += 1);
            A(d + "</div>");
            z(x(a, b));
        }
    };
    y = function (b, a, e, d) {
        if (void 0 !== b) {
            var c = f[b];
            I = x(m[c.parentBookId - 1], c, a);
            c = aa(b, a);
            B =
                void 0 === c
                    ? ""
                    : '<a href="javascript:void(0);" onclick="Scriptures.hash(0, ' +
                      c[0] +
                      ", " +
                      c[1] +
                      ')" title="' +
                      c[2] +
                      '"><i class="material-icons">skip_previous</i></a>';
            c = Y(b, a);
            void 0 !== c &&
                (B +=
                    '<a href="javascript:void(0);" onclick="Scriptures.hash(0, ' +
                    c[0] +
                    ", " +
                    c[1] +
                    ')" title="' +
                    c[2] +
                    '"><i class="material-icons">skip_next</i></a>');
            $.ajax({
                url: P(b, a, e, d),
                success: S,
                error: T,
            });
            q = b;
            u = a;
        }
    };
    r = function (b) {
        var a,
            e = '<div id="scripnav">';
        m.forEach(function (c) {
            if (void 0 === b || c.id === b)
                (e +=
                    '<div class="volume"><a name="v' +
                    c.id +
                    '" /><h5>' +
                    c.fullName +
                    '</h5></div><div class="books">'),
                    c.books.forEach(function (b) {
                        e +=
                            '<a class="waves-effect waves-custom waves-ripple btn" id="' +
                            b.id +
                            '" href="#' +
                            c.id +
                            ":" +
                            b.id +
                            '">' +
                            b.gridName +
                            "</a>";
                    }),
                    (e += "</div>"),
                    c.id === b && (a = c);
        });
        e += "<br /><br /></div>";
        A(e);
        z(x(a));
    };
    Y = function (b, a) {
        var c = f[b];
        if (void 0 !== c) {
            if (a < c.numChapters) return [b, a + 1, t(c, a + 1)];
            c = f[b + 1];
            if (void 0 !== c) {
                var d = 0;
                0 < c.numChapters && (d = 1);
                return [c.id, d, t(c, d)];
            }
        }
    };
    n = function (b) {
        Materialize.toast(b, 4e3);
    };
    Z = function () {
        var b = [];
        u = q = void 0;
        "" !== window.location.hash &&
            1 < window.location.hash.length &&
            (b = window.location.hash.substring(1).split(":"));
        if (0 >= b.length) r();
        else {
            var a = Number(b.shift());
            if (0 >= b.length) a < m[0].id || a > m.slice(-1).id ? r() : r(a);
            else if (((a = Number(b.shift())), 0 >= b.length))
                void 0 === f[a] ? r() : X(a);
            else {
                var e = Number(b.shift());
                L(a, e) ? y(a, e, b.shift(), b.shift()) : r();
            }
        }
    };
    aa = function (b, a) {
        var c = f[b];
        if (void 0 !== c) {
            if (1 < a) return [b, a - 1, t(c, a - 1)];
            c = f[b - 1];
            if (void 0 !== c) return [c.id, c.numChapters, t(c, c.numChapters)];
        }
    };
    F = function (b) {
        if (void 0 === window.google)
            (b = window.setTimeout(F, w, b)),
                (w += w),
                5e3 < w && window.clearTimeout(b);
        else {
            0 < l.length && N();
            var a;
            (void 0 === b
                ? $('a[onclick^="showLocation("]')
                : $(b).find('a[onclick^="showLocation("]')
            ).each(function (b, c) {
                var d = c.getAttribute("onclick");
                if ((a = h.exec(d))) {
                    var d = a[2],
                        e = parseFloat(a[3]),
                        g = parseFloat(a[4]),
                        f = a[11].substring(1),
                        f = f.substring(0, f.length - 1);
                    "" !== f && (d += " " + f);
                    J(d, Number(e), Number(g));
                }
            });
            if (0 < l.length)
                if (1 === l.length && a)
                    (b = Math.round(Number(a[9]) / 450)),
                        6 > b ? (b = 6) : 18 < b && (b = 18),
                        map.setZoom(b),
                        map.panTo(l[0].position);
                else {
                    var d = new google.maps.LatLngBounds();
                    l.forEach(function (b) {
                        d.extend(b.position);
                    });
                    map.panTo(d.getCenter());
                    map.fitBounds(d);
                }
        }
    };
    ba = function () {
        d.placename = $("#placename").val().trim();
        d.latitude = Number($("#latitude").val());
        d.longitude = Number($("#longitude").val());
        d.viewLatitude = Number($("#view_latitude").val());
        d.viewLongitude = Number($("#view_longitude").val());
        d.viewTilt = Number($("#view_tilt").val());
        d.viewRoll = Number($("#view_roll").val());
        d.viewAltitude = Number($("#view_altitude").val());
        d.viewHeading = Number($("#view_heading").val());
        "" === d.placename ||
        Number.isNaN(d.latitude) ||
        Number.isNaN(d.longitude) ||
        Number.isNaN(d.viewAltitude)
            ? n("Please supply all required fields.")
            : ($("#suggestion").modal("close"),
              G(function () {
                  n(
                      "Thank you for the geolocation suggestion for '" +
                          d.placename +
                          "'."
                  );
              }));
    };
    G = function (b) {
        $.ajax({
            url: "https://scriptures.byu.edu/mapscrip/suggestpm.php",
            data: d,
            success: function () {
                void 0 !== b && "function" === typeof b && b();
            },
            error: function () {
                n("Error communicating with server.  Suggestion not saved.");
            },
        });
    };
    da = function () {
        var b = Xpath.getSelectionOffset(),
            a = map.getCenter();
        d.latitude = a.lat();
        d.viewLatitude = a.lat();
        d.longitude = a.lng();
        d.viewLongitude = a.lng();
        d.viewAltitude = 450 * map.getZoom();
        "" !== b && void 0 !== u
            ? ((d.placename = window.getSelection().toString()),
              (d.viewTilt = 0),
              (d.viewRoll = 0),
              (d.viewHeading = 0),
              (d.offset = b),
              (d.bookId = q),
              (d.chapter = u),
              delete d.id,
              O())
            : void 0 !== d.id
            ? (delete d.bookId,
              delete d.chapter,
              delete d.offset,
              G(function () {
                  n(
                      "Thank you for the view settings suggestion for " +
                          d.placename +
                          "."
                  );
              }))
            : n("To make a suggestion, first select a placename.");
    };
    ca = function (b, a, e, f, g, h, k, l, m, n) {
        d.id = b;
        d.placename = a;
        d.latitude = e;
        d.longitude = f;
        d.viewLatitude = g;
        d.viewLongitude = h;
        d.viewTilt = k;
        d.viewRoll = l;
        d.viewAltitude = m;
        d.viewHeading = n;
        map.panTo({
            lat: e,
            lng: f,
        });
        map.setZoom(Math.round(m / 450));
    };
    t = function (b, a) {
        return b.tocName + (0 < a ? " " + a : "");
    };
    z = function (b) {
        $("#crumb ul").html(b);
    };
    H = function (b, a, d, f) {
        if (g.hasOwnProperty(a + "In") || g.hasOwnProperty(a + "Out"))
            window.setTimeout(H, 200, b, a, d, f);
        else {
            var c = $(d + " " + f);
            b = $(b);
            0 < c.length
                ? ((g[a + "Out"] = c),
                  c.animate(
                      {
                          opacity: 0,
                      },
                      {
                          queue: !1,
                          duration: 700,
                          complete: function () {
                              c.remove();
                              delete g[a + "Out"];
                          },
                      }
                  ),
                  (g[a + "In"] = b),
                  b
                      .css({
                          opacity: 0,
                      })
                      .appendTo(d),
                  b.animate(
                      {
                          opacity: 1,
                      },
                      {
                          queue: !1,
                          duration: 700,
                          complete: function () {
                              delete g[a + "In"];
                          },
                      }
                  ))
                : $(d).html(b);
        }
    };
    A = function (a) {
        H(a, "scriptures", "#scriptures", "*");
        F(a);
    };
    return {
        about: function () {
            $("#about_site").modal("open");
        },
        cancelSuggestion: function () {
            M();
        },
        closeAbout: function () {
            $("#about_site").modal("close");
        },
        getScripture: function (a) {
            R(a);
        },
        hash: function (a, c, d, f) {
            E(a, c, d, f);
        },
        init: function (a) {
            U(a);
        },
        onHashChanged: function () {
            Z();
        },
        sendSuggestion: function () {
            ba();
        },
        showLocation: function (a, c, d, f, g, h, k, l, m, n) {
            ca(a, c, d, f, g, h, k, l, m, n);
        },
        suggest: function () {
            da();
        },
        volumes: function () {
            return m.slice();
        },
    };
})();
