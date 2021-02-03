export default {

  created() {
  },

  mounted() {
    let vm = this
  },

  methods: {

    goToPath (url) {
      this.$router.replace({ path: url })
    },


  }
}
