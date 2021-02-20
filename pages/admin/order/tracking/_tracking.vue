<template>
  <div>
    <!-- Overlay on screen -->
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </v-overlay>

    <div v-if="order_loaded">
      <v-card>
        <v-card-title>
          جزئیات سفارش
          <v-spacer></v-spacer>
          <span class="grey--text" style="font-family: arial">
            {{ order.tracking_code }}
          </span>
        </v-card-title>

        <v-divider></v-divider>

        <!-- info -->
        <v-card-text>
          <h3>سفارش:</h3>

          <v-row>
            <!-- status -->
            <v-col xl="6">
              <div v-if="order.order_status === 'EX'">
                وضعیت:
                <v-icon color="error">mdi-close-circle</v-icon>
                <span class="error--text">
                  منقضی
                </span>
              </div>

              <div v-else-if="order.order_status === 'PE'">
                وضعیت:
                <v-icon color="secondary">mdi-sync-circle</v-icon>
                <span class="secondary--text">
                  انتظار
                </span>
              </div>

              <div v-else-if="order.order_status === 'AP'">
                وضعیت:
                <v-icon color="green">mdi-checkbox-marked-circle</v-icon>
                <span class="green--text">
                  تأیید
                </span>
              </div>

              پرداخت:
              <v-icon :color="transaction_method(order).color">
                {{ transaction_method(order).icon }}
              </v-icon>
              <span :class="transaction_method(order).color + '--text'">
                {{ transaction_method(order).text }}
              </span>

              <br />

              <v-btn
                x-small
                rounded
                depressed
                outlined
                @click="showAttachment(order)"
                v-show="last_transaction(order).method === 'OF'"
              >
                نمایش فیش
              </v-btn>

              <v-btn
                x-small
                rounded
                depressed
                color="success"
                v-show="
                  ['OF', 'HA'].includes(last_transaction(order).method) &&
                    order.order_status === 'PE'
                "
                @click="changeStatus(order, 'OK')"
              >
                تایید
              </v-btn>

              <v-btn
                x-small
                rounded
                depressed
                color="secondary"
                v-show="
                  ['OF', 'HA'].includes(last_transaction(order).method) &&
                    order.order_status === 'AP'
                "
                @click="changeStatus(order, 'PE')"
              >
                انتظار
              </v-btn>

              <v-btn
                x-small
                rounded
                depressed
                color="error"
                v-show="
                  ['OF', 'HA'].includes(last_transaction(order).method) &&
                    order.order_status === 'PE'
                "
                @click="changeStatus(order, 'ER')"
              >
                منقضی
              </v-btn>

              <v-dialog
                v-if="attachmentDialog"
                v-model="attachmentDialog"
                width="500"
              >
                <v-card>
                  <v-card-title>
                    تصویر فیش
                    <v-spacer></v-spacer>
                    <v-btn
                      color="primary"
                      text
                      @click="attachmentDialog = false"
                      icon
                    >
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                  </v-card-title>

                  <v-divider></v-divider>

                  <v-card-text>
                    <v-img
                      :lazy-src="
                        this.payments[this.payments.length - 1].attachment
                      "
                      :src="this.payments[this.payments.length - 1].attachment"
                    >
                      <template v-slot:placeholder>
                        <v-row
                          class="fill-height ma-0"
                          align="center"
                          justify="center"
                        >
                          <v-progress-circular></v-progress-circular>
                        </v-row>
                      </template>
                    </v-img>
                  </v-card-text>
                </v-card>
              </v-dialog>
            </v-col>

            <!-- date & price -->
            <v-col xl="6">
              <v-icon>
                mdi-cash-multiple
              </v-icon>
              <span> {{ order.total_price }} تومان </span>

              <br />
              <v-icon>
                mdi-calendar
              </v-icon>
              <span>
                {{ $jalaliDateTime(order.created_at).date }}
              </span>

              <br />
              <v-icon>
                mdi-clock
              </v-icon>
              <span>
                {{ $jalaliDateTime(order.created_at).time }}
              </span>
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider></v-divider>

        <!-- send -->
        <v-card-text>
          <h3>ارسال:</h3>

          <v-row>
            <v-col xl="6">
              <v-icon>mdi-motorbike</v-icon>
              <span>
                {{ order.send_method.label }}
              </span>
              <br />
              <v-icon>mdi-currency-usd-circle</v-icon>
              <span> {{ order.send_method_price }} تومان </span>
            </v-col>

            <v-col xl="6">
              <v-icon>mdi-phone-classic</v-icon>
              <span> تلفن: {{ order.phone }} </span>
              <br />
              <v-icon>mdi-email</v-icon>
              <span> کد پستی: {{ order.postal_code }} </span>
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <v-icon>mdi-map</v-icon>
              <span> {{ order.province.name }} </span>
              <br />

              <v-icon>mdi-map-search</v-icon>
              <span> {{ order.city.name }} </span>
            </v-col>

            <v-col>
              <v-icon>mdi-map-marker</v-icon>
              <span> {{ order.postal_address }} </span>
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider></v-divider>

        <!-- user -->
        <v-card-text>
          <h3>کاربر:</h3>

          <v-row>
            <v-col xl="6">
              <v-icon>mdi-account</v-icon>
              <span v-if="order.user">
                {{ order.user.first_name }} {{ order.user.last_name }}
              </span>
              <span v-else>
                حذف شده
              </span>
            </v-col>

            <v-col xl="6">
              <v-icon>mdi-cellphone-iphone</v-icon>
              <span v-if="order.user">{{ order.user.mobile }}</span>
              <span v-else>
                حذف شده
              </span>
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider></v-divider>

        <!-- more -->
        <v-card-text v-if="['HA'].includes(last_transaction(order).method)">
          <h3>اطلاعات حواله انبار:</h3>

          <v-row class="pt-4">
            <v-col xl="6">
              <v-text-field
                label="نام درخواست دهنده"
                v-model="payments[payments.length - 1].requested_by"
                prepend-icon="mdi-account-arrow-left"
                filled
                rounded
                required
              ></v-text-field>

              <v-text-field
                label="نام پاسخ دهنده"
                v-model="payments[payments.length - 1].delivered_by"
                prepend-icon="mdi-account-arrow-right"
                filled
                rounded
                required
              ></v-text-field>

              <div class="text-center">
                <v-btn
                  color="secondary"
                  @click.prevent="updateHavalehPayment()"
                  rounded
                  depressed
                >
                  به روز رسانی
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider
          v-if="['HA'].includes(last_transaction(order).method)"
        ></v-divider>

        <!-- models -->
        <v-card-text>
          <h3>سبد خرید:</h3>
          <br />

          <v-simple-table dense>
            <template v-slot:default>
              <thead>
                <tr>
                  <th>
                    #
                  </th>
                  <th>
                    تصویر
                  </th>
                  <th>
                    مدل
                  </th>
                  <th>
                    فی
                  </th>
                  <th>
                    تعداد
                  </th>
                  <th class="text-left">
                    جمع قیمت
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item, index) in order.models"
                  :key="item.model.model_id"
                >
                  <td>
                    {{ index + 1 }}
                  </td>
                  <td style="height: 60px;">
                    <v-img
                      style="height: 100%; max-width: 60px"
                      :src="item.model.image"
                    ></v-img>
                  </td>
                  <td>
                    {{ item.model.title }}
                    <br />
                    <span class="grey--text">
                      {{ item.model.code }}
                    </span>
                  </td>
                  <td>{{ item.price }} تومان</td>
                  <td>{{ item.quantity }}</td>
                  <td class="text-left">
                    {{ item.price * item.quantity }} تومان
                  </td>
                </tr>

                <tr>
                  <td colspan="5"></td>
                  <td class="text-left">
                    <span class="font-weight-bold">مجموع:</span>
                    {{ order.total_price - order.send_method_price }} تومان
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script>
export default {
  name: "OrderDetails",

  head() {
    return {
      title: this.child_title
    };
  },

  //   validate({ params }) {
  //     // Check 'id' parameter to be a number
  //     if (params.id) return /^\d+$/.test(params.id);
  //     else return true;
  //   },

  async fetch({ $axios, $auth, error }) {
    // permission check
    if (!$auth.user.permissions.includes("core.view_order"))
      error({ statusCode: 403, message: "" });
  },

  data() {
    return {
      child_title: "جزئیات سفارش",

      // order
      order_loaded: false,
      order: null,
      payments: [],
      attachmentDialog: false,

      // overlay
      overlay: false
    };
  },

  watch: {
    // require for react to route from `/url/foo` to `/url/bar`
    $route(to, from) {
      let tracking_code = to.params.tracking ? to.params.tracking : null;
      this.loadPage(tracking_code);
    }
  },

  mounted() {
    let tracking_code = this.$route.params.tracking
      ? this.$route.params.tracking
      : null;
    this.loadPage(tracking_code);
  },

  methods: {
    async loadPage(tracking_code) {
      this.overlay = true;
      if (tracking_code) {
        try {
          let response = await this.$axios.get(
            "order/?return-object=true&tracking-code=" + tracking_code
          );

          if (response.data.length > 0) {
            this.order = response.data[0];

            // send method deleted
            if (this.order.send_method === null)
              this.order.send_method = {
                label: this.order.send_method_label
              };

            // province deleted
            if (this.order.province === null)
              this.order.province = {
                name: this.order.province_name
              };

            // city deleted
            if (this.order.city === null)
              this.order.city = {
                name: this.order.city_name
              };

            // Load requested_by for havaleh transactions
            if (this.last_transaction(this.order).method === "HA") {
              await this.getPaymentDetails(this.order);
              console.log(this.payments);
            }

            this.order_loaded = true;
          } else {
            this.$toast.error("سفارشی با این کد پیدا نشد.");
          }
          this.overlay = false;
        } catch (error) {
          console.log(error);
          this.overlay = false;
        } finally {
          this.overlay = false;
        }
      }
    },

    async getPaymentDetails(order) {
      let last = this.order.transactions.length - 1;
      let transaction_id = this.order.transactions[last].transaction_id;
      let transction_method = this.order.transactions[last].method;

      try {
        let response = await this.$axios.get(
          "/payment/?method=" +
            transction_method +
            "&transaction=" +
            transaction_id
        );

        if (response.data.length > 0) {
          this.payments = response.data;
        } else {
          this.$toast.error("نتیجه‌ای یافت نشد.");
        }
      } catch (error) {
        console.log(error);
        this.$toast.error(
          "متاسفانه مشکلی در بارگذاری جزئیات پرداخت به وجود آمده."
        );
      } finally {
        this.overlay = false;
      }
    },

    async showAttachment(order) {
      await this.getPaymentDetails(order);
      this.attachmentDialog = true;
    },

    last_transaction(item) {
      if (item.transactions.length > 0)
        return item.transactions[item.transactions.length - 1];
      else
        return {
          text: "بدون پرداخت",
          icon: "mdi-alert-circle",
          color: "error"
        };
    },

    transaction_method(item) {
      let method = "unknown";

      if (item.transactions.length > 0)
        method = item.transactions[item.transactions.length - 1].method;

      switch (method) {
        case "ZB":
          return {
            text: "زیبال",
            icon: "mdi-credit-card-outline",
            color: "blue"
          };
          break;

        case "OF":
          return {
            text: "فیش بانکی",
            icon: "mdi-receipt",
            color: "orange"
          };
          break;

        case "HA":
          return {
            text: "حواله انبار",
            icon: "mdi-store",
            color: "purple"
          };
          break;

        default:
          return {
            text: "بدون پرداخت",
            icon: "mdi-alert-circle",
            color: "error"
          };
          break;
      }
    },

    changeStatus(order, transaction_status) {
      if (transaction_status === "ER")
        if (
          !confirm(
            "با انقضای سفارش، موجودی محصولات سبد خرید به فروشگاه بر می‌گردد.\nاین عملیات غیر قابل بازگشت است، آیا مطمئنید؟"
          )
        )
          return;

      this.overlay = true;
      let transaction = this.last_transaction(order);
      this.$axios
        .patch("transaction/?id=" + transaction.transaction_id, {
          status: transaction_status
        })
        .then(response => {
          this.$toast.success("سفارش با موفقیت ویرایش شد.");
          if (response.data.status === "OK") this.order.order_status = "AP";
          else if (response.data.status === "PE")
            this.order.order_status = "PE";
          else this.order.order_status = "EX";
        })
        .catch(error => {
          this.$toast.error("خطایی رخ داده است.");
          console.log(error);
        })
        .finally(() => {
          this.overlay = false;
        });
    },

    async updateHavalehPayment() {
      try {
        let response = await this.$axios.patch("/payment/request/havaleh/", {
          havaleh_anbar_id: this.payments[this.payments.length - 1]
            .havaleh_anbar_id,
          requested_by: this.payments[this.payments.length - 1].requested_by,
          delivered_by: this.payments[this.payments.length - 1].delivered_by
        });

        if (response.data.type === "ok") {
          this.$toast.success("حواله با موفقیت ویرایش شد.");
        } else {
          this.$toast.error("مشکلی در ویرایش حواله به وجود آمده.");
        }
      } catch (error) {
        console.log(error);
        this.$toast.error("مشکلی در ویرایش حواله به وجود آمده.");
      } finally {
        this.overlay = false;
      }
    }
  }
};
</script>
