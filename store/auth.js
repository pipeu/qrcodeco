/* eslint no-undef: "off" */
/* eslint-disable indent,no-unused-vars */

import axios from 'axios'
import store from '~/store/index.js'
import Cookie from 'js-cookie'

let rootPath = '/'
let loginPath = '/admPixCommerce/login'

const API = {
    TOKEN_KEY: 'Authorization'
}

let setAuthToken = (authToken) => {
    axios.defaults.headers.common[API.TOKEN_KEY] = 'Bearer ' + authToken
}

// #feature_17
// Set API with user Store that he want's to execute api functions
let setAPIStoreHeader = (storeId) => {
  // console.log('auth.setAPIStoreHeader:', storeId)
  axios.defaults.headers.common['StoreId'] = storeId
}



let logout = () => {
  console.log('#logout')

    return new Promise((resolve, reject) => {
        console.log('#auth.setAuthToken - after setting Axios Header Authorization header:', axios.defaults.headers.common[API.TOKEN_KEY])

        axios.post('/user/logout/', {headers: {'Content-Type': 'application/json'}}).then((response) => {
            console.log('api logout response success ')
            console.log('Removing Cookies, Reseting local jwt token, userAccount and axios headers')

            Cookie.remove(API.TOKEN_KEY)

            // Backend cookie
            Cookie.remove('cookie_KEEP_CONNECTED')

            delete axios.defaults.headers.common[API.TOKEN_KEY]

            // 30/06/20 - This way store doesnt work because its a new instance of store
            store().dispatch('addAuthToken', null)
            // 30/06/20 - This way store doesnt work because its a new instance of store
            store().state.auth_token = null
            // 30/06/20 - This way store doesnt work because its a new instance of store
            store().dispatch('addUserAccount', null)

            resolve(response)
        }, (error) => {
            console.log('logout failure response', error)
            reject(error)
        })
    })
}

// @deprecated
/**
 * 05/03/18 - Here is a "glue" with Monotlythic back-end, we need pass user request store and access the api with store domain to get User Session if any
 * @param clientRequestDomain
 * @returns {Promise<any>}
 */
let me = () => {
    return new Promise((resolve, reject) => {
        console.log('### me')

        axios.get('/user/me/').then((response) => {
            console.log('data.userAccount Ok ', response.data.userAccount.id)

            // 30/06/20 - This way store doesnt work because its a new instance of store
            store().dispatch('addUserAccount', response.data.userAccount)

            resolve(response)
        }, (error) => {
            reject(error)
        })
    })
}

// let tryUpdateShippingAddress = async (mainAddress) => {}

let isAdmin = (userAccount, pipStore) => {
    return checkedAllowedRoles(userAccount, pipStore, ['ADMIN'])
}

let checkedAllowedRoles = (userAccount, pipStore, allowedRoles) => {
    // console.log('### checkedAllowedRoles', userAccount, allowedRoles)
    if (!userAccount || !userAccount.roles) {
        return false
    }

    let roles = userAccount.roles // get user's role

    // #feature_13
    // Get User Roles from List of Stores Roles this user may have access
    // If User store is different com store get roles from storesRoles
    if (userAccount.storeId !== pipStore.id && userAccount.storesRoles) {
        console.log('<<<<<<<<<<<<<<<<< checkAllowedRoles  User storeId is different from current App Store, setting corrent ROLES from storesRoles >>>>>>>>>>>>>>>> ')
        // console.log('>>> pipStore.id', pipStore.id)
        let storesRoles = userAccount.storesRoles.find(o => o.storeId === pipStore.id)
        if (storesRoles && storesRoles.roles) {
            console.log('>>> found storesRoles.roles', storesRoles.roles)
            roles = storesRoles.roles
        }
    }
    let allowed = allowedRoles.some(r => roles.indexOf(r) >= 0)
    return allowed
}

let unPublishStore = () => {
    return axios.put('/store/unPublish/', {headers: {'Content-Type': 'application/json'}})
}

let publishStore = () => {
    return axios.put('/store/publish/', {headers: {'Content-Type': 'application/json'}})
}


let getTempAliasToken = () => {
  console.log('### getTempAliasToken')
  return axios.get('/user/tempAliasToken/')
}

export default {
    getTempAliasToken,
    isAdmin,
    publishStore,
    unPublishStore,
    logout,
    rootPath,
    loginPath,
    me,
    // initClientSide,
    setAuthToken, setAPIStoreHeader,
    API
}
