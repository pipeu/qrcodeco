<template>
    <div>
        <!--CMD_CHANGE_ACCOUNT_TAX_INFO-->
        <div class="row">
          <div class="col s12 l12">
            <!-- We need to Emit update to Parent Since it is using .sync ! -->
            <PipCPFInput :value="cpf" @input="$emit('update:cpf', $event)" :disabled="isProcessing" component-name="cpf" label-desc="Seu CPF" ></PipCPFInput>
          </div>

        </div>

        <!--        <div v-if="!mandatoryInvoiceDetails" class="row">-->
        <!--            <div class="col s12 l12">-->
        <!--              <label>-->
        <!--                <input type="checkbox" class="filled-in" checked="checked" v-model="useBuyerDataAsChargeData" />-->
        <!--                <span style="font-size: 12px;">Nota Fiscal, Usar meus Dados de Cadastro</span>-->
        <!--              </label>-->
        <!--            </div>-->
        <!--        </div>-->

        <template v-if="useInvoiceDetails || !useBuyerDataAsChargeData">
            <div class="pixcomm-success">

                <p style="font-size: 20px;color: #1b427c;padding: 0 0 0px;">Dados de Cobrança e Nota Fiscal</p>
                <!--<div class="form-check mb-4">-->
                    <!--<input type="checkbox" class="form-check-input" id="companyChargeData" v-model="companyChargeData">-->
                    <!--<label class="form-check-label" for="companyChargeData">Emitir em nome de Empresa</label>-->
                <!--</div>-->

                <label>
                  <input type="checkbox" class="filled-in" checked="checked" v-model="companyChargeData" />
                  <span style="font-size: 12px;">Emitir em nome de Empresa</span>
                </label>

                <template v-if="entityType === 'F'">
                    <div class="row">
                        <div class="col-lg-6 col-md-8 col-xs-8">
                          <PipCPFInput :value="registryCode" @input="$emit('update:registryCode', $event)" :disabled="isProcessing" component-name="registryCode" label-desc="CPF" ></PipCPFInput>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-lg-7 col-md-8 col-xs-12">
                          <PipInput :value="name" @input="$emit('update:name', $event)" :disabled="isProcessing" component-name="name" label-desc="Nome" type="text"></PipInput>
                        </div>
                    </div>

                </template>
                <template v-else>

                    <div class="row">
                        <div class="col-lg-6 col-md-8 col-xs-8">
                          <PipCNPJInput :value="registryCode" @input="$emit('update:registryCode', $event)" :disabled="isProcessing" component-name="registryCode" label-desc="CNPJ da Empresa" ></PipCNPJInput>
                        </div>
                    </div>


                    <div class="row">
                        <div class="col-lg-7 col-md-8 col-xs-12">
                          <PipInput :value="name" @input="$emit('update:name', $event)" :disabled="isProcessing" component-name="name" label-desc="Nome da Empresa" type="text"></PipInput>
                        </div>
                    </div>


                </template>

                <UserAccountAddress
                        :zipCode.sync="billingAddress.zipCode"
                        :address.sync="billingAddress.address"
                        :addressNumber.sync="billingAddress.addressNumber"
                        :addressNumberComp.sync="billingAddress.addressNumberComp"
                        :neighborhood.sync="billingAddress.neighborhood"
                        :city.sync="billingAddress.city"
                        :state.sync="billingAddress.state">
                </UserAccountAddress>
            </div>

        </template>

    </div>
</template>

<script>
    import UserAccountAddress from '@/components/user/UserAccountAddress'
    import PipCPFInput from "../pipeu/common/PipCPFInput";

    import basicuicomponent from '@/mixins/BasicUIComponent'
    import PipInput from "../pipeu/common/PipInput";
    import PipCNPJInput from "../pipeu/common/PipCNPJInput";

    export default {
        name: 'ChargeData',

        mixins: [basicuicomponent],

        data () {
            return {
                companyChargeData: false,
                useBuyerDataAsChargeData: true,

                billingAddress: this.value, // bind v-model value to this data propertie
            }
        },

        props: {
            value: {
                required: true
            },

            cpf: {
                required: true,
                type: String
            },
            entityType: {
                required: true,
                type: String
            },
            processing: {
                required: true,
                type: Boolean
            },
            useInvoiceDetails: {
                required: false,
                type: Boolean
            },
            mandatoryInvoiceDetails: {
                required: false,
                type: Boolean,
                default: false
            },

            registryCode: {
                required: false,
                type: String
            },
            name: {
                required: false,
                type: String
            }
        },

        components: {
          PipCNPJInput,
          PipInput,
          PipCPFInput,
          UserAccountAddress
        },

        watch: {
            cpf: function (newValue, oldValue) {
              // console.log('watch ChargeData.cpf newValue', newValue)
            },

            'billingAddress.zipCode': function (newValue, oldValue) {
                console.log('watch ChargeData.zipCode oldValue', oldValue)
                console.log('watch ChargeData.zipCode zipCode newValue', newValue)
            },
            'companyChargeData': function (newValue, oldValue) {
                console.log('watch companyChargeData oldValue', oldValue)
                console.log('watch companyChargeData newValue', newValue)
                if (newValue === true) {
                    this.$emit('update:entityType', 'J')
                    this.$nextTick()
                } else {
                    this.$emit('update:entityType', 'F')
                    this.$nextTick()
                }

              this.attachComponents()
            },
            'useBuyerDataAsChargeData': function (newValue, oldValue) {
                console.log('watch useBuyerDataAsChargeData oldValue', oldValue)
                console.log('watch useBuyerDataAsChargeData newValue', newValue)

                if (newValue === true) {
                    this.$emit('update:useInvoiceDetails', false)
                    this.$nextTick()
                } else {
                    this.$emit('update:useInvoiceDetails', true)
                    this.$nextTick()
                }

                this.attachComponents()
            }
        }
    }
</script>
<style scoped>
    .account-error {
        color: #e40903;
        padding: 5px;
        margin-bottom: 13px;
    }
</style>
