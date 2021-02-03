import Vue from 'vue'
import axios from 'axios'

let normalizeProductUrl = (name, id) => {
  let finalUrl = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '') // remove accents

  finalUrl = finalUrl.replace(/\s-\s/g, '-') // replace - with spaces by -

  finalUrl = finalUrl.replace(/\s/g, '-') // replace spaces to - (dash)

  finalUrl = finalUrl.replace(',', '')
  finalUrl = finalUrl.replace('%', '')

  finalUrl = finalUrl.toLowerCase()

  finalUrl = finalUrl + '-' + id // append id
  finalUrl = '/cardapio/' + finalUrl
  return finalUrl
}

let getPrincipalMaskedCreditCardSavedByUser = () => {
  return axios.get('/user/account/payment/preferencies/creditCard/principal/masked')
}

let setCreditCardAsPrincipal = (id) => {
  return axios.put('/user/account/payment/preferencies/creditCard/principal/' + id)
}

let deleteCreditCard = (id) => {
  return axios.delete('/user/account/payment/preferencies/creditCard/' + id)
}

let addPrincipalCreditCard = (cc) => {
  return axios.post('/user/account/payment/preferencies/creditCard', cc, {headers: {'Content-Type': 'application/json'}})
}

let getListOfMaskedCreditCardSavedByUser = () => {
  return axios.get('/user/account/payment/preferencies/creditCard')
}

let updateAccount = (user) => {
  return axios.put('/user', user, {headers: {'Content-Type': 'application/json'}})
}


let updateCurrentPass = (currentPass, newPass) => {
  return axios.put('/user/password?currentPass=' + currentPass + '&newPass=' + newPass, {headers: {'Content-Type': 'application/json'}})
}

let resetPassword = (email) => {
  return axios.post('/user/password/reset?email=' + email, {headers: {'Content-Type': 'application/json'}})
}

let verifyFogotEmailLink = (email, code) => {
  return axios.get('/user/password/reset/verifyLink?email=' + email + '&code=' + code)
}


let changePassword = (email, code, newPass) => {
  return axios.put('/user/password/byEmailCode?email=' + email + '&code=' + code + '&newPass=' + newPass, {headers: {'Content-Type': 'application/json'}})
}

//07/06/19
let getOrder = (id) => {
  console.log('api.getOrder')
  return axios.get('/orders/' + id + '/user' + '?includeFields=product,user')
}

let getPicPayOrder = (id) => {
  console.log('api.getPicPayOrder')
  return axios.get('/orders/' + id + '/user' + '?includeFields=product,user,picpay')
}

let getUserOrders = (limit, offset, count) => {
  console.log('api.getUserOrders')
  return axios.get('/user/orders' + '?includeFields=productEvent&limit=' + limit + '&offset=' + offset + '&count=' + count) //TODO: includeFields not implemented on Server
}

// TODO: Create method to normalize common parameters like includeFields and pagination

let getUserTickets = (limit, offset, count) => {
  console.log('api.getUserTickets')
  return axios.get('/user/events/tickets' + '?includeFields=productEvent,event&limit=' + limit + '&offset=' + offset + '&count=' + count)
}


// This API Call uses Pipeu API Composition to get Product and User aggregate
let getEventTicketProductUserByQRCode = (qrCode) => {
  return axios.get('/eventTickets/qrCode/' + qrCode + '?includeFields=productEvent,user,event')
}


let getUserTicketById = (ticketId) => {
  console.log('api.getUserTicketById')
  return axios.get('/user/events/ticket/' + ticketId + '?includeFields=productEvent,event,order')
}


let getUserTicketsByGroupId = (groupId) => {
  console.log('api.getUserTicketsByGroupId')
  return axios.get('/user/events/tickets/group/' + groupId + '?includeFields=productEvent,event,order')
}

let updateEventTicket = (ticketId, ticket) => {
  return axios.put('/user/events/tickets/' + ticketId , ticket, {headers: {'Content-Type': 'application/json'}})
}

let updateMainAddress = (address) => {
  console.log('api.updateMainAddress address:', address)
  return axios.put('/user/address/main/', address, {headers: {'Content-Type': 'application/json'}})
}

let deleteAddress = (addressType, tokenId) => {
  console.log('api.deleteAddress')
  return axios.delete('/user/address/'+addressType+'/' + tokenId)
}

//########################## End refactoring block

let getUserEventTicketsByOrder = (orderId) => {
  return axios.get('/user/events/ticket/order/' + orderId + '?includeFields=productEvent,event,order')
}


/*********************************************************************************************************
 * New Pipeu API v2.0 based on AWS API GATEWAY
 ***********************************************************************************************************/
let PIPEU_V2_API_ADDRESS_SERVICE = 'https://api.pipeu.co/address'
if('development' ===  process.env.NODE_ENV) {
  PIPEU_V2_API_ADDRESS_SERVICE = 'https://dev-api.pipeu.co/address'
}
console.log('Pipeu AWS API Gateway URL:', PIPEU_V2_API_ADDRESS_SERVICE)


let PIPEU_V2_API = 'https://api.pipeu.co'

let getProductV2 = (uuid) => {
  console.log('*** apiv2.getProduct /products/uuid/', uuid)

  return fetch(PIPEU_V2_API + '/products/uuid/' + uuid)
}



