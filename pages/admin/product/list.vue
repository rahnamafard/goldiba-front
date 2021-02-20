<template>
  <div>
    <!-- Overlay on screen -->
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </v-overlay>

    <v-dialog v-if="filterDialog" v-model="filterDialog" width="30%">
      <v-card>
        <v-card-title>
          جستجو
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="filterDialog = false" icon>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text>
          <v-row>
            <v-col>
              <v-text-field
                label="نام"
                v-model="filter.title"
                prepend-icon="mdi-rename-box"
                filled
                rounded
              ></v-text-field>

              <v-text-field
                label="کد"
                v-model="filter.code"
                prepend-icon="mdi-barcode"
                filled
                rounded
              ></v-text-field>

              <!-- start date -->
              <v-text-field
                :value="
                  filter.start_date
                    ? startDateMoment.format('dddd jDD jMMMM jYYYY')
                    : null
                "
                label="از تاریخ"
                prepend-icon="mdi-calendar"
                id="start-jalali-input"
                @click:clear="filter.start_date = null"
                clearable
                filled
                rounded
              ></v-text-field>
              <date-picker
                v-model="filter.start_date"
                :clearable="true"
                element="start-jalali-input"
                format="YYYY-MM-DD"
                display-format="dddd jDD jMMMM jYYYY"
                @change="startDateMoment = $event"
                :max="today"
                :auto-submit="true"
              />

              <!-- end date -->
              <v-text-field
                :value="
                  filter.end_date
                    ? endDateMoment.format('dddd jDD jMMMM jYYYY')
                    : null
                "
                label="تا تاریخ"
                prepend-icon="mdi-calendar"
                id="end-jalali-input"
                @click:clear="filter.end_date = null"
                clearable
                filled
                rounded
              ></v-text-field>

              <date-picker
                v-model="filter.end_date"
                :clearable="true"
                element="end-jalali-input"
                format="YYYY-MM-DD"
                display-format="dddd jDD jMMMM jYYYY"
                @change="endDateMoment = $event"
                :max="today"
                :auto-submit="true"
              />

              <v-treeview
                v-model="filter.selected_cats"
                :items="nested_cats.children"
                item-text="title"
                item-key="category_id"
                class=" mb-5"
                selection-type="independent"
                selectable
                return-object
              ></v-treeview>

              <v-btn
                color="secondary"
                class="pa-6"
                @click="loadTable"
                depressed
                rounded
                block
              >
                اعمال
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-data-table
      :headers="headers"
      :items="rows"
      class="elevation-2"
      :loading="loadingTable"
      loading-text="در حال بارگذاری..."
      :footer-props="{
        'items-per-page-text': 'تعداد نمایش:',
        'items-per-page-options': [10, 20, 30, 50, { text: 'همه', value: -1 }]
      }"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title> {{ child_title }} </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn dark class="mb-2" @click="filterDialog = true">
            جستجو
          </v-btn>
        </v-toolbar>
        <v-divider></v-divider>
      </template>

      <template v-slot:item.title="{ item }">
        {{ item.title }}<br />
        <span class="grey--text">{{ item.description }}</span>
      </template>

      <template v-slot:item.main_image="{ item }">
        <img
          v-show="item.main_image"
          style="max-height: 100%;"
          class="pa-0 ma-0"
          :src="item.main_image"
        />
      </template>

      <template v-slot:item.categories="{ item }">
        <div v-for="category in item.categories" :key="category.category_id">
          <v-chip x-small>
            {{ category.title }}
          </v-chip>
          <br />
        </div>
      </template>

      <template v-slot:item.created_at="{ item }">
        <div class="pt-2 pb-2">
          <v-icon small>
            mdi-clock
          </v-icon>
          <span style="color: #454545">
            {{ $jalaliDateTime(item.created_at).time }}
          </span>
          <br />
          <v-icon small color="grey">
            mdi-calendar
          </v-icon>
          <span class="grey--text">
            {{ $jalaliDateTime(item.created_at).date }}
          </span>
        </div>
      </template>

      <template v-slot:item.updated_at="{ item }">
        <div class="pt-2 pb-2">
          <v-icon small>
            mdi-clock
          </v-icon>
          <span style="color: #454545">
            {{ $jalaliDateTime(item.updated_at).time }}
          </span>
          <br />
          <v-icon small color="grey">
            mdi-calendar
          </v-icon>
          <span class="grey--text">
            {{ $jalaliDateTime(item.updated_at).date }}
          </span>
        </div>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <nuxt-link
              :to="
                '/product/' +
                  item.product_id +
                  '/' +
                  escapeTitle(item.title) +
                  '/'
              "
              target="_blank"
            >
              <v-icon small v-bind="attrs" v-on="on">
                mdi-arrow-top-right-thick
              </v-icon>
            </nuxt-link>
          </template>
          <span>
            جزئیات
          </span>
        </v-tooltip>

        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <nuxt-link :to="'/admin/product/form/?id=' + item.product_id">
              <v-icon small v-bind="attrs" v-on="on">
                mdi-pencil
              </v-icon>
            </nuxt-link>
          </template>
          <span>
            ویرایش
          </span>
        </v-tooltip>

        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              small
              style="cursor: pointer"
              v-bind="attrs"
              v-on="on"
              @click="deleteItem(item)"
            >
              mdi-delete
            </v-icon>
          </template>
          <span>
            حذف
          </span>
        </v-tooltip>
      </template>

      <template v-slot:no-data>
        <span>نتیجه‌ای جهت نمایش وجود ندارد.</span>
      </template>

      <template v-slot:footer.page-text="props">
        آیتم {{ props.pageStart }} تا {{ props.pageStop }} از
        {{ props.itemsLength }} مورد
      </template>
    </v-data-table>
  </div>
