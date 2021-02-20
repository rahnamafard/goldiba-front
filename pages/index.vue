<template>
  <div>
    <v-container>
      <!-- SLIDER -->
      <v-row class="mt-1">
        <v-carousel
          cycle
          height="auto"
          hide-delimiter-background
          show-arrows-on-hover
          class="slider-container"
        >
          <v-carousel-item
            v-for="(slide, i) in slider.slides"
            :src="slide.src"
            :key="i"
          >
          </v-carousel-item>
        </v-carousel>
      </v-row>
      <!-- END SLIDER -->

      <!-- <v-alert type="success" color="secondary" class="mt-6 mb-6">
        به نسخه‌ی آزمایشی فروشگاه اینترنتی گلدیبا خوش آمدید. این محصول همچنان در
        حال تکمیل است.
        <br />
        ایده‌های شما می‌تواند ما را در مسیر فراهم کردن تجربه‌ی یک خرید لذت‌بخش
        یاری دهد.
        <br />
        لطفا در صورت مشاهده‌ی هرگونه خرابی آن را گزارش نمایید.
      </v-alert> -->

      <!-- SEARCH BAR -->
      <v-row class="mt-5 mb-0">
        <v-text-field
          label="نام یا کد محصول را وارد کنید"
          :append-outer-icon="'mdi-magnify'"
          v-model="searchProductQuery"
          @click:append-outer="searchProduct"
          @keydown.enter="searchProduct"
          class="centered-input"
          color="secondary"
          rounded
          filled
          required
        ></v-text-field>
      </v-row>

      <!-- CATEGORIES MENU -->
      <v-row flat class="d-none d-sm-block mb-2" style="margin-top: -30px">
        <div class="pa-2" align="center" justify="center">
          <template v-for="root in tree_categories.children">
            <div
              v-if="!root.children || root.children.length <= 0"
              :key="root.category_id"
              class="d-inline"
            >
              <nuxt-link :to="categoryURL(root)">
                <v-btn :key="root.category_id" text rounded>
                  {{ root.title }}
                </v-btn>
              </nuxt-link>
            </div>

            <v-menu
              :key="root.category_id"
              v-else
              :close-on-content-click="false"
              open-on-hover
              bottom
              offset-y
            >
              <template v-slot:activator="{ on }">
                <nuxt-link :to="categoryURL(root)">
                  <v-btn rounded text v-on="on">
                    {{ root.title }}
                    <v-icon>
                      mdi-chevron-down
                    </v-icon>
                  </v-btn>
                </nuxt-link>
              </template>

              <v-list>
                <div v-for="child in root.children" :key="child.title">
                  <v-list-group
                    v-if="child.children && child.children.length > 0"
                    v-model="child.active"
                    prepend-icon="mdi-shape"
                  >
                    <template v-slot:activator>
                      <v-list-item>
                        <v-list-item-title>{{ child.title }}</v-list-item-title>
                        <v-list-item-action>
                          <v-btn icon :to="categoryURL(child)">
                            <v-icon>
                              mdi-arrow-top-right-thick
                            </v-icon>
                          </v-btn>
                        </v-list-item-action>
                      </v-list-item>
                    </template>

                    <v-list-item
                      v-for="subChild in child.children"
                      :key="subChild.title"
                      :to="categoryURL(subChild)"
                      dense
                    >
                      <v-list-item-icon>
                        <v-icon>mdi-subdirectory-arrow-left</v-icon>
                      </v-list-item-icon>
                      <v-list-item-title>
                        {{ subChild.title }}
                      </v-list-item-title>
                    </v-list-item>
                  </v-list-group>

                  <v-list-item
                    :key="child.title"
                    :to="categoryURL(child)"
                    v-else
                    prepend-icon="mdi-shape"
                  >
                    <v-list-item-icon>
                      <v-icon>mdi-subdirectory-arrow-left</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>
                      {{ child.title }}
                    </v-list-item-title>
                  </v-list-item>
                </div>
              </v-list>
            </v-menu>
          </template>
        </div>
      </v-row>

      <!-- PRODUCTS  -->
      <div v-if="$fetchState.pending">
        <div align="center" justify="center">
          <v-progress-circular
            class="center"
            indeterminate
            color="primary"
          ></v-progress-circular>
        </div>
      </div>
      <p v-else-if="$fetchState.error" class="red--text">خطا در بارگذاری</p>
      <div v-else>
        <!-- recharged shelf -->
        <div class="recharge mb-10">
          <v-icon>
            mdi-autorenew
          </v-icon>
          <h3 class="d-inline">شارژ مجدد</h3>

          <v-divider class="mt-2"></v-divider>
          <v-row>
            <v-slide-group
              show-arrows="always"
              class="d-flex mt-8"
              style="width: 100%"
            >
              <v-slide-item
                v-for="product in recharged_products"
                :key="product.product_id"
                :value="product.product_id"
                class="mb-3 align-self-stretch product-item"
              >
                <product-card :product="product"></product-card>
              </v-slide-item>
            </v-slide-group>
          </v-row>
        </div>

        <!-- category shelfs -->
        <div
          v-for="(shelf, index) in shelfs"
          :key="'shelf_' + index"
          class="mt-5 mb-5"
        >
          <v-row>
            <h3 class="float-right">{{ shelf.title }}</h3>
            <v-spacer></v-spacer>
            <v-btn text dense rounded :to="categoryURL(shelf.category)">
              <span class="ml-2">
                همه
              </span>
              <v-icon>mdi-dots-horizontal</v-icon>
            </v-btn>
          </v-row>
          <v-row class="mb-3"></v-row>
          <v-divider></v-divider>
          <v-row>
            <v-slide-group
              show-arrows="always"
              class="d-flex mt-8"
              style="width: 100%"
            >
              <v-slide-item
                v-for="product in shelf.products"
                :key="product.product_id"
                :value="product.product_id"
                class="mb-3 align-self-stretch product-item"
              >
                <product-card :product="product"></product-card>
              </v-slide-item>
            </v-slide-group>
          </v-row>
        </div>
      </div>
      <!-- END PRODUCTS -->
    </v-container>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import productCard from "~/components/productCard.vue";
