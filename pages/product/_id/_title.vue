<template>
  <div>
    <!-- Overlay on screen -->
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </v-overlay>

    <v-container>
      <v-row class="d-flex flex-column flex-sm-row mb-6">
        <v-col sm="6" md="6" lg="6">
          <!-- slider -->
          <v-carousel
            cycle
            v-model="slider.currentPage"
            ref="carousel"
            hide-delimiter-background
            show-arrows
            class="slider-container"
          >
            <v-carousel-item
              v-for="(slide, i) in slider.slides"
              :src="slide.src"
              :key="i"
            >
            </v-carousel-item>
          </v-carousel>

          <!-- product info -->
          <v-card class="mt-6">
            <v-card-text>
              <h2
                class="font-weight-bold text-body-1 float-right"
                style="font-family: inherit !important; color: black"
              >
                {{ product.title }}
              </h2>
              <div class="float-left">
                <span v-if="inStock > 0" class="secondary--text">
                  موجود
                </span>
                <span v-else class="red--text">ناموجود</span>
              </div>

              <div style="clear: both"></div>

              <div class="float-right">کد {{ product.code }}</div>
              <div class="float-left">{{ inStock }} عدد</div>

              <div style="clear: both"></div>
            </v-card-text>

            <v-divider v-show="product.description"></v-divider>

            <v-card-text v-show="product.description">
              {{ product.description }}
            </v-card-text>
          </v-card>
        </v-col>

        <v-col sm="6" md="6" lg="6">
          <!-- choose model -->
          <v-card>
            <v-card-title>
              انتخاب مدل
            </v-card-title>

            <v-divider></v-divider>

            <v-card-text>
              <v-select
                label="مدل محصول"
                prepend-icon="mdi-layers-search"
                v-model="selectedModel"
                :items="product.models"
                @change="selectedCount = 0"
                item-text="title"
                item-value="model_id"
                style="margin-bottom: -30px"
                return-object
                filled
                rounded
              ></v-select>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-text>
              <div v-if="selectedModel" style="margin-bottom: -20px">
                <!-- code -->
                <div class="float-left text-center">
                  <img
                    :src="selectedModel.image"
                    width="100"
                    style="border-radius: 20px"
                  />

                  <p>کد {{ selectedModel.code }}</p>
                </div>

                <!-- color box view -->
                <p>
                  <v-icon
                    :color="
                      colors.find(c => c.color_id === selectedModel.color)
                        ? '#' +
                          colors.find(c => c.color_id === selectedModel.color)
                            .hex
                        : '#f1f1f1'
                    "
                  >
                    mdi-square-rounded
                  </v-icon>
                  <span>
                    {{
                      colors.find(c => c.color_id === selectedModel.color)
                        ? colors.find(c => c.color_id === selectedModel.color)
                            .name
                        : "نامشخص"
                    }}
                  </span>
                </p>

                <!-- in stock -->
                <p>
                  <v-icon>
                    mdi-storefront
                  </v-icon>
                  {{
                    selectedModel.in_stock > 0
                      ? selectedModel.in_stock + " عدد"
                      : "ناموجود"
                  }}
                </p>

                <!-- price -->
                <p>
                  <v-icon>
                    mdi-cash
                  </v-icon>
                  {{ selectedModel.price }} تومان
                </p>

                <!-- desccription -->
                <p>
                  <v-icon>
                    mdi-image-text
                  </v-icon>
                  {{ selectedModel.description }}
                </p>
              </div>
            </v-card-text>

            <v-divider></v-divider>

            <!-- number of models -->
            <v-card-text>
              <v-select
                :label="countLabel"
                prepend-icon="mdi-cart-plus"
                v-model="selectedCount"
                :items="generateItems"
                :disabled="countDisabled"
                item-text="title"
                item-value="model_id"
                style="margin-bottom: -30px"
                return-object
                filled
                rounded
              ></v-select>
            </v-card-text>
          </v-card>

          <!-- add to basket -->
          <v-btn
            color="secondary"
            class="pa-7 mt-5"
            @click.prevent="addToBasket"
            :disabled="!addToBasketActive"
            block
            rounded
            depressed
          >
            <span style="white-space: normal;" v-if="addToBasketActive">
              {{ selectedCount }} عدد به سبد خریدم اضافه کن
            </span>

            <span style="white-space: normal;" v-else>
              تعداد را انتخاب کنید
            </span>
          </v-btn>

          <!-- back to shop -->
          <v-btn
            color="secondary"
            class="pa-7 mt-3"
            to="/"
            block
            rounded
            outlined
          >
            بازگشت به فروشگاه
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
var _ = require("lodash");

