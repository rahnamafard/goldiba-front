<template>
  <div>
    <!-- Overlay on screen -->
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </v-overlay>

    <v-form
      class="mt-3"
      ref="form"
      v-model="form_product"
      @submit.prevent="submit()"
      lazy-validation
    >
      <v-row>
        <v-col lg="6" class="pt-0">
          <v-card>
            <v-card-title>
              شناسنامه محصول
            </v-card-title>
            <v-card-subtitle> </v-card-subtitle>

            <v-divider></v-divider>

            <v-card-text>
              <v-text-field
                label="عنوان محصول"
                v-model="product.title"
                prepend-icon="mdi-form-textbox"
                filled
                rounded
                required
              ></v-text-field>

              <v-text-field
                label="کد محصول"
                v-model="product.code"
                type="number"
                prepend-icon="mdi-numeric"
                filled
                rounded
                required
              ></v-text-field>

              <v-textarea
                label="توضیحات"
                v-model="product.description"
                prepend-icon="mdi-text-box-search"
                auto-grow
                filled
                rounded
              ></v-textarea>

              <v-switch
                v-model="product.is_recharged"
                label="ثبت به عنوان شارژ مجدد"
                color="secondary"
                inset
              ></v-switch>

              <v-switch
                v-model="product.is_active"
                label="فعال بودن این محصول"
                color="secondary"
                inset
              ></v-switch>

              <!-- <v-select
                label="برند محصول"
                prepend-icon="mdi-watermark"
                v-model="product.brand"
                :loading="meta.brands_load"
                :items="meta.brands"
                item-text="name"
                item-value="brand_id"
                filled
                rounded
              ></v-select>

              <v-select
                label="وضعیت محصول"
                prepend-icon="mdi-format-list-bulleted-square"
                v-model="product.status"
                :loading="meta.statuses_load"
                :items="meta.statuses"
                item-text="label"
                item-value="status_id"
                filled
                rounded
              ></v-select> -->
            </v-card-text>
          </v-card>
        </v-col>

        <v-col lg="6" class="pt-0">
          <v-card>
            <v-card-title>
              تصاویر
            </v-card-title>
            <v-card-subtitle> </v-card-subtitle>

            <v-divider></v-divider>

            <v-card-text>
              <!-- <v-combobox
                multiple
                v-model="product.tags"
                :items="meta.tags"
                item-value="tag_id"
                item-text="tag"
                label="برچسب‌ها"
                prepend-icon="mdi-tag"
                chips
                deletable-chips
                class="tag-input"
                :search-input.sync="meta.tag_search"
                @keypress.tab="updateTags"
                @paste="updateTags"
                filled
                rounded
              >
              </v-combobox> -->

              <!-- <v-text-field
                label="تخفیف"
                v-model="product.discount"
                :rules="discount_rules"
                suffix="درصد"
                type="number"
                prepend-icon="mdi-sale"
                filled
                rounded
              ></v-text-field> -->

              <!-- Show old main_image -->
              <div v-show="product.main_image !== null">
                <v-icon>
                  mdi-file-image
                </v-icon>
                <label class="pr-2">تصویر اصلی:</label>
                <br />
                <v-hover>
                  <template v-slot:default="{ hover }">
                    <v-card
                      class="mx-auto pa-0 ma-0 mt-2 border-radius-20 elevation-0 "
                    >
                      <img
                        v-show="product.main_image"
                        style="max-width: 100%;"
                        class="pa-0 ma-0 border-radius-20"
                        :src="product.main_image"
                      />

                      <v-fade-transition>
                        <v-overlay v-if="hover" absolute>
                          <v-btn @click="removeMainImage">
                            حذف
                          </v-btn>
                        </v-overlay>
                      </v-fade-transition>
                    </v-card>
                  </template>
                </v-hover>
              </div>

              <!-- choose new main_image -->
              <v-file-input
                v-model="product.new_main_image"
                v-if="product.main_image == null"
                @change="product.main_image_updated = true"
                label="تصویر اصلی"
                accept=".png,.jpg,.jpeg"
                prepend-icon="mdi-file-image"
                show-size
                filled
                rounded
              ></v-file-input>

              <!-- Show old second_image -->
              <div v-show="product.second_image !== null">
                <v-icon>
                  mdi-file-image-outline
                </v-icon>
                <label class="pr-2">تصویر دوم:</label>
                <br />
                <v-hover>
                  <template v-slot:default="{ hover }">
                    <v-card
                      class="mx-auto pa-0 ma-0 mt-2 border-radius-20 elevation-0 "
                    >
                      <img
                        v-show="product.second_image"
                        style="max-width: 100%;"
                        class="pa-0 ma-0 border-radius-20"
                        :src="product.second_image"
                      />

                      <v-fade-transition>
                        <v-overlay v-if="hover" absolute>
                          <v-btn @click="removeSecondImage">
                            حذف
                          </v-btn>
                        </v-overlay>
                      </v-fade-transition>
                    </v-card>
                  </template>
                </v-hover>
              </div>

              <!-- choose new second_image -->
              <v-file-input
                v-model="product.new_second_image"
                v-if="product.second_image == null"
                @change="product.second_image_updated = true"
                label="تصویر دوم"
                accept=".png,.jpg,.jpeg"
                prepend-icon="mdi-file-image-outline"
                show-size
                filled
                rounded
              ></v-file-input>

              <!-- Show old size_image -->
              <div v-show="product.size_image !== null">
                <v-icon>
                  mdi-file-image-outline
                </v-icon>
                <label class="pr-2">تصویر راهنمای سایز:</label>
                <br />
                <v-hover>
                  <template v-slot:default="{ hover }">
                    <v-card
                      class="mx-auto pa-0 ma-0 mt-2 border-radius-20 elevation-0 "
                    >
                      <img
                        v-show="product.size_image"
                        style="max-width: 100%;"
                        class="pa-0 ma-0 border-radius-20"
                        :src="product.size_image"
                      />

                      <v-fade-transition>
                        <v-overlay v-if="hover" absolute>
                          <v-btn @click="removeSizeImage">
                            حذف
                          </v-btn>
                        </v-overlay>
                      </v-fade-transition>
                    </v-card>
                  </template>
                </v-hover>
              </div>

              <!-- choose new size_image -->
              <v-file-input
                v-model="product.new_size_image"
                v-if="product.size_image == null"
                @change="product.size_image_updated = true"
                label="تصویر راهنمای سایز"
                accept=".png,.jpg,.jpeg"
                prepend-icon="mdi-image-size-select-large"
                show-size
                filled
                rounded
              ></v-file-input>

              <!-- <v-switch
                v-model="product.free_send"
                label="ارسال رایگان برای مشتری"
                color="secondary"
                inset
              ></v-switch> -->

              <!-- <v-btn @click="submit()">تست</v-btn> -->
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <v-col lg="12">
          <v-card>
            <v-card-title>
              دسته‌بندی‌ها
            </v-card-title>

            <v-divider></v-divider>

            <v-card-text>
              <v-row>
                <v-col>
                  <v-treeview
                    v-model="selected_cats"
                    :items="meta.nested_cats.children"
                    item-text="title"
                    item-key="category_id"
                    selection-type="independent"
                    selectable
                    return-object
                  ></v-treeview>
                </v-col>
                <v-divider vertical></v-divider>
                <v-col class="pa-6" cols="6">
                  <div
                    v-if="
                      selected_cats !== undefined &&
                        selected_cats !== null &&
                        selected_cats.length > 0
                    "
                  >
                    <v-chip
                      class="ma-1"
                      v-for="(category, i) in selected_cats"
                      :key="i"
                    >
                      {{ category.title }}
                    </v-chip>
                  </div>
                  <div v-else>
                    دسته‌بندی‌ای انتخاب نشده.
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <v-col lg="12">
          <v-data-table
            :headers="headers"
            :items="models"
            class="elevation-2"
            :loading="loadingTable"
            loading-text="در حال بارگذاری..."
            :footer-props="{
              'items-per-page-text': 'تعداد نمایش:',
              'items-per-page-options': [
                10,
                20,
                30,
                50,
                { text: 'همه', value: -1 }
              ]
            }"
          >
            <template v-slot:top>
              <v-toolbar flat>
                <v-toolbar-title> مدل‌های محصول </v-toolbar-title>

                <v-spacer></v-spacer>

                <!-- New Item Form -->
                <v-dialog
                  v-model="new_dialog"
                  @click:outside="close"
                  max-width="50%"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn dark class="mb-2" v-bind="attrs" v-on="on">
                      مدل جدید
                    </v-btn>
                  </template>

                  <v-card>
                    <v-card-title>
                      <span>مدل جدید</span>
                    </v-card-title>

                    <v-divider></v-divider>

                    <v-card-text class="pb-0">
                      <v-container>
                        <v-row>
                          <v-col class="pb-0">
                            <v-form
                              ref="form_new_model"
                              v-model="form_new_model"
                              @submit.prevent="save"
                            >
                              <v-text-field
                                label="عنوان مدل"
                                v-model="newItem.title"
                                :rules="model_title_rules"
                                prepend-icon="mdi-form-textbox"
                                filled
                                rounded
                                required
                              ></v-text-field>

                              <v-text-field
                                label="کد مدل"
                                v-model="newItem.code"
                                :rules="model_code_rules"
                                prepend-icon="mdi-numeric"
                                filled
                                rounded
                                required
                              ></v-text-field>

                              <v-text-field
                                label="قیمت"
                                v-model="newItem.price"
                                suffix="تومان"
                                :rules="model_price_rules"
                                prepend-icon="mdi-cash-multiple"
                                filled
                                rounded
                              ></v-text-field>

                              <v-text-field
                                label="موجودی"
                                v-model="newItem.in_stock"
                                suffix="عدد"
                                :rules="model_in_stock_rules"
                                prepend-icon="mdi-store"
                                filled
                                rounded
                              ></v-text-field>

                              <v-file-input
                                v-model="newItem.new_image"
                                label="تصویر مدل"
                                :rules="model_image_rules"
                                prepend-icon="mdi-file-image-outline"
                                show-size
                                filled
                                rounded
                              ></v-file-input>

                              <div class="mb-5">
                                <div style="float: right; padding-top: 15px">
                                  <v-icon>mdi-eyedropper-variant</v-icon>
                                </div>

                                <v-chip-group
                                  mandatory
                                  active-class="color-selected"
                                  v-model="newItem.color"
                                  style="padding-right: 10px"
                                >
                                  <div
                                    v-for="color in meta.colors"
                                    :key="color.color_id"
                                  >
                                    <v-tooltip bottom>
                                      <template v-slot:activator="{ on }">
                                        <v-chip
                                          :color="'#' + color.hex"
                                          v-bind="
                                            // JUST FOR VUE.JS WARNINGS!!!
                                            (() => {
                                              color.color_id;
                                            })()
                                          "
                                          v-on="on"
                                          class="color-chip ml-1"
                                          large
                                        >
                                        </v-chip>
                                      </template>
                                      <span>{{ color.name }}</span>
                                    </v-tooltip>
                                  </div>
                                </v-chip-group>
                              </div>

                              <v-textarea
                                label="توضیحات"
                                v-model="newItem.description"
                                prepend-icon="mdi-text-box-search"
                                auto-grow
                                filled
                                rounded
                              ></v-textarea>

                              <v-switch
                                v-model="newItem.is_active"
                                label="فعال بودن این مدل"
                                color="secondary"
                                inset
                              ></v-switch>
                            </v-form>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-card-text>

                    <v-divider></v-divider>

                    <v-card-actions>
                      <v-btn color="error darken-1" text @click="close">
                        بستن
                      </v-btn>
                      <v-spacer></v-spacer>

                      <v-btn color="success darken-1" text @click="save">
                        ذخیره
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>

                <!-- Edit Item Form -->
                <v-dialog
                  v-model="edit_dialog"
                  @click:outside="close"
                  max-width="50%"
                >
                  <v-card>
                    <v-card-title>
                      <span>ویرایش مدل</span>
                    </v-card-title>

                    <v-divider></v-divider>

                    <v-card-text class="pb-0">
                      <v-container>
                        <v-row>
                          <v-col class="pb-0">
                            <v-form
                              ref="form_edit_model"
                              v-model="form_edit_model"
                              @submit.prevent="save"
                            >
                              <v-text-field
                                label="عنوان مدل"
                                v-model="editedItem.title"
                                :rules="model_title_rules"
                                prepend-icon="mdi-form-textbox"
                                filled
                                rounded
                                required
                              ></v-text-field>

                              <v-text-field
                                label="کد مدل"
                                v-model="editedItem.code"
                                :rules="model_code_rules"
                                prepend-icon="mdi-numeric"
                                filled
                                rounded
                                required
                              ></v-text-field>

                              <v-text-field
                                label="قیمت"
                                v-model="editedItem.price"
                                suffix="تومان"
                                :rules="model_price_rules"
                                prepend-icon="mdi-cash-multiple"
                                filled
                                rounded
                              ></v-text-field>

                              <v-text-field
                                label="موجودی"
                                v-model="editedItem.in_stock"
                                suffix="عدد"
                                :rules="model_in_stock_rules"
                                prepend-icon="mdi-store"
                                filled
                                rounded
                              ></v-text-field>

                              <!-- Show old model image -->
                              <div v-show="editedItem.image !== null">
                                <v-icon>
                                  mdi-file-image-outline
                                </v-icon>
                                <label class="pr-2">تصویر مدل:</label>
                                <br />
                                <v-hover>
                                  <template v-slot:default="{ hover }">
                                    <v-card
                                      class="mx-auto pa-0 ma-0 mt-2 border-radius-20 elevation-0 "
                                    >
                                      <img
                                        v-show="editedItem.image"
                                        style="max-width: 100%;"
                                        class="pa-0 ma-0 border-radius-20"
                                        :src="editedItem.image"
                                      />

                                      <v-fade-transition>
                                        <v-overlay v-if="hover" absolute>
                                          <v-btn @click="removeEditedItemImage">
                                            حذف
                                          </v-btn>
                                        </v-overlay>
                                      </v-fade-transition>
                                    </v-card>
                                  </template>
                                </v-hover>
                              </div>

                              <!-- choose new model image -->
                              <v-file-input
                                v-model="editedItem.new_image"
                                v-if="editedItem.image == null"
                                @change="editedItem.image_updated = true"
                                :rules="model_image_rules"
                                label="تصویر مدل"
                                accept=".png,.jpg,.jpeg"
                                prepend-icon="mdi-file-image-outline"
                                show-size
                                filled
                                rounded
                              ></v-file-input>

                              <div class="mb-5">
                                <div style="float: right; padding-top: 15px">
                                  <v-icon>mdi-eyedropper-variant</v-icon>
                                </div>

                                <v-chip-group
                                  mandatory
                                  active-class="color-selected"
                                  v-model="editedItem.color"
                                  style="padding-right: 10px"
                                >
                                  <div
                                    v-for="color in meta.colors"
                                    :key="color.color_id"
                                  >
                                    <v-tooltip bottom>
                                      <template v-slot:activator="{ on }">
                                        <v-chip
                                          :color="'#' + color.hex"
                                          v-bind="
                                            // JUST FOR VUE.JS WARNINGS!!!
                                            (() => {
                                              color.color_id;
                                            })()
                                          "
                                          v-on="on"
                                          class="color-chip ml-1"
                                          large
                                        >
                                        </v-chip>
                                      </template>
                                      <span>{{ color.name }}</span>
                                    </v-tooltip>
                                  </div>
                                </v-chip-group>
                              </div>

                              <v-textarea
                                label="توضیحات"
                                v-model="editedItem.description"
                                prepend-icon="mdi-text-box-search"
                                auto-grow
                                filled
                                rounded
                              ></v-textarea>

                              <v-switch
                                v-model="editedItem.is_active"
                                label="فعال بودن این مدل"
                                color="secondary"
                                inset
                              ></v-switch>
                            </v-form>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-card-text>

                    <v-divider></v-divider>

                    <v-card-actions>
                      <v-btn color="error darken-1" text @click="close">
                        بستن
                      </v-btn>
                      <v-spacer></v-spacer>

                      <v-btn color="success darken-1" text @click="save">
                        ذخیره
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-toolbar>
              <v-divider></v-divider>
            </template>

            <!-- model image -->
            <template v-slot:item.image="{ item }">
              <img
                v-if="item.image"
                style="max-height: 100%; border-radius: 10px; margin: 5px 5px 0 5px"
                :src="item.image"
              />
              <div v-else>
                <v-icon color="grey">
                  mdi-image-remove
                </v-icon>
                <span class="grey--text" style="font-size:0.8em">
                  بدون تصویر
                </span>
              </div>
            </template>

            <!-- color box view -->
            <template v-slot:item.color="{ item }">
              <v-icon
                :color="
                  meta.colors.find(c => c.color_id === item.color)
                    ? '#' + meta.colors.find(c => c.color_id === item.color).hex
                    : '#f1f1f1'
                "
              >
                mdi-square-rounded
              </v-icon>
              <span>
                {{
                  meta.colors.find(c => c.color_id === item.color)
                    ? meta.colors.find(c => c.color_id === item.color).name
                    : "نامشخص"
                }}
              </span>
            </template>

            <!-- is model active?  -->
            <template v-slot:item.is_active="{ item }">
              <v-switch v-model="item.is_active" inset disabled></v-switch>
            </template>

            <!-- actions -->
            <template v-slot:item.actions="{ item }">
              <v-icon small class="mr-2" @click="editItem(item)">
                mdi-pencil
              </v-icon>
              <v-icon small @click="deleteItem(item)">
                mdi-delete
              </v-icon>
            </template>

            <!-- no data -->
            <template v-slot:no-data>
              <span>نتیجه‌ای جهت نمایش وجود ندارد.</span>
            </template>

            <!-- table page text -->
            <template v-slot:footer.page-text="props">
              آیتم {{ props.pageStart }} تا {{ props.pageStop }} از
              {{ props.itemsLength }} مورد
            </template>
          </v-data-table>
        </v-col>
      </v-row>

      <v-row>
        <v-col lg="12">
          <v-btn
            color="secondary"
            class="pa-7 mb-5"
            :disabled="!form_product"
            @click.prevent="submitForm()"
            block
            rounded
            depressed
          >
            {{ edit_mode ? "ویرایش محصول" : "افزودن محصول" }}
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>

