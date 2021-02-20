<template>
  <div>
    <!-- Overlay on screen -->
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </v-overlay>

    <v-container>
      <v-row>
        <v-col>
          <v-alert
            v-show="order.order_status === 'AP' && success"
            type="success"
          >
            سفارش‌تون با موفقیت ثبت شد!
            <br />
            خیالتون راحت! هر موقع که آماده بشه، براتون ارسالش می‌کنیم.
          </v-alert>

          <v-alert
            v-show="order.order_status === 'PE' && success"
            type="success"
            color="blue"
          >
            سفارش‌تون با موفقیت ثبت شد!
            <br />
            خیالتون راحت! اطلاعات سفارشتون رو بررسی می‌کنیم و در صورت تایید یا
            رد اون بهتون اطلاع می‌دیم.
          </v-alert>

          <v-alert v-show="success" icon="mdi-barcode" type="info" outlined>
            کد پی‌گیری:
            <span style="font-family: Arial;">{{ order.tracking_code }}</span>

            <br />
            برای دیدن وضعیت سفارشتون، می‌تونید این کد رو یادداشت کنید و بعدا ازش
            استفاده کنید.
          </v-alert>

          <v-alert v-show="!success" type="error">
            متاسفانه فرآیند ثبت سفارش موفقیت‌آمیز نبود.
            <br />
            لطفا سفارش خود را دوباره ثبت کنید.
          </v-alert>

          <v-alert
            v-show="order.order_status === 'PE' && !success"
            type="info"
            outlined
          >
            در صورتی که مبلغ سفارش از حساب شما کسر شده، این مبلغ تا 72 ساعت
            آینده از طرف بانک به حسابتون بر می‌گرده. این اتفاق معمولا در چند
            ساعت اولیه می‌افته، پس خیالتون راحت باشه.
          </v-alert>

          <v-row class="d-flex justify-center">
            <nuxt-link to="/">
              <v-btn color="secondary" class="pa-7 mb-5" rounded depressed>
                بازگشت به فروشگاه
              </v-btn>
            </nuxt-link>
          </v-row>
        </v-col>

        <!-- <v-col sm="5" md="5" lg="5">
        <v-card>
          <v-card-title>
            اطلاعات ارسال
          </v-card-title>

          <v-divider></v-divider>

          <v-card-text>
            جزئیات اطلاعات
          </v-card-text>
        </v-card>
      </v-col> -->
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters, mapMutations } from "vuex";
let _ = require("lodash");

export default {
  name: "OrderCallback",

  components: {},

  data: () => ({
    page_title: "نتیجه خرید شما",
    page_loaded: false,

    success: false,
    order: {
      tracking_code: "..."
    },

    overlay: false
  }),

  head: {
    title: "نتیجه خرید شما"
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

    async loadPage() {
      const tracking_code = this.$route.query.tracking;

      // is payment successful?
      if (this.$route.query.success === "1") {
        this.success = true;
        this.clear();
      }

      // load order details
      try {
        let order = await this.$axios.$get("order/?tracking-code=" + tracking_code);
        this.order = order[0];
      } catch (e) {
        console.error("ERR on FETCH order (/order/callback.vue/): ", e);
      }

      this.page_loaded = true;
    }
  },

  computed: {
    ...mapGetters({
      loggedInUser: "loggedInUser",
      isAuth: "isAuthenticated"
    })
  }
};
</script>
