<template>
  <div>
    <!-- Overlay on screen -->
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </v-overlay>

    <v-container fluid>
      <v-row>
        <v-col cols="12">
          <v-row align="center" justify="center">
            <img
              src="~assets/images/badge-login.svg"
              style="max-width: 300px; margin-right: -25px"
              class="mb-6"
              alt="قفل"
              title="قفل"
            />
          </v-row>

          <v-row align="center" justify="center">
            <v-col sm="10" md="5" lg="4" xs="3">
              <v-card class="pa-8">
                <v-form
                  ref="login"
                  v-model="login_valid"
                  class="ma-4"
                  @submit.prevent="login()"
                >
                  <v-text-field
                    v-model="user.mobile"
                    :rules="mobileRules"
                    label="شماره همراه"
                    hint="راهنما: با 0 اول وارد کنید نه با +98"
                    :append-outer-icon="'mdi-cellphone-iphone'"
                    class="left-align-input"
                    rounded
                    filled
                    required
                  ></v-text-field>

                  <v-text-field
                    v-model="user.password"
                    :rules="passRules"
                    label="گذرواژه"
                    hint="حداقل طول گذرواژه 4 کاراکتر"
                    :type="hidepass ? 'password' : 'text'"
                    :append-outer-icon="hidepass ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append-outer="() => (hidepass = !hidepass)"
                    class="left-align-input"
                    @keyup.enter="login()"
                    rounded
                    required
                    filled
                  ></v-text-field>

                  <v-btn
                    color="secondary"
                    :disabled="!login_valid"
                    @click="login()"
                    class="mt-5 pa-6"
                    depressed
                    rounded
                    block
                  >
                    ورود
                  </v-btn>
                </v-form>
              </v-card>

              <v-row align="center" justify="center" class="mt-5">
                <nuxt-link to="/user/register">هنوز ثبت‌نام نکرده‌ام</nuxt-link>
                <span class="mr-5 ml-5">|</span>
                <nuxt-link to="/user/reset-password/"
                  >رمزم یادم نمیاد</nuxt-link
                >
              </v-row>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>

    <!-- Snackbar for messages -->
    <transition name="fab-transition" mode="out-in">
      <v-snackbar
        v-model="snackbar.visible"
        transition="fab-transition"
        :color="this.snackbar.color"
        top
      >
        <span>
          {{ snackbar.value }}
        </span>

        <v-btn color="white" text @click="snackbar.visible = false">
          بستن
        </v-btn>
      </v-snackbar>
    </transition>
  </div>
</template>

<script>
export default {
  name: "Login",
  middleware: ["guest"],

  head: {
    title: "ورود"
  },

  data: () => ({
    page_title: "ورود",

    // Login form
    login_valid: true,
    user: {
      mobile: "",
      password: ""
    },

    // mobile: "",
    mobileRules: [
      val => !!val || "وارد کردن شماره همراه الزامی است.",
      len => (len && len.length == 11) || "لطفا یک عدد 11 رقمی وارد کنید.",
      reg => /^09\d{9}$/.test(reg) || "عدد وارد شده صحیح نیست."
    ],

    // pass1: "",
    hidepass: true,

    passRules: [
      val => !!val || "وارد کردن گذرواژه الزامی است.",
      len => len.length >= 4 || "گذرواژه حداقل باید 4 حرف باشد."
    ],

    // Overlay
    overlay: false, // loading

    // Snackbar
    snackbar: {
      visible: false,
      value: "خطایی رخ داده است.",
      color: "info"
    }
  }),

  methods: {
    login(e) {
      if (!this.$refs.login.validate()) return;

      this.overlay = true;

      this.$auth
        .loginWith("local", {
          data: this.user
        })
        // .then(response => {
        //   this.$auth.$state.permissions = response.data.permissions;
        // })
        .catch(error => {
          this.overlay = false;

          if (error.response !== null && error.response !== undefined) {
            this.snackbar.value = error.response.data.message;
          } else {
            this.snackbar.value = "سرور در دسترس نیست.";
          }

          this.snackbar.color = "error";
          this.snackbar.visible = true;
        });
    }
  },

  mounted() {
    this.$store.commit("SET_PAGE_TITLE", this.page_title); // Set page title
  }
};
</script>

<style>
.left-align-input input {
  text-align: left;
  direction: ltr;
}
</style>
