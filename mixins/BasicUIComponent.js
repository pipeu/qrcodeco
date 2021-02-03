import { eventHub } from '@/utils/eventHub'
import constants from '@/utils/constants'
import auth from '@/store/auth'
import {mapState, mapGetters} from 'vuex'
import formatFuncMixin from '@/mixins/FormatFuncMixin'
import UtilsMixin from '@/mixins/UtilsMixin'
import api from '@/pipeuapi/api.js'

export default {
  mixins: [formatFuncMixin, UtilsMixin],
  data() {
    return {
      componentKeyReRender: 0, // Used as a counter to re-render components that must be re-rendered in certain cases
      mounted: false,
      entityDataNotFound: false,
    }
  },
  computed: {
    ...mapState({
      store: state => state.store,
      userAccount: state => state.userAccount
    }),
    ...mapGetters(['isFullScreen', 'isProcessing'])
  },

  /**
   * basicuicomponent mixin is common on all system pages, then here we initialize Store Marketing integrations services
   * through common methods or event listeners (for those componenets inside pages that use this mixin)
   */
  mounted() {
    // console.log('>>>>>>>>>> mounted: basicuicomponent Mixins <<<<<<<<<<')
    let vm = this

    if (process.client) {
      // console.log('basicuicomponent.vue running on Browser, initing clientSide scripts')
    }

    this.attachComponents()
  },

  methods: {

    normalizeProductUrl (name, id) {
      return api.normalizeProductUrl(name, id)
    },

    updateComponentKeyReRender () {
      this.componentKeyReRender = this.componentKeyReRender + 1
    },

    getFlagImage(item) {
      return constants.getCreditCardFlagImageByFlagName(item.flagName)
    },

    isPipeuStore ()   {
      // console.log('>>>>> isPipeuStore:', constants.PIPEU_STORE_ID === this.getStore.id)
      return constants.PIPEU_STORE_ID === this.getStore.id
    },

    isAdmin () {
      return auth.isAdmin(this.userAccount, this.store)
    },


    goToHome () {
      this.$router.replace({ path: '/' })
    },

    getPaymentMethodFlagImage(paymentMethod) {
      return constants.getPaymentMethodFlagImage(paymentMethod)
    },

    isProduct  (productType) {
      return constants.isProduct(productType)
    },

    showFirstEvent  (productType) {
      return constants.showFirstEvent(productType)
    },

    isDigitalProduct  (productType) {
      return constants.isDigitalProduct(productType)
    },

    isEventProduct  (productType) {
      return constants.isEventProduct(productType)
    },

    isProductBundle  (productType) {
      return constants.isProductBundle(productType)
    },

    isMealProduct  (productType)   {
      return constants.isMealProduct(productType)
    },

    isDonationProduct  (productType)   {
      return constants.isDonationProduct(productType)
    },

    clone (obj) {
      return JSON.parse(JSON.stringify(obj))
    },

    isMobile() {
      if (screen.width <= 768) {
        return true
      } else {
        return false
      }
    },

    back() {
      this.$router.go(-1)
    },


    getUserProfilePhoto (user) {
      // this.deb('user.profilePhoto', user.profilePhoto)
      if (user && user.profilePhoto && user.profilePhoto !== 'null' &&  user.profilePhoto != '/images/avatar-default-50.jpg') {
        return user.profilePhoto;
      } else {
        return "https://s3.amazonaws.com/pipeu-us/images/avatar-default-70.jpg";
      }
    },

    isNullOrDefaultAvatar (user) {
      return !user.profilePhoto || user.profilePhoto === '/images/avatar-default-50.jpg'
    },

    showValidationError (key, message) {
      let vm = this
      let element = document.getElementById(key)
      if (element) {
        // element.classList.add('myaccount-error')
      }

      let elementIndicator = document.getElementById(key + '-indicator')
      if (elementIndicator) {
        elementIndicator.innerText = message
      }

      if (vm.errors) {
        // vm.errors.add(key, message)
        vm.addErrors(key, message)
      }
    },

    showError (msg) {
      this.$toast.error(msg)
    },

    addErrors (field, message) {
      let vm = this
      if (vm.errors) {
        vm.errors.add({field: field,msg: message});
      }
    },

    handleApiError(error, options) {
      console.log('>>>>>>>>> handleApiError <<<<<<<<< -> error:', error)
      // console.log('>>>>>>>>> handleApiError <<<<<<<<< -> error.message:', error.message)
      let vm = this

      if (options && options.mainEntity && error.response.status == 404) {
        // console.log('>>> setting entityDataNotFound to True')
        vm.entityDataNotFound = true
      }

      if (options && options.ignoreNotFound && error.response.status == 404) {
        return
      }

      if (error && error.message) {
        vm.showElementError ('message', error.message)
      }

      if (error.response) {
        console.log(error.response.data)

        if (error.response.data.message) {
          vm.showError(error.response.data.message)
          vm.showElementError ('message', error.response.data.message)
        }

        let errors = error.response.data.errors

        for (let key in errors) {
          if (key === 'message') {
            vm.showError(errors[key])
          }
          vm.showElementError (key, errors[key])
        }

        if (error.response.data.errorsBatch) {
          let errorsBatch = error.response.data.errorsBatch

          for (var i = 0; i < errorsBatch.length; i++) {
            console.log('listOfErrors in errorsBatch:', errorsBatch[i])

            let errors = errorsBatch[i]
            for (let key in errors) {
              if (key == 'message') {
                vm.showError(errors[key])
              }

              let apiIndex = errors['index']
              vm.showElementError (apiIndex + '-' + key, errors[key])
            }
          }
        }

        if (options && options.alertMessage) {
          vm.showError(options.alertMessage)
        }


      }
    },

    addPipError (field, message) {
      this.showElementError (field, message)
    },

    showElementError (key, message) {
      let vm = this

      let element = document.getElementById(key)
      if (element) {
        // element.classList.add('invalid')
      }

      let elementIndicator = document.getElementById(key + '-indicator')
      if (elementIndicator) {
        elementIndicator.innerText = message
      }

      // 14/08/18 - Emit validation error for someone listening for this component
      // console.log('>>>>>>>>>>>>>>>>>>>>>>> Emitting ['+message+'] To ' + (key + '-indicator') )
      eventHub.$emit(key + '-indicator', message)

      if (vm.errors) {
        vm.addErrors(key, message)
      }

    },

    confirm (title, message) {
      let vm = this
      return new Promise((res, rej) => {

        if(!title) {
          rej(new Error('You must pass at least a Title'));
        }

        vm.$swal({
          title: title,
          text: message,
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sim'
        }).then((result) => {
          if (result.value) {
            res(result.value)
          }
        })
      });

    },

    // Attach UnReactive components (called by the App to attach or re-attach components when elements are mounted or data ir ready to be used)
    attachComponents() {
      // Force All properties and data to be available attach Materialize Components
      this.$nextTick(function() {
        // console.log("######## BasicUIComponent.attachComponents $nextTick callback, attaching")

        var textAreas = document.querySelectorAll('textarea')
        for (var i = 0; i < textAreas.length; i++){
          M.textareaAutoResize(textAreas[i])
        }

        var collapsibles = document.querySelectorAll('.collapsible')
        for (var i = 0; i < collapsibles.length; i++){
          M.Collapsible.init(collapsibles[i])
        }


        var modals = document.querySelectorAll('.modal')
        for (var i = 0; i < modals.length; i++){
          M.Modal.init(modals[i]);
        }

        var tabs = document.querySelectorAll('.tabs')
        for (var i = 0; i < tabs.length; i++){
          M.Tabs.init(tabs[i])
        }

        var tooltips = document.querySelectorAll('.tooltipped')
        for (var i = 0; i < tooltips.length; i++){
          M.Tooltip.init(tooltips[i])
        }

        var selects = document.querySelectorAll('select')
        for (var i = 0; i < selects.length; i++){
          M.FormSelect.init(selects[i])
        }

        var dropdowns = document.querySelectorAll('.dropdown-trigger')
        for (var i = 0; i < dropdowns.length; i++){
          M.Dropdown.init(dropdowns[i], {constrainWidth: false} );
        }

        M.updateTextFields()

      })
    },

  }
}
