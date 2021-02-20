<template>
  <div>
    <!-- Overlay on screen -->
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
      در حال بارگذاری...
    </v-overlay>

    <v-container>
      <v-expansion-panels>
        <v-expansion-panel
          v-for="order in orders"
          :key="'order-' + order.order_id"
        >
          <v-expansion-panel-header>
            <div>
              <span class="ml-3 d-none d-sm-inline-block">
                <v-icon>
                  mdi-calendar
                </v-icon>
                {{ $jalaliDateTime(order.created_at).date }}
              </span>

              <span class="ml-10 d-none d-sm-inline-block">
                <v-icon>
                  mdi-clock
                </v-icon>
                {{ $jalaliDateTime(order.created_at).time }}
              </span>

              <!-- status -->
              <span v-if="order.order_status === 'EX'">
                <v-icon color="error">mdi-close-circle</v-icon>
                <span class="error--text">
                  منقضی
                </span>
              </span>

              <span v-else-if="order.order_status === 'PE'">
                <v-icon color="secondary">mdi-sync-circle</v-icon>
                <span class="secondary--text">
                  انتظار
                </span>
              </span>

              <span v-else-if="order.order_status === 'AP'">
                <v-icon color="green">mdi-checkbox-marked-circle</v-icon>
                <span class="green--text">
                  تأیید
                </span>
              </span>
            </div>

            <template v-slot:actions>
              <div>
                <v-chip
                  class="ml-2"
                  style="font-family:calibri; font-weight:bold"
                  color="grey--text"
                >
                  {{ order.tracking_code }}
                  <v-icon class="mr-2">
                    mdi-barcode
                  </v-icon>
                </v-chip>
              </div>
              <v-icon color="primary">
                $expand
              </v-icon>
            </template>
          </v-expansion-panel-header>
          <v-divider></v-divider>
          <v-expansion-panel-content>
            <!-- info -->
            <div class="mt-3 mb-3">
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

                  مرحله:
                  <v-icon :color="stage(order).color">
                    {{ stage(order).icon }}
                  </v-icon>
                  <span :style="'color:' + stage(order).color">
                    {{ stage(order).text }}
                  </span>
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
            </div>
            <v-divider></v-divider>

            <!-- send -->
            <div class="mt-3 mb-3">
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
            </div>

            <v-divider></v-divider>

            <!-- models -->
            <div class="mt-3 mb-3">
              <h3>سبد خرید:</h3>
              <br />

              <v-simple-table dense>
                <template v-slot:default>
                  <thead>
                    <tr>
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
                    <tr v-for="item in order.models" :key="item.model.model_id">
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
                      <td colspan="4"></td>
                      <td class="text-left">
                        <span class="font-weight-bold">مجموع:</span>
                        {{ order.total_price - order.send_method_price }}
                        تومان
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
var _ = require("lodash");

export default {
  name: "UserOrders",

  head() {
    return {
      title: this.title
    };
  },

  data() {
    return {
      title: "سفارش‌های من",
      orders: [],
      overlay: false,
      page_loaded: false
    };
  },

  async fetch() {
    this.overlay = true;

    this.loadPage();
  },

  async mounted() {
    // load page data
    if (!this.page_loaded) {
      await this.loadPage();
    }

    this.$store.commit("SET_PAGE_TITLE", this.title);
    this.overlay = false;
  },

  methods: {
    async loadPage() {
      try {
        let orders = await this.$axios.$get(
          "order/?return-object=true&user=" + this.loggedInUser.user_id
        );
        orders.forEach(order => {
          // send method deleted
          if (order.send_method === null)
            order.send_method = {
              label: order.send_method_label
            };

          // province deleted
          if (order.province === null)
            order.province = {
              name: order.province_name
            };

          // city deleted
          if (order.city === null)
            order.city = {
              name: order.city_name
            };
        });

        this.orders = orders;
        this.page_loaded = true;
      } catch (e) {
        console.error("FETCH orders ERR (user/profile/orders.vue): " + e);
      }
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
            text: "پرداخت آنلاین",
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
            text: "ناموفق",
            icon: "mdi-alert-circle",
            color: "error"
          };
          break;
      }
    },

    stage(item) {
      let stage = "unknown";

      if (!_.isNil(item.order_stage)) stage = item.order_stage;

      switch (stage) {
        case "SBMT":
          return {
            text: "ثبت سفارش",
            icon: "mdi-circle-outline",
            color: "#78909C"
          };
          break;

        case "INVC":
          return {
            text: "صدور فاکتور",
            icon: "mdi-circle-slice-2",
            color: "#546E7A"
          };
          break;

        case "PACK":
          return {
            text: "بسته بندی",
            icon: "mdi-circle-slice-4",
            color: "#455A64"
          };
          break;

        case "POST":
          return {
            text: "تحویل به پست",
            icon: "mdi-circle-slice-6",
            color: "#37474F"
          };
          break;

        case "CRIR":
          return {
            text: "تحول به پیک",
            icon: "mdi-circle-slice-6",
            color: "#37474F"
          };
          break;

        case "TRCK":
          return {
            text: "ثبت کد مرسوله",
            icon: "mdi-circle-slice-8",
            color: "#263238"
          };
          break;

        default:
          return {
            text: "نامشخص",
            icon: "mdi-close-circle",
            color: "error"
          };
          break;
      }
    }
  },

  computed: {
    ...mapGetters({
      isAuth: "isAuthenticated",
      loggedInUser: "loggedInUser"
    })
  }
};
</script>

<style scoped>
.centered-input >>> * {
  text-align: center;
}
.centered-input >>> .v-label {
  right: 50% !important;
  margin-right: -100px;
}
</style>
