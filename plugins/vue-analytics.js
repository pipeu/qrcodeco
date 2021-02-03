/* eslint-disable */
import Vue from 'vue'
import VueAnalytics from 'vue-analytics'

console.log('##### vue-analytics plugin #####')
export default ({ app, store, req }) => {
    let fetchURL
    // console.log('### vue-analytics plugin getDomain:', store.getters.getDomain)
    // console.log('### vue-analytics plugin getStore:', store.getters.getStore)
    if (process.env.NODE_ENV === 'development') {
      fetchURL = process.env.DEV_PIPEU_API_URL
    } else {
      // fetchURL = 'https://' + store.getters.getDomain + '/rest/api/1.0'
      fetchURL = process.env.PIPEU_API_URL
    }
    console.log('### vue-analytics fetchURL: ', fetchURL)

    // Every time the route changes (fired on initialization too)
    if (process.client) {
      let router = app.router

      let storeId = store.getters.getStore.id
      console.log('storeId to use in fetch /storeintegration/ga', storeId)

      Vue.use(VueAnalytics, {
        id: () => fetch(fetchURL + '/storeintegration/ga',{
            headers: {
                'StoreId': storeId
            }
        }).then(res => res.json()).then(data => {
          console.log('@@@@@@@ Fetch Pipeu StoreIntegration Rest /storeintegration/ga result: ', data)

          if (data && data.paramEnabled) {
            return data.paramValue
          } else {
            return '';
          }
        }),
        router
      })
    }
}

