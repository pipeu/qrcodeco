/* eslint-disable indent,spaced-comment,no-multi-spaces,padded-blocks,no-multiple-empty-lines, no-trailing-spaces, eqeqeq */
import Vuex from 'vuex'
import Vue from 'vue'
import axios from 'axios'
import auth from '~/store/auth.js'
import Cookies from 'universal-cookie'
import Cookie from "js-cookie";
import communications from '~/pipeuapi/communications'
import api from '@/pipeuapi/api'

const createStore = () => {
    return new Vuex.Store({

    state: {
        customerAddress: null, // holds Customer Address

        order: null, //hold current order been processed, if it exists
        checkout: null, //Hold the current or previously saved on API Checkout with selected Products and Configuration
        userHasPrincipalValidCreditCard: false,

        fullScreen: false,
        installedAppsTemplates: [],
        authorizedAppsModules: [],

        domain: null, // will hold current domain been request from client
        counter: 0,
        store: null,
        userAccount: null,
        userLogged: false,
        auth_token: null,
        products: [],
        pages: [],
        plans: [],

        processing: false,
        defaultPage: null,

        AFID: 0,
        AFAID: 0,
        cardapio: null,
        firstAccess: false,
        creditBalance: 0
    },

    mutations: {
        setCreditBalance: function (state, data) {
          state.creditBalance = data
        },

        setFirstAccess: function (state, data) {
          state.firstAccess = data
        },

        setAFID: function (state, data) {
            state.AFID = data
        },
        setAFAID: function (state, data) {
            state.AFAID = data
        },

        setCardapio: function (state, data) {
          state.cardapio = data
        },

        setCustomerAddress: function (state, data) {
          state.customerAddress = data
        },

        setOrder: function (state, data) {
          state.order = data
        },

        setUserHasPrincipalValidCreditCard: function (state, data) {
          state.userHasPrincipalValidCreditCard = data
        },

        setCheckout: function (state, data) {
          state.checkout = data
        },

        setCheckoutCustomerNotes: function (state, data) {
            state.checkout.customerNotes = data
        },

        setCheckoutShippingAddressToken: function (state, data) {
            state.checkout.shippingAddressTokenId = data
        },

        toggleFullScreen: function (state) {
          state.fullScreen = ! state.fullScreen
        },

        setDomain: function (state, data) {
            state.domain = data
        },

        increment (state) {
          state.counter++
        },
        setStore: function (state, data) {
          state.store = data
        },

        setDefaultPage: function (state, data) {
          state.defaultPage = data
        },

        addPage (state, page) {
            // mutate state
            state.pages.push(page)
        },

        SET_USER_ACCOUNT: function (state, data) {
            state.userAccount = data
        },
        SET_AUTH_TOKEN: function (state, data) {
            state.auth_token = data
        },

        SET_PRODUCTS: function (state, data) {
            state.products = data
        },

        // 07/08/18 new
        ADD_PRODUCT: function (state, data) {
            state.products.push(data)
        },

        SET_PLANS: function (state, data) {
            state.plans = data
        },

        ADD_PLAN: function (state, data) {
            state.plans.push(data)
        },

        toggleProcessing: function (state) {
          // console.log('##### vuex.mutations.toggleProcessing')
          state.processing = ! state.processing
        }
    },

    getters: {
        getCreditBalance: state => {
          return state.creditBalance
        },

        isFirstAccess: state => {
          console.log('isFirstAccess accessed:', state.firstAccess)
          return state.firstAccess
        },

        getAFID: state => {
            return state.AFID
        },
        getAFAID: state => {
            return state.AFAID
        },

        getCardapio: state => {
          return state.cardapio
        },

        getCustomerAddress: state => {
          return state.customerAddress
        },

        getOrder: state => {
          return state.order
        },

        userHasPrincipalValidCreditCard: state => {
          return state.userHasPrincipalValidCreditCard
        },

        getCheckout: state => {
          return state.checkout
        },

        isFullScreen: state => {
          return state.fullScreen
        },

        getAppTemplateInstalled: state => param => {
          // console.log('### getAppTemplateInstalled', param)
          let appTemplate = Object.values(state.installedAppsTemplates).find(appTemplate => appTemplate.id === param)
          //console.log('#### state.installedAppsTemplates', state.installedAppsTemplates)

          return appTemplate
        },

        getAuthorizedAppsModules: state => {
          return state.authorizedAppsModules
        },

        getDomain: state => {
            return state.domain
        },
        getStore: state => {
            return state.store
        },

        getDefaultPage: state => {
          return state.defaultPage
        },

        getUserAccount: state => {
            return state.userAccount
        },
        isUserLogged: state => {
            return state.userLogged
        },
        getAuthToken: state => {
            return state.auth_token
        },

        getProducts: state => {
            return state.products
        },
        getProductsByDetailPageURL: state => param => {
            let foundProduct = Object.values(state.products).find(product => product.detailPageURL === param)
            // console.log('#### state.installedAppsTemplates', state.installedAppsTemplates)
            // console.log('#### Array.from(state.installedAppsTemplates)', Array.from(state.installedAppsTemplates))
            console.dir(foundProduct)
            return foundProduct
        },
        getPageByAliasCodeUrl: state => param => {
            console.log('### getPageByAliasCodeUrl param:', param)
            // wpages.data.pageByAliasCodeURL['home']
            // return state.installedAppsTemplates.filter(appTemplate => appTemplate.id===10)
            // let foundPage = state.pages[param]
            let foundPage = Object.values(state.pages).find(page => page.aliasCodeURL === param)

            return foundPage
        },
        getProductsById: state => param => {
            console.log('### getProductsById', param)

            let foundProduct = state.products[param]
            console.log('foundProduct: ', foundProduct)
            return foundProduct
        },

        getPlanById: state => param => {
            console.log('### getPlanById', param)
            // console.log('### state.plans', state.plans)

            // let foundPlan = Object.values(state.plans).find(plan => plan.id === param)
            var foundPlan = state.plans.find(plan => plan.id == param)
            // console.log('foundPlan: ', foundPlan)

            // foundPlan = state.plans.find(function (element) {
            //     console.log('inside Array.find : ', element)
            //     console.log('inside Array.element.id : ', element.id)
            //     console.log('inside Array.find element.id == param: ', element.id == param)
            //     return element.id == param
            // })
            // console.log('foundPlan: ', foundPlan)

            return foundPlan
        },
        getPlans: state => {
            return state.plans
        },

        getUserBillingAddress: state => {
            let user = state.userAccount
            let address
            // If found the billing or shipping address entity then get it, otherwhise get from UserAccount personal data entity (user personal address)
            if (user && user.mainBillingAddress && user.mainBillingAddress.address) {
                address = user.mainBillingAddress
            } else if (user && user.mainShippingAddress && user.mainShippingAddress.address) {
                address = user.mainShippingAddress
            } else {
                // console.log('### NOT Found mainShippingAddress at user entity getUserAccount, getting personal Data')
                address = {}
                address.tokenId = 0
                if (user && user.zipCode) {
                    address.zipCode = user.zipCode
                    address.address = user.address
                    address.addressNumber = user.addressNumber
                    address.addressNumberComp = user.addressNumberComp
                    address.neighborhood = user.neighborhood
                    address.city = user.city
                    address.state = user.state
                    address.country = user.country
                }
            }
            return address
        },

        isProcessing: state => {
          return state.processing
        }
    },

    actions: {
      async getSetCreditBalance ({ commit }) {
        try {

          let {data} = await api.getCreditBalance()
          console.log('getSetCreditBalance data', data)
          commit('setCreditBalance', data)
          return data

        } catch (e) {
          console.error(e)
          return 0
        }
      },

      addFirstAccess ({ commit }, data) {
        commit('setFirstAccess', data)
      },

      addAFID ({ commit }, data) {
          commit('setAFID', data)
      },
      addAFAID ({ commit }, data) {
          commit('setAFAID', data)
      },

      addCardapio ({ commit }, data) {
        commit('setCardapio', data)
      },

      async updateCustomerAddress ({ commit }, data) {
          Vue.localStorage.set('customerAddress', JSON.stringify(data))
          commit('setCustomerAddress', data)
      },

      updateOrder ({ commit }, data) {
        commit('setOrder', data)
      },

      updateCheckout ({ commit }, data) {
        commit('setCheckout', data)
      },

      updateCheckoutCustomerNotes ({ commit, dispatch, state }, data) {
        commit('setCheckoutCustomerNotes', data)
      },

      async updateCheckoutShippingAddressToken ({ commit, dispatch, state }, data) {
        commit('setCheckoutShippingAddressToken', data)
        return state.checkout
      },

      // TODO: Move this and another related checkout and products items to a specialized Vuex Class
      async userHasPrincipalValidCreditCard ({ commit }) {
        // console.log('store.actions.userHasPrincipalValidCreditCard')
        try {
          let res = await axios.get('/user/account/payment/preferencies/creditCard/principal/valid')
          commit('setUserHasPrincipalValidCreditCard', res.data)
          return res.data
        } catch (e) {
          throw e
        }
      },

        async addCheckout ({ commit }, data) {
            console.log('>>>>> store.actions.addCheckout data', data)
            // TODO: Transfer this to a Service Class, like AuthService
            Cookie.set('checkoutTokenId', data.tokenId, { path: '/' });
            commit('setCheckout', data)
        },

      async deleteCheckout ({ commit, dispatch, state }) {
        // console.log('>>>>> store.actions.deleteCheckout')
        try {
          await dispatch('updateCheckout', null)
          return true
        } catch (e) {
          throw e
        }
      },

      async getCheckoutByTokenId ({ commit }, checkoutTokenId) {
          // console.log('store.actions.getCheckoutByTokenId  checkoutTokenId =>' + checkoutTokenId)
          try {
            let res = await axios.get('/user/checkout/items/' + checkoutTokenId)
            commit('setCheckout', res.data)
            return res
          } catch (e) {
            throw e
          }
      },

      // Create a new checkout for PlanSubscription
      async addPlanSubscriptionToCart ({ commit }, planId) {
        try {
          let res = await axios.post('/user/checkout/items/planSubscription/' + planId, {headers: {'Content-Type': 'application/json'}})
          commit('setCheckout', res.data)
          return res
        } catch (e) {
          throw e
        }
      },

      // Create a new checkout
      async addUpdateCartItem ({ commit, dispatch, state }, data) {
        try {
          if (state.checkout && state.checkout.items && state.checkout.items.length > 0) {
            return await dispatch('updateCartItem', {checkoutTokenId: state.checkout.tokenId, item: data})
          } else {
            return await dispatch('addCartItem', data) //
          }
        } catch (e) {
          console.log('Error on index.addUpdateCartItem in store.index', e)
          throw e
        }
      },

      // Create a new checkout
      async addCartItem ({ commit, state }, data) {
          console.log('addCartItem')
          try {

              // Add aditional info like sales origin
              if ( Vue.localStorage.get('AFAID') ) {
                  data.affiliateAdId = Vue.localStorage.get('AFAID')
              }
              // Add aditional info like sales origin
              if ( Vue.localStorage.get('AFID') ) {
                  data.affiliateId = Vue.localStorage.get('AFID')
              }

              console.log('state.userAccount', state.userAccount)
              // Setting user uuid on checkout
              if (state.userAccount && state.userAccount.uuid) {

                  console.log('Setting userUUID on OrderItem:', state.userAccount.uuid)

                  data.userUuid = state.userAccount.uuid
              }

              let res = await axios.post('/user/checkout', data, {headers: {'Content-Type': 'application/json'}})

              // TODO: Transfer this to a Service Class, like AuthService
              Cookie.set('checkoutTokenId', res.data.tokenId, { path: '/' });
              commit('setCheckout', res.data)

              return res

          } catch (e) {
            throw e
          }
      },
      async updateCartItem ({ commit, state }, data) {
        try {
          let res = await axios.put('/user/checkout/items/' + data.checkoutTokenId, data.item, {headers: {'Content-Type': 'application/json'}})
          commit('setCheckout', res.data)
          return res
        } catch (e) {
          console.log('Error index.updateCartItem in store.index', e)
          throw e
        }
      },

        //@Deprecated
        async updateDeliveryDateOptions ({ commit }, data) {
            console.log('updateDeliveryDateOptions data', data)
            try {
                let res = await axios.put('/user/checkout/deliveryDateOptions/' + data.tokenId + '?selectedDeliveryDay=' + data.selectedDeliveryDay + '&selectedDeliveryPeriod=' + data.selectedDeliveryPeriod, {headers: {'Content-Type': 'application/json'}})
                commit('setCheckout', res.data)
                return res
            } catch (e) {
                console.log('Error index.updateDeliveryDateOptions in store.index', e)
                throw e
            }
        },

        // 08/07/20
        // Update checkout Options
        async updateCheckoutOptions ({ commit }, data) {
            console.log('updateCheckoutOptions on serverside data', data)
            try {
                let res = await axios.put('/user/checkout/' + data.tokenId, data, {headers: {'Content-Type': 'application/json'}})

                commit('setCheckout', res.data)
                return res
            } catch (e) {
                console.log('Error index.updateCheckoutOptions in store.index', e)
                throw e
            }
        },


        async deleteCartItem ({ commit }, data) {
        try {
          let res = await axios.delete('/user/checkout/' + data.checkoutTokenId + '/item/' + data.item.productId, {headers: {'Content-Type': 'application/json'}})
          commit('setCheckout', res.data)
          return res
        } catch (e) {
          throw e
        }
      },

      async applyCartDiscount ({ commit }, data) {
        try {
          let res = await axios.put('/user/checkout/items/' + data.checkoutTokenId + '/discount/' + data.discountCode, {headers: {'Content-Type': 'application/json'}})
          commit('setCheckout', res.data)
          return res
        } catch (e) {
          throw e
        }
      },


      async login ({ commit, dispatch }, data) {
        try {
          let res = await axios.post('/user/login', data, {headers: {'Content-Type': 'application/json'}})

          await dispatch('addUserAccount', res.data.userAccount)
          return res
        } catch (e) {
          console.log('error on vuex index.login', e)
          throw e
        }
      },


      async getMe ({ commit, dispatch }) {
        try {
          let {data} = await api.getMe()

          await dispatch('addUserAccount', data.userAccount)

          return data.userAccount
        } catch (e) {
          console.log('error on vuex getMe', e)
          throw e
        }
      },

        addStore ({ commit }, data) {
            commit('setStore', data)
        },
        addUserAccount ({ commit }, data) {
            commit('SET_USER_ACCOUNT', data)
        },
        addAuthToken ({ commit }, data) {
            commit('SET_AUTH_TOKEN', data)
        },

        // 07/08/18 new
        setProducts ({ commit }, data) {
            commit('SET_PRODUCTS', data)
        },
        addProduct ({ commit }, data) {
            commit('ADD_PRODUCT', data)
        },

        setPlans ({ commit }, data) {
            commit('SET_PLANS', data)
        },
        addPlan ({ commit }, data) {
            commit('ADD_PLAN', data)
        },

        async nuxtServerInit ({commit, dispatch, state, getters}, { req, query }) {
            console.log('                                       ')
            console.log('                                       ')
            console.log('                                       ')
            console.log('                                       ')
            console.log('                                       ')
            console.log('                                       ')
            console.log('                                       ')
            console.log('                                       ')
            console.log('### nuxtServerInit version:', process.env.version)

            // With SPA when we go back to home for instance there is no req from server, then there is no req object
            let clientDomainRequest

            if (req && req.hostname) {
                clientDomainRequest = req.hostname
            } else {
                clientDomainRequest = getters.getDomain
            }

            clientDomainRequest = process.env.storeUrl
            console.log('serverless.environment.storeUrl', process.env.storeUrl)
            if (!process.env.storeUrl) {
              console.log('Not found serverless.env.storeUrl aplying hard coded for tests')
              clientDomainRequest = 'coze.com.br'
            }

          // console.log('process.env.NODE_ENV', process.env.NODE_ENV)
          // console.log('process.env.stage', process.env.stage)
          // || process.env.stage == 'dev' || process.env.stage == 'staging'
          if (process.env.NODE_ENV === 'development') {
                clientDomainRequest = process.env.DEVELOPMENT_STORE_DOMAIN
                console.log('development mode using clientDomainRequest for tests', clientDomainRequest)

                axios.defaults.baseURL = process.env.DEV_PIPEU_API_URL

            } else {
                axios.defaults.baseURL = process.env.PIPEU_API_URL
            }
            // console.log('### nuxtServerInit Setting Pipeu API on axios.baseURL to:', axios.defaults.baseURL)

            let wstore

            // 16/12/18 - Investigate why this line here fix the issue related to undefined StoreId header on Axios
            auth.setAPIStoreHeader('')

            try {
                // This code runs on the same server as this script (Universal js)
                wstore = await axios.get('/store/' + clientDomainRequest)
                commit('setDomain', clientDomainRequest)

                // console.log('After getStore from pipeu API', wstore.data)

                commit('setStore', wstore.data)

            } catch (e) {
                console.log('nuxtServerInit error getting /api/store/', e)
            } finally {
            }

            // Set AXIOS Default Header for API WhiteLabel (optional)
            auth.setAPIStoreHeader(wstore.data.id)

            const inBrowser = typeof window !== 'undefined'

             let cookies
             if (inBrowser) {
                 cookies = new Cookies()
             } else {
                 cookies = new Cookies(req.headers.cookie)
             }

            let accessToken = cookies.get(auth.API.TOKEN_KEY)
            if (accessToken && accessToken != '' && accessToken != 'undefined' && getters.getUserAccount == null) {
              auth.setAuthToken(accessToken)
              commit('SET_AUTH_TOKEN', accessToken)
              try {
                let userAccount = await dispatch('getMe')
                // console.log('>>> nuxtServerInit after dispatch getMe userAccount.id, fullName:', userAccount.id, userAccount.fullName)

                await dispatch('getUserObjects')

              } catch (e) {
                  console.log('nuxtServerInit error getting authService.me() ', e)
              }
            }

            // Marketing and Affiliates Analytics
            if (query.AFID) {
                try {
                    commit('setAFID', query.AFID)
                } catch (e) {
                    console.log('Error storing AFID')
                }
            }

            if (query.AFAID) {
                try {
                    commit('setAFAID', query.AFAID)
                } catch (e) {
                    console.log('Error storing AFAID')
                }
            }
        },

        // Get Some User Information / properties / objects
        async getUserObjects ({ commit, dispatch, state, getters }) {
          try {
            let userHasPrincipalValidCC = await dispatch('userHasPrincipalValidCreditCard')
          } catch (e) {
            console.log(e) // // We can ignore if we can't get this info
          }
        },

        async nuxtClientInit ({ commit, state, getters, dispatch }, { req, app }) {

            if (getters.getAuthToken) {
                auth.setAuthToken(getters.getAuthToken)
            }

            if (getters.getAFID) {
                Vue.localStorage.set('AFID', getters.getAFID)
            }
            if (getters.getAFAID) {
                Vue.localStorage.set('AFAID', getters.getAFAID)
            }

            let puserId = null
            if (getters.getUserAccount && getters.getUserAccount.id > 0) {
                // console.log(`getters.getUserAccount.id ${getters.getUserAccount.id}`)
                Vue.localStorage.set('userId', getters.getUserAccount.id)
                puserId = getters.getUserAccount.id
            }

            // console.log('nuxtClientInit getters.getDomain', getters.getDomain)

            // Get cookies and set on vuex
            let customerAddress = Vue.localStorage.get('customerAddress') // every item got from localStorage is a string, attention here
            if (customerAddress) {
                await dispatch('updateCustomerAddress', JSON.parse(customerAddress))
            }

            if (process.env.NODE_ENV === 'development') {
                axios.defaults.baseURL = process.env.DEV_PIPEU_API_URL

            } else {
                axios.defaults.baseURL = process.env.PIPEU_API_URL
            }

            console.log('### nuxtClientInit Setting axios.baseURL to:', axios.defaults.baseURL)

            // Set AXIOS Default Header for API WhiteLabel (optional)
            auth.setAPIStoreHeader(getters.getStore.id)

            // init communications api
            // 23/01/18 - Disabled one signal and pipeu leads integration due to no team members to continue the project
            // communications.initUUID(getters.getStore.id, puserId).then((userUUID) => {
            //     let clientIntegrations = getters.getStore.clientSideIntegrations
            //     // console.log('### nuxtClientInit Mixins -> clientIntegrations', clientIntegrations)
            //     if (clientIntegrations) {
            //       let oneSignalAppParam = clientIntegrations.find(item => item.paramName === 'ONE_SIGNAL_APP_ID')
            //       if (oneSignalAppParam && oneSignalAppParam.paramEnabled) {
            //         let oneSignalAppId = oneSignalAppParam.paramValue
            //         console.log('>>> oneSignalAppId:', oneSignalAppId)
            //
            //         // onesignal part
            //         communications.registerOnesignal(userUUID, getters.getDomain, oneSignalAppId)
            //
            //       }
            //     }
            // })
            // .catch((e) => {
            //     console.log(e)
            // })

        }
    }

    })
}
export default createStore
