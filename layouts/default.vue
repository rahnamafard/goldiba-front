<template>
  <v-app>
    <nav-bar :drawer="drawer"></nav-bar>
    <top-bar :title="$store.state.pageTitle" :toggle="toggleNav"></top-bar>

    <div class="mt-12 pa-5 mb-16">
      <v-container fluid>
        <v-row align="center" justify="center">
          <v-col cols="12">
            <nuxt />
          </v-col>
        </v-row>
      </v-container>

      <v-footer absolute class="font-weight-medium">
        <v-col class="text-center" cols="12">
          تمامی حقوق برای مجموعه
          <nuxt-link to="/">گلدیبا</nuxt-link>
          محفوظ است.
        </v-col>
      </v-footer>
    </div>
  </v-app>
</template>

<script>
import navBar from "~/components/navBar.vue";
import topBar from "~/components/topBar.vue";
import { mapGetters } from "vuex";

export default {
  name: "Default", // Resoolving this error: Invalid component name: "layouts/default.vue". Component names should conform to valid custom element name in html5 specification.

  components: {
    topBar,
    navBar
  },

  data() {
    return {
      drawer: false
    };
  },

  methods: {
    toggleNav(e) {
      this.drawer = !this.drawer;
    }
  }
};
</script>
