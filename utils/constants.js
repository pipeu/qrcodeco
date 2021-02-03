/* eslint-disable indent,spaced-comment,no-multi-spaces,padded-blocks,no-multiple-empty-lines, no-unused-vars, keyword-spacing, eqeqeq, semi */

const PIPEU_STORE_ID = 1

const PAYMENT_METHOD_BOLETO = 1;

//03/05/17 - Fazer um refactoring profundo pois nas Ordens nao deveria estar o cartao de credito visa mas sim cartao de credito.
//A bandeira visa deveria estar sendo apontada em uma tabela de cobrancas ou na tabela credit card transaction
const PAYMENT_METHOD_CREDIT_CARD = 2;

const PAYMENT_METHOD_VISA_CREDIT = 3;
const PAYMENT_METHOD_MASTER_CREDIT = 4;
const PAYMENT_METHOD_PAYPAL = 5;
const PAYMENT_METHOD_PAGSEGURO = 6;
const PAYMENT_METHOD_AMEX = 7;
const PAYMENT_METHOD_BANK_TRANSFER = 9;

const PAYMENT_METHOD_HIPERCARD_CREDIT = 12;
const PAYMENT_METHOD_ELO_CREDIT = 13;

const PAYMENT_TYPE_VISTA = 1;
const PAYMENT_TYPE_PARCELADO = 2;

const ORDER_ARCHIVED = 0; // Archived, not visible on default visualizations, just for Admin
const ORDER_STATUS_NOT_PAID = 1; // NÃO PAGO
const ORDER_STATUS_PAID = 2; // PAGO
const ORDER_CANCELLED = 3; // CANCELADO
const ORDER_PENDING_BACKOFFICE_ANALYSIS = 4; //EM ANALISE
const ORDER_BACKOFFICE_ANALYSIS_FRAUD = 5; //NEGADA, POSSIVEL FRAUDE
const ORDER_DELIVERY_ON_DENIED_CHARGE_AFTER = 7;//VENDA FIADO

const PRODUCT_TYPE_GOODS = 500 //Phisical Goods (magazines, goods, kits to be delivered)
const PRODUCT_TYPE_DIGITAL_GOOD = 700 //Digital Goods (pdf, restricted videos/urls, pages, calls)
const PRODUCT_TYPE_EVENT_TICKETS = 1000  //08/01/17 - Novo Produto Tickets de Evento
const PRODUCT_TYPE_COURSE = 2000  //13/01/17 - Novo Tipo de Produto Venda de Cursos
//18/09/17 - New type of Produto - Access to a restrict content / resource
const PRODUCT_TYPE_MEMBERSHIP_ACCESS = 3000 // 14/02/18 - Generic service like Design Services, Ilustration, Accounting, SEO, others
const TYPE_BUNDLE = 4000
const PRODUCT_TYPE_BUNDLE = 5000
const PRODUCT_TYPE_SERVICE = 6000
const PRODUCT_TYPE_MEAL = 7000
const PRODUCT_TYPE_DONATION = 8000

const EVENT_TICKET_PAID = 'PAID'
const EVENT_TICKET_FREE = 'FREE'
const EVENT_TICKET_DONATION = 'DONATION'
const EVENT_TICKET_COURTESY = 'COURTESY'
const EVENT_TICKET_PRESS = 'PRESS'
const EVENT_TICKET_STUDANT = 'STUDANT'

let getCreditCardFlagImageByFlagName = (name) => {

   if(name === 'mastercard') {
    return 'https://s3.amazonaws.com/pipeu-us/images/billing/flag-mastercard.png'

  }else if(name === 'visa') {
    return 'https://s3.amazonaws.com/pipeu-us/images/billing/flag-visa.png'

  }else if(name === 'amex') {
    return 'https://s3.amazonaws.com/pipeu-us/images/billing/flag-amex.png'

  }else if(name === 'hipercard') {
    return 'https://s3.amazonaws.com/pipeu-us/images/billing/flag-hiper.png'


  }else if(name === 'elo') {
    return 'https://s3.amazonaws.com/pipeu-us/images/billing/flag-elo.png'

  }else  {
    return null;
  }
}

