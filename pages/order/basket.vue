<template>
  <div>
    <!-- Overlay on screen -->
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </v-overlay>

    <v-container>
      <v-row class="d-flex flex-column flex-sm-row mb-6">
        <!-- basket -->
        <v-col sm="6" md="6" lg="6">
          <basket-card
            v-for="item in cart"
            :key="item.model.model_id"
            :model="item.model"
            :quantity="item.quantity"
            :color_list="colors"
          ></basket-card>

          <v-alert text type="info" v-show="length == 0">
            سبد خرید خالی است
          </v-alert>

          <v-btn
            color="secondary"
            class="pa-7 mb-5"
            to="/"
            block
            rounded
            depressed
            outlined
            nuxt
          >
            ادامه خرید
          </v-btn>
        </v-col>

        <!-- sidebar -->
        <v-col sm="6" md="6" lg="6">
          <!-- info -->
          <v-card v-if="showSendInfoCard">
            <v-card-title>
              اطلاعات ارسال
            </v-card-title>

            <v-divider></v-divider>

            <v-card-text>
              <v-form
                ref="form"
                v-model="form_model"
                @submit.prevent="payBasket()"
                lazy-validation
              >
                <v-text-field
                  label="تلفن تماس"
                  v-model="order.phone"
                  prepend-icon="mdi-phone"
                  :rules="phoneRules"
                  filled
                  rounded
                  required
                ></v-text-field>

                <v-select
                  label="استان"
                  prepend-icon="mdi-map"
                  v-model="order.province"
                  :items="provinces"
                  item-text="name"
                  item-value="province_id"
                  :rules="provinceRules"
                  @change="loadCities"
                  return-object
                  filled
                  rounded
                ></v-select>

                <v-select
                  label="شهرستان"
                  prepend-icon="mdi-map-search"
                  v-model="order.city"
                  v-show="order.province !== null && order.province !== ''"
                  :items="cities"
                  item-text="name"
                  item-value="city_id"
                  @change="loadSendMethods"
                  :rules="cityRules"
                  :loading="!cities_loaded"
                  return-object
                  filled
                  rounded
                ></v-select>

                <v-text-field
                  label="کد پستی"
                  v-model="order.postal_code"
                  prepend-icon="mdi-post"
                  :rules="postalCodeRules"
                  filled
                  rounded
                  required
                ></v-text-field>

                <v-textarea
                  label="آدرس"
                  v-model="order.postal_address"
                  prepend-icon="mdi-map-marker"
                  :rules="postalAddressRules"
                  auto-grow
                  filled
                  rounded
                ></v-textarea>

                <v-select
                  label="نحوه ارسال"
                  prepend-icon="mdi-cube-send"
                  v-model="order.send_method"
                  v-show="order.city !== null && order.city !== ''"
                  :items="send_methods"
                  item-text="label"
                  item-value="send_method_id"
                  :hint="
                    order.send_method
                      ? order.send_method.alternative_price_text
                      : ''
                  "
                  :rules="sendMethodRules"
                  :loading="!send_methods_loaded"
                  persistent-hint
                  return-object
                  filled
                  rounded
                ></v-select>
              </v-form>
            </v-card-text>
          </v-card>

          <br />

          <v-card>
            <v-card-title>
              صورتحساب
            </v-card-title>

            <v-divider></v-divider>

            <v-card-text>
              <!-- model costs -->
              <v-simple-table dense>
                <template v-slot:default>
                  <tbody>
                    <tr v-for="item in cart" :key="item.model.model_id">
                      <td>{{ item.model.title }}</td>
                      <td class="grey--text">{{ item.quantity }} عدد</td>
                      <td class="text-left">
                        {{ item.model.price * item.quantity }} تومان
                      </td>
                    </tr>
                  </tbody>

                  <tbody v-if="order.send_method">
                    <tr
                      class="pa-0 ma-0 devider-tr"
                      v-if="order.send_method.price > 0"
                    >
                      <td colspan="3" class="pa-0 ma-0">
                        <v-divider class="mt-3 mb-2 dotted-devider"></v-divider>
                      </td>
                    </tr>
                  </tbody>

                  <!-- send method cost -->
                  <!-- <v-simple-table dense>
                <template v-slot:default> -->
                  <tbody v-if="order.send_method">
                    <tr v-if="order.send_method.price > 0">
                      <td>ارسال</td>
                      <td class="grey--text">{{ order.send_method.label }}</td>
                      <td class="text-left">
                        {{
                          order.send_method.price ? order.send_method.price : 0
                        }}
                        تومان
                      </td>
                    </tr>
                  </tbody>

                  <tbody>
                    <tr class="pa-0 ma-0 devider-tr">
                      <td colspan="3" class="pa-0 ma-0">
                        <v-divider class="mt-3 mb-2 dotted-devider"></v-divider>
                      </td>
                    </tr>
                  </tbody>

                  <tbody>
                    <tr>
                      <td class="font-weight-bold">مجموع</td>
                      <td></td>
                      <td class="text-left font-weight-bold">
                        {{ invoice }}
                        تومان
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-card-text>

            <v-card-title>
              پرداخت
            </v-card-title>

            <v-divider></v-divider>

            <v-card-text>
              <v-form ref="payment_form" v-model="payment_form" lazy-validation>
                <v-select
                  label="نحوه پرداخت"
                  prepend-icon="mdi-credit-card-settings-outline"
                  v-model="order.payment_method"
                  :items="payment_methods"
                  :hint="order.payment_method ? order.payment_method.hint : ''"
                  :rules="paymentMethodRules"
                  @change="checkPaymentMethod"
                  persistent-hint
                  return-object
                  filled
                  rounded
                ></v-select>

                <v-file-input
                  v-if="
                    order.payment_method && order.payment_method.value == 'OF'
                  "
                  v-model="attachment"
                  :rules="attachmentRules"
                  label="تصویر فیش واریزی"
                  accept=".png,.jpg,.jpeg"
                  prepend-icon="mdi-receipt"
                  show-size
                  filled
                  rounded
                ></v-file-input>

                <v-text-field
                  v-if="
                    order.payment_method && order.payment_method.value == 'HA'
                  "
                  :rules="requestedByRules"
                  label="نام درخواست دهنده"
                  v-model="requested_by"
                  prepend-icon="mdi-account"
                  filled
                  rounded
                  required
                ></v-text-field>

                <v-btn
                  v-show="length > 0 && isAuth"
                  color="secondary"
                  class="pa-7"
                  @click.prevent="payBasket()"
                  block
                  rounded
                  depressed
                >
                  پرداخت و ثبت سفارش
                </v-btn>
              </v-form>
            </v-card-text>
          </v-card>

          <nuxt-link to="/user/login">
            <v-btn
              v-show="length > 0 && !isAuth"
              color="secondary"
              class="pa-7 mt-5"
              block
              rounded
              depressed
              nuxt
            >
              ورود به حساب کاربری
            </v-btn>
          </nuxt-link>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import basketCard from "~/components/basketCard.vue";
