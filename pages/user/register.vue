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
            <v-img
              :src="require('assets/images/badge-register.jpg')"
              max-width="300"
              class="mb-6"
              alt="فردی در حال ثبت نام در سایت گلدیبا"
              title="ثبت نام در سایت"
            ></v-img>
          </v-row>

          <v-row align="center" justify="center">
            <!-- Stepper  -->
            <v-stepper v-model="s">
              <v-stepper-header>
                <v-stepper-step :complete="s > 1" step="1" :vertical="true">
                  ورود شماره همراه
                </v-stepper-step>

                <v-divider></v-divider>

                <v-stepper-step :complete="s > 2" step="2">
                  اعتبارسنجی کد تایید
                </v-stepper-step>

                <v-divider></v-divider>

                <v-stepper-step step="3">
                  تکمیل اطلاعات
                </v-stepper-step>
              </v-stepper-header>

              <v-stepper-items>
                <!-- Step 1 -->
                <v-stepper-content step="1" class="step">
                  <v-row>
                    <v-col>
                      <span>لطفا شماره تلفن همراه خود را وارد کنید:</span>

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
                          append-outer-icon="mdi-cellphone-iphone"
                          class="left-align-input"
                          filled
                          rounded
                          required
                        ></v-text-field>
                      </v-form>

                      <v-btn
                        color="secondary"
                        class="pa-6"
                        :disabled="!valid1"
                        @click="reqVerification()"
                        block
                        rounded
                        depressed
                      >
                        ارسال کد
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-stepper-content>

                <!-- Step2 -->
                <v-stepper-content step="2" class="step">
                  <v-row>
                    <v-col>
                      <span>
                        لطفا کد تایید ارسال شده برای {{ this.mobile }} را وارد
                        کنید:
                      </span>

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
                          append-outer-icon="mdi-lock-question"
                          type="number"
                          label="کد تایید"
                          filled
                          rounded
                          required
                        ></v-text-field>
                      </v-form>

                      <v-btn
                        color="secondary"
                        :disabled="!valid2"
                        class="pa-7"
                        @click="verifyPhone()"
                        block
                        rounded
                        depressed
                      >
                        اعتبارسنجی
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-stepper-content>

                <!-- Step 3 -->
                <v-stepper-content step="3" class="step">
                  <v-row>
                    <v-col>
                      <span
                        >لطفا اطلاعات خود را برای تکمیل ثبت نام وارد
                        نمایید:</span
                      >

                      <v-form
                        ref="form3"
                        lazy-validation
                        v-model="valid3"
                        class="ma-4"
                        @submit.prevent="registerUser()"
                      >
                        <v-text-field
                          type="text"
                          label="شماره همراه"
                          v-model="mobile"
                          append-outer-icon="mdi-cellphone-iphone"
                          required
                          disabled
                          class="left-align-input"
                          filled
                          rounded
                        ></v-text-field>

                        <v-text-field
                          type="text"
                          label="نام"
                          v-model="firstname"
                          append-outer-icon="mdi-card-account-details"
                          :rules="firstnameRules"
                          filled
                          rounded
                          required
                        ></v-text-field>

                        <v-text-field
                          type="text"
                          label="نام خانوادگی (اختیاری)"
                          append-outer-icon="mdi-card-account-details-outline"
                          v-model="lastname"
                          filled
                          rounded
                        ></v-text-field>

                        <br />

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
                          required
                          class="left-align-input"
                          @keyup.enter="registerUser()"
                          filled
                          rounded
                        ></v-text-field>
                      </v-form>

                      <v-btn
                        color="secondary"
                        class="pa-7"
                        :disabled="!valid3"
                        @click="registerUser()"
                        block
                        rounded
                        depressed
                      >
                        پایان ثبت نام
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-stepper-content>
              </v-stepper-items>
            </v-stepper>
          </v-row>

          <v-row align="center" justify="center" class="mt-5">
            <nuxt-link to="/user/login">قبلا ثبت‌نام کرده‌ام</nuxt-link>
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
  name: "Register",
  middleware: ["guest"],

  head: {
    title: "ثبت نام"
  },

  data: () => ({
    page_title: "ثبت نام", // page title
    s: 1, // step model
    overlay: false, // loading

    // form models
    valid1: true,
    valid2: true,
    valid3: true,

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

    firstname: "",
    lastname: "",
    firstnameRules: [req => !!req || "وارد کردن نام الزامی است."],

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
        .$post("request-verification/", {
          mobile: this.mobile
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
        .$post("verify-phone/", {
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

    registerUser(e) {
      if (!this.$refs.form3.validate()) return;

      this.overlay = true;
      this.$axios
        .$post("register-user/", {
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
    }
  },

  // computed: {
  //   passwordConfirmationRule() {
  //     return () =>
  //       this.pass1 === this.pass2 || "گذرواژه‌های وارد شده یکسان نیستند.";
  //   }
  // },

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
