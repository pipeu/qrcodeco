/* eslint-disable no-multiple-empty-lines,indent */

/* global fbq */
function attachPixel (pixelId) {
  // console.log('### FaceBook Pixel Enabled: attachPixel', pixelId)
  try {
    if (typeof window !== 'undefined') {
      ((f, b, e, v, n, t, s) => {
        if (f.fbq) return;
        n = f.fbq = function () {
          n.callMethod
            ? n.callMethod.apply(n, arguments) : n.queue.push(arguments)
        }
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = !0;
        n.version = '2.0'
        n.queue = []
        t = b.createElement(e)
        t.async = true
        t.defer = true
        t.src = v
        s = b.getElementsByTagName('body')[0]
        s.parentNode.appendChild(t, s)

        fbq('init', pixelId)
        fbq('track', 'PageView')
      })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js')
    }
  }catch (e) {
    console.error('Error attaching fb pixel e', e)
  }
}

function trackEvent (eventTrack) {
  console.log('trackEvent', eventTrack)
  try {
    fbq('track', eventTrack)
  }catch (e) {
    console.error('Error on track fb event e', e)
  }
}

// i.e 'Purchase', { value: 10, currency: 'BRL'}
function trackPurchase (value, currency) {
  console.log('trackPurchase', value, currency)
  try {
    fbq('track', 'Purchase', {
      value: value,
      currency: currency
    })
  }catch (e) {
    console.error('Error on track Purchase fb event e', e)
  }

}

export default {
  attachPixel, trackEvent, trackPurchase
}