</template>

<script>
import moment from "moment-jalaali";
var FlatToNested = require("flat-to-nested"); // convert flat json to nested json
var _ = require("lodash");

let modelName = "محصول";

export default {
  name: "ProductList",

  components: {
    datePicker: () => import("vue-persian-datetime-picker")
  },

  head() {
    return {
      title: this.page_title
    };
  },

  async fetch() {
    // // permission check
    // if (!$auth.user.permissions.includes("core.view_order"))
    //   error({ statusCode: 403, message: "" });

    await this.fetchCategories();
  },

  data() {
    return {
      child_title: modelName + " ها",

      // overlay
      overlay: false,

      // data table
      headers: [
        { text: "عنوان", value: "title", align: "right", sortable: false },
        {
          text: "کد",
          value: "code",
          align: "center",
          sortable: false
        },
        {
          text: "مدل ها",
          value: "models.length",
          align: "left",
          sortable: true
        },
        {
          text: "تصویر اصلی",
          value: "main_image",
          align: "left",
          sortable: false
        },
        {
          text: "دسته‌ها",
          value: "categories",
          align: "center",
          sortable: false
        },
        {
          text: "ایجاد",
          value: "created_at",
          align: "right",
          sortable: true
        },
        {
          text: "به‌روزرسانی",
          value: "updated_at",
          align: "right",
          sortable: true
        },

        { text: "عملیات", value: "actions", sortable: false }
      ],
      rows: [],
      loadingTable: false,

      // filter
      filterDialog: false,
      filter: {
        title: null,
        code: null,
        selected_cats: [],
        start_date: null,
        end_date: null
      },
      linear_cats: [],
      nested_cats: [],
      startDateMoment: moment(),
      endDateMoment: moment(),
      order_status_list: [
        {
          label: "انتظار",
          value: "PE"
        },
        {
          label: "تأیید",
          value: "AP"
        },
        {
          label: "منقضی",
          value: "EX"
        }
      ],
      transaction_method_list: [
        {
          label: "زیبال",
          value: "ZB"
        },
        {
          label: "فیش بانکی",
          value: "OF"
        }
      ],
      date_menu: false
    };
  },

  mounted() {
    this.loadTable();
  },

  methods: {
    loadTable() {
      this.loadingTable = true;

      let url = "product/";
      url += this.queryStr("?", "return-object", true, "");

      // filter
      url = this.addFiltersTo(url);

      this.$axios
        .get(url)
        .then(response => {
          let results = response.data;

          // null or undefined response
          if (!results) {
            this.$toast.error("خطا در بارگذاری");
            return;
          }

          if (results.length <= 0) {
            this.$toast.show("آیتمی وجود ندارد.");
          }

          this.rows = results;
          this.loadingTable = false;
          this.filterDialog = false;
        })
        .catch(error => {
          console.log(error);
        });
    },

    async fetchCategories() {
      try {
        let response = await this.$axios.get("/category");
        this.linear_cats = response.data;

        let flatToNested = new FlatToNested({ id: "category_id" });
        let nested_categories = flatToNested.convert(this.linear_cats);

        this.nested_cats = nested_categories;
      } catch (e) {
        console.error("ERROR on fetch categories (product/list.vue): " + e);
      }
    },

    queryStr(start, key, val, end) {
      return start + key + "=" + val + end;
    },

    addFiltersTo(url) {
      url += !_.isNil(this.filter.title)
        ? this.queryStr("&", "title", this.filter.title, "")
        : "";

      url += !_.isNil(this.filter.code)
        ? this.queryStr("&", "code", this.filter.code, "")
        : "";

      url += !_.isNil(this.filter.selected_cats)
        ? this.queryStr(
            "&",
            "categories",
            this.filter.selected_cats.map(item => item.category_id).join(","),
            ""
          )
        : "";

      url += !_.isNil(this.filter.start_date)
        ? this.queryStr("&", "start-date", this.filter.start_date, "")
        : "";

      url += !_.isNil(this.filter.end_date)
        ? this.queryStr("&", "end-date", this.filter.end_date, "")
        : "";

      return url;
    },

    escapeTitle(title) {
      return title.split(" ").join("-"); // old solution (replaceAll is new but not supported in all browsers)
    },

    deleteItem(item) {
      const index = this.rows.indexOf(item);
      let product_id = item.product_id;
      if (confirm("از حذف این آیتم مطمئنید؟")) {
        // delete item
        this.$axios
          .delete("product/?id=" + product_id)
          .then(response => {
            this.$toast.success("محصول «" + item.title + "» با موفقیت حذف شد.");
            this.rows.splice(index, 1);
          })
          .catch(error => {
            console.log(error);
            if (error.response.status == 403) {
              this.$toast.error("شما دسترسی لازم را ندارید.");
            } else if (error.response.status == 500) {
              this.$toast.error(
                "امکان حذف محصولی که حداقل یکی از مدل‌هایش سفارش داده شده وجود ندارد."
              );
            } else {
              Object.entries(error.response.data).forEach(([key, val]) => {
                val.forEach(error => {
                  this.$toast.error(error);
                });
              });
            }
          });
      }
    }
  },

  computed: {
    today() {
      return new Date().toISOString().substr(0, 10);
    }
  }
};
</script>
