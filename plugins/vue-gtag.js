/* eslint-disable */
import Vue from 'vue'
import VueGtag from 'vue-gtag'

console.log('##### vue-gtag plugin #####')
export default ({ app, store, req }) => {
  // console.log('>>> Installing plugin vue-gtag')

    Vue.use(VueGtag, {
      config: { id: "UA-161417078-1" },
      onAfterTrack () {
        console.log('===> Vue-gtag - AfterTrack hook')
      },
      bootstrap: true
    }, app.router)

}

