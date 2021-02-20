<template>
  <v-row>
    <v-col sm="4" md="3" lg="2">
      <side-bar :menues="menues"></side-bar>
    </v-col>

    <v-col
      sm="8"
      md="9"
      lg="10"
      v-if="
        this.$route.path === '/admin/product/' ||
          this.$route.path === '/admin/product'
      "
    >
      <v-card>
        <v-card-title>
          {{ page_title }}
        </v-card-title>

        <v-card-subtitle>
          {{ page_subtitle }}
        </v-card-subtitle>

        <v-divider></v-divider>

        <v-card-text>
          محل نمایش اطلاعات کلی محصولات از قبیل آخرین محصولات، پرفروش‌ترین‌ها،
          فروش روزانه و ماهیانه و غیره.
        </v-card-text>
      </v-card>
    </v-col>

    <v-col sm="8" md="9" lg="10">
      <nuxt-child />
    </v-col>
  </v-row>
</template>

<script>
import sideBar from "~/components/sideBar.vue";
import { mapGetters } from "vuex";

export default {
  name: "ProductDashboard",
  middleware: ["auth"],

  components: {
    sideBar
  },

  validate({ params, query, store }) {
    return store.getters["isUserStaff"]; // user is admin?
  },

  data() {
    let permissions = this.$auth.user.permissions;

    return {
      page_title: "پیش‌خوان محصولات",
      page_subtitle: "نمای کلی از پیش‌خوان محصولات",

      menues: [
        {
          title: "مدیریت محصولات",
          items: [
            {
              type: "group",
              value: true,
              title: "محصولات",
              icon: "mdi-storefront",
              active:
                permissions.includes("core.view_product") ||
                permissions.includes("core.add_product"),
              items: [
                {
                  title: "نمایش لیستی",
                  link: "/admin/product/list/",
                  icon: "mdi-format-list-bulleted-type",
                  active: permissions.includes("core.view_product")
                },
                {
                  type: "item",
                  title: "ایجاد محصول",
                  link: "/admin/product/form/",
                  icon: "mdi-plus",
                  active: permissions.includes("core.add_product")
                }
              ]
            },

            {
              type: "group",
              value: true,
              title: "طبقه‌بندی‌ها",
              icon: "mdi-shape",
              active:
                permissions.includes("core.view_product") ||
                permissions.includes("core.add_product"),
              items: [
                {
                  title: "دسته‌ها",
                  link: "/admin/product/category/",
                  icon: "mdi-format-list-bulleted-type",
                  active: permissions.includes("core.view_product")
                }
              ]
            }
          ]
        }

        // {}
      ],

      right: null
    };
  },

  head: {
    title: "داشبورد محصولات"
  },

  mounted() {
    this.$store.commit("SET_PAGE_TITLE", this.page_title); // Set page title
  },

  computed: {
    ...mapGetters({
      isAuth: "isAuthenticated",
      loggedInUser: "loggedInUser"
    })
  }
};
</script>
