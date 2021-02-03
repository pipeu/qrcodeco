<template>
  <div>

    <HeaderPipeu :showCartIcon="false" :returnPath="returnPath"></HeaderPipeu>


    <template>
      <div class="col-xs-12 col-md-3">
        <div class="list-group">

          <h3 class="list-group-item"> Minha Conta </h3>

          <nuxt-link class="list-group-item" to="/myaccount/account"><i class="fa fa-user fa-fw"></i>Dados Pessoais</nuxt-link>

          <nuxt-link class="list-group-item" to="/myaccount/pass/changePass"><i class="fa fa-user fa-fw"></i>Alterar Senha</nuxt-link>

          <nuxt-link class="list-group-item" to="/myaccount/address"><i class="fa fa-user fa-fw"></i>Endereço</nuxt-link>

          <!-- <a href="mb-minha-conta-notificacoes.html" class="list-group-item"><i class="fa fa-bell fa-fw"></i> Notificações</a> -->

          <a class="list-group-item" href="/myaccount/events/tickets"><i class="fa fa-ticket fa-fw"></i> Meus Ingressos</a>

          <a class="list-group-item" href="/myaccount/order"><i class="fa fa-ticket fa-fw"></i> Pedidos </a>

          <a class="list-group-item" @click="logout">Sair </a>

        </div>
      </div>
    </template>





  </div>


</template>
<script>
  import auth from '@/store/auth.js'
  import basicuicomponent from '@/mixins/BasicUIComponent'
  import HeaderPipeu from "../../components/HeaderPipeu";

  export default {
    name: 'AccountHeader',
    components: {HeaderPipeu},
    mixins: [basicuicomponent],

    data: function () {
      return {
        menu: {},
        backReturnPath: '/myaccount'
      }
    },

    // NOTE: On element creation we just can receive data in lower case like storedata or userlogged, storeData or userLogged won't work
    created: function () {
      console.log('###### AccountHeader.created')
      if (this.returnPath) {
        this.backReturnPath = this.returnPath
      }
    },

    methods: {
      logout () {
        let vm = this
        auth.logout().then((response) => {
          console.log('logout auth response')

          vm.$store.commit('SET_USER_ACCOUNT', null)

          vm.$router.replace({ path: '/' })

        }, (error) => {
          console.log('logout failure response', error)
        })
      },
    },

    props: {
      title: '',
      returnPath: {
        default: undefined,
        type: String
      }
    }
  }
</script>
<style scoped>

  @media (min-width: 992px){
    .navbar li {
      margin-left : 0.3em;
      margin-right : 0.3em;
    }
  }

</style>

<style scoped>
  @import "@/pages/myaccount/account.css";
</style>


