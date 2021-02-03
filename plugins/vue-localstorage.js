import Vue from 'vue'
import VueLocalStorage from 'vue-localstorage'

Vue.use(VueLocalStorage, {
  name: 'localStorage',
  bind: true // created computed members from your variable declarations
})
