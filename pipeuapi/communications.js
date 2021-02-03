import Vue from 'vue'

let initUUID = (storeId, puserId) => {
  // THE UUID AND USER ID LOGIC //////////////////////////////
  // check if the user have uuid and userid in local storage

  let clientCommunicationsDomain = process.env.PIPEU_COMMUNICATIONS_API_URL

  let userId = Vue.localStorage.get('userId')
  let userUUID = Vue.localStorage.get('userUUID')
  if (!userId && puserId) {
    Vue.localStorage.set('userId', puserId)
    userId = puserId
  }

  // console.log('START UUID PROCCESS', userId, userUUID)

  // if do not have userUUID and do not have userID
  // generate a new userUUID
  if (!userUUID && !userId) {
    console.log('NONE USER ', userId, userUUID)
    return new Promise((resolve, reject) => {

      fetch(clientCommunicationsDomain + '/uuid/generate')
        .then(res => res.json())
        .then((result) => {
          userUUID = result.uuid
          // set uuid to local storage for future consult
          Vue.localStorage.set('userUUID', userUUID)
          resolve(userUUID)
        })
        .catch((e) => {
          console.log(e)
          reject(e)
        })
    })
  } else if (!userUUID && userId) {
    console.log('USER ', userId, userUUID)
    // if do not have an userUUID but have an unserID
    // try to recover the uuid, if not success, generate and persists
    return new Promise((resolve, reject) => {

      fetch(clientCommunicationsDomain + '/uuid/get/' + userId + '/' + storeId)
        .then(res => res.json())
        .then((result) => {
          console.log('Result uuid/get api call result', result)
          if (result.lenght > 0) {
            Vue.localStorage.set('userUUID', result.uuid[1])
            resolve(result.uuid[1])

          } else {
            fetch(clientCommunicationsDomain + '/uuid/generate')
              .then(res => res.json())
              .then((result) => {
                userUUID = result.uuid
                Vue.localStorage.set('userUUID', userUUID)
                return new Promise((resolve, reject) => {

                  let postData = {
                    'userId': userId,
                    'uuid': userUUID,
                    'storeId': storeId
                  }

                  fetch(clientCommunicationsDomain + '/uuid/save', {
                    method: "POST", // *GET, POST, PUT, DELETE, etc.
                    mode: "cors", // no-cors, cors, *same-origin
                    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
                    // credentials: "same-origin", // include, *same-origin, omit
                    headers: {
                      "Content-Type": "application/json; charset=utf-8",
                      // "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: JSON.stringify(postData), // body data type must match "Content-Type" header
                  }).then((result) => {
                      Vue.localStorage.set('userUUID', userUUID)
                      resolve(userUUID)
                    })
                    .catch((e) => {
                      console.log(e)
                      reject(e)
                    })
                })
              })
              .catch((e) => {
                console.log(e)
                reject(e)
              })
          }
        })
        .catch((e) => {
          console.log('Error calling uuid/get' + e)
          reject(e)
        })
    })
  } else if (userId && userUUID) {
    // console.log('USER snd UUID', userId, userUUID)
    // with user id and user uuid, update
    return new Promise((resolve, reject) => {

      let postData = {
        'userId': userId,
        'uuid': userUUID,
        'storeId': storeId
      }

      fetch(clientCommunicationsDomain + '/uuid/save', {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, cors, *same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        // credentials: "same-origin", // include, *same-origin, omit
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          // "Content-Type": "application/x-www-form-urlencoded",
        },
        body: JSON.stringify(postData), // body data type must match "Content-Type" header
      }).then((result) => {
          // console.log('>>> /uuid/save result:', result)
          Vue.localStorage.set('userUUID', userUUID)
          resolve(userUUID)
        })
        .catch((e) => {
          console.log(e)
          reject(e)
        })
    })
  } else {
    console.log('USER DEFINED else')
    return new Promise((resolve, reject) => {
      resolve(userUUID)
    })
  }

}

let registerOnesignal = (userUUID, domain, oneSignalAppId) => {
  console.log(">>> registerOnesignal ", userUUID, domain, oneSignalAppId)
  let OneSignal = window.OneSignal || []

      let pushKey = oneSignalAppId

      console.log('### pushKey:', pushKey)
      OneSignal.push(['init', {appId: pushKey, autoRegister: true}])
      OneSignal.on('subscriptionChange', function (isSubscribed) {
        console.log(">>> OneSignal: The user's subscription state is now: " + isSubscribed)
        getIdsOnesignal(userUUID, domain)
      })
      OneSignal.on('notificationPermissionChange', function (permissionChange) {
        console.log('>>> OneSignal: permission change', permissionChange)
        OneSignal.setSubscription(true)
        getIdsOnesignal(userUUID, domain)
      })


}

let getIdsOnesignal = (userUUID, domain) => {
  console.log(">>> getIdsOnesignal ")

  // let vm = this
  // let clientCommunicationsDomain = process.env.PIPEU_COMMUNICATIONS_API_URL
  const OneSignal = window.OneSignal || []
  OneSignal.push(['getIdsAvailable', function (ids) {
    let data = {}
    data.onesignal_player_id = ids.userId
    data.onesignal_chrome_reg_id = ids.registrationId
    console.log('>>> OneSignal:  onesignal_player_id: ' + ids.userId, ids)
    console.log('>>> OneSignal:  chrome_registration_id: ' + ids.registrationId)
    // save the onesignal id to future pushs
    if (ids.userId && userUUID) {

      let clientCommunicationsDomain = process.env.PIPEU_COMMUNICATIONS_API_URL

      let dataToPost = {
        'onesignalPlayerId': ids.userId,
        'userUuid': userUUID,
        'domain': domain
      }

      console.log(">>> getIdsOnesignal /push/register post")

      fetch(clientCommunicationsDomain + '/push/register', {
        method: 'POST', // or 'PUT'
        body: JSON.stringify(dataToPost), // data can be `string` or {object}!
        headers:{
          'Content-Type': 'application/json'
        }
      }).then(res => res.json())
        .then(response => {
          console.log('>>> OneSignal: register Ok res:', response)
          }
        )
        .catch(error => {
          console.log('#onesignal register Error ', error)
        });



    }
  }])
}

export default {
  initUUID,
  registerOnesignal
}
