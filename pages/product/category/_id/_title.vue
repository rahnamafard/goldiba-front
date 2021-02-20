<template>
  <div>
    <!-- Overlay on screen -->
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </v-overlay>

    <v-container>
      <div v-if="products && products.length > 0">
        <div class="d-flex flex-wrap justify-center">
          <div
            v-for="product in products"
            :key="'product-' + product.product_id"
          >
            <product-card :product="product"></product-card>
          </div>
        </div>
      </div>

      <div v-else>
        <v-alert text type="info">
          محصولی در این دسته وجود ندارد.
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
          صفحه اصلی
        </v-btn>
      </div>
    </v-container>
  </div>
</template>

<script>
import productCard from "~/components/productCard.vue";
var _ = require("lodash");

export default {
  name: "ProductCategory",

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
      title: "محصولات یک دسته",
      overlay: true,
      products: {},
      page_loaded: false
    };
  },

  async fetch() {
    this.overlay = true;
    let passed_id = this.$route.params.id ? this.$route.params.id : null;
    let passed_title = this.$route.params.title ? this.$route.params.title : "";
    await this.loadPage(passed_id, passed_title);
  },

  async mounted() {
    if (!this.page_loaded) {
      let passed_id = this.$route.params.id ? this.$route.params.id : null;
      let passed_title = this.$route.params.title
        ? this.$route.params.title
        : "";
      await this.loadPage(passed_id, passed_title);
    }

    // Set page title
    this.$store.commit("SET_PAGE_TITLE", this.title);

    this.overlay = false;
  },

  methods: {
    async loadPage(id, title) {
      // fetch products
      try {
        let products = await this.$axios.$get(
          "product/?category=" +
            id +
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
        this.title = "دسته «" + title.split("-").join(" ") + "»";
      } catch (e) {
        console.error(
          "FETCH product ERR (product/category/_id/_title.vue): " + e
        );
      }

      this.page_loaded = true;
    },
    inStock(product) {
      if (!_.isNil(product.models)) {
        let models = product.models.filter(model => model.is_active === true);
        let inStock = 0;
        models.forEach(model => {
          if (model.in_stock) {
            inStock += model.in_stock;
          }
        });
        return inStock;
      }
    }
  }
};
</script>