<script>
import moment from "moment";
var _ = require("lodash"); // to deep_clone json
var FlatToNested = require("flat-to-nested"); // convert flat json to nested json

export default {
  name: "NewProduct",

  validate({ query }) {
    // Check 'id' parameter to be a number
    if (query.id) return /^\d+$/.test(query.id);
    else return true;
  },

  async fetch({ $axios, $auth, error }) {
    this.overlay = true;

    if (!$auth.user.permissions.includes("core.add_product"))
      error({ statusCode: 403, message: "" });
  },

  data() {
    return {
      page_title: "فرم محصول",

      snackbar: {
        visible: false,
        value: "خطایی رخ داده است.",
        color: "info"
      },

      overlay: false, // loading

      edit_mode: false,

      meta: {
        statuses_load: true,
        brands_load: true,
        colors: [],
        tags: [],
        tag_search: "", // sync search
        linear_cats: [],
        nested_cats: []
      },

      product_id: null,
      product: {
        brand: "",
        status: "",
        title: "",
        description: "",
        code: "",
        discount: 0,
        free_send: false,
        is_active: true,
        is_recharged: false,

        main_image: null,
        new_main_image: null,
        main_image_updated: false,

        second_image: null,
        new_second_image: null,
        second_image_updated: false,

        size_image: null,
        new_size_image: null,
        size_image_updated: false

        // params_json: {},
        // relatives_json: {},
        // likes: 0,
        // tags: [],
      },

      selected_cats: [], // category select helper

      form_product: false,
      form_new_model: false,
      form_edit_model: false,

      // field rules
      discount_rules: [
        val => {
          return val <= 100 && val >= 0 ? true : "عددی بین 0 تا 100 وارد کنید.";
        }
      ],
      image_rules: [
        value => {
          !value ||
            value.size <= 2000000 ||
            "حجم فایل باید کمتر از 2 مگابایت باشد";
        }
      ],
      model_title_rules: [
        val => {
          return !!val || "نام مدل را وارد کنید.";
        }
      ],
      model_code_rules: [
        val => {
          return !!val || "کد مدل را وارد کنید.";
        }
      ],
      model_price_rules: [
        val => {
          return !!val || "قیمت مدل را وارد کنید.";
        }
      ],
      model_in_stock_rules: [
        val => {
          return !!val || "موجودی مدل را وارد کنید.";
        }
      ],
      model_image_rules: [
        val => {
          return !!val || "تصویر مدل را انتخاب کنید.";
        }
      ],

      // dialogs
      new_dialog: false,
      edit_dialog: false,

      // data table
      models: [],
      headers: [
        {
          text: "کد ",
          align: "start",
          sortable: true,
          value: "code"
        },
        {
          text: "نام",
          align: "start",
          sortable: true,
          value: "title"
        },

        {
          text: "رنگ",
          align: "start",
          sortable: true,
          value: "color"
        },
        {
          text: "تصویر ",
          align: "start",
          sortable: false,
          value: "image"
        },
        {
          text: "وضعیت",
          align: "start",
          sortable: true,
          value: "is_active"
        },
        {
          text: "قیمت",
          align: "start",
          sortable: true,
          value: "price"
        },
        {
          text: "موجودی ",
          align: "start",
          sortable: true,
          value: "in_stock"
        },
        { text: "عملیات", value: "actions", sortable: false }
      ],
      loadingTable: false,
      loading: false,

      // model definition
      newItem: {
        title: "",
        code: "",
        color: null,
        is_active: true,
        description: "",
        price: "",
        in_stock: 0,
        image: [],
        new_image: null
      },
      defaultNewItem: {
        title: "",
        code: "",
        color: null,
        is_active: true,
        description: "",
        price: "",
        in_stock: 0,
        image: [],
        new_image: null
      },
      editedItem: {
        title: "",
        code: "",
        color: null,
        is_active: true,
        description: "",
        price: "",
        in_stock: 0,
        image: [],
        new_image: null,
        image_updated: false
      },
      editedIndex: -1,
      defaultEditItem: {
        title: "",
        code: "",
        color: null,
        is_active: true,
        description: "",
        price: "",
        in_stock: 0,
        image: [],
        new_image: null,
        image_updated: false
      }
    };
  },

  head() {
    return {
      title: this.page_title
    };
  },

  watch: {
    // require for react to route from `/url/foo` to `/url/bar`
    $route(to, from) {
      let passed_id = this.$route.query.id ? this.$route.query.id : null;
      this.product_id = passed_id;
      if (!_.isNil(this.product_id)) this.edit_mode = true;
    }
  },

  mounted() {
    this.$store.commit("SET_PAGE_TITLE", this.page_title); // Set page title

    // id param
    let passed_id = this.$route.query.id ? this.$route.query.id : null;
    this.product_id = passed_id;

    // Get form meta data
    this.overlay = true;
    this.$axios
      .get("/product/new-product-form-info/")
      .then(response => {
        let body = response.data.body;

        let default_status = { status_id: "", label: "بدون وضعیت" };
        let default_brand = {
          brand_id: "",
          name: "بدون برند",
          english_name: "No Brand",
          image: []
        };
        let default_color = { color_id: null, code: "fff", name: "نامشخص" };

        let statuses = [default_status].concat(body.statuses);
        let brands = [default_brand].concat(body.brands);
        let colors = [default_color].concat(body.colors);

        // categories
        let flatToNested = new FlatToNested({ id: "category_id" });
        let linear_categories = body.categories;
        let nested_categories = flatToNested.convert(linear_categories);

        // let tags = [];

        // body.tags.forEach(t => {
        //   console.log(t);
        //   tags.concat([{ tag: t.tag }]);
        // });

        this.product = {
          ...this.product,
          status: default_status.status_id,
          brand: default_brand.brand_id
        };

        this.meta = {
          ...this.meta,
          statuses: statuses,
          statuses_load: false,

          brands: brands,
          brands_load: false,

          colors: colors,
          linear_cats: linear_categories,
          nested_cats: nested_categories
          // tags: tags,
        };
      })
      .catch(error => {
        this.snackbar.color = "error";
        this.snackbar.visible = true;
      });

    if (!_.isNil(this.product_id)) {
      this.edit_mode = true;

      this.$axios
        .get("/product/?id=" + this.product_id)
        .then(respond => {
          let fetched_product = respond.data[0];
          this.product = fetched_product;
          this.models = fetched_product.models;

          fetched_product.categories.forEach(category_id => {
            let found_cat = this.meta.linear_cats.find(
              item => item.category_id === category_id
            );
            this.selected_cats.push(found_cat);
          });
        })
        .catch(error => {
          console.log(error);
        });
    }

    this.overlay = false;
  },

  methods: {
    async post() {
      try {
        let data = await this.prepareObjectForPost(this.product);
        try {
          let respond = await this.$axios.$post("product/", data);
          this.overlay = false;
          this.$toast.success("محصول با موفقیت تعریف شد.");

          // redirect to home
          // setTimeout(resolve => {
          this.$nuxt.$router.replace({ path: "/admin/product/list/" });
          // }, 500);
        } catch (error) {
          // show errors
          if (error.response.status == 403) {
            this.$toast.error("شما دسترسی لازم را ندارید.");
          } else {
            Object.entries(error.response.data).forEach(([key, val]) => {
              // val is always an array (of string/of obj)
              val.forEach(item => {
                if (typeof item === "string") {
                  this.$toast.error(item);
                } else {
                  // nested errors
                  Object.entries(item).forEach(([nested_key, nested_val]) => {
                    nested_val.forEach(nested_item => {
                      if (typeof nested_item === "string") {
                        this.$toast.error(nested_item);
                      }
                    });
                  });
                }
              });
            });
          }
        } finally {
          this.overlay = false;
        }
      } catch (e) {
        console.error("ERROR ON PREPARE OBJECT FOR POST: ", e);
      }
    },

    async patch() {
      try {
        let data = await this.prepareObjectForPatch(this.product);
        try {
          let respond = await this.$axios.$patch(
            "product/?id=" + this.product_id,
            data
          );
          this.overlay = false;
          this.$toast.success("محصول با موفقیت ویرایش شد.");
        } catch (error) {
          this.$toast.error("مشکلی در ویرایش محصول پیش آمده.");
          console.error("ERROR ON PATCHING OBJECT: ", error);

          // show errors
          if (error.response.status == 403) {
            this.$toast.error("شما دسترسی لازم را ندارید.");
          } else {
            Object.entries(error.response.data).forEach(([key, val]) => {
              // val is always an array (of string/of obj)
              val.forEach(item => {
                if (typeof item === "string") {
                  this.$toast.error(item);
                } else {
                  // nested errors
                  Object.entries(item).forEach(([nested_key, nested_val]) => {
                    nested_val.forEach(nested_item => {
                      if (typeof nested_item === "string") {
                        this.$toast.error(nested_item);
                      }
                    });
                  });
                }
              });
            });
          }
        } finally {
          this.overlay = false;
        }
      } catch (e) {
        console.error("ERROR ON PREPARE OBJECT FOR PATCH: ", e);
      }
    },

    submitForm(e) {
      if (!this.$refs.form.validate()) return;

      this.overlay = true;
      if (this.edit_mode) {
        this.patch();
      } else {
        this.post();
      }
    },

    prepareObjectForPost(input) {
      return new Promise(async (resolve, reject) => {
        let output = _.cloneDeep(input); // BEST WAY TO CLONE A JSON EVER!
        output.models = JSON.parse(JSON.stringify(this.models));

        // base64 conversion for images:
        // main image
        if (output.main_image_updated) {
          if (_.isNil(output.new_main_image)) {
            output.main_image = null; // new_cover == null
          } else {
            if (output.new_main_image instanceof File) {
              output.main_image = await this.$base64(output.new_main_image);
            } else {
              delete output.main_image; // new_cover == [] (possibly not reachable at all!)
            }
          }
        } else {
          // if (new_cover == 'no_new_cover') remove prop from obj for PATCH request
          delete output.main_image;
        }

        // second image
        if (output.second_image_updated) {
          if (_.isNil(output.new_second_image)) {
            output.second_image = null; // new_cover == null
          } else {
            if (output.new_second_image instanceof File) {
              output.second_image = await this.$base64(output.new_second_image);
            } else {
              delete output.second_image; // new_cover == [] (possibly not reachable at all!)
            }
          }
        } else {
          // if (new_cover == 'no_new_cover') remove prop from obj for PATCH request
          delete output.second_image;
        }

        // size image
        if (output.size_image_updated) {
          if (_.isNil(output.new_size_image)) {
            output.size_image = null; // new_cover == null
          } else {
            if (output.new_size_image instanceof File) {
              output.size_image = await this.$base64(output.new_size_image);
            } else {
              delete output.size_image; // new_cover == [] (possibly not reachable at all!)
            }
          }
        } else {
          // if (new_cover == 'no_new_cover') remove prop from obj for PATCH request
          delete output.size_image;
        }

        // models
        await Promise.all(
          output.models.map(async model => {
            if (model.color === 0) {
              model.color = null;
            } else {
              model.color = model.color;
            }
          })
        );

        // categories
        output.categories = this.selected_cats.map(cat => cat.category_id);

        // recharged
        if (output.is_recharged) {
          output.recharged_at = this.today();
        } else {
          delete output.is_recharged;
          delete output.recharged_at;
        }

        resolve(output);
      });
    },

    // edit mode
    prepareObjectForPatch(input) {
      return new Promise(async (resolve, reject) => {
        let output = await _.cloneDeep(input); // BEST WAY TO CLONE A JSON EVER!

        // base64 conversion for images:
        // main image
        if (output.main_image_updated) {
          if (_.isNil(output.new_main_image)) {
            output.main_image = null; // new_cover == null
          } else {
            if (output.new_main_image instanceof File) {
              output.main_image = await this.$base64(output.new_main_image);
            } else {
              delete output.main_image; // new_cover == [] (possibly not reachable at all!)
            }
          }
        } else {
          // if (new_cover == 'no_new_cover') remove prop from obj for PATCH request
          delete output.main_image;
        }

        // second image
        if (output.second_image_updated) {
          if (_.isNil(output.new_second_image)) {
            output.second_image = null; // new_cover == null
          } else {
            if (output.new_second_image instanceof File) {
              output.second_image = await this.$base64(output.new_second_image);
            } else {
              delete output.second_image; // new_cover == [] (possibly not reachable at all!)
            }
          }
        } else {
          // if (new_cover == 'no_new_cover') remove prop from obj for PATCH request
          delete output.second_image;
        }

        // size image
        if (output.size_image_updated) {
          if (_.isNil(output.new_size_image)) {
            output.size_image = null; // new_cover == null
          } else {
            if (output.new_size_image instanceof File) {
              output.size_image = await this.$base64(output.new_size_image);
            } else {
              delete output.size_image; // new_cover == [] (possibly not reachable at all!)
            }
          }
        } else {
          // if (new_cover == 'no_new_cover') remove prop from obj for PATCH request
          delete output.size_image;
        }

        // models
        await Promise.all(
          output.models.map(async model => {
            if (model.color === 0) {
              model.color = null;
            } else {
              model.color = model.color;
            }
          })
        );

        // remove model unchanged images
        output.models.map(model => {
          if (model.image_updated !== true) {
            delete model.image;
          }
          delete model.new_image;
          delete model.image_updated;
        });

        // categories
        output.categories = this.selected_cats.map(cat => cat.category_id);

        // recharged
        if (output.is_recharged) {
          output.recharged_at = this.today();
        } else {
          delete output.is_recharged;
          delete output.recharged_at;
        }

        resolve(output);
      });
    },

    today() {
      let d = moment().format("YYYY-MM-DD HH:mm:ss");
      return d;
    },

    // model pane
    editItem(item) {
      this.editedIndex = this.models.indexOf(item);
      this.editedItem = Object.assign({}, this.defaultEditItem, item); // merge item by default object and assign a copy
      this.edit_dialog = true;
    },

    async deleteItem(item) {
      const index = this.models.indexOf(item);
      if (confirm("از حذف این آیتم مطمئنید؟")) {
        this.overlay = true;
        if (this.edit_mode) {
          try {
            let respond = await this.$axios.$delete(
              "product/model/?id=" + item.model_id
            );
            this.$toast.success("مدل «" + item.title + "» با موفقیت حذف شد.");
            this.models.splice(index, 1);
          } catch (error) {
            this.$toast.error("امکان حذف این مدل وجود ندارد.");
          }
        } else {
          this.$toast.success("مدل «" + item.title + "» با موفقیت حذف شد.");
          this.models.splice(index, 1);
        }
        this.overlay = false;
      }
    },

    close() {
      this.new_dialog = false;
      this.edit_dialog = false;

      if (!_.isNil(this.$refs.form_new_model))
        this.$refs.form_new_model.reset();
      if (!_.isNil(this.$refs.form_edit_model))
        this.$refs.form_edit_model.reset();

      this.$nextTick(() => {
        this.newItem = Object.assign({}, this.defaultNewItem);
        this.editedItem = Object.assign({}, this.defaultEditItem);
        this.editedIndex = -1;
      });
    },

    async save() {
      if (this.editedIndex > -1) {
        // update an item
        if (!this.$refs.form_edit_model.validate()) {
          this.$toast.error("فرم ناقص است.");
          return;
        }

        // let edit_item = Object.assign({}, this.editedItem);
        let edit_item = _.clone(this.editedItem);

        if (!_.isNil(edit_item.new_image)) {
          if (edit_item.new_image instanceof File) {
            await this.$base64(edit_item.new_image).then(base64_img => {
              edit_item.image = base64_img;
            });
          } else {
            edit_item.image = null; // cover == []
          }
        }

        Object.assign(this.models[this.editedIndex], _.clone(edit_item));

        this.$toast.success("آیتم ویرایش شد.");
        this.close();
      } else {
        // create new item
        if (!this.$refs.form_new_model.validate()) {
          this.$toast.error("فرم ناقص است.");
          return;
        }

        let new_item = Object.assign({}, this.newItem, { image_updated: true });

        if (!_.isNil(new_item.new_image)) {
          if (new_item.new_image instanceof File) {
            this.$base64(new_item.new_image).then(base64_img => {
              new_item.image = base64_img;
            });
          } else {
            new_item.image = null; // cover == []
          }
        }

        this.models.push(new_item);
        this.$toast.success("آیتم ایجاد شد.");
        this.close();
      }
    },

    removeMainImage() {
      this.product.main_image = null;
      this.product.new_main_image = null;
      this.product.main_image_updated = true;
    },

    removeSecondImage() {
      this.product.second_image = null;
      this.product.new_second_image = null;
      this.product.second_image_updated = true;
    },

    removeSizeImage() {
      this.product.size_image = null;
      this.product.new_size_image = null;
      this.product.size_image_updated = true;
    },

    removeEditedItemImage() {
      this.editedItem.image = null;
      this.editedItem.new_image = null;
      this.editedItem.image_updated = true;
    }
  }
};
</script>