let getPaymentMethodFlagImage = (paymentMethod) => {
  if(paymentMethod == PAYMENT_METHOD_BOLETO) {
    return 'https://s3.amazonaws.com/pipeu-us/images/billing/flag-boleto.png'


  } else if(paymentMethod == PAYMENT_METHOD_CREDIT_CARD) {
    return 'https://s3.amazonaws.com/pipeu-us/images/billing/credit-card.png'

  }else if(paymentMethod == PAYMENT_METHOD_MASTER_CREDIT) {
    return 'https://s3.amazonaws.com/pipeu-us/images/billing/flag-mastercard.png'

  }else if(paymentMethod == PAYMENT_METHOD_VISA_CREDIT) {
    return 'https://s3.amazonaws.com/pipeu-us/images/billing/flag-visa.png'

  }else if(paymentMethod == PAYMENT_METHOD_PAYPAL) {
    return 'https://s3.amazonaws.com/pipeu-us/images/billing/flag-paypal.png'

  }else if(paymentMethod == PAYMENT_METHOD_PAGSEGURO) {
    return 'https://s3.amazonaws.com/pipeu-us/images/billing/flag-pagseguro.png'

  }else if(paymentMethod == PAYMENT_METHOD_AMEX) {
    return 'https://s3.amazonaws.com/pipeu-us/images/billing/flag-amex.png'

  }else if(paymentMethod == PAYMENT_METHOD_BANK_TRANSFER) {
    return 'https://s3.amazonaws.com/pipeu-us/images/billing/flag-transferencia.png'

  }else if(paymentMethod == PAYMENT_METHOD_HIPERCARD_CREDIT) {
    return 'https://s3.amazonaws.com/pipeu-us/images/billing/flag-hiper.png'


  }else if(paymentMethod == PAYMENT_METHOD_ELO_CREDIT) {
    return 'https://s3.amazonaws.com/pipeu-us/images/billing/flag-elo.png'


  }else  {
    return "indefinido";
  }
}


let isProduct = (productType) => {
    return productType == PRODUCT_TYPE_GOODS
}

let showFirstEvent = (productType) => {
    return productType == PRODUCT_TYPE_EVENT_TICKETS
}

let isDigitalProduct = (productType) => {
    return productType == PRODUCT_TYPE_DIGITAL_GOOD
}

let isEventProduct = (productType) => {
    return productType == PRODUCT_TYPE_EVENT_TICKETS
}

// 04/09/18
let isProductBundle = (productType) => {
    return productType == PRODUCT_TYPE_BUNDLE
}

let isMealProduct = (productType) => {
  return productType == PRODUCT_TYPE_MEAL
}

let isDonationProduct = (productType) => {
  return productType == PRODUCT_TYPE_DONATION
}

let getProductTypeDescription = (productType) => {
    // console.log('getProductTypeDescription:', productType)
    let desc = ''
    if(productType == 1000) {
        desc = 'Ingressos'

    }else if(productType == 500) {
        desc = 'Produto'

    }else if(productType == 700) {
        desc = 'Produto Digital'

    }else if(productType == 7000) {
      desc = 'Produto Refeição'

    } else {
        desc = 'Todos os Produtos'
    }
    return desc
}

let isCreditCardPaymentMethod = (paymentMethod) => {
    console.log('isCreditCardPaymentMethod:', paymentMethod)
  if(PAYMENT_METHOD_CREDIT_CARD == paymentMethod ||
      paymentMethod === PAYMENT_METHOD_MASTER_CREDIT ||
        paymentMethod === PAYMENT_METHOD_VISA_CREDIT ||
        paymentMethod === PAYMENT_METHOD_AMEX ||
        paymentMethod === PAYMENT_METHOD_HIPERCARD_CREDIT ||
        paymentMethod === PAYMENT_METHOD_ELO_CREDIT) {
        console.log('returning true')
        return true
    }else  {
        console.log('returning false')
        return false
    }
}

export default {
  getCreditCardFlagImageByFlagName,
  PIPEU_STORE_ID,
    getProductTypeDescription,
getPaymentMethodFlagImage,
isCreditCardPaymentMethod,
    PRODUCT_TYPE_GOODS,
PRODUCT_TYPE_DIGITAL_GOOD,
PRODUCT_TYPE_EVENT_TICKETS,
PRODUCT_TYPE_COURSE,
PRODUCT_TYPE_MEMBERSHIP_ACCESS,
PRODUCT_TYPE_SERVICE,
    EVENT_TICKET_PAID,
EVENT_TICKET_FREE,
EVENT_TICKET_DONATION,
EVENT_TICKET_COURTESY,
EVENT_TICKET_PRESS,
EVENT_TICKET_STUDANT,
    showFirstEvent,
isDigitalProduct,
isEventProduct, isMealProduct, isDonationProduct,
isProduct,
TYPE_BUNDLE,
PRODUCT_TYPE_BUNDLE,
    isProductBundle
}
