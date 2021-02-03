<template>
  <div class="row divise">
    <div class="col">
      <div v-if="$breadcrumbs.length" class="col s12 no-padding" style="margin-bottom: 5px;">

        <template v-for="crumb in $breadcrumbs">
          <router-link :to="linkProp(crumb)" class="breadcrumb">{{ crumb | crumbText }}</router-link>
        </template>

      </div>
    </div>
  </div>
</template>

<script>
  /* eslint-disable indent */
  import { mapGetters } from 'vuex'

  export default {
    name: 'BreadCrumb',

    computed: {
      ...mapGetters([
        'getStore','getUserAccount'
      ])
    },

    created: function () {
      // console.log('###### BreadCrumb.created this.$breadcrumbs:', this.$breadcrumbs)
    },

    filters: {
      // Display the correct breadcrumb text
      // depending on the Vue version
      crumbText: function (crumb) {
        return crumb.meta.breadcrumb
      }
    },

    methods: {

      // Return the correct prop data
      linkProp: function (crumb) {
        // If it's a named route, we'll base the route
        // off of that instead
        if (crumb.name || (crumb.handler && crumb.handler.name)) {
          return {
            name: crumb.name || crumb.handler.name,
            params: this.$route.params
          }
        }

        return {
          path: (crumb.handler && crumb.handler.fullPath)
            ? crumb.handler.fullPath
            : crumb.path,
          params: this.$route.params
        }
      }

    }

  }
</script>
<style scoped>
  .breadcrumb {
    color: #3085d6;
    font-size: 20px;
  }
  .breadcrumb:last-child {
    color: #3085d6;
    font-size: 20px;
  }
</style>
