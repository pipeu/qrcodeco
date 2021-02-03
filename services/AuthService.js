import Cookie from "js-cookie"
import axios from "axios/index"
import api from '~/pipeuapi/api.js'

export default class AuthService {

  static get PIPEU_API_KEY() {
    return 'Authorization'
  }

  constructor(store) {
    this.store = store
  }

  setAuthToken (authToken) {
    axios.defaults.headers.common[AuthService.PIPEU_API_KEY] = 'Bearer ' + authToken
  }

  async login(username, password) {
    try {
      let response = await this.store.dispatch('login', {password: password, email: username})

      let jwt = response.data.userAccount.token

      this.setAuthToken(jwt)

      // 27/03/18 - Set token on Cookie for SSR (if user do a refresh on browser for instance)
      Cookie.set(AuthService.PIPEU_API_KEY, jwt) // saving token in cookie for server rendering

      // 13/07/20 - Setting StoreId related to the Authorization token
      Cookie.set('AuthorizationStoreId', response.data.userAccount.storeId)

      Cookie.set('cookie_KEEP_CONNECTED', '1')

      await this.store.dispatch('addAuthToken', jwt)

      try {
        await this.store.dispatch('getUserObjects')
      } catch (e) {
        console.log(e) // We can ignore if we can't get this info
      }

      return response

      } catch (e) {
        console.log('error on AuthService.login', e)
        throw e
      }
    }

    async tryUpdateShippingAddress() {
      try {
        // If user verified address than try to update customer main shipping address
        // console.log('after getting customerAddress from local storage customerAddress:', localStorage.customerAddress)
        if ( localStorage.customerAddress ) {
          let address = JSON.parse( localStorage.customerAddress ) // every item got from localStorage is a string, attention here

          address.mainAddress = true
          address.userConfirmedMainAddress = true

          let updateAddressRes = await axios.put('/user/address/main/', address, {headers: {'Content-Type': 'application/json'}})

          let {data} = await api.getMe() // refresh user account to get all addresses

          await this.store.dispatch('addUserAccount', data.userAccount)
        }

      } catch (e) {
        console.log('error on AuthService.tryUpdateShippingAddress', e)
      }
    }


}