let checkStoreMaxRadiusForDelivery = (storeId, address) => {
  console.log('api.checkStoreMaxRadiusForDelivery', storeId, address)
  const instance = axios.create({timeout: 35000})
  return instance.post(PIPEU_V2_API_ADDRESS_SERVICE + '/checkMaxDeliveryRadius', JSON.stringify(address), {
    // Deleting Authorization and StoreId header, because we have one as global Axios config and Amazon does not play nice with it.
    transformRequest: [function (data, headers) {
      headers.common = {}
      return data
    }]
  })
}

let fetchZipCode = (zipCode) => {
  console.log('fetchZipCode')
  let fetchUrl = 'https://viacep.com.br/ws/' + zipCode + '/json/'
  return axios.get(fetchUrl, {
    transformRequest: [function (data, headers) {
      headers.common = {}
      return data
    }]
  })
}

let getMe = () => {
  console.log('api.getMe')
  return axios.get('/user/me/')
}

let register = (email, fullName, mobilePhone, password, affiliateAdId, affiliateId) => {
  let data = JSON.stringify({
    email: email,
    fullName: fullName,
    mobilePhone: mobilePhone,
    password: password,
    affiliateAdId: affiliateAdId,
    affiliateId: affiliateId
  })
  return axios.post('/user/signup', data, {headers: {'Content-Type': 'application/json'}})
}

// 08/01/19 - Refact
let updateOrderProductDeliveryAddress = (orderId, address) => {
  console.log('api.updateOrderProductDeliveryAddress orderId:', orderId)
  console.log('api.updateOrderProductDeliveryAddress address:', address)
  return axios.put('/user/order/' + orderId + '/updateProductDeliveryAddress/', address, {headers: {'Content-Type': 'application/json'}})
}

// Get one Product from a LinkedGroupedProduct type based on the products rules lke endData and StartDate
let getLinkedProductGroupByGroupId = (groupId) => {
  console.log('api.getLinkedProductGroupByGroupId groupId', groupId)
  return axios.get(`/products/group/linkedproductgroup/${groupId}`)
}

let getProductGroupById = (groupId) => {
  console.log('api.getProductGroupById groupId', groupId)
  return axios.get(`/products/group/${groupId}`)
}

let getProduct = (id, productType) => {
    console.log('api.getProduct', id)
    let typePath = ''
    if (productType == 1000) {
      typePath = 'events/'
    }
    return axios.get('/products/' + typePath + id)
}

let getProductsQuery = (type, keyword, listOfIds) => {
  return axios.get('/products/query', {
    params: {
      type: type,
      keyword: keyword,
      ids: listOfIds
    }
  })
}

let getPlan = (id) => {
    console.log('api.getPlan', id)
    return axios.get('/plans/' + id)
}

let getAllEvents = () => {
    console.log('api.getAllEvents')
    return axios.get('/events/list')
}

let getPlansActive = () => {
    console.log('api.getPlansActive')
    return axios.get('/plans/active/all')
}


let getChildStoresList = () => {
  return axios.get('/store/marketplace/childStore/list')
}

// type IMAGE, or type FILE generic protected file
let getSignedURL = (fileName, type) => {
  console.log('getSignedURL fileName', fileName)
  console.log('getSignedURL type', type)

  return axios.get('/files/getsignedurls3upload?fileName=' + fileName + '&type=' + type)
    .then((res) => {
      console.log('__________lambda after get signed upload url res.data.fileURL:', res.data.fileURL)
      console.log(`/files/getsignedurls3upload?fileName=${fileName}`, res.data.fileURL)

      return Promise.resolve(res.data.fileURL || '/')
    })
    .catch((err) => {
      console.error(err)
      return Promise.reject('/')
    })
}

// Notify pipeu api file upload success to set permissions
let notifyFileUploadSuccessGetFullURL = (fileName, type) => {
  console.log('notifyFileUploadSuccessGetFullURL file', fileName)
  console.log('notifyFileUploadSuccessGetFullURL type', type)
  return axios.put('/files/notifyFileUploadSuccessGetFullURL?fileName=' + fileName + '&type=' + type)
}

let updateProfilePhoto = (profilePhoto) => {
  console.log('api.updateProfilePhoto')
  return axios.put('/user/profile/photo', profilePhoto)
}

let duplicateCheckout = (checkoutTokenId) => {
  console.log('api.duplicateCheckout ', checkoutTokenId)
  return axios.post('/user/checkout/duplicate/' + checkoutTokenId, {headers: {'Content-Type': 'application/json'}})
}

let getCreditBalance = () => {
  return axios.get('/user/credit/balance')
}


export default {
  getProductGroupById,
  updateProfilePhoto,
  getSignedURL, notifyFileUploadSuccessGetFullURL,
  getChildStoresList,
  getPrincipalMaskedCreditCardSavedByUser, setCreditCardAsPrincipal, deleteCreditCard, addPrincipalCreditCard, getListOfMaskedCreditCardSavedByUser,
  updateAccount, updateCurrentPass,
  resetPassword, verifyFogotEmailLink, changePassword,
  getUserOrders, getOrder, getPicPayOrder,
  getUserTickets, getUserTicketsByGroupId, updateEventTicket, getUserTicketById, getUserEventTicketsByOrder, getEventTicketProductUserByQRCode,
  updateMainAddress, deleteAddress, // New path /user -> #refactoring_1
  duplicateCheckout,

  getMe,
  register,
  fetchZipCode, checkStoreMaxRadiusForDelivery,
  getProduct, getLinkedProductGroupByGroupId, getProductsQuery,
  getPlan,
  getAllEvents,
  getPlansActive,
  updateOrderProductDeliveryAddress,

  getProductV2,

  normalizeProductUrl,

  getCreditBalance
}
