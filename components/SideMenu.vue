<template>
  <div>
  <div id="slide-out" class="sidenav"><!--sidenav-fixed-->
    <div class="pip-account">

      <div v-if="getUserAccount" class="infos">
        <div class="row">
          <div class="col s4">
            <div class="gb_Hb" style="position:relative">
              <img :src="getUserProfilePhoto(getUserAccount)" alt="">
              <span @click="showUploadProfilePhoto = true" class="gb_ob" style="cursor: pointer;">Alterar</span>
            </div>
          </div>
          <div class="col s8">
            <h6 style="margin: 0">{{getUserAccount.fullName}}</h6>
            <p>{{getUserAccount.email}}</p>
            <CreditBalance></CreditBalance>
          </div>
        </div>
      </div>

      <div v-if="menu && menu.enabled" class="collection"><!-- customer mobile menu -->
        <template v-for="(itemMenu, key, index) in menu.items">
            <a class="collection-item" style="color: #C83B6B; padding: 5px; margin-left: 10px;" v-bind:href="itemMenu.a.href">{{itemMenu.a.name}}</a>
        </template>
      </div>

      <template v-if="getUserAccount">
        <div class="collection">
          <h6>Minha Conta</h6>
          <!--<a href="pipeu-conta-favorito-vazio.html" class="collection-item"><i class="material-icons left">favorite</i>Favoritos</a>-->
          <!--The Class sidenav-close is very important, in SPA it will close sidenav after click-->
          <template v-if="getAppTemplateInstalled(10)">
            <nuxt-link to="/myaccount/events/tickets" class="sidenav-close collection-item"><i class="material-icons left">local_play</i>Ingressos</nuxt-link>
          </template>
          <nuxt-link to="/myaccount/order" class="sidenav-close collection-item"><i class="material-icons left">list_alt</i>Pedidos</nuxt-link>
          <nuxt-link to="/myaccount" class="sidenav-close collection-item"><i class="material-icons left">settings</i>Configurações</nuxt-link>
        </div>
        <div class="collection section">
          <template v-if="isAdmin()">
            <h6>Meus Eventos</h6>
            <a href="/app" class="collection-item"><i class="material-icons left">event</i>Administrar Loja</a>
          </template>

          <template v-if="getUserAccount.storesRoles && getUserAccount.storesRoles.length > 0">

            <!--If user has just one Store then....>-->
            <template v-if="getUserAccount.storesRoles.length == 1">
              <a @click="goToStore(getUserAccount.storesRoles[0])" target="_blank" class="collection-item" style="cursor: pointer;"><i class="material-icons left">store</i>Gerenciar Minha Loja</a>
            </template>

            <!--TODO: If User has more than one Store Role show a Popup so that he can choice which store to manage-->
            <!--For now going to Admin App that already show a list of Stores do manage-->
            <template v-else>

              <!--<a href="/app" class="collection-item"><i class="material-icons left">store</i>Gerenciar Minhas Lojas</a>-->
              <a @click="showStoreList = !showStoreList" class="collection-item" style="cursor: pointer;"><i class="material-icons left">store</i>Gerenciar Minhas Lojas</a>

            </template>
          </template>

          <!--Disabled until we launch the Feature for end user create Stores and Events-->
          <!--<div>-->
            <!--<a class="btn" href="/app/saas/wizard/newStore">Criar evento</a>-->
          <!--</div>-->
        </div>
      </template>



    </div>

  </div>


    <client-only>
      <component v-if="mounted && showUploadProfilePhoto" :is="pipFileUploadV2" @fileupload-success="fileUploadSuccess" @close="showUploadProfilePhoto = false" component-name="profilePhoto" v-model="userAccount.profilePhoto" ref="myRefPureDropZone"></component>
    </client-only>

    <template v-if="showStoreList">
      <StoreList @go-to-store="goToStore"></StoreList>
    </template>

  </div>

</template>

