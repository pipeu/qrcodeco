import { eventHub } from '@/utils/eventHub'

export default {
  data() {
    return {
      entityDataNotFound: false
    }
  },

  created() {
  },

  mounted() {
    let vm = this
  },

  methods: {

    addErrors (field, message) {
      let vm = this
      if (vm.errors) {
        vm.errors.add({field: field,msg: message});
      }
    },

    showError (msg) {
      this.$toast.error(msg)
    },

    handleApiError(error, options) {
      console.log('>>>>>>>>> handleApiError <<<<<<<<< -> error:', error)
      let vm = this

      if (options && options.mainEntity && error.response.status == 404) {
        // console.log('>>> setting entityDataNotFound to True')
        vm.entityDataNotFound = true
      }

      if (options && options.ignoreNotFound && error.response.status == 404) {
        return
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
          console.log(key + ': ' + errors[key])
          console.log('showing div erros:' + ('#' + key + '-indicator'))

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
              console.log('apiIndex:', apiIndex)

              console.log(apiIndex + '-' + key + ': ' + errors[key])
              console.log('showing div erros:' + ('#' + apiIndex + '-' + key + '-indicator'))

              vm.showElementError (apiIndex + '-' + key, errors[key])
            }
          }

        }
      }
    },

    addPipError (field, message) {
      this.showElementError (field, message)
    },

    showElementError (key, message) {
      console.log('### showElementError')
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
      console.log('>>>>>>>>>>>>>>>>>>>>>>> Emitting ['+message+'] To ' + (key + '-indicator') )
      eventHub.$emit(key + '-indicator', message)

      if (vm.errors) {
        vm.addErrors(key, message)
      }

    },


  }
}
