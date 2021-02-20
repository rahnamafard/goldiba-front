<template>
  <div>
    <!-- Overlay on screen -->
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </v-overlay>

    <v-container>
      <v-row class="mt-5">
        <v-text-field
          label="نام یا کد محصول را وارد کنید"
          :append-outer-icon="'mdi-magnify'"
          v-model="searchProductQuery"
          @click:append-outer="searchProduct"
          @keydown.enter="searchProduct"
          hint="برای جستجو روی ذره‌بین بزنید"
          class="centered-input"
          color="secondary"
          rounded
          filled
          required
        ></v-text-field>
      </v-row>

      <div class="d-flex flex-wrap justify-center">
        <div v-for="product in products" :key="'product-' + product.product_id">
          <product-card :product="product"></product-card>
        </div>
      </div>
    </v-container>
  </div>
</template>

<script>
import productCard from "~/components/productCard.vue";
var _ = require("lodash");

export default {
  name: "ProductSearch",
  components: {
    productCard
  },

  head() {
    return {
      title: this.title
    };
  },

  data() {
    return {
      title: "جستجوی محصول",
      page_loaded: false,
      overlay: true,
      products: []
    };
  },

  async fetch() {
    this.overlay = true;

    let passed_query = this.$route.params.query
      ? this.$route.params.query
      : null;
    this.loadPage(passed_query);
  },

  async mounted() {
    // load page data
    if (!this.page_loaded) {
      let passed_query = this.$route.params.query
        ? this.$route.params.query
        : null;
      await this.loadPage(passed_query);
    }

    this.overlay = false;
  },

  // watch: {
  //   // load page data on direct url load
  //   $route(to, from) {
  //     let passed_query = this.$route.params.query
  //       ? this.$route.params.query
  //       : null;
  //     this.loadPage(passed_query);
  //   }
  // },

  methods: {
    async loadPage(query) {
      try {
        let products = await this.$axios.$get(
          "product/?query=" +
            query +
            "&is_active=true&order-by=-created_at,-recharged_at"
        );
        // na mojoud -> end of list
        products.sort((a, b) => {
          if (this.inStock(a) <= 0) {
            return 1;
          } else if (this.inStock(b) <= 0) {
            return -1;
          }
          return 0;
        });
        this.products = products;
        this.searchProductQuery = query;

        // Set page title
        this.title = "جستجوی محصول | " + (query || "؟");
        this.$store.commit("SET_PAGE_TITLE", this.title);

        this.page_loaded = true;
      } catch (e) {
        console.error("FETCH products ERR (product/search/_query.vue): " + e);
      }
    },

    searchProduct() {
      this.$router.replace("/product/search/" + this.searchProductQuery);
    },

    inStock(product) {
      let inStock = 0;
      let models = product.models.filter(model => model.is_active === true);
      models.forEach(model => {
        if (model.in_stock) {
          inStock += model.in_stock;
        }
      });
      return inStock;
    }
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
