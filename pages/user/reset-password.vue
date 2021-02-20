<template>
  <div>
    <!-- Overlay on screen -->
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </v-overlay>

    <v-container fluid>
      <v-row align="center" justify="center">
        <v-col cols="12">
          <v-row align="center" justify="center">
            <img
              :src="img_src"
              style="max-width: 300px; margin-right: -25px"
              class="mb-6"
              :alt="currentTitle"
              :title="currentTitle"
            />
          </v-row>

          <v-row align="center" justify="center">
            <v-col sm="10" md="5" lg="4" xs="3">
              <v-card>
                <v-card-title class="pr-5 pl-5">
                  <span>{{ currentTitle }}</span>
                  <v-avatar
                    color="primary lighten-2"
                    class="subheading white--text"
                    size="24"
                    v-text="s"
                  ></v-avatar>
                </v-card-title>

                <v-divider></v-divider>

                <v-window v-model="s" class="pa-5 pb-0">
                  <v-window-item :value="1">
                    <v-form
                      ref="form1"
                      v-model="valid1"
                      class="ma-4"
                      @submit.prevent="reqVerification()"
                    >
                      <v-text-field
                        v-model="mobile"
                        :rules="mobileRules"
                        label="شماره همراه"
                        hint="راهنما: با 0 اول وارد کنید نه با +98"
                        placeholder="09xxxxxxxxx"
                        class="left-align-input"
                        rounded
                        filled
                        required
                      ></v-text-field>
                    </v-form>
                  </v-window-item>

                  <v-window-item :value="2">
                    <v-form
                      ref="form2"
                      v-model="valid2"
                      lazy-validation
                      class="ma-4"
                      @submit.prevent="verifyPhone()"
                    >
                      <v-text-field
                        v-model="verification"
                        :counter="4"
                        :rules="verificationRules"
                        type="number"
                        label="کد تایید"
                        rounded
                        filled
                        required
                      ></v-text-field>
                    </v-form>
                  </v-window-item>

                  <v-window-item :value="3">
                    <v-alert type="success" color="secondary">
                      {{ user.firstname }} {{ user.lastname }} عزیز! <br />
                      می‌تونی گذرواژه جدیدت رو برای {{ mobile }} مشخص کنی!
                    </v-alert>

                    <v-form
                      ref="form3"
                      lazy-validation
                      v-model="valid3"
                      class="ma-4"
                      @submit.prevent="changePassword()"
                    >
                      <v-text-field
                        :type="hidepass ? 'password' : 'text'"
                        label="گذرواژه"
                        v-model="pass1"
                        :rules="passRules"
                        :append-outer-icon="
                          hidepass ? 'mdi-eye' : 'mdi-eye-off'
                        "
                        @click:append-outer="() => (hidepass = !hidepass)"
                        hint="حداقل طول گذرواژه 4 کاراکتر"
                        rounded
                        filled
                        required
                        class="left-align-input"
                      ></v-text-field>
                    </v-form>
                  </v-window-item>
                </v-window>

                <v-divider></v-divider>

                <v-card-actions>
                  <v-btn
                    :disabled="buttonDisable"
                    color="secondary"
                    depressed
                    @click="handleStep()"
                    block
                    rounded
                  >
                    {{ buttonText }}
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>

          <v-row align="center" justify="center" class="mt-5">
            <nuxt-link to="/user/login">رمزم یادمه</nuxt-link>
            <span class="mr-5 ml-5">|</span>
            <nuxt-link to="/user/register/">یه اکانت جدید میسازم</nuxt-link>
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
        {{ snackbar.value }}

        <v-btn color="white" text @click="snackbar.visible = false">
          بستن
        </v-btn>
      </v-snackbar>
    </transition>
  </div>
</template>

