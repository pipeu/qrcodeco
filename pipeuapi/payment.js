/* eslint-disable indent */
import axios from 'axios'

// #feature_15 - moved to /eventTickets API path
let issueFreeEventTicket = (productEventId, cpf, quantity) => {
  console.log('payment.issueFreeEventTicket ')
  return axios.post('/eventTickets/free/ticket?productEventId=' + productEventId + '&cpf=' + cpf, {headers: {'Content-Type': 'application/json'}})
}

// Timeout in 35 Seconds to simulate async processing in background
// TODO: Implement Queue in Server Side to receive the order and then subscribers process the orders
let processPaymentWithPrincipalCreditCard = (checkout, cpf,
                                             paymentType, installments,
                                             useInvoiceDetails, chargeData) => {

  let data = JSON.stringify({
    checkoutTokenId: checkout.tokenId,
    cpf: cpf,
    paymentType: paymentType,
    installments: installments,
    useInvoiceDetails: useInvoiceDetails,
    chargeData: chargeData,
    usePrincipalCreditCard: true, // Used in API for OCB
    customerNotes: checkout.customerNotes,
    shippingAddressTokenId: checkout.shippingAddressTokenId
  })

  return axios.post('/user/checkout/payment/creditcard/principal', data, {
      timeout: 35000,
      headers: {'Content-Type': 'application/json'}
    })
}

// 20/07/18 - New fields for Charge Data with option for a company input the company charge details
// entityType, registryCode, name,
// 07/08/18 - planId, if greater than 0 then it exists
let createBankSlip = (checkout, cpf,
                      useInvoiceDetails, chargeData) => {
  console.log('api.createBankSlip checkout.tokenId', checkout.tokenId)
  console.log('api.createBankSlip chargeData:', chargeData)
  let data = JSON.stringify({
    checkoutTokenId: checkout.tokenId,
    cpf: cpf,
    useInvoiceDetails: useInvoiceDetails,
    chargeData: chargeData,
    customerNotes: checkout.customerNotes,
    shippingAddressTokenId: checkout.shippingAddressTokenId
  })
  return axios.post('/user/checkout/payment/bankslip/', data, {headers: {'Content-Type': 'application/json'}})
}

let getCheckoutProperties = () => {
  let url = '/user/checkout/properties'
  return axios.get(url, {headers: {'Content-Type': 'application/json'}})
}


let createPaypal = (checkout, cpf) => {
  console.log('api.createPaypal ')

  let data = JSON.stringify({
    checkoutTokenId: checkout.tokenId,
    cpf: cpf,
    customerNotes: checkout.customerNotes,
    shippingAddressTokenId: checkout.shippingAddressTokenId
  })
  return axios.post('/user/checkout/payment/paypal/create', data, {headers: {'Content-Type': 'application/json'}})
}

let processPaypal = (checkout, cpf,
                     paymentID, payerID,
                     orderId) => {
  console.log('api.processPaypal ')

  let data = JSON.stringify({
    checkoutTokenId: checkout.tokenId,
    cpf: cpf,
    paymentID: paymentID,
    payerID: payerID,
    orderId: orderId
  })
  return axios.post('/user/checkout/payment/paypal/process', data, {headers: {'Content-Type': 'application/json'}})
}

let processBankTransfer = (checkout, cpf,
                           useInvoiceDetails, chargeData) => {
  console.log('api.processBankTransfer ')

  let data = JSON.stringify({
    checkoutTokenId: checkout.tokenId,
    cpf: cpf,
    useInvoiceDetails: useInvoiceDetails,
    chargeData: chargeData,
    customerNotes: checkout.customerNotes,
    shippingAddressTokenId: checkout.shippingAddressTokenId
  })
  return axios.post('/user/checkout/payment/wireTransfer', data, {headers: {'Content-Type': 'application/json'}})
}

let processPOS = (checkout, cpf,
                           useInvoiceDetails, chargeData) => {
  console.log('api.processPOS ')

  let data = JSON.stringify({
    checkoutTokenId: checkout.tokenId,
    cpf: cpf,
    useInvoiceDetails: useInvoiceDetails,
    chargeData: chargeData,
    customerNotes: checkout.customerNotes,
    shippingAddressTokenId: checkout.shippingAddressTokenId
  })
  return axios.post('/user/checkout/payment/pos', data, {headers: {'Content-Type': 'application/json'}})
}

// Refactored = 24/06/20
let createPicPay = (checkout, cpf,
                    useInvoiceDetails, chargeData) => {

  console.log('api.createPicPay checkout', checkout)

  let data = JSON.stringify({
    checkoutTokenId: checkout.tokenId,
    cpf: cpf,
    useInvoiceDetails: useInvoiceDetails,
    chargeData: chargeData,
    customerNotes: checkout.customerNotes,
    shippingAddressTokenId: checkout.shippingAddressTokenId
  })

  return axios.post('/user/checkout/payment/picpay/create', data, {headers: {'Content-Type': 'application/json'}})
}



// TODO: Finalize send customerNotes and shippingAddressToken
// For single invoices
let processCreditCard = (checkoutTokenId,
                         flagName, name, month, year, cc, cvv,
                         cpf, paymentType, paymentMethod, installments,
                         useInvoiceDetails, chargeData) => {
  console.log('api.processCreditCard ')

  let data = JSON.stringify({
      checkoutTokenId: checkoutTokenId,
      cpf: cpf,
      paymentType: paymentType,
      installments: installments,
      paymentMethod: paymentMethod,
      creditCard: {
        flagName: flagName,
        name: name,
        month: month,
        year: year,
        cc: cc,
        cvv: cvv
      },
      useInvoiceDetails: useInvoiceDetails,
      chargeData: chargeData
  })
  console.log('data', data)
  return axios.post('/user/checkout/payment/creditcard', data, {headers: {'Content-Type': 'application/json'}})
}


let calculateDiscount = (quantity, productId, code) => {
  console.log('calculateDiscount')
  let url = '/user/checkout/discount'
  let pQuantity = '?quantity=' + quantity
  let pProductId = '&productId=' + productId
  let pCode = '&code=' + code
  url = url + pQuantity + pProductId + pCode
  return axios.get(url, {headers: {'Content-Type': 'application/json'}})
}


let processUserCredit = (checkout, cpf, useInvoiceDetails, chargeData) => {
  console.log('api.processUserCredit ')

  let data = JSON.stringify({
    checkoutTokenId: checkout.tokenId,
    cpf: cpf,
    useInvoiceDetails: useInvoiceDetails,
    chargeData: chargeData,
    customerNotes: checkout.customerNotes,
    shippingAddressTokenId: checkout.shippingAddressTokenId
  })
  return axios.post('/user/checkout/payment/usercredit', data, {headers: {'Content-Type': 'application/json'}})
}

export default {
  calculateDiscount,
  createBankSlip,
  processCreditCard,
  processPaymentWithPrincipalCreditCard,
  processBankTransfer,
  createPaypal,
  processPaypal,
  getCheckoutProperties,
  issueFreeEventTicket,
  createPicPay,
  processPOS,
  processUserCredit,
}
