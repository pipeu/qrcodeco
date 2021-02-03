<template>
    <div class="pip-login page">
        Test
    </div>
</template>

<script>
  import {mapMutations, mapGetters, mapActions} from 'vuex'
  import pipeuApi from '~/pipeuapi/api.js'
  import basicuicomponent from '@/mixins/BasicUIComponent'
  import PipButton from "@/components/pipeu/common/PipButton";
  import HeaderPipeu from "../../components/HeaderPipeu";

  export default {
    name: 'Account',
    mixins: [basicuicomponent],

    data () {
      return {
        some: {
        }
      }
    },
    components: {
      HeaderPipeu,
      PipButton,
    },

    async mounted () {
      let vm = this

      console.log('### test.created testing pipeuApi.getProductV2...')
      try {
        let res = await pipeuApi.getProductV2('4d413118-4e98-4f02-aa6b-a7249a9cc672')
        console.log('res', res)
        console.log('res.json()', res.json())
        console.log('res.result', res.result)
      }catch (e) {
        console.log('error',e)
      }

    },

    methods: {
      ...mapActions(['addUserAccount', 'addAuthToken']),
      ...mapGetters(['getStore', 'getUserAccount', 'getDomain']),

      update () {
      }
    }

  }
</script>
<style scoped>
</style>
