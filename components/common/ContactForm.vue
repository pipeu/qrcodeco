<template>
    <div class="row font">

      <template v-if="contactSent === false">
        <div class="col l2"></div>
        <div class="col s12 l8 contact-data">
          <h1>{{$props.formtitle}}</h1>
          <div>
            <!-- custom form -->
            <div class="form-group" v-for="(field, id) in fields" v-bind:key="id">
              <!--<label>field.label</label>-->
              <div v-if="field.type === 'select'"  >
                <select class="form-control " :name="field.name" v-model="field.value" id="idCmbDepartQuestCod">
                  <option v-for="(opt, idopt) in field.options" v-bind:key="idopt"
                          :value="opt.value" :selected="(opt.value === '' ? 'selected' : '')">
                    {{opt.label}}
                  </option>
                </select>
              </div>

              <div v-else-if="field.type === 'text' || field.type === 'email'" >
                <PipInput :component-name="field.name" :type="field.type" :label-desc="field.label" v-model="field.value"></PipInput>
              </div>

              <div v-else-if="field.type === 'textarea'" >
                <textarea :name="field.name" id="txtComments" v-model="field.value" class="materialize-textarea" style="height: 100px;" rows="5" :placeholder="field.label"></textarea>
              </div>
            </div>
            <!-- submit -->
            <div v-if="submitLocked === false" class="row">
              <div class="col s12">
                <PipButton @click="sendContactForm()">Enviar</PipButton>
              </div>
            </div>

          </div>
        </div>
        <div class="col l2"></div>
      </template>

        <div v-else class="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 bg-light contact-data shadow mx-auto text-center">
            <h1 class="text-success"><i class="fa fa-check"></i></h1>
            <p>Contato enviado. Aguarde retorno.</p>
            <!--<button type="button" @click="resetForm()" class="btn btn-primary mt-3">Ok</button>-->

        </div>
    </div>

</template>

<script>
    /* eslint-disable indent,space-infix-ops,key-spacing,keyword-spacing,space-before-blocks,semi,no-multiple-empty-lines,comma-spacing,object-property-newline,eqeqeq,padded-blocks,space-before-function-paren */

import axios from 'axios'
import numeral from 'numeral'
    import PipButton from "../pipeu/common/PipButton";
    import PipInput from "../pipeu/common/PipInput";

