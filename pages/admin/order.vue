<template>
  <div class="pb-10">
    <v-row>
      <v-col sm="3" md="3" lg="2">
        <side-bar :menues="menues"></side-bar>
      </v-col>

      <v-col sm="9" md="9" lg="10">
        <v-card
          v-if="
            this.$route.path === '/admin/order/' ||
              this.$route.path === '/admin/order'
          "
        >
          <v-card-title>
            {{ page_title }}
          </v-card-title>

          <v-card-subtitle>
            {{ page_subtitle }}
          </v-card-subtitle>

          <v-divider></v-divider>

          <v-card-text>
            محل نمایش اطلاعات کلی سفارشات از قبیل آخرین سفارشات و...
          </v-card-text>
        </v-card>

        <nuxt-child />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import sideBar from "~/components/sideBar.vue";

export default {
  name: "OrderDashboard",

  components: {
    sideBar
  },

  validate({ params, query, store }) {
    return store.getters["isUserStaff"];
  },

  data() {
    return {
      page_title: "داشبورد سفارشات",
      page_subtitle: "نمای کلی از داشبورد سفارشات",

      // overlay
      overlay: false,

      menues: [
        {
          title: "",
          items: [
            {
              type: "group",
              value: true,
              title: "سفارشات",
              icon: "mdi-cart-arrow-down",
              active: true,
              items: [
                {
                  title: "لیست سفارشات",
                  link: "/admin/order/list/",
                  icon: "mdi-format-list-bulleted-type",
                  active: true
                }
              ]
            }
          ]
        }
      ],

      right: null
    };
  },

  head() {
    return {
      title: this.page_title
    };
  },

  mounted() {
    this.$store.commit("SET_PAGE_TITLE", this.page_title); // Set page title
  }
};
</script>