var _ = require("lodash"); // to deep_clone json
var FlatToNested = require("flat-to-nested"); // convert flat json to nested json

export default {
  name: "HomePage",
  components: {
    productCard
  },

  head: {
    title: "صفحه اصلی"
  },

  data() {
    return {
      page_title: "صفحه اصلی",

      slider: {
        colors: [
          "indigo",
          "warning",
          "pink darken-2",
          "red lighten-1",
          "deep-purple accent-4"
        ],
        slides: [
          {
            src: require("assets/images/slider/1.jpg")
          },
          {
            src: require("assets/images/slider/2.jpg")
          },
          {
            src: require("assets/images/slider/3.jpg")
          },
          {
            src: require("assets/images/slider/4.jpg")
          },
          {
            src: require("assets/images/slider/5.jpg")
          }
        ]
      },
      categories: [],
      tree_categories: [],
      shelfs: [],
      prods: [],
      recharged_products: [],

      items: [
        {
          action: "mdi-chevron-down",
          title: "تست",
          items: [{ title: "تست" }]
        },
        {
          action: "mdi-chevron-down",
          title: "تست",
          active: true,
          items: [{ title: "تست" }, { title: "تست" }, { title: "تست" }]
        }
      ],

      searchProductQuery: ""
    };
  },

  async fetch() {
    await this.fetchShelfs();
  },

  watch: {
    // load page on direct url load
    async $route(to, from) {
      await this.fetchShelfs();
    }
  },

  computed: {},

  async mounted() {
    // Set page title
    this.$store.commit("SET_PAGE_TITLE", this.page_title);

    await this.fetchCategories();

    // bug fix: resolve issue that the page doesn't load completely at first server load
    if (this.shelfs.length === 0) await this.fetchShelfs();
  },

  methods: {
    async fetchCategories() {
      this.categories = await this.$axios.$get("/category/");
      // convert to tree
      let flatToNested = new FlatToNested({ id: "category_id" });
      let linear_categories = this.categories;
      this.tree_categories = flatToNested.convert(linear_categories);
    },

    async fetchShelfs() {
      try {
        try {
          let recharged_products = await this.$axios.$get(
            "/product/?is_active=true&is_recharged=true&order-by=-recharged_at&limit=30"
          );
          this.recharged_products = recharged_products;
        } catch (error) {
          console.error(
            "ERROR ON FETCH racherged products (index.vue): ",
            error
          );
        }

        let temp_shelfs = [];

        // products in cats
        await Promise.all(
          this.categories.map(async category => {
            let product_array = await this.$axios.$get(
              "/product/?category=" +
                category.category_id +
                "&is_active=true&order-by=-created_at,-recharged_at"
            );

            if (product_array.length > 0) {
              let newShelf = {
                title: category.title,
                category: category,
                products: product_array
              };
              temp_shelfs.push(newShelf);
            }
          })
        );

        // sort shelfs by count of products in it
        temp_shelfs.sort(function(a, b) {
          return b.products.length - a.products.length;
        });

        temp_shelfs.forEach(shelf => {
          // sort by in_stock
          shelf.products.sort((a, b) => {
            if (this.inStock(a) <= 0) {
              return 1;
            } else if (this.inStock(b) <= 0) {
              return -1;
            }
            return 0;
          });
        });

        this.shelfs = temp_shelfs;
      } catch (error) {
        console.error("ERROR ON FETCH (index.vue): ", error);
      }
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
    },

    searchProduct() {
      this.$router.replace("/product/search/" + this.searchProductQuery);
    },
    escapeTitle(title) {
      return title.split(" ").join("-"); // old solution (replaceAll is new but not supported in all browsers)
    },

    categoryURL(category) {
      return (
        "/product/category/" +
        category.category_id +
        "/" +
        this.escapeTitle(category.title) +
        "/"
      );
    }
  }
};
</script>

<style scoped>
.slider-container {
  border-radius: 20px;
}
.centered-input >>> * {
  text-align: center;
}
.centered-input >>> .v-label {
  right: 50% !important;
  margin-right: -100px;
}
</style>