export default {
    name: 'ContactForm',
  components: {PipInput, PipButton},
  // props need to be all lower capt
    props: {
        domain: {type: String, default: ''},
        customparameters: {type: String, default: '{}'},
        customfields: {type: String, default: '[]'},
        storeid: {type: String, default: '0'},
        formtitle: {type: String, default: 'Entre em contato conosco'},
        emailto: {type: String, default: 'yes-reply@kontato.co'},
        email: {type: String, default: ''},
        fullname: {type: String, default: ''}
    },
    data: function () {
        return {
            submitLocked: false,
            contactSent: false,
            fields: [],
            parameters: [],
            COMMUNICATIOS_API: process.env.PIPEU_COMMUNICATIONS_API_URL
        }
    },
    created: function () {
        let vm = this
        console.log('###### ContactForm.vue created :', vm.$props.customparameters)

        vm.parameters = JSON.parse(vm.$props.customparameters)

        // console.log(vm.$props.customparameters)
        // console.log(vm.$props.customfields)


        // vm.fields = JSON.parse(vm.$props.customfields)
        vm.setStoreCustomFields()



    },
    methods: {
        setStoreCustomFields() {
            let vm = this

            console.log('###### setStoreCustomFields vm.parameters:', vm.parameters)
            console.log('###### setStoreCustomFields vm.parameters Object.values:', Object.values(vm.parameters))

            let customFields =
                [
                    {'type':'text','label':'Seu Nome','required':false,'name':'txtFullName','value': this.fullname},
                    {'type':'email','label':'Seu e-mail','required':true,'name':'txtEmail','value': this.email},
                    {'type':'text','label':'Assunto','required':false,'name':'txtSubject','value':''},
                    {'type':'textarea','label':'Escreva sua Mensagem','required':true,'name':'txtComments','value':''}
                ]


            // HardCoded for tests in NetCartas - 20/08/18
            if (vm.$props.storeid == '16') {

                let nickname = vm.parameters[0].nickname
                console.log('###### snickname:', nickname)

                customFields =
                    [
                        {'type':'select','label':'Questionamento','required':false,'name':'cmbDepartQuestCod','value':'0','options':[{'value':'0','label':'Selecione o Questionamento'},
                                {'value':'10','label':'Duvida Geral'},
                                {'value':'11','label':'Pontos Negativos (abandono)'},
                                {'value':'12','label':'O Jogo não carrega'},
                                {'value':'13','label':'Duvidas sobre Cobranca'},
                                {'value':'14','label':'Sugestoes / Reclamacoes'},
                                {'value':'15','label':'Ofensas / Denuncias'},
                                {'value':'16','label':'Problemas de Conexao no Jogo'},
                                {'value':'17','label':'O que achou do Novo Visual do Jogo'}
                            ]},
                        {'type':'text','label':'Seu Nome','required':false,'name':'txtFullName','value': this.fullname},
                        {'type':'text','label':'Apelido (login no jogo)','required':true,'name':'txtNick','value': nickname},
                        {'type':'email','label':'Seu e-mail','required':true,'name':'txtEmail','value': this.email},
                        {'type':'text','label':'Assunto','required':false,'name':'txtSubject','value':''},
                        {'type':'textarea','label':'Escreva aqui sua duvida, sugestao ou reclamacao','required':true,'name':'txtComments','value':''}
                    ]

            }

            vm.fields = customFields


        },


        formatAmount (amount) {
            return 'R$ ' + numeral(amount).format('0,0.00')
        },

        resetForm () {
            this.contactSent = false
            this.submitLocked = false
        },

        sendContactForm () {
            let vm = this
            vm.submitLocked = true
            let message = vm.formatMessageFromFields()

            console.log('send contact form message:', message)

            let dataToBeSend = {
                'customFormData' : JSON.stringify(vm.fields),
                'storeId': vm.$props.storeid,
                'message': message,
                'emailTo': vm.$props.emailto,
                'customParameters' : JSON.stringify(vm.parameters),

                'email': vm.findEmailFromFields(),
                'fullName': vm.findFullNameFromFields(),

                'notes': vm.findNotes()
            }

            console.log('data to be sent:', dataToBeSend)


          fetch(vm.COMMUNICATIOS_API + '/chat/formMessage', {
            method: 'PUT',
            body: JSON.stringify(dataToBeSend),
            headers:{'Content-Type': 'application/json'}
          }).then(res => res.json()).then(response => {
            console.log('>>> /communications/chat/formMessage/ res:', response)
            vm.contactSent = true
            vm.submitLocked = false
          }).catch(error => {
            console.log('/communications/chat/formMessage/ Error ', error)
            vm.contactSent = true
            vm.submitLocked = false
          })

            // axios.put(vm.COMMUNICATIOS_API + '/chat/formMessage', JSON.stringify(dataToBeSend),
            //     {
            //         // Deleting Authorization header, because we have one as global Axios
            //         // config and Amazon and ViaCEP does not play nice with it.
            //         transformRequest: [function (data, headers) {
            //             delete headers.common['Authorization']
            //             return data
            //         }],
            //         headers: {
            //             'Content-Type': 'application/json;charset=UTF-8'
            //         }
            //     })
            //     .then((result) => {
            //         console.log(result.data)
            //         vm.contactSent = true
            //         vm.submitLocked = false
            //     })
            //     .catch((e) => {
            //         console.log(e)
            //         vm.contactSent = true
            //         vm.submitLocked = false
            //     })

        },

        formatMessageFromFields () {
            let msg = ''
            for (let x=0; x<this.fields.length; x++){
                if (this.fields[x].type === 'select') {
                    let fValue = this.fields[x].value
                    for (let y=0; y<this.fields[x].options.length; y++){
                        if(this.fields[x].options[y].value === this.fields[x].value) {
                            fValue = this.fields[x].options[y].label
                        }
                    }
                    msg = msg + this.fields[x].label + ': ' + fValue + '\r\n'
                } else {
                    msg = msg + this.fields[x].label + ': ' + this.fields[x].value + '\r\n'
                }
            }
            return msg
        },

        // Luiz
        findNotes () {
            let notes = ''
            for (let x=0; x<this.fields.length; x++){
                if(this.fields[x].type === 'textarea'){
                    notes = this.fields[x].value
                    break;
                }
            }
            return notes
        },
        findEmailFromFields () {
            let email = ''
            for (let x=0; x<this.fields.length; x++){
                if(this.fields[x].type === 'email'){
                    email = this.fields[x].value
                    break;
                }
            }
            return email
        },
        findFullNameFromFields () {
            let fullName = ''
            for (let x=0; x<this.fields.length; x++){
                if(this.fields[x].name === 'txtFullName'){
                    fullName = this.fields[x].value
                    break;
                }
            }
            return fullName
        }
    }
}
</script>


<style scoped>
    .contact-data {
        padding: 50px;
        z-index: 2;
    }
    .contact-info {
        padding: 100px;
        font-size: 16px;
        color: #666;
    }
    .contact-info p {
        padding-bottom: 20px;
        margin-bottom: 0;
    }
    .contact-info i {
        color: #ccc;
    }
    .contact-info img {
        margin-bottom: 50px;
    }
    .contact-info a {
        font-size: 24px;
        color: #000;
    }
    .contact-info a i {
        color: #000;
        padding-right: 40px;
    }
    .contact-social {
        margin-top: 50px;
    }
    .form-control {
        border: 1px solid #eee;

    }

</style>
