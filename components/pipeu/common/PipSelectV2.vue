<!--
V2 suffix in components means a new version and more stable, we are using this naming until we replaced old components examples all pages that uses PipSelect needs to be replaces to PipeSelectV2

09/09/18 - Basic Pipeu Select Component
Initially using Materialize 1.0.0-rc2

We can change this Element that will change every Select html component inside PipeU
-->
<template>
  <div>

    <!-- ##################################################################################### -->
    <!-- ##################################### For Good !##################################### -->
    <!-- If we use Materialize Components we need to identify each instance of a component like the dropdown bellow  -->
    <!-- with an unique id and data-target name, ie id="mycomponent" data-target="dropdown-mycomponent"  -->
    <!-- If we not add an unique identifier for id and data-target Materialize get messed with active instances across others components that uses dropdown for instance  -->
    <!-- Aditionally we need to initialize and destroy using vue lifecycle hooks like in this component  -->

    <!--class="input-field"-->
    <div>
      <i v-if="options.materialIcon" class="material-icons prefix">{{options.materialIcon}}</i>

      <!--class="browser-default"-->
      <select :disabled="disabled" :id="componentName" v-model="selectedItem">

        <option v-for="(item, index) in items" v-bind:value="item.value" :disabled="item.disabled">
          {{item.text}}
        </option>

      </select>

      <label v-if="options.label" :for="componentName">{{options.label}}</label>
    </div>
    <template v-if="selectedItemDescription">
      <p>{{selectedItemDescription}}</p>
    </template>



  </div>

</template>

<script>
  /* eslint-disable indent,spaced-comment */
  import basicuicomponent from '@/mixins/BasicUIComponent'
  import { eventHub } from '@/utils/eventHub'



  export default {
    name: 'PipSelectV2',

    mixins: [basicuicomponent],

    data: function() {
      return {
        items: [],

        selectedItem: this.value, // We can bind parent v-mode in this way, instead of this vm.modelValue = vm.value in created hook

        selectedItemDescription: ''
      }
    },

    props: {
      value: { // Initial value passed from v-model from Parent Component
        required: true
      },


      componentName: {
        required: true,
        type: String
      },
      options: {
        required: false,
        default () {
          return []
        }
      },
      selected: {
        required: false,
        default () {
          return {}
        }
      },
      disabled: {
        required: false,
        type: Boolean,
        default () {
          return false
        }
      },
    },

    computed: {
    },

    mounted () {

      this.renderComponent()

    },

    created () {
      let vm = this
      // console.log('###### PipSelectV2.created ['+this.componentName+'] options:', this.options)
      // console.log('###### PipSelectV2.created ['+this.componentName+'] value:', this.value) // from v-model

      this.items = this.options.items

      vm.setSelectedDescripiton(this.value)

    },

    beforeDestroy () {
      var elSelect = document.querySelector('#' + this.componentName);
      // console.log('$$$$ beforeDestroy elSelect:', elSelect)

      if (elSelect) {
        var instance = M.FormSelect.getInstance(elSelect)
        if (instance) {
          instance.destroy()
        }
      }

    },

    watch: {

      selectedItem: {
        handler: function(newValue) {
          // console.log('### AEEEEE !!! PipSelect WATCH selectedItem newValue:', newValue)
          this.changedItem(newValue)
        },
        deep: true
      },

      options: {
        handler: function(newValue) {
          // console.log('### AEEEEE !!! PipSelectV2 WATCH options changed newValue:', newValue.items)
          this.items = newValue.items


          var elSelect = document.querySelector('#' + this.componentName);
          if (elSelect) {
            var instance = M.FormSelect.getInstance(elSelect)
          }

        },
        deep: true
      }
    },

    methods: {
      setSelectedDescripiton (value) {
        let vm = this

        if (this.items && value) {
          let objItem = this.items.find( obj => obj.value == value )
          // console.log(' selected objItem:', objItem)

          if (objItem && objItem.description) {
            vm.selectedItemDescription = objItem.description
          } else {
            vm.selectedItemDescription = ''
          }
        }

      },

      changedItem (value) {
        let vm = this
        // console.log('######## PipSelect.changedItem: value:', value)
        // console.log('######## PipSelect.changedItem emiting :' + this.componentName + '-item-change-' + value)

        vm.setSelectedDescripiton(value)

        vm.$emit('input', value)
        eventHub.$emit(vm.componentName + '-item-change-', value)
        vm.$emit('select-change', value)


      },


      renderComponent () {

        var elSelect = document.querySelector('#' + this.componentName);
        // console.log('$$$$ mounted PipSelect.elSelect:', elSelect)

        if (elSelect) {
          M.FormSelect.init(elSelect) // , {constrainWidth: false}
        }

        // var instance = M.FormSelect.getInstance(elSelect)
      },

      reRender() {
        let vm = this
        this.$nextTick(function() {
          vm.renderComponent()
        })

      }


    }

  }
</script>
<style scoped>


</style>