export default {
  name: "ProductPage",

  head() {
    return {
      title: this.title
    };
  },

  data() {
    return {
      title: "جزئیات محصول",
      overlay: true,
      product: {},
      selectedModel: undefined,
      selectedCount: 0,
      slider: {
        currentPage: 2,
        colors: [],
        slides: []
      },
      colors: []
    };
  },

  async fetch() {
    this.overlay = true;
    let passed_id = this.$route.params.id ? this.$route.params.id : null;
    await this.loadPage(passed_id);
  },

  async mounted() {
    // Set page title
    this.$store.commit("SET_PAGE_TITLE", this.title);

    if (!this.page_loaded) {
      let passed_id = this.$route.params.id ? this.$route.params.id : null;
      await this.loadPage(passed_id);
    }

    // add main, second, size images to slider
    if (!_.isNil(this.product.main_image))
      this.slider.slides.push({ src: this.product.main_image });
    if (!_.isNil(this.product.second_image))
      this.slider.slides.push({ src: this.product.second_image });
    if (!_.isNil(this.product.size_image))
      this.slider.slides.push({ src: this.product.size_image });

    // iterate models
    this.product.models.forEach(model => {
      // add image to slider
      if (!_.isNil(model.image)) this.slider.slides.push({ src: model.image });
    });

    // selected model
    this.selectedModel = this.product.models[0];

    this.overlay = false;
  },

  methods: {
    // ...mapMutations("basket", []),
    ...mapActions("basket", ["increaseModelQuantity"]),
    addToBasket() {
      this.increaseModelQuantity({
        model: this.selectedModel,
        reqQuantity: this.selectedCount
      });
      const toast = this.toast;
      if (toast.show) {
        this.$toast.show(toast.text, { type: toast.type });
      }
    },

    async loadPage(id) {
      // fetch product
      try {
        let product = await this.$axios.$get("product/?id=" + id);
        product[0].models = product[0].models.filter(
          model => model.is_active === true
        );
        this.product = product[0];
        this.title = "جزئیات محصول | " + this.product.title;
      } catch (e) {
        console.error("FETCH product ERR (product/_id/_title.vue): " + e);
      }

      // fetch colors
      try {
        let colors = await this.$axios.$get("color/");
        this.colors = colors;
      } catch (e) {
        console.error("FETCH colors ERR (product/_id/_title.vue): " + e);
      }

      this.page_loaded = true;
    }
  },

  computed: {
    inStock() {
      if (!_.isNil(this.product.models)) {
        let inStock = 0;
        this.product.models.forEach(model => {
          if (model.in_stock) {
            inStock += model.in_stock;
          }
        });
        return inStock;
      }
    },
    generateItems() {
      if (!_.isNil(this.selectedModel)) {
        let x = [];
        for (let i = 1; i <= this.selectedModel.in_stock; i++) x.push(i);

        return x;
      }
    },
    countDisabled() {
      if (!_.isNil(this.selectedModel)) {
        if (this.selectedModel.in_stock <= 0) return true;
        else return false;
      }
    },
    countLabel() {
      if (!_.isNil(this.selectedModel)) {
        return this.selectedModel.in_stock > 0 ? "تعداد " : "ناموجود";
      } else {
        return "تعداد";
      }
    },
    addToBasketActive() {
      if (
        !_.isNil(this.selectedModel) &&
        !_.isNil(this.selectedCount) &&
        this.selectedCount > 0
      )
        return true;
      else return false;
    },
    ...mapGetters("basket", ["toast"])
  }
};
</script>

<style scoped>
.slider-container {
  border-radius: 20px !important;
  overflow: hidden;
  box-shadow: 0 2px 2px 0 lightgray;
}
</style>
