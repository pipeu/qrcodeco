<template>
  <div class="pip-login page">
    <HeaderPipeu :showCartIcon="false" title="Dados Pessoais" returnPath="/myaccount"></HeaderPipeu>

    <div v-if="mounted" class="" >

      <div class="pipeu-conta card pip-container account-container">
        <h1>Dados Pessoais</h1>
        <div>
          <PipInput component-name="fullName" label-desc="Nome Completo" v-model="user.fullName"></PipInput>
        </div>

        <div>
          <PipInput component-name="email" type="email" label-desc="Email" v-model="user.email"></PipInput>
        </div>

        <div>
          <PipInput component-name="mobilePhone" type="number" label-desc="Celular" v-model="user.mobilePhone"></PipInput>
        </div>

        <div>
          <PipCPFInput component-name="cpf" label-desc="CPF" v-model="user.cpf"></PipCPFInput>
        </div>

        <div>
          <!--v-if="mounted"-->
          <PipRadioGroup v-model="user.gender" componentName="gender"
                         :options="{ materialIcon: 'gender',items: [{ name: 'female', label: 'Feminino', value: 'F' },{ name: 'male', label: 'Masculino', value: 'M' }]}">
          </PipRadioGroup>
        </div>

        <PipErrorIndicator componentName="message"></PipErrorIndicator>

        <PipButton @click="update">Salvar</PipButton>
      </div>
    </div>

  </div>
</template>

<script>
  import {mapMutations, mapGetters, mapActions} from 'vuex'
  import pipeuApi from '~/pipeuapi/api.js'
  import basicuicomponent from '@/mixins/BasicUIComponent'
  import PipInput from '@/components/pipeu/common/PipInput'
  import PipErrorIndicator from '@/components/pipeu/common/PipErrorIndicator'
  import PipButton from "@/components/pipeu/common/PipButton";
  import AccountHeader from "@/pages/myaccount/AccountHeader";
  import PipRadioGroup from "@/components/pipeu/common/PipRadioGroup";
  import PipCPFInput from "@/components/pipeu/common/PipCPFInput";
  import HeaderPipeu from "../../components/HeaderPipeu";

  export default {
    name: 'Account',
    mixins: [basicuicomponent],

    data () {
      return {
        user: {
          fullName: '',
          email: '',
          mobilePhone: '',
          cpf: '',
          gender: '',
          entityAccountType: 'F'
        }
      }
    },
    components: {
      HeaderPipeu,
      PipCPFInput,
      PipRadioGroup,
      AccountHeader,
      PipButton,
      PipInput, PipErrorIndicator
    },

    mounted: function () {
      let vm = this
      vm.user = vm.clone(vm.getUserAccount())
      vm.mounted = true
    },

    methods: {
      ...mapActions(['addUserAccount', 'addAuthToken']),
      ...mapGetters(['getStore', 'getUserAccount', 'getDomain']),

      update () {
        let vm = this
        vm.user.entityAccountType = 'F'
        pipeuApi.updateAccount(this.user).then((res) => {
          console.log('updateAccount res', res, res.data)
          vm.addUserAccount(res.data)
          vm.$toast.success('Ok !')
          vm.$router.replace({ path: '/myaccount' })
        }, (error) => {
          vm.handleApiError(error)
        })
      }
    }

  }
</script>
<style scoped>
  @import "@/pages/myaccount/account.css";

  .pipeu-conta {
    margin-top: 50px;
    width: 100%;
    padding: 50px;
  }
  .pip-login h1 {
    margin: 0;
    padding: 0;
    text-align: left;
    margin-bottom: 40px;
  }
  /* Medium devices (landscape tablets, 768px and up) */
  @media only screen and (max-width: 768px) {
    .card {
      box-shadow: none;
    }
    .pipeu-conta {
      padding: 15px;
      width: 100%;
      margin: auto;
      margin-top: 20px;
    }
    .pip-login {
      padding-top: 0;
    }
    .input-field {
      position: relative;
      margin-top: 5px;
      margin-bottom: 5px;
    }
    h1 {
      display: none;
    }
  }
</style>
