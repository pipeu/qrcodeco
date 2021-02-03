import constants from '@/utils/constants'

let productHasDeliveries = (product) => {
  console.log('products.productHasDeliveries => product.name:', product.name)
  let value = product.deliveryEnabled || constants.isProduct(product.type) || constants.isProductBundle(product.type)
  console.log('===================== productHasDeliveries:', value)

  if (product.additionalProducts && product.additionalProducts.length > 0) {
    product.additionalProducts.forEach(function (prd) {
      console.log('===================== product.additionalProducts:', prd)
      if (prd.deliveryEnabled || constants.isProduct(prd.type) || constants.isProductBundle(prd.type)) {
        value = true
        console.log('===================== product.additionalProducts HasDeliveries:', value)
      }
    })
  }

  return value
}

let isPlanSubscriptionCheckout = (checkout) => {
  let value = false

  if (checkout && checkout.plan && checkout.plan.items) {
    value = true
  }
  return value
}

let getRenewalText = (item) => {
  // A Cada {{intervalCount}} Mês(es)
  if (item.interval === 'months') {
    if (item.intervalCount === 1) {
      return 'ao Mês'
    } else {
      return 'a cada ' + item.intervalCount + ' Meses'
    }
  } else { // days
    if (item.intervalCount === 1) {
      return 'por Dia'
    } else {
      return 'a cada ' + item.intervalCount + ' Dias'
    }
  }
}

export default
{
  isPlanSubscriptionCheckout,
  getRenewalText
}
