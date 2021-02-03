export default ({ store, route, query, redirect }) => {
  // console.log('middleware/auth.js route.path:', route.path)
  // console.log('middleware/auth.js route.fullPath:', route.fullPath)
  // console.log('middleware/auth.js route.query:', route.query)

  // Check if user is connected first
  // console.log('### store.getters(\'getUserAccount\'):', store.getters.getUserAccount)

  if (!process.server) {
    console.log('middleware from client side')
  }

  if (!store.getters.getUserAccount) {
    return redirect('/Register', { next: encodeURIComponent(route.fullPath) })
  }

  // console.log('route.meta', route.meta)

  // // Get authorizations for matched routes (with children routes too)
  // const authorizationLevels = route.meta.map((meta) => {
  //   if (meta.auth && typeof meta.auth.authority !== 'undefined') { return meta.auth.authority }
  //   return 0
  // })
  // // Get highest authorization level
  // const highestAuthority = Math.max.apply(null, authorizationLevels)
  //
  // console.log('highest authority', highestAuthority)

  // if (store.getters['user/user'].details.general.authority < highestAuthority) {
  //   return error({
  //     statusCode: 401,
  //     message: 'Du måste vara admin för att besöka denna sidan.'
  //   })
  // }
}
