<template>
  <v-navigation-drawer v-model="localDrawer" app temporary right>
    <template v-slot:prepend>
      <v-list-item two-line v-if="isAuth">
        <v-list-item-avatar>
          <img src="~assets/images/profile.svg" />
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>{{
            loggedInUser.first_name + " " + loggedInUser.last_name
          }}</v-list-item-title>
          <v-list-item-subtitle>
            {{ loggedInUser.mobile }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-list-item two-line v-if="!isAuth">
        <v-list-item-content>
          <v-list-item-title>فروشگاه آنلاین گلدیبا</v-list-item-title>
          <v-list-item-subtitle
            >امیدواریم از خریدت لذت ببری!</v-list-item-subtitle
          >
        </v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>
    </template>

    <!-- USER MENU -->
    <v-list v-if="isAuth" dense>
      <v-list-group prepend-icon="mdi-view-dashboard" value="true">
        <template v-slot:activator>
          <v-list-item-title>داشبورد کاربر</v-list-item-title>
        </template>

        <v-list-item
          v-for="item in user_list"
          :key="item.title"
          :to="item.link"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list-group>
    </v-list>

    <v-divider v-if="isAuth"></v-divider>

    <!-- STAFF MENU -->
    <v-list v-if="isAuth && isStaff" dense>
      <v-list-group prepend-icon="mdi-cog" value="true">
        <template v-slot:activator>
          <v-list-item-title>مدیریت سایت</v-list-item-title>
        </template>

        <v-list-item
          v-for="item in staff_list"
          :key="item.title"
          :to="item.link"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list-group>
    </v-list>

    <v-divider v-if="isAuth && isStaff"></v-divider>

    <!-- GLOBAL MENU -->
    <v-list dense>
      <v-list-group prepend-icon="mdi-asterisk" value="true">
        <template v-slot:activator>
          <v-list-item-title>منوی اصلی</v-list-item-title>
        </template>

        <v-list-item
          v-for="item in active_general_list"
          :key="item.title"
          :to="item.link"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: ["drawer"],

  watch: {
    drawer: function(newDrawer, oldDrawer) {
      this.localDrawer = !this.localDrawer;
    }
  },

  data() {
    return {
      localDrawer: this.drawer,
      general_list: [
        {
          title: "صفحه اصلی",
          link: "/",
          icon: "mdi-home",
          beforeAuth: true,
          afterAuth: true
        },
        {
          title: "ورود",
          link: "/user/login/",
          icon: "mdi-login",
          beforeAuth: true,
          afterAuth: false
        },
        {
          title: "ثبت نام",
          link: "/user/register/",
          icon: "mdi-account-plus",
          beforeAuth: true,
          afterAuth: false
        },
        {
          title: "تماس با ما",
          link: "/page/contact/",
          icon: "mdi-phone-message",
          beforeAuth: false,
          afterAuth: false
        },
        {
          title: "ارتباط با ما",
          link: "/page/about/",
          icon: "mdi-information",
          beforeAuth: false,
          afterAuth: false
        },
        {
          title: "راهنمای خرید",
          link: "/page/help/",
          icon: "mdi-help",
          beforeAuth: false,
          afterAuth: false
        },
        {
          title: "قوانین و شرایط استفاده",
          link: "/page/terms-conditions/",
          icon: "mdi-police-badge",
          beforeAuth: false,
          afterAuth: false
        },
        {
          title: "درخواست همکاری",
          link: "/page/coworking/",
          icon: "mdi-handshake",
          beforeAuth: false,
          afterAuth: false
        }
      ],
      staff_list: [
        {
          title: "محصولات",
          link: "/admin/product/list/",
          icon: "mdi-storefront"
        },
        {
          title: "سفارشات",
          link: "/admin/order/list/",
          icon: "mdi-newspaper-variant"
        },
        {
          title: "آمارها",
          link: "/admin/statistic/orders/",
          icon: "mdi-chart-box"
        }
      ],
      user_list: [
        // {
        //   title: "تنظیمات حساب",
        //   link: "/user/account/",
        //   icon: "mdi-account-cog"
        // },
        // {
        //   title: "پروفایل من",
        //   link: "/user/profile/",
        //   icon: "mdi-face-profile-woman"
        // },
        {
          title: "سفارش‌های من",
          link: "/user/profile/orders/",
          icon: "mdi-order-bool-descending"
        },
        {
          title: "خروج",
          link: "/user/logout/",
          icon: "mdi-logout"
        }
      ]
    };
  },

  computed: {
    ...mapGetters({
      loggedInUser: "loggedInUser",
      isAuth: "isAuthenticated",
      isStaff: "isUserStaff",
      isAdmin: "isUserAdmin"
    }),

    active_general_list() {
      return this.general_list.filter(item => {
        if (this.isAuth) return item.afterAuth;
        else return item.beforeAuth;
      });
    }
  }
};
</script>
