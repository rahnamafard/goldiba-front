<template>
  <v-app>
    <nav-bar :drawer="drawer"></nav-bar>
    <top-bar :title="$store.state.pageTitle" :toggle="toggleNav"></top-bar>

    <v-container>
      <v-col sm="2">
        <slot name="sidebar"></slot>
      </v-col>

      <v-col sm="10">
        <slot name="content"></slot>
      </v-col>
    </v-container>

    <v-footer absolute class="font-weight-medium">
      <v-col class="text-center" cols="12">
        تمامی حقوق برای مجموعه
        <nuxt-link to="/">گلدیبا</nuxt-link>
        محفوظ است.
      </v-col>
    </v-footer>
  </v-app>
</template>

<script>
import navBar from "~/components/navBar.vue";
import topBar from "~/components/topBar.vue";
import { mapGetters } from "vuex";

export default {
  components: {
    topBar,
    navBar
  },

  data() {
    return {
      //   page_title: "کالا",
      //   items: [
      //     { title: "لیست کالا", icon: "mdi-view-dashboard" },
      //     { title: "کالای جدید", icon: "mdi-image" },
      //     { title: "دسته ها", icon: "mdi-help-box" }
      //   ],
      //   right: null
    };
  },

  methods: {}
};
</script>