import { mapState, mapActions, mapGetters, mapMutations } from "vuex";
let _ = require("lodash");

export default {
  name: "OrderBasket",

  components: {
    basketCard
  },

  data: () => ({
    page_title: "سبد خرید",
    page_loaded: false,

    overlay: false,
    showSendInfoCard: true,
    complete: false,
    retrived_tracking_code: "INVALID",
    colors: [],
    cart: [],
    provinces: [],
    cities: [],
    cities_loaded: false,
    send_methods: [],
    send_methods_loaded: false,

    order: {
      phone: null,
      postal_code: null,
      postal_address: null,
      total_price: 9999999,
      send_method: null,
      payment_method: null,
      province: null,
      city: null
    },
    retrived_tracking_code: null,

    attachment: [],
    requested_by: "",

    payment_form: false,
    form_model: false,
    phoneRules: [
      val => !!val || "شماره را وارد کنید",
      num => !isNaN(num) || "لطفا عدد وارد کنید."
    ],
    postalCodeRules: [
      val => !!val || "کد پستی را وارد کنید",
      num => !isNaN(num) || "لطفا عدد وارد کنید."
    ],
    postalAddressRules: [val => !!val || "آدرس را وارد کنید"],
    sendMethodRules: [val => !!val || "نحوه ارسال را انتخاب کنید."],
    provinceRules: [val => !!val || "استان را انتخاب کنید."],
    cityRules: [val => !!val || "شهر را انتخاب کنید."],
    paymentMethodRules: [val => !!val || "نحوه پرداخت را انتخاب کنید."],
    requestedByRules: [val => !!val || "نام درخواست دهنده را انتخاب کنید."],
    attachmentRules: [val => !!val || "تصویر فیش را انتخاب کنید."]
  }),

  head: {
    title: "سبد خرید"
  },

  async fetch() {
    this.overlay = true;

    this.loadPage();
  },

  mounted() {
    // Set page title
    this.$store.commit("SET_PAGE_TITLE", this.page_title);

    // load page data
    if (!this.page_loaded) this.loadPage();

    this.overlay = false;
  },

  watch: {
    // load page data on direct url load
    $route(to, from) {
      this.loadPage();
    }
  },

  methods: {
    ...mapMutations("basket", ["clear"]),

    async payBasket(e) {
      if (this.order.payment_method.value !== "HA") {
        if (!this.$refs.form.validate()) return;
      }
      if (!this.$refs.payment_form.validate()) return;
      // this.overlay = true;

      // prepare data object
      try {
        let data = await this.prepareObjectForRequest(this.order);

        // submit order in server
        try {
          if (_.isNil(this.retrived_tracking_code)) {
            let order = await this.$axios.$post("order/", data);
            this.retrived_tracking_code = order.tracking_code;
          } else {
            let order = await this.$axios.$get(
              "order/?tracking-code=" + this.retrived_tracking_code
            );
          }

          // submit payment depned on payment_method
          switch (data.payment_method.value) {
            case "ZB":
              try {
                let zibal_respond = await this.$axios.$post(
                  "payment/request/zibal/",
                  {
                    tracking_code: this.retrived_tracking_code
                  }
                );

                if (zibal_respond.type === "ok") {
                  // redirect to external link
                  location.href = zibal_respond.payment_url;
                }
              } catch (error) {
                console.error("Zibal Payment Error: ", error);
              } finally {
                this.overlay = false;
              }
              break;

            case "OF":
              // covert attachment to Base64Image if it is not null || undefined
              let temp_attachment = null; // == []
              if (!_.isNil(this.attachment)) {
                if (this.attachment instanceof File) {
                  let temp_attachment = await this.$base64(this.attachment);

                  try {
                    let offline_respond = await this.$axios.$post(
                      "payment/request/offline/",
                      {
                        tracking_code: this.retrived_tracking_code,
                        attachment: temp_attachment
                      }
                    );
                    if (offline_respond.type === "ok") {
                      // redirect to payment callback page
                      this.$nuxt.$router.replace({
                        path:
                          "/order/callback/?tracking=" +
                          this.retrived_tracking_code +
                          "&success=1"
                      });
                    }
                  } catch (error) {
                    if (error.response) {
                      if (error.response.status === 500) {
                        this.$toast.error("مشکلی از سمت سرور پیش آمده.");
                      } else if (error.response.status === 403) {
                        this.$toast.error("دسترسی غیر مجاز.");
                      } else {
                        // redirect to payment callback page
                        this.$nuxt.$router.replace({
                          path:
                            "/order/callback/?tracking=" +
                            this.retrived_tracking_code +
                            "&success=0"
                        });
                      }
                    }
                  } finally {
                    this.overlay = false;
                  }
                }
              }

              break;

            case "HA":
              try {
                let havaleh_anbar_respond = await this.$axios.$post(
                  "payment/request/havaleh/",
                  {
                    tracking_code: this.retrived_tracking_code,
                    requested_by: this.requested_by
                  }
                );
                if (havaleh_anbar_respond.type === "ok") {
                  // redirect to payment callback page
                  this.$nuxt.$router.replace({
                    path:
                      "/order/callback/?tracking=" +
                      this.retrived_tracking_code +
                      "&success=1"
                  });
                }
              } catch (error) {
                if (error.response) {
                  if (error.response.status === 500) {
                    this.$toast.error("خطا از سمت سرور.");
                  } else if (error.response.status == 403) {
                    this.$toast.error("دسترسی غیر مجاز.");
                  } else {
                    // redirect to payment callback page
                    this.$nuxt.$router.replace({
                      path:
                        "/order/callback/?tracking=" +
                        this.retrived_tracking_code +
                        "&success=0"
                    });
                  }
                }
              } finally {
                this.overlay = false;
              }

              break;

            default:
              this.overlay = false;
              this.$toast.error("مشکلی در انتخاب نحوه‌ی پرداخت به وجود آمده.");
              break;
          }
        } catch (error) {
          this.overlay = false;
          console.log("Order Submittion Error: ", error);

          // show errors
          Object.entries(error.response.data).forEach(([key, val]) => {
            if (key === "models") {
              // it is an array of model errors
              val.forEach(model_obj => {
                Object.entries(model_obj).forEach(([field, model_errors]) => {
                  model_errors.forEach(e => {
                    this.$toast.error(e);
                  });
                });
              });
            } else {
              val.forEach(error => {
                this.$toast.error(error);
              });
            }
          });
        }
      } catch (error) {
        this.overlay = false;
        this.$toast.error("لطفا وارد حساب کاربری خود شوید.");
      }
    },

    prepareObjectForRequest(input) {
      return new Promise(async (resolve, reject) => {
        let output = _.cloneDeep(input); // BEST WAY TO CLONE A JSON EVER!

        // send method
        if (!_.isNil(output.send_method))
          output.send_method = output.send_method.send_method_id;

        // province
        if (!_.isNil(output.province))
          output.province = output.province.province_id;

        // city
        if (!_.isNil(output.city)) output.city = output.city.city_id;

        // phone
        if (_.isNil(output.phone)) output.phone = "";

        // postal code
        if (_.isNil(output.postal_code)) output.postal_code = "";

        // phone
        if (_.isNil(output.postal_address)) output.postal_address = "";

        output.cart = this.cart.map(cartItem => ({
          model: cartItem.model.model_id,
          quantity: cartItem.quantity
        }));

        output.total_price = this.totalPrice;

        if (this.loggedInUser === null || this.loggedInUser === undefined) {
          reject();
        } else {
          output.user = this.loggedInUser.user_id;
        }
        output.tracking_code = "invalid";

        // base64 conversion for attachment if it is not: null || undefined
        if (!_.isNil(this.attachment)) {
          if (this.attachment instanceof File) {
            output.attachment = await this.$base64(this.attachment);
          } else {
            output.attachment = null; // cover == []
          }
        }

        resolve(output);
      });
    },

    async loadPage() {
      // load cart from store
      this.cart = this.$store.state.basket.cart;

      // load provinces
      try {
        this.provinces = await this.$axios.$get("province/");
      } catch (e) {
        console.error("ERR on FETCH provinces (/order/basket.vue/): ", e);
      }

      // colors
      try {
        let colors = await this.$axios.$get("/color/");
        this.colors = colors;
      } catch (e) {
        console.error("ERR on FETCH colors (/order/basket.vue/): ", e);
      }

      this.page_loaded = true;
    },

    async loadCities() {
      this.cities_loaded = false;
      try {
        this.cities = await this.$axios.$get(
          "city/?province_id=" + this.order.province.province_id
        );
        this.cities_loaded = true;
      } catch (e) {
        console.error("ERR on FETCH cities (/order/basket.vue/): ", e);
      }
    },

    async loadSendMethods() {
      this.send_methods_loaded = false;
      try {
        this.send_methods = await this.$axios.$get(
          "send-method/?city_id=" + this.order.city.city_id
        );
        this.send_methods_loaded = true;
      } catch (e) {
        console.error("ERR on FETCH send-methods (/order/basket.vue/): ", e);
      }
    },

    checkPaymentMethod() {
      if (this.order.payment_method === null) {
        this.showSendInfoCard = true;
      } else {
        if (this.order.payment_method.value === "HA") {
          this.showSendInfoCard = false;
        } else {
          this.showSendInfoCard = true;
        }
      }
    }
  },

  computed: {
    ...mapGetters("basket", ["length", "totalPrice"]),
    ...mapGetters({
      loggedInUser: "loggedInUser",
      isAuth: "isAuthenticated",
      isStaff: "isUserStaff"
    }),
    invoice() {
      if (!_.isNil(this.order.send_method))
        return this.totalPrice + this.order.send_method.price;
      else return this.totalPrice;
    },

    payment_methods() {
      let payment_mthods_arr = [
        {
          text: "پرداخت آنلاین",
          hint: "از طریق درگاه واسط زیبال",
          value: "ZB"
        },
        {
          text: "فیش بانکی",
          hint: "پس از بررسی فیش سفارش پردازش خواهد شد",
          value: "OF"
        }
      ];
      if (this.isAuth && this.isStaff) {
        payment_mthods_arr.push({
          text: "حواله انبار",
          hint: "ثبت سفارش برای فروشگاه",
          value: "HA"
        });
      }
      return payment_mthods_arr;
    }
  }
};
</script>

<style scoped>
.dotted-devider {
  border-style: dotted;
  border-color: #f7c4c9;
  border-width: 3px;
  border-top: none;
}
.theme--light.v-data-table
  > .v-data-table__wrapper
  > table
  > tbody
  > tr.devider-tr:hover:not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper) {
  background: inherit;
}
</style>
