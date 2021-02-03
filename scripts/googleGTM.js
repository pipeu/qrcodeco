import { loadScript } from '~/utils/helpers.js'

/* eslint-disable indent,space-before-function-paren,no-unused-vars,no-trailing-spaces,no-multiple-empty-lines,padded-blocks,no-global-assign */
/* global gtm */
/* global dataLayer */

function sendEvent (eventObj) {
    console.log('### GTM >>> sendEvent', eventObj)

    window['dataLayer'].push(eventObj)

}

function attach (gtmId, initialEvent) {
    console.log('##### googleGTM.js attach Id', gtmId)
    console.log('initialEvent', initialEvent)

    // console.log('###########################')
    // console.log('### Google Tag Manager Enabled ')
    // console.log('###########################')

    // dataLayer = [{
    //     'pageCategory': 'signup',
    //     'visitorType': 'high-value'
    // }];

    window['dataLayer'] = window['dataLayer'] || []
    window['dataLayer'].push({event: 'gtm.js', 'gtm.start': new Date().getTime()})


    if (initialEvent) {
        console.log('### GTM >>> pushing initialEvent', initialEvent)
        window['dataLayer'].push(initialEvent)
    }

    // This bellow worked very fine !!!
    // window['dataLayer'].push({event: 'pipeu_checkout_conv', 'pipeu_checkout_conv_value': 99})

    const options = {
        id: gtmId,
        layer: 'dataLayer',
        pageTracking: true,
        env: {}, // env is supported for backward compability and is alias of query
        query: {}
    }

    // Don't include when no GTM id is given
    if (!options.id) {
        return
    }

    // Build the <script> URL
    const queryParams = Object.assign({}, options.env, options.query)

    queryParams.id = options.id

    if (options.layer) {
        queryParams.l = options.layer
    }

    const queryString = Object.keys(queryParams)
        .filter(key => queryParams[key] !== null && queryParams[key] !== undefined)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`)
        .join('&')

    // Add google tag manager script to head
    console.log('### Adding GTM to Head')

    let resource = '//www.googletagmanager.com/gtm.js' + '?' + queryString

    // if (shouldGaLoad() && (!window.ga || !disableScriptLoader)) {
        loadScript(resource).catch(() => {
            console.error(
                `[vue-analytics] An error occured trying to load ${resource}. Please check your connection ` +
                `or if you have any Google Analytics blocker installed in your browser.`
            )
        })
    // }

}

export default {
    attach, sendEvent
}

// 'Purchase', {
//     value: 10,
//     currency: 'BRL'
// }
// function trackEvent (eventTrack) {
//     console.log('track', eventTrack)
//     fbq('track', eventTrack)
// }
//
// function trackPurchase (value, currency) {
//     console.log('trackPurchase', value, currency)
//
//     fbq('track', 'Purchase', {
//         value: value,
//         currency: currency
//     })
// }
//
