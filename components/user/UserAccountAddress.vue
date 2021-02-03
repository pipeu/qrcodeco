<!--Component deprecated - please replace by PipUserAddress-->
<template>
    <div>
        <div class="row fg-mb">
            <div class="col-lg-4 col-md-7 col-xs-3">
                <!--<label for="zipCode">CEP</label>-->
                <!-- v-bind:onchange="changeZipCode" -->

                <!-- ATTENTION: DO NO USE V-VALIDATE WITH V-MASK, APP CAN FREEZE, REMEMBER CPF ISSUE ON TICKET REGISTRATION AFTER PAYMENT-->
                <!-- ATTENTION: DO NO USE V-VALIDATE WITH V-MASK, APP CAN FREEZE, REMEMBER CPF ISSUE ON TICKET REGISTRATION AFTER PAYMENT-->
                <!-- ATTENTION: DO NO USE V-VALIDATE WITH V-MASK, APP CAN FREEZE, REMEMBER CPF ISSUE ON TICKET REGISTRATION AFTER PAYMENT-->
                <!-- ATTENTION: DO NO USE V-VALIDATE WITH V-MASK, APP CAN FREEZE, REMEMBER CPF ISSUE ON TICKET REGISTRATION AFTER PAYMENT-->
                <!-- ATTENTION: DO NO USE V-VALIDATE WITH V-MASK, APP CAN FREEZE, REMEMBER CPF ISSUE ON TICKET REGISTRATION AFTER PAYMENT-->
                <input :disabled="processing" type="text" class="form-control"  v-on:keyup.native="changeZipCode" id="zipCode" name="zipCode"
                              v-mask="'99999-999'"
                              :value="zipCode" @input="$emit('update:zipCode', $event.target.value)"
                              placeholder="Cep">
            </div>
        </div>
        <PipErrorIndicator component-name="zipcode"></PipErrorIndicator>


        <!--<template v-if="address">-->
            <div class="row fg-mb">
                <div class="col-lg-12 col-md-9 col-xs-9">

                    <!--<label for="address">Endereço</label>-->
                    <input :disabled="processing" type="text" class="form-control input-lg" id="address" name="address"
                           :value="address" @input="$emit('update:address', $event.target.value)"
                           placeholder="Endereço"
                           v-validate="'required|max:150'" :class="{'input': true, 'account-error': errors.has('address') }" >

                    <PipErrorIndicator component-name="address"></PipErrorIndicator>
                </div>
            </div>


            <div class="form-group row">

                <div class="col-lg-5 col-xs-4">
                    <!--<label for="addressNumber">Número</label>-->
                    <input :disabled="processing" type="text" class="form-control input-lg" id="addressNumber" name="addressNumber"
                           :value="addressNumber" @input="$emit('update:addressNumber', $event.target.value)"
                           placeholder="Número"
                           v-validate="'required|max:50'" :class="{'input': true, 'account-error': errors.has('addressNumber') }" >

                    <PipErrorIndicator component-name="addressNumber"></PipErrorIndicator>

                </div>

                <div class="col-lg-5 col-xs-4">
                    <!--<label for="addressNumberComp">Complemento</label>-->
                    <input :disabled="processing" type="text" class="form-control input-lg" id="addressNumberComp" name="addressNumberComp"
                           :value="addressNumberComp" @input="$emit('update:addressNumberComp', $event.target.value)"
                           placeholder="Complemento">
                </div>

            </div>

            <div class="row fg-mb">
                <div class="col-lg-10 col-md-8 col-xs-9">
                    <!--<label for="neighborhood">Bairro</label>-->
                    <input :disabled="processing" type="text" class="form-control input-lg" id="neighborhood" name="neighborhood"
                           :value="neighborhood" @input="$emit('update:neighborhood', $event.target.value)"
                           placeholder="Bairro"
                           v-validate="'required|max:100'" :class="{'input': true, 'account-error': errors.has('neighborhood') }" >

                    <PipErrorIndicator component-name="neighborhood"></PipErrorIndicator>
                </div>
            </div>


            <div class="row fg-mb">
                <div class="col-lg-10 col-md-8 col-xs-9">
                    <!--<label for="neighborhood">Bairro</label>-->
                    <input :disabled="processing" type="text" class="form-control input-lg" id="city" name="city"
                           :value="city" @input="$emit('update:city', $event.target.value)"
                           placeholder="Cidade"
                           v-validate="'required|max:100'" :class="{'input': true, 'account-error': errors.has('city') }" >
                    <PipErrorIndicator component-name="city"></PipErrorIndicator>
                </div>
            </div>


        <div class="row fg-mb">
            <div class="col-lg-8 col-md-8 col-xs-12">

                <!--<label for="cmbState">Estado</label>-->

                <select :disabled="processing" @change="$emit('update:state', $event.target.value)"  style="width: auto" class="form-control input-md" >

                    <option value="AC" :selected="'AC' == state">Acre</option>

                    <option value="AL" :selected="'AL' == state">Alagoas</option>

                    <option value="AM" :selected="'AM' == state">Amazonas</option>

                    <option value="AP" :selected="'AP' == state">Amapá</option>

                    <option value="BA" :selected="'BA' == state">Bahia</option>

                    <option value="CE" :selected="'CE' == state">Ceará</option>

                    <option value="DF" :selected="'DF' == state">Distrito Federal</option>

                    <option value="ES" :selected="'ES' == state">Espírito Santo</option>

                    <option value="GO" :selected="'GO' == state">Goiás</option>

                    <option value="MA" :selected="'MA' == state">Maranhão</option>

                    <option value="MG" :selected="'MG' == state">Minas Gerais</option>

                    <option value="MS" :selected="'MS' == state">Mato Grosso do Sul</option>

                    <option value="MT" :selected="'MT' == state">Mato Grosso</option>

                    <option value="PA" :selected="'PA' == state">Pará</option>

                    <option value="PB" :selected="'PB' == state">Paraíba</option>

                    <option value="PE" :selected="'PE' == state">Pernambuco</option>

                    <option value="PI" :selected="'PI' == state">Piauí</option>

                    <option value="PR" :selected="'PR' == state">Paraná</option>

                    <option value="RJ" :selected="'RJ' == state">Rio de Janeiro</option>

                    <option value="RN" :selected="'RN' == state">Rio Grande do Norte</option>

                    <option value="RO" :selected="'RO' == state">Rondônia</option>

                    <option value="RR" :selected="'RR' == state">Roraima</option>

                    <option value="RS" :selected="'RS' == state">Rio Grande do Sul</option>

                    <option value="SC" :selected="'SC' == state">Santa Catarina</option>

                    <option value="SE" :selected="'SE' == state">Sergipe</option>

                    <option value="SP" :selected="'SP' == state">São Paulo</option>

                    <option value="TO" :selected="'TO' == state">Tocantins</option>
                </select>

                <PipErrorIndicator component-name="state"></PipErrorIndicator>

            </div>
        </div>


        <!--</template>-->



    </div>
