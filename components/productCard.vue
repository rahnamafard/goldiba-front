<template>
  <nuxt-link
    :to="
      '/product/' + product.product_id + '/' + escapeTitle(product.title) + '/'
    "
  >
    <v-card
      class="border-radius-20 light-box-shadow ma-3 align-self-stretch"
      max-width="190"
    >
      <v-img class="white--text align-end" :src="product.main_image"> </v-img>

      <v-card-title style="font-size: 0.9em; font-weight: bold">
        {{ product.title }}
      </v-card-title>

      <v-card-subtitle style="font-size: 0.6em;" class="pb-0">
      </v-card-subtitle>

      <v-card-text class="text--primary" style="font-size: 0.7em;">
        {{ product.description }}
      </v-card-text>

      <v-card-actions style="margin-top: -20px">
        <!-- <v-btn rounded depressed>جزئیات</v-btn> -->
        <v-spacer></v-spacer>
        <span
          v-if="inStock(product) > 0"
          style="font-size: 0.8em;"
          class="secondary--text"
        >
          {{ product.models[0].price }} تومان &nbsp;
        </span>
        <span v-else class="red--text" style="font-size: 0.8em;">
          ناموجود &nbsp;
        </span>
      </v-card-actions>
    </v-card>
  </nuxt-link>
</template>

<script>
export default {
  props: ["product"],

  methods: {
    escapeTitle(title) {
      return title.split(" ").join("-"); // old solution (replaceAll is new but not supported in all browsers)
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
  },

  computed: {}
};
</script>

<style scoped>
.card-outter {
  position: relative;
  padding-bottom: 60px;
}
.card-actions {
  position: absolute;
  bottom: 0;
}
</style>