<script>
  import { mapGetters, mapState, mapActions } from 'vuex'
  import auth from '@/store/auth'
  import basicuicomponent from '@/mixins/BasicUIComponent'
  import api from '@/pipeuapi/api'
  import axios from 'axios'
  import Cookie from 'js-cookie'
  import StoreList from "./common/StoreList";
  import CreditBalance from './user/CreditBalance';

  export default {
    name: 'SideMenu',
    components: { CreditBalance, StoreList},
    mixins: [basicuicomponent],
    computed: {
      ...mapState(['userAccount', 'creditBalance']),
      ...mapGetters(['getStore','getUserAccount','getAppTemplateInstalled','getAuthorizedAppsModules', 'getCreditBalance']),
    },
    props: {
        menu: {
            type: Object,
            default: function () {
                return []
            }
        }
    },
    watch: {
      userAccount: {
        handler: function(newValue) {
        },
        deep: true
      }
    },

    data: function() {
      return {
        showStoreList: false,
        showUploadProfilePhoto: false
      }
    },

    mounted () {
      if (process.client) {
        this.pipFileUploadV2 = () => import(`~/components/pipeu/common/PipFileUploadV2`)
        this.mounted = true
      }

      this.$nextTick(function() {
        var sidenavs = document.querySelectorAll('.sidenav')
        for (var i = 0; i < sidenavs.length; i++) {
          M.Sidenav.init(sidenavs[i], {
            // edge: 'right', // Choose the horizontal origin
          })
        }
      })
      M.AutoInit()
    },

    methods: {
      ...mapActions(['addUserAccount', 'addAuthToken']),

      goToStore (storeRole) {
        let vm = this
        console.log('### goToStore storeRole', storeRole)
        auth.getTempAliasToken().then((res) => {
          console.log('### Return getTempAliasToken', res)
          let resData = res.data
          console.log('resData:', resData)

          if (process.env.NODE_ENV === 'development') {

            axios.put('/store/changeDevelopmentStore/' + storeRole.storeId, {headers: {'Content-Type': 'application/json'}}).then((innerRes) => {
              console.log('### Return changeDevelopmentStore', innerRes)
              // Remove token to simulate redirect to another domain
              auth.setAuthToken('')
              Cookie.set(auth.API.TOKEN_KEY, '') // saving token in cookie for server rendering

              window.location = 'http://localhost:8081/app?AT=' + resData.data.aliasToken

            },(error) => {
              console.log('error on changeDevelopmentStore ',error)
            })
          } else {
            window.location = storeRole.storeUrl + '/app?AT=' + resData.data.aliasToken
          }

        },(error) => {
          console.log('error on goToStore ',error)
        })
      },

      logout () {
        auth.logout().then((response) => {
          this.$router.go(auth.loginPath)
        })
      },
      checkAllowedRoles(roles) {
        return auth.checkAllowedRoles(roles)
      },

      fileUploadSuccess (file) {
        this.deb('fileUploadSuccess file', file)
        console.dir(file)
        this.updateProfilePhoto(file);
      },

      updateProfilePhoto (file) {
        let vm = this
        console.log('updateProfilePhoto profilePhoto:', file.fullURL)
        api.updateProfilePhoto(file.fullURL).then((res) => {
          console.log('updateProfilePhoto res', res.data)

          vm.addUserAccount(res.data)
          vm.$toast.success('Ok !')

        }, (error) => {
          vm.handleApiError(error)
        })
      }

    }
  }
</script>
<style scoped>
  .pip-background-color {
    background-color: #002b4d!important;
  }
  .gb_Hb .gb_ob {
    background: rgba(0,0,0,.54);
  }
  .gb_ob {
    background: rgba(78,144,254,.7);
    bottom: 0;
    color: #fff;
    font-size: 9px;
    font-weight: bold;
    left: 0;
    line-height: 9px;
    position: absolute;
    padding: 7px 0;
    text-align: center;
    width: 80px;
  }
  .gb_Hb {
    -webkit-border-radius: 50%;
    border-radius: 50%;
    overflow: hidden;
    -webkit-transform: translateZ(0);
  }
</style>