</template>

<script>
    /* eslint-disable indent,spaced-comment */
    import AwesomeMask from 'awesome-mask'
    import pipeuApi from '~/pipeuapi/api.js'
    import PipErrorIndicator from "../pipeu/common/PipErrorIndicator";
    // import communication from '~/store/components-communication.js'

    export default {
        name: 'UserAccountAddress',
      components: {PipErrorIndicator},
      // children inherit from the parent:
        props: {
            processing: Boolean,
            zipCode: String,
            address: String,
            addressNumber: String,
            addressNumberComp: String,
            neighborhood: String,
            city: String,
            state: String
        },
        directives: {
            'mask': AwesomeMask
        },

        created: function () {
            console.log('###### UserAccountAddress.created')
        },

        // mounted: function () {
        //     communication.bus.$on('validateUserAddress', this.validate)
        // },

        watch: {
            // whenever question changes, this function will run
            zipCode: function (newValue, oldValue) {
                console.log('watch zipCode oldValue', oldValue)
                console.log('watch zipCode newValue', newValue)
                this.changeZipCode()
            }
        },

        methods: {
            changeZipCode: function (e) {
                console.log('changeZipCode')
                let auxZipCode = this.zipCode.replace(/[_-]/g, '')
                if (auxZipCode.length === 8) {
                    this.queryZipCode(auxZipCode)
                }
            },

            queryZipCode (zipCode) {
                console.log('queryZipCode' + zipCode)

                pipeuApi.fetchZipCode(zipCode).then((response) => {
                    // console.log('response fetchZipCode', response.data)

                    /**
                     * This is important
                     * As this is a child component synced with Parent'' components, we should not never
                     * set local data directly, instead we must emit data changes to Parent to inform new values
                     */
                    this.$emit('update:address', response.data.logradouro)
                    this.$emit('update:neighborhood', response.data.bairro)
                    this.$emit('update:city', response.data.localidade)
                    this.$emit('update:state', response.data.uf)
                }, (error) => {
                    console.log('login failure response', error)
                })
            }
        }

    }
</script>
<style scoped>

    .fg-mb {
        margin-bottom: 20px;
    }

    .account-error {
        color: #e40903;
        padding: 5px;
        margin-bottom: 13px;
    }


</style>
