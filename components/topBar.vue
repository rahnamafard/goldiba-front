<template>
  <v-app-bar color="transparent" app flat>
    <v-app-bar-nav-icon
      @click.stop="toggle()"
      class="mr-2"
    ></v-app-bar-nav-icon>

    <v-toolbar-title>
      {{ title }}
    </v-toolbar-title>

    <v-spacer></v-spacer>

    <v-btn
      class="ml-2"
      color="info"
      to="/user/login/"
      v-if="!isAuth"
      text
      icon
      nuxt
    >
      <v-icon>mdi-login</v-icon>
    </v-btn>

    <v-btn
      class="ml-4"
      color="info"
      to="/user/register/"
      v-if="!isAuth"
      icon
      nuxt
    >
      <v-icon>mdi-account-plus</v-icon>
    </v-btn>

    <div class="ml-5">
      <div v-show="basket_size > 0">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-badge bottom color="secondary" dot offset-x="37" offset-y="20">
              <v-btn
                color="info"
                to="/order/basket/"
                v-bind="attrs"
                v-on="on"
                icon
                nuxt
              >
                <v-icon>mdi-basket</v-icon>
              </v-btn>
            </v-badge>
          </template>
          <span>سبد خرید</span>
        </v-tooltip>
      </div>

      <div v-show="basket_size <= 0">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="info"
              to="/order/basket/"
              v-bind="attrs"
              v-on="on"
              icon
              nuxt
            >
              <v-icon>mdi-basket</v-icon>
            </v-btn>
          </template>
          <span>سبد خرید</span>
        </v-tooltip>
      </div>
    </div>

    <nuxt-link to="/user/profile/" v-if="isAuth">
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-avatar class="ml-4" v-bind="attrs" v-on="on">
            <img src="~assets/images/profile.svg" />
          </v-avatar>
        </template>
        <span>{{
          loggedInUser.first_name + " " + loggedInUser.last_name
        }}</span>
      </v-tooltip>
    </nuxt-link>

    <nuxt-link to="/">
      <img
        src="~assets/images/logo/logo-transparent.png"
        style="max-height: 45px;"
        class="ml-2 mt-1"
        alt="گلدیبا؛ حسی زیبا"
        title="گلدیبا؛ حسی زیبا"
      />
    </nuxt-link>
  </v-app-bar>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: ["title", "toggle"],

  computed: {
    ...mapGetters({
      isAuth: "isAuthenticated",
      loggedInUser: "loggedInUser"
    }),
    ...mapGetters("basket", {
      basket_size: "length"
    })
  }
};
</script>
