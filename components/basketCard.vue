<template>
  <v-card class="mb-5 d-flex border-radius-20">
    <v-container class="pa-0" style="overflow: hidden">
      <v-row class="flex-column flex-sm-row" no-gutters>
        <v-col cols="auto" sm="4" class="flex-shrink-1 pt-0 ma-0">
          <v-img style="height: 100%;" :src="model.image"></v-img>
        </v-col>

        <v-col class="flex-grow-1 pa-0 ma-0" style="position: relative">
          <v-card-title class="pb-0">
            {{ model.title }}
            <v-spacer></v-spacer>
            <v-btn icon color="primary" @click="removeOne()">
              <v-icon dark>
                mdi-close
              </v-icon>
            </v-btn>
          </v-card-title>

          <!-- color icon -->
          <v-icon
            :color="
              color_list.find(c => c.color_id === model.color)
                ? '#' + color_list.find(c => c.color_id === model.color).hex
                : '#f1f1f1'
            "
            class="d-inline mr-3"
          >
            mdi-square-rounded
          </v-icon>

          <!-- <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                :color="
                  color_list.find(c => c.color_id === model.color)
                    ? '#' + color_list.find(c => c.color_id === model.color).hex
                    : '#f1f1f1'
                "
                class="d-inline mr-3"
                v-bind="attrs"
                v-on="on"
              >
                mdi-square-rounded
              </v-icon>
            </template>
            <span>
              {{
                color_list.find(c => c.color_id === model.color)
                  ? color_list.find(c => c.color_id === model.color).name
                  : "نامشخص"
              }}
            </span>
          </v-tooltip> -->

          <v-card-subtitle class="d-inline pr-0 pb-5">
            <div class="float-left pl-5 pt-1 grey--text" style="opacity: 0.5">
              کد {{ model.code }}
            </div>
            {{
              color_list.find(c => c.color_id === model.color)
                ? color_list.find(c => c.color_id === model.color).name
                : "نامشخص"
            }}
          </v-card-subtitle>

          <v-divider class="mt-3"></v-divider>

          <v-card-text style="padding-bottom: 80px;">
            <div class="grey--text">
              {{ model.description }}
              <br v-show="model.description" />
            </div>
          </v-card-text>

          <v-divider
            style="position: absolute; bottom:50px; width: 100%"
          ></v-divider>

          <v-card-actions style="position: absolute; bottom:0; width: 100%;">
            <span> {{ quantity * model.price }} تومان </span>
            <v-spacer></v-spacer>
            <!-- change quantity -->
            <v-btn icon color="primary" @click="increaseOne">
              <v-icon dark>
                mdi-plus
              </v-icon>
            </v-btn>

            <span class="mr-1">
              {{ quantity }}
            </span>

            <v-btn icon color="primary" @click="decreaseOne">
              <v-icon dark>
                mdi-minus
              </v-icon>
            </v-btn>
          </v-card-actions>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
import { mapMutations, mapGetters, mapActions } from "vuex";

export default {
  props: ["model", "quantity", "color_list"],

  methods: {
    ...mapActions("basket", [
      "increaseModelQuantity",
      "decreaseModelQuantity",
      "removeModel"
    ]),
    increaseOne() {
      this.increaseModelQuantity({ model: this.model, reqQuantity: 1 });
      this.showToast();
    },
    decreaseOne() {
      this.decreaseModelQuantity({ model: this.model, reqQuantity: 1 });
      this.showToast();
    },
    removeOne() {
      this.removeModel(this.model);
      this.showToast();
    },
    showToast() {
      const toast = this.toast;
      if (toast.show) {
        this.$toast.show(toast.text, { type: toast.type });
      }
    }
  },

  computed: {
    ...mapGetters("basket", ["toast"])
  }
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
