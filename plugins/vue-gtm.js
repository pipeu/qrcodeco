import Vue from 'vue'
import VueGtm from 'vue-gtm'

export default ({ app, store, req }) => {
  console.log('>>> Installing vue-gtm plugin')
  Vue.use(VueGtm, {
    id: 'GTM-5NB8QNG', // Your GTM single container ID or array of container ids ['GTM-xxxxxxx', 'GTM-yyyyyyy']
    defer: false, // defaults to false. Script can be set to `defer` to increase page-load-time at the cost of less accurate results (in case visitor leaves before script is loaded, which is unlikely but possible)
    enabled: true, // defaults to true. Plugin can be disabled by setting this to false for Ex: enabled: !!GDPR_Cookie (optional)
    debug: true, // Whether or not display console logs debugs (optional)
    loadScript: true // Whether or not to load the GTM Script (Helpful if you are including GTM manually, but need the dataLayer functionality in your components) (optional)
  });

}
