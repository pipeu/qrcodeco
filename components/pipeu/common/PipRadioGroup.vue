<template>
  <div>
    <!--<template v-for="item in options.items">-->
    <!--<md-radio v-model="modelValue" :value="item.value" :name="componentName" >{{item.label}}</md-radio>-->
    <!--</template>-->

    <!-- 13/09/18 - VERY IMPORTANT, its working, but -->
    <!-- USING MATERIALIZE 1.0.0 PURE JAVASCRIPT WITH VUE V-MODEL THEY BREAK VUE REACTIVITY  -->
    <!-- AS A TEMP FIX WE'RE USING @CHANGE TO SET THE VALUE MANUALLY EVENT USING V-MODE  -->
    <template v-for="item in options.items">
        <label :class="options.align" :for="item.name">
          <input :class="' ' + propClass" type="radio" :disabled="disabled || item.disabled" :name="componentName"
                 :id="item.name" :value="item.value" v-model="modelValue"  @change="setSelectedValue(item.value)" />
          <span style="font-size: 15px; color: black;" v-html="item.label"></span>
        </label>
    </template>

    <PipErrorIndicator :componentName="componentName"></PipErrorIndicator>
  </div>
</template>

<script>
  /* eslint-disable indent,spaced-comment */
  import { eventHub } from '@/utils/eventHub'
  import PipErrorIndicator from "./PipErrorIndicator";

  export default {
    name: 'PipRadioGroup',
    components: {PipErrorIndicator},
    data: function() {
      return {
        modelValue: this.value, // We can bind parent v-mode in this way, instead of this vm.modelValue = vm.value in created hook
      }
    },

    props: {
      componentName: {
        required: true,
        type: String
      },
      options: {
        required: true,
        type: Object,
        default () {
          return {
            align: ''
          }
        }
      },
      value: { // Initial value passed from v-model from Parent Component
        required: true
      },
      propClass: {
        required: false,
        type: String,
        default () {
          return ''
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

    created () {
      let vm = this
      if (vm.value) {
        // vm.modelValue = vm.value // dont need to associate if we do this in data propertie modelValue: this.value,
      }
    },

    watch: {
      modelValue: {
        handler: function(newValue) {
          // console.log('>>>>>>>>>>>>>>>>>>>>>>> ### [PipRadioGroup] WATCH modelValue emiting newValue:', newValue)
          this.$emit('input', newValue)
          eventHub.$emit(this.componentName + '-pip-radiogroup-selected-', newValue)
          eventHub.$emit(this.componentName + '-clear-indicator')
          this.$emit('updated', newValue);
        },
        deep: true
      }
    },

    methods: {
      setSelectedValue (val) {
        // console.log('### setSelectedValue:', val)
        this.modelValue = val
      }
    }

  }
</script>
<!--Using third party radio component example-->
<!--<style lang="scss">-->
<!--@import "~vue-material/dist/theme/engine"; // Import the theme engine-->
<!--@include md-register-theme("default", (-->
<!--primary: md-get-palette-color(black, A200), // The primary color of your application-->
<!--accent: md-get-palette-color(blue, A200), // The accent or secondary color-->
<!--theme: light // This can be dark or light-->
<!--));-->

<!--/*@import "~vue-material/dist/components/MdButton/theme"; // Apply the Button theme*/-->
<!--/*@import "~vue-material/dist/components/MdContent/theme"; // Apply the Content theme*/-->
<!--/*@import "~vue-material/dist/components/MdToolbar/theme"; // Apply the Toolbar theme*/-->
<!--@import "~vue-material/dist/components/MdRadio/theme"; // Apply the Radio theme-->

<!--// @import 'vue-material/dist/theme/default-dark.css';-->
<!--// @import 'vue-material/dist/theme/default.css';-->

<!--/*.md-list {*/-->
<!--/*.md-selected,*/-->
<!--/*.router-link-active{*/-->
<!--/*.md-list-item-text {*/-->
<!--/*color: md-get-palette-color(blue, A200)*/-->
<!--/*}*/-->
<!--/*}*/-->
<!--/*}*/-->

<!--</style>-->

<style scoped>
  .linebreak:after {
    content: '\A';
    white-space: pre;
    display: block;
    height: 10px;
  }
</style>
