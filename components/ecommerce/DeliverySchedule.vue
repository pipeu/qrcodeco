<template>
    <div v-if="getCheckout()" class="ingress">
        <h2 style="margin-bottom: 20px; ">Datas de Entrega Disponíveis</h2>
        <div class="row">
            <PipRadioGroup  :disabled="isProcessing" :key="componentKeyReRender + '-selectedDeliveryDay'" prop-class="with-gap"
                            v-model="getCheckout().selectedDeliveryDay" componentName="selectedDeliveryDayComp"
                            @updated="updateSelectedDeliveryDate"
                            :options="{ align: 'linebreak', materialIcon: 'calendar', items: formattedDeliveryOptions}">
            </PipRadioGroup>
        </div>
    </div>
</template>

<script>
    import basicuicomponent from '@/mixins/BasicUIComponent'
    import format from '@/mixins/FormatFuncMixin'
    import PipRadioGroup from "../pipeu/common/PipRadioGroup"
    import {mapGetters, mapActions} from 'vuex'

    export default {
        name: 'DeliverySchedule',
        components: {PipRadioGroup},
        mixins: [format, basicuicomponent],

        data () {
            return {
                formattedDeliveryOptions: []
            }
        },

        mounted () {

            let vm = this

            let deliveryRegion = 'REGION-1'
            let user = vm.getUserAccount()

            if ( user && user.mainShippingAddress && user.mainShippingAddress.deliveryRegion && user.mainShippingAddress.deliveryRegion != '' ) {
                deliveryRegion = user.mainShippingAddress.deliveryRegion
                console.log('Found delivery region on user.mainShippingAddress deliveryRegion:', deliveryRegion)
            }

            if ( vm.getCustomerAddress() && vm.getCustomerAddress().deliveryRegion && vm.getCustomerAddress().deliveryRegion != '' ) {
                deliveryRegion = vm.getCustomerAddress().deliveryRegion
                console.log('Found delivery region on customAddresss at store deliveryRegion:', deliveryRegion)
            }

            if (deliveryRegion === undefined) {
              deliveryRegion = 'REGION-1'
            }

            this.formattedDeliveryOptions = Object.values(this.getCheckout().deliveryDateOptions).map(obj => {
                this.getCheckout().selectedDeliveryPeriod = "ANY" // Fixed Period

                let newObj = {}
                newObj.name = 'day-' + obj.day
                newObj.label = 'Dia ' + obj.day + ' ' + obj.periodHoursNotes
                newObj.value = '' + obj.day

                // console.log('checkig obj.sameDayDelivery', obj.sameDayDelivery)
                // console.log('checkig deliveryRegion for sameDay', deliveryRegion)
                if (true == obj.sameDayDelivery && deliveryRegion == 'REGION-1') { // sameDay just from Region1
                    // newObj.value = 'SAMEDAY'
                    newObj.label = '<strong>Hoje</strong> ' + newObj.label + '<br><strong>Pedido mínimo ' + vm.formatCurrency(vm.getCheckout().minOrderAmountForSameDayDelivery) + '</strong>'
                    if (vm.getCheckout().totalAmount >= vm.getCheckout().minOrderAmountForSameDayDelivery) {
                          newObj.disabled = false;
                    } else {
                          newObj.disabled = true;
                    }
                }

                return newObj
            })

            // console.log('checkig deliveryRegion for pickAndGo', deliveryRegion)
            // TODO: Put this on serverside, in this way the client doesnt know the rules just the options
            if (vm.getCheckout().deliveryPickAndGoEnabled && deliveryRegion == 'REGION-1') { // sameDay just from Region1
              vm.formattedDeliveryOptions.push({
                  name: 'GRAB_AND_GO',
                  label: '<strong>Retirar no Cozinha </strong>' + vm.getCheckout().deliveryPickAndGoPeriodNotes + '<br>Rua Davi Hume 116 - Vila Mariana<br>Tel (11) 9953-56972',
                  value: '32'
                }
              )
            }


          this.updateComponentKeyReRender()
        },

        // computed: {
        //     selectedDeliveryDay() {
        //       return this.getCheckout().selectedDeliveryDay;
        //     }
        // },
        // watch: {
        //     // @! Important: To watch just an Object property we need to create a computed property and then watch it
        //     selectedDeliveryDay() {
        //         console.log('watch selectedDeliveryDay')
        //         this.updateCheckoutDeliveryDateOptions()
        //     }
        // },

        methods: {
            ...mapGetters(['getStore', 'getUserAccount', 'getDomain, getProductsByDetailPageURL', 'getCustomerAddress', 'getCheckout']),
            ...mapActions(['updateCheckoutOptions']),

            updateSelectedDeliveryDate(value) {
                // console.log('updateSelectedDeliveryDate value', value)
                // console.log('updateSelectedDeliveryDate this.getCheckout().selectedDeliveryDay', this.getCheckout().selectedDeliveryDay)
                this.updateCheckoutDeliveryDateOptions()
            },

            // Update checkout local on vuex store to reflect delivery date user pickups
            async updateCheckoutDeliveryDateOptions() {
                let vm = this
                await this.updateCheckoutOptions(vm.getCheckout())
            }
        }
    }
</script>

<style scoped>
    .ingress td {
        padding: 13px 0;
    }
</style>
