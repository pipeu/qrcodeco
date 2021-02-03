<template>
<div>
    <CartView></CartView>

    <CheckDeliveryRadiusUserAddress></CheckDeliveryRadiusUserAddress>

    <div class="footer">

        <div class="row">
            <div class="col s2 l1">
                <a href="https://www.instagram.com/br.coze/" target="_blank">
                    <img src="https://static.pipeu.co/images/icons/insta.png" alt="" style="width: auto;height: 32px; margin-left: 20px;"></a>
            </div>
            <div class="col s2 l2">
                <a href="https://www.facebook.com/br.coze" target="_blank">
                    <img src="https://static.pipeu.co/images/icons/fb.png" alt="" style="width: auto;height: 32px; margin-left: 20px;"></a>
            </div>
            <div class="col s8 l2">
            </div>
        </div>

        <div class="row" style="margin-bottom: 40px;">
            <div class="col s3 l3">
                <a href="#home"><img style="height: 97px;" src="https://pipeu-us.s3.amazonaws.com/clients/cozinha/images/logo-cozi-white.svg" alt=""></a>
            </div>
            <div class="col s9 l9">
                <p class="store-info">Cozinha Marketplace e Servicos Digitais LTDA</p>
                <p class="store-info">CNPJ n 33.192.514/0001-45</p>
                <p class="store-info">Rua Davi Hume 116 - Vila Mariana / São Paulo – SP</p>
                <p class="store-info">Tel / WhatsApp (11) 9953-56972</p>
            </div>
        </div>

        <div class="row" style="margin-top: 20px;">
            <div class="col s12 l12">
                <p style="color: #ffffff; font-size: 14px; margin-bottom: 15px;" class="banners">Aceitamos Todos os Cartões e Vales</p>

                <img class="banners" src="https://pipeu-us.s3.amazonaws.com/images/billing/flag-mastercard.png">
                <img class="banners" src="https://s3.amazonaws.com/pipeu-us/images/billing/flag-visa.png">
                <img class="banners" src="https://s3.amazonaws.com/pipeu-us/images/billing/flag-elo.png">
                <img class="banners" src="https://pipeu-us.s3.amazonaws.com/images/billing/flag-alelo.png">
                <img class="banners" src="https://pipeu-us.s3.amazonaws.com/images/billing/bandeiradiners.png">
                <img class="banners" src="https://pipeu-us.s3.amazonaws.com/images/billing/flag-hiper.png">
                <img class="banners" src="https://s3.amazonaws.com/pipeu-us/images/billing/flag-amex.png">
                <img class="banners" src="https://pipeu-us.s3.amazonaws.com/clients/cozinha/images/billing/vr-vale-refeicao.jpeg" style="width: auto;height: 35px;">
                <img class="banners" src="https://pipeu-us.s3.amazonaws.com/images/billing/flag-sodexo.png">
                <img class="banner-ticket banners" src="https://pipeu-us.s3.amazonaws.com/images/billing/flag-ticket.png" style="width: auto;height: 35px;">
                <img class="banners" src="https://pipeu-us.s3.amazonaws.com/images/billing/bandeiraben.png">

                <img class="banners" src="https://pipeu-us.s3.amazonaws.com/images/billing/ppay-icon.png" style="width: auto;height: 35px;">
                <img class="banners" src="https://pipeu-us.s3.amazonaws.com/images/billing/flag-paypal.png">
            </div>
        </div>
    </div>

<!--    <div class="row" style="background-color: #ffffff; padding: 30px 0;">-->
<!--        <div class="col s12 l12">-->
<!--            <a href="https://transparencyreport.google.com/safe-browsing/search?url=cozinha.com.br&amp;hl=pt_BR" title="Google Safe Browsing" target="_blank" rel="noopener noreferrer" class="certificado-google banners">-->
<!--                <img data-cfsrc="https://www.beleaf.com.br/pub/static/version1590116316/frontend/Beleaf/beleaf/pt_BR/images/certificadogooglesafe.png" alt="" src="https://www.beleaf.com.br/pub/static/version1590116316/frontend/Beleaf/beleaf/pt_BR/images/certificadogooglesafe.png">-->
<!--            </a>-->
<!--        </div>-->
<!--    </div>-->

</div>
</template>

<script>
    import {mapState} from 'vuex'
    import CartView from "./payment/CartView"
    import CheckDeliveryRadiusUserAddress from "./user/CheckDeliveryRadiusUserAddress"

    export default {
        name: 'FooterPipeu',
        components: {CheckDeliveryRadiusUserAddress, CartView},

        computed: {
            ...mapState({
                counter: state => state.counter,
                store: state => state.store,
                userAccount: state => state.userAccount,
                userLogged: state => state.userLogged
            })
        }
    }
</script>

<style>
    .store-info {
        color: #ffffff;
        font-size: 11px;
    }

    .footer {
      /*background-color: #2d2240;*/
      background-color: #000000;
      padding: 100px 0;
    }

    /*media="screen and (min-width: 768px)"*/
    .banners {
        margin-top: 20px;
        margin: auto 15px;
        /*vertical-align: middle;*/
        object-fit: contain;
    }
</style>
