<template>
  <div class="pb-10">
    <v-row>
      <v-col sm="3" md="3" lg="2">
        <side-bar :menues="menues"></side-bar>
      </v-col>

      <v-col sm="9" md="9" lg="10">
        <v-card
          v-if="
            this.$route.path === '/admin/statistic/' ||
              this.$route.path === '/admin/statistic'
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
            توضیحات
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
  name: "StatisticDashboard",

  components: {
    sideBar
  },

  validate({ params, query, store }) {
    return store.getters["isUserStaff"];
  },

  data() {
    return {
      page_title: "داشبورد آمار",
      page_subtitle: "نمای کلی از داشبورد آمار",

      // overlay
      overlay: false,

      menues: [
        {
          title: "",
          items: [
            {
              type: "group",
              value: true,
              title: "آمار",
              icon: "mdi-chart-arc",
              active: true,
              items: [
                {
                  title: "سفارش‌ها",
                  link: "/admin/statistic/orders/",
                  icon: "mdi-cart",
                  active: true
                },
                {
                  title: "کاربران",
                  link: "/admin/statistic/users/",
                  icon: "mdi-account-multiple",
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
