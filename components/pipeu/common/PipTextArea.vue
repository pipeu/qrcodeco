<template>
    <div>
        <!-- ##################################################################################### -->
        <!-- ##################################### For Good !##################################### -->
        <!-- If we use Materialize Components we need to identify each instance of a component like bellow  -->
        <!-- with an unique id and data-target name, ie id="mycomponent" data-target="dropdown-mycomponent"  -->
        <!-- If we not add an unique identifier for id and data-target Materialize get messed with active instances across others components that uses dropdown for instance  -->
        <!-- Aditionally we need to initialize and destroy using vue lifecycle hooks like in this component  -->

        <!--<i class="material-icons">{{options.materialIcon}}</i> <p>{{options.label}}</p></a>-->
        <div class="input-field">
            <label :for="componentName">{{labelDesc}}</label>
            <textarea v-on:focus.prevent="$emit('focus', $event.target.value)"
                      @input="$emit('input', modelValue)"
                      :disabled="disabled"
                      v-model="modelValue"
                      name="componentName"
                      :id="componentName"
                      class="materialize-textarea" :rows="rows">

            </textarea>
            <span :id="componentName + '-indicator'" class="material-input input-error"></span>
        </div>

    </div>
</template>

<script>
    /* eslint-disable indent,spaced-comment */
    import basicuicomponent from '@/mixins/BasicUIComponent'
    import { eventHub } from '@/utils/eventHub'

    export default {
        name: 'PipTextArea',

        mixins:[basicuicomponent],

        data: function() {
            return {
                modelValue: this.value, // We can bind parent v-mode in this way, instead of this vm.modelValue = vm.value in created hook
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

            labelDesc: {
                required: true,
                type: String
            },

            disabled: {
                required: false,
                type: Boolean,
                default () {
                    return false
                }
            },

            rows: {
                required: false,
                type: Number,
                default () {
                    return 2
                }
            }
        },

        mounted () {
            var elSelect = document.querySelector('#' + this.componentName);
            // console.log('$$$$ mounted PipSelect.elSelect:', elSelect)
            M.textareaAutoResize(elSelect);
        },


        created () {
            let vm = this
            // console.log('### [PipTextArea '+vm.componentName+'] value via parent v-model:', vm.value)
            // console.log('### [PipTextArea '+vm.componentName+'] required:', vm.required)

            // componentName must be exacle the entity attribute name in input field and container indicator id
            // Validation message emitted by parent mixins errorHandling func
            eventHub.$on(vm.componentName + '-indicator', (message) => {
                // console.log('### [PipInput '+vm.componentName+'] -indicator message:', message)

                let element = document.getElementById(vm.componentName)
                if (element) {
                    element.classList.add('invalid')
                }

                let elementIndicator = document.getElementById(vm.componentName + '-indicator')
                if (elementIndicator) {
                    elementIndicator.innerText = message
                }

            })

        },

        beforeDestroy () {
            eventHub.$off(this.componentName + '-indicator');
        },

        watch: {
            // modelValue: function(newValue) {
            //     console.log('   >>> PipTextArea ['+this.componentName+'] modelValue changed:', newValue)
            //     let vm = this
            //     vm.$emit('input', newValue)
            // }
        }
    }
</script>
