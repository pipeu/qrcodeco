
let apiv2Url = 'https://api.pipeu.co'

let getProduct = async (uuid) => {
  console.log('*** apiv2.getProduct /products/uuid/', uuid)

  let response = await fetch(apiv2Url + '/products/uuid/' + uuid)
  console.log('response', response)

  return response.json()
}

export default {
  getProduct
}