<script>
export default {
  name: "ResetPassword",
  middleware: ["guest"],

  head: {
    title: "بازیابی گذرواژه"
  },

  data: () => ({
    page_title: "بازیابی گذرواژه", // page title

    s: 1, // step model
    overlay: false, // loading

    // form models
    valid1: false,
    valid2: false,
    valid3: false,

    // user data given from backend
    user: {
      firstname: "",
      lastname: ""
    },

    mobile: "",
    mobileRules: [
      val => !!val || "وارد کردن شماره همراه الزامی است.",
      len => (len && len.length == 11) || "لطفا یک عدد 11 رقمی وارد کنید.",
      reg => /^09\d{9}$/.test(reg) || "عدد وارد شده صحیح نیست."
    ],

    verification: "",
    verificationRules: [
      val => !!val || "وارد کردن کد تایید الزامی است.",
      num => !isNaN(num) || "لطفا عدد وارد کنید.",
      len => (len && len.length == 4) || "طول کد تایید اشتباه است."
    ],

    pass1: "",
    hidepass: true,

    passRules: [
      val => !!val || "وارد کردن گذرواژه الزامی است.",
      len => len.length >= 4 || "گذرواژه حداقل باید 4 حرف باشد."
    ],

    snackbar: {
      visible: false,
      value: "سرور در دسترس نیست.",
      color: "info"
    }
  }),

  methods: {
    reqVerification(e) {
      if (!this.$refs.form1.validate()) return;

      this.overlay = true;
      this.$axios
        .$get("user/request-reset-password-code/", {
          params: {
            mobile: this.mobile
          }
        })

        .then(respond => {
          this.overlay = false;
          if (respond.type === "ok") {
            this.s++;
            this.snackbar.color = "success";
          } else if (resond.type === "error") {
            this.s--;
            this.snackbar.color = "error";
          }

          this.snackbar.value = respond.message;
          this.snackbar.visible = true;
        })

        .catch(error => {
          this.overlay = false;

          if (error.response !== null && error.response !== undefined) {
            if (error.response.status >= 400) {
              this.snackbar.value = error.response.data.message;
            } else {
              this.snackbar.value = "خطایی از سمت سرور رخ داده است.";
            }
          }

          this.snackbar.color = "error";
          this.snackbar.visible = true;
        });
    },

    verifyPhone(e) {
      if (!this.$refs.form2.validate()) return;

      this.overlay = true;
      this.$axios
        .$post("user/verify-reset-password-code/", {
          mobile: this.mobile,
          verification: this.verification
        })

        .then(respond => {
          this.overlay = false;
          if (respond.type === "ok") {
            this.s++;
            this.snackbar.color = "success";
          } else if (respond.type === "error") {
            this.s--;
            this.$refs.form2.reset();
            this.snackbar.color = "error";
          }

          // set firstname & lastname
          this.user.firstname = respond.data.user.firstname;
          this.user.lastname = respond.data.user.lastname;

          this.snackbar.value = respond.message;
          this.snackbar.visible = true;
        })

        .catch(error => {
          this.overlay = false;

          if (error.response.status >= 400) {
            this.snackbar.value = error.response.data.message;
          } else {
            this.snackbar.value = "خطایی از سمت سرور رخ داده است.";
          }

          this.snackbar.color = "error";
          this.snackbar.visible = true;
          this.s--;
        });
    },

    changePassword(e) {
      if (!this.$refs.form3.validate()) return;

      this.overlay = true;
      this.$axios
        .$post("user/reset-password", {
          mobile: this.mobile,
          first_name: this.firstname,
          last_name: this.lastname,
          password: this.pass1
        })

        .then(respond => {
          this.overlay = false;

          if (respond.type === "ok") {
            this.snackbar.color = "success";
            this.snackbar.value = respond.message;
            this.snackbar.visible = true;

            let user = {
              mobile: this.mobile,
              password: this.pass1
            };

            this.$auth
              .loginWith("local", {
                data: user
              })
              .catch(error => {
                console.log(error);
                this.overlay = false;

                if (error.response !== null && error.response !== undefined) {
                  this.snackbar.value = error.response.data.detail;
                } else {
                  this.snackbar.value = "سرور در دسترس نیست.";
                }

                this.snackbar.color = "error";
                this.snackbar.visible = true;
              });

            // redirect to home
            // setTimeout(resolve => {
            //   this.$nuxt.$router.replace({ path: "/" });
            // }, 1000);
          } else if (respond.type === "error") {
            this.s--;
            this.$refs.form2.reset();
            this.snackbar.color = "error";
            this.snackbar.value = respond.message;
            this.snackbar.visible = true;
          }
        })

        .catch(error => {
          this.overlay = false;

          if (error.response.status >= 400) {
            this.snackbar.value = error.response.data.message;
          } else {
            this.snackbar.value = "خطایی از سمت سرور رخ داده است.";
          }

          this.snackbar.color = "error";
          this.snackbar.visible = true;
        });
    },

    handleStep(e) {
      switch (this.s) {
        case 1:
          this.reqVerification(e);
          break;
        case 2:
          this.verifyPhone(e);
          break;
        case 3:
          this.changePassword(e);
          break;
      }
    }
  },

  computed: {
    currentTitle() {
      switch (this.s) {
        case 1:
          return "درخواست کد تایید";
        case 2:
          return "اعتبارسنجی کد تایید";
        default:
          return "تغییر گذرواژه";
      }
    },

    img_src() {
      switch (this.s) {
        case 2:
          return require("assets/images/badge-reset-password-step2.svg");
        case 3:
          return require("assets/images/badge-reset-password-step3.svg");
        default:
          return require("assets/images/badge-reset-password-step1.svg");
      }
    },

    buttonText() {
      switch (this.s) {
        case 2:
          return "ببین درسته؟";
        case 3:
          return "همین گذرواژه خوبه!";
        default:
          return "کد تایید رو بفرست!";
      }
    },

    buttonDisable() {
      switch (this.s) {
        case 2:
          return !this.valid2;
        case 3:
          return !this.valid3;
        default:
          return !this.valid1;
      }
    }
  },

  mounted() {
    this.$store.commit("SET_PAGE_TITLE", this.page_title); // Set page title
  }
};
</script>

<style>
.step {
  text-align: right;
}

.left-align-input input {
  text-align: left;
  direction: ltr;
}
</style>
