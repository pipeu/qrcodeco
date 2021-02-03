<!--
V2 suffix in components means a new version and more stable, we are using this naming until we replaced old components examples all pages that uses PipSelect needs to be replaces to PipeSelectV2
-->
<template>
  <div>

    <div class="mdc-select">

      <i class="mdc-select__dropdown-icon"></i>
      <!--<i v-if="options.materialIcon" class="material-icons prefix">{{options.materialIcon}}</i>-->

      <select :disabled="disabled" :id="componentName" v-model="selectedItem" class="mdc-select__native-control">

        <option v-for="(item, index) in items" v-bind:value="item.value" :disabled="item.disabled">
          {{item.text}}
        </option>

      </select>

      <!--<label v-if="options.label" class="mdc-floating-label">{{options.label}}</label>-->

      <div class="mdc-line-ripple"></div>
    </div>


    <!--<template v-if="selectedItemDescription">-->
    <!--<p>{{selectedItemDescription}}</p>-->
    <!--</template>-->

  </div>
</template>

<script>
  /* eslint-disable indent,spaced-comment */
  import basicuicomponent from '@/mixins/BasicUIComponent'
  import { eventHub } from '@/utils/eventHub'

  import {MDCSelect} from '@material/select';

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

      const select = new MDCSelect(document.querySelector('.mdc-select'));

      select.listen('MDCSelect:change', () => {
        console.log(`Selected option at index ${select.selectedIndex} with value "${select.value}"`);
      });


    },

    created () {
      let vm = this
      // console.log('###### PipSelectV2.created ['+this.componentName+'] options:', this.options)
      // console.log('###### PipSelectV2.created ['+this.componentName+'] value:', this.value) // from v-model

      this.items = this.options.items

      vm.setSelectedDescripiton(this.value)

    },

    beforeDestroy () {
      // var elSelect = document.querySelector('#' + this.componentName);
      // // console.log('$$$$ beforeDestroy elSelect:', elSelect)
      //
      // if (elSelect) {
      //   var instance = M.FormSelect.getInstance(elSelect)
      //   instance.destroy()
      // }

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
          console.log('### AEEEEE !!! PipSelectV2 WATCH options changed newValue:', newValue.items)
          this.items = newValue.items



        },
        deep: true
      }
    },

    methods: {
      setSelectedDescripiton (value) {
        let vm = this

        let objItem = this.items.find( obj => obj.value == value )
        // console.log(' selected objItem:', objItem)

        if (objItem && objItem.description) {
          vm.selectedItemDescription = objItem.description
        } else {
          vm.selectedItemDescription = ''
        }

      },

      changedItem (value) {
        let vm = this
        // console.log('######## PipSelect.changedItem: value:', value)
        // console.log('######## PipSelect.changedItem emiting :' + this.componentName + '-item-change-' + value)

        vm.setSelectedDescripiton(value)

        this.$emit('input', value)
        eventHub.$emit(this.componentName + '-item-change-', value)


      }


    }

  }
</script>
<style scoped>
  /*@import "@material/textfield/dist/mdc.textfield.css";*/
  @import "@material/select/dist/mdc.select.css";
</style>

