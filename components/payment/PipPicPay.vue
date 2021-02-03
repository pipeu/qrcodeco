<template>
    <div>
        <div id="picpay-button">
            <a @click="createPicPayRequest" class="waves-effect waves-light btn-small" style="background-color:#11c76f;border-radius:50px;color:#fff;font-weight:500; margin-left: 10px;">
                <span>Pagar com PicPay</span>
            </a>
        </div>
    </div>
</template>

<script>
    /* eslint-disable */
    import {mapGetters} from 'vuex'
    import { eventHub } from '@/utils/eventHub'
    import basicuicomponent from '@/mixins/BasicUIComponent'
    import orderFuncMixin from '@/mixins/OrderFuncMixin'
    import paymentApi from '@/pipeuapi/payment.js'

    export default {
        name: 'PipPicPay',
        mixins: [basicuicomponent, orderFuncMixin],

        data: function() {
            return {
                newOrderId: '',
            }
        },

        props: {
            cpf: {
                required: true
            }
        },

        mounted () {
            let vm = this
        },

        methods: {
            ...mapGetters(['getCheckout']),

            createPicPayRequest () {
                let vm = this
                console.log('createPicPayRequest')

                eventHub.$emit('before-payment-request')

                paymentApi.createPicPay(vm.getCheckout(), vm.cpf).then((res) => {

                    console.log('paymentApi.createPicPay res ', res.data)

                    let order = res.data
                    console.log('order', order)

                    // Emit updated order to Parent
                    vm.$emit('payment-update-order', order);
                    vm.$emit('picpay-payment-approved-interval', order); // check if user pays the bill in picpay App

                }, (error) => {
                    vm.handleApiError(error, { alertMessage: 'Ops!, verifique o Problema Abaixo'})
                })
            }
        }

    }
</script>

