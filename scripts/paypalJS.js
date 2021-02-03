/* eslint-disable prefer-promise-reject-errors */
// paypal-checkout.js - external dependency

/* eslint-disable */
function loadJSAsync(e, n, o) {
    const t = document,
        a = "script",
        i = t.createElement(a),
        r = t.getElementsByTagName(a)[0];
    i.src = "//" + e, n && i.addEventListener("load", function (e) {
        n(null, e)
    }, !1), o && i.addEventListener("error", function (e) {
        o(e)
    }, !1), r.parentNode.insertBefore(i, r)
}

let defer
function get () {
  if (defer === undefined) {
    defer = new Promise((resolve, reject) => {
      loadJSAsync('www.paypalobjects.com/api/checkout.js',
        () => resolve(window.paypal),
        () => reject())
    })
  }
  return defer
}

const paypalcheckout = {
  get
}

export default paypalcheckout
