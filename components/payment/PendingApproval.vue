<template>
  <div>

    <div class="row">
      <div style="padding:20px 0 10px;">
          <h1 class="pip-text-title">{{getUserAccount().firstName}}, recebemos seu Pedido !</h1>
      </div>
    </div>

    <div class="pip-text">

      <p>Seu Pedido foi Enviado com Sucesso e em breve entraremos em contato por Email</p>
      <p>Seu email {{getUserAccount().email}}</p>

      <p class="mt-3">Qualquer dúvida ligue para nós:<br/>
        Telefone: {{getStore().phoneOffice}}
      </p>

      <p >
        Obrigado por comprar conosco !
      </p>

      <div style="margin:15px 0px 15px;" align="center">
        <PipButton @click="goToPath('/')">Voltar para o Site</PipButton>
      </div>
    </div>

  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import UtilsMixin from '@/mixins/UtilsMixin'
  import PipButton from "../pipeu/common/PipButton";

  export default {
    name: 'PendingApproval',
    mixins: [UtilsMixin],
    components: {PipButton},

    methods: {
      ...mapGetters(['getStore', 'getUserAccount', 'getDomain', 'getCheckout', 'userHasPrincipalValidCreditCard'])
    }

  }
</script>
