<template>
  <div>
      <span :id="componentName + '-indicator'" class="input-error"></span>
  </div>
</template>

<script>
  /* eslint-disable */
  import { eventHub } from '@/utils/eventHub'

  export default {
    name: 'PipErrorIndicator',

    props: {
      componentName: {
        required: true,
        type: String
      }
    },

    created () {
      let vm = this
      // componentName must be exacle the entity attribute name in input field and container indicator id
      // Validation message emitted by parent mixins errorHandling func
      eventHub.$on(vm.componentName + '-indicator', (message) => {
        // console.log('### [PipErrorIndicator '+vm.componentName+'] -indicator message:', message)

        let elementIndicator = document.getElementById(vm.componentName + '-indicator')
        if (elementIndicator) {
          elementIndicator.innerText = message
        }
      })

      eventHub.$on(vm.componentName + '-clear-indicator', () => {
        // console.log('### [PipErrorIndicator '+vm.componentName+'] -clear-indicator message:')
        this.removeValidationIndicator()
      })
    },

    beforeDestroy () {
      eventHub.$off(this.componentName + '-indicator');
      eventHub.$off(this.componentName + '-clear-indicator');
    },

    methods: {
      removeValidationIndicator () {
        let vm = this
        let element = document.getElementById(vm.componentName)
        if (element) {
          element.classList.remove('invalid')
        }
        let elementIndicator = document.getElementById(vm.componentName + '-indicator')
        if (elementIndicator) {
          elementIndicator.innerText = ''
        }
      }

    }

  }
</script>
<style scoped>
.input-error {
    color: #B8211D;
    padding: 5px;
    margin-bottom: 13px;
}
</style>

