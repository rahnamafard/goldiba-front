<template>
  <div>
    <!-- Overlay on screen -->
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </v-overlay>

    <v-dialog v-if="filterDialog" v-model="filterDialog" width="40%">
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
                label="نام کاربر"
                v-model="filter.name"
                prepend-icon="mdi-account-details"
                @keydown.enter="loadTable"
                filled
                rounded
              ></v-text-field>

              <v-text-field
                label="موبایل کاربر"
                v-model="filter.mobile"
                prepend-icon="mdi-cellphone-iphone"
                @keydown.enter="loadTable"
                filled
                rounded
              ></v-text-field>

              <v-text-field
                label="شماره تماس"
                v-model="filter.phone"
                prepend-icon="mdi-phone"
                @keydown.enter="loadTable"
                filled
                rounded
              ></v-text-field>

              <v-text-field
                label="کد پی‌گیری"
                v-model="filter.tracking_code"
                prepend-icon="mdi-barcode"
                @keydown.enter="loadTable"
                filled
                rounded
              ></v-text-field>

              <v-select
                label="وضعیت سفارش"
                prepend-icon="mdi-list-status"
                v-model="filter.order_status"
                :items="order_status_list"
                item-text="label"
                item-value="value"
                @keydown.enter="loadTable"
                filled
                rounded
              ></v-select>

              <v-select
                label="نوع سفارش"
                prepend-icon="mdi-credit-card-outline"
                v-model="filter.transaction_method"
                :items="transaction_method_list"
                item-text="label"
                item-value="value"
                @keydown.enter="loadTable"
                filled
                rounded
              ></v-select>

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
                @keydown.enter="loadTable"
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
                @keydown.enter="loadTable"
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
                @keydown.enter="loadTable"
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
                @keydown.enter="loadTable"
                :max="today"
                :auto-submit="true"
              />

              <v-select
                label="استان"
                prepend-icon="mdi-map"
                v-model="filter.province"
                :items="provinces"
                item-text="name"
                item-value="province_id"
                @change="loadCities"
                @keydown.enter="loadTable"
                :clearable="true"
                return-object
                filled
                rounded
              ></v-select>

              <v-select
                label="شهرستان"
                prepend-icon="mdi-map-search"
                v-model="filter.city"
                v-show="
                  filter.province !== null &&
                    filter.province !== undefined &&
                    filter.province !== ''
                "
                :items="cities"
                item-text="name"
                item-value="city_id"
                @keydown.enter="loadTable"
                :loading="!cities_loaded"
                :clearable="true"
                return-object
                filled
                rounded
              ></v-select>

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
          <v-btn dark class="mb-2" @click="openFilterDialog()">
            جستجو
          </v-btn>
        </v-toolbar>
        <v-divider></v-divider>
      </template>

      <template v-slot:item.full_name="{ item }">
        <div v-if="item.user">
          {{ item.user.first_name }} {{ item.user.last_name }} <br />
          <span class="grey--text">{{ item.user.mobile }}</span>
        </div>
        <div v-else>
          حذف شده
        </div>
      </template>

      <!-- <template v-slot:item.mobile="{ item }">
        {{ item.phone }}
      </template> -->

      <!-- <template v-slot:item.tracking_code="{ item }">
        <span style="font-family: arial">
          {{ item.tracking_code }}
        </span>
      </template> -->

      <template v-slot:item.order_stage="{ item }">
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              small
              class="mr-2"
              style="cursor: pointer"
              v-bind="attrs"
              v-on="on"
              @click="editItem(item)"
            >
              mdi-pencil
            </v-icon>
          </template>
          <span>
            تغییر
          </span>
        </v-tooltip>

        <v-icon :color="stage(item).color">
          {{ stage(item).icon }}
        </v-icon>
        <span :style="'color:' + stage(item).color">
          {{ stage(item).text }}
        </span>
      </template>

      <template v-slot:item.order_status="{ item }">
        <div v-if="item.order_status === 'EX'">
          <v-icon color="error">mdi-close-circle</v-icon>
          <span class="error--text">
            منقضی
          </span>
        </div>

        <div v-else-if="item.order_status === 'PE'">
          <v-icon color="secondary">mdi-sync-circle</v-icon>
          <span class="secondary--text">
            انتظار
          </span>
        </div>

        <div v-else-if="item.order_status === 'AP'">
          <v-icon color="green">mdi-checkbox-marked-circle</v-icon>
          <span class="green--text">
            تأیید
          </span>
        </div>
      </template>

      <template v-slot:item.transactions[0].method="{ item }">
        <v-icon :color="transaction_method(item).color">
          {{ transaction_method(item).icon }}
        </v-icon>
        <span :class="transaction_method(item).color + '--text'">
          {{ transaction_method(item).text }}
        </span>
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

      <template v-slot:item.actions="{ item }">
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <nuxt-link :to="'/admin/order/tracking/' + item.tracking_code">
              <v-icon small class="mr-2" v-bind="attrs" v-on="on">
                mdi-arrow-top-right-thick
              </v-icon>
            </nuxt-link>
          </template>
          <span>
            جزئیات
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

    <!-- Edit Item Form -->
    <v-dialog v-model="edit_dialog" @click:outside="close" max-width="50%">
      <v-card>
        <v-card-title>
          <span>ویرایش سفارش</span>
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text class="pb-0">
          <v-container>
            <v-row>
              <v-col class="pb-0">
                <v-select
                  v-model="editedItem.order_stage"
                  :items="order_stage_list"
                  item-text="label"
                  item-value="value"
                  label="مرحله سفارش"
                  prepend-icon="mdi-circle-multiple"
                  :persistent-hint="true"
                  hint="با تغییر وضعیت سفارش، برای کاربر پیامک ارسال خواهد شد."
                  filled
                  rounded
                >
                </v-select>

                <v-text-field
                  v-if="
                    editedItem.order_stage && editedItem.order_stage == 'TRCK'
                  "
                  :rules="requestedByRules"
                  label="کد رهگیری مرسوله"
                  v-model="editedItem.send_tracking_code"
                  prepend-icon="mdi-package"
                  filled
                  rounded
                  required
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn color="error darken-1" text @click="close">بستن</v-btn>
          <v-spacer></v-spacer>

          <v-btn color="success darken-1" text @click="save">ذخیره</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import moment from "moment-jalaali";
var _ = require("lodash");

let modelName = "سفارش";

export default {
  name: "OrderList",

  components: {
    datePicker: () => import("vue-persian-datetime-picker")
  },

  head() {
    return {
      title: this.page_title
    };
  },

  async fetch({ $axios, $auth, error }) {
    // permission check
    if (!$auth.user.permissions.includes("core.view_order"))
      error({ statusCode: 403, message: "" });
  },

  data() {
    return {
      child_title: modelName + " ها",
      child_subtitle: "دسترسی لیستی به سفارش ها.",

      // overlay
      overlay: false,

      // data table
      headers: [
        { text: "کاربر", value: "full_name", align: "right", sortable: false },
        // {
        //   text: "شماره تماس",
        //   value: "mobile",
        //   align: "center",
        //   sortable: false
        // },
        // {
        //   text: "کد پیگیری",
        //   value: "tracking_code",
        //   align: "left",
        //   sortable: false
        // },
        {
          text: "مبلغ (تومان)",
          value: "total_price",
          align: "center",
          sortable: true
        },
        { text: "وضعیت", value: "order_status", sortable: true },
        {
          text: "نوع",
          value: "transactions[0].method",
          sortable: true
        },
        {
          text: "مرحله",
          value: "order_stage",
          align: "right",
          sortable: true
        },
        { text: "تاریخ و زمان", value: "created_at", sortable: true },

        { text: "نمایش", value: "actions", sortable: false }
      ],
      rows: [],
      loadingTable: false,

      // edit order stage
      editedItem: {
        order_id: null,
        order_stage: "SBMT",
        send_tracking_code: ""
      },
      editedIndex: -1,
      defaultEditItem: {
        order_id: null,
        order_stage: "SBMT",
        send_tracking_code: ""
      },
      edit_dialog: false,

      // filter
      filterDialog: false,
      filter: {
        name: null,
        mobile: null,
        order_status: null,
        transaction_method: null,
        tracking_code: null,
        phone: null,
        start_date: null,
        end_date: null,
        province: null,
        city: null
      },
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
      order_stage_list: [
        {
          label: "ثبت سفارش",
          value: "SBMT"
        },
        {
          label: "صدور فاکتور",
          value: "INVC"
        },
        {
          label: "بسته‌بندی",
          value: "PACK"
        },
        {
          label: "تحویل به پست",
          value: "POST"
        },
        {
          label: "تحویل به پیک",
          value: "CRIR"
        },
        {
          label: "ثبت کد مرسوله",
          value: "TRCK"
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
      date_menu: false,
      provinces_loaded: false,
      provincecs: [],
      cities_loaded: false,
      cities: []
    };
  },

  mounted() {
    this.loadTable();
  },

  methods: {
    loadTable() {
      this.loadingTable = true;
      this.filterDialog = false;

      let url = "order/";
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
        })
        .catch(error => {
          console.log(error);
        });
    },

    transaction_method(item) {
      let method = "unknown";

      if (item.transactions.length > 0)
        method = item.transactions[item.transactions.length - 1].method;

      switch (method) {
        case "ZB":
          return {
            text: "زیبال",
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
            icon: "mdi-close-circle",
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
    },

    queryStr(start, key, val, end) {
      return start + key + "=" + val + end;
    },

    addFiltersTo(url) {
      url += !_.isNil(this.filter.name)
        ? this.queryStr("&", "name", this.filter.name, "")
        : "";
      url += !_.isNil(this.filter.mobile)
        ? this.queryStr("&", "mobile", this.filter.mobile, "")
        : "";
      url += !_.isNil(this.filter.phone)
        ? this.queryStr("&", "phone", this.filter.phone, "")
        : "";
      url += !_.isNil(this.filter.tracking_code)
        ? this.queryStr("&", "tracking-code", this.filter.tracking_code, "")
        : "";
      url += !_.isNil(this.filter.order_status)
        ? this.queryStr("&", "order-status", this.filter.order_status, "")
        : "";
      url += !_.isNil(this.filter.transaction_method)
        ? this.queryStr(
            "&",
            "transaction-method",
            this.filter.transaction_method,
            ""
          )
        : "";
      url += !_.isNil(this.filter.start_date)
        ? this.queryStr("&", "start-date", this.filter.start_date, "")
        : "";
      url += !_.isNil(this.filter.end_date)
        ? this.queryStr("&", "end-date", this.filter.end_date, "")
        : "";

      url += !_.isNil(this.filter.province)
        ? this.queryStr("&", "province", this.filter.province.name, "")
        : "";
      url += !_.isNil(this.filter.city)
        ? this.queryStr("&", "city", this.filter.city.name, "")
        : "";

      return url;
    },

    async openFilterDialog() {
      this.overlay = true;
      if (_.isNil(this.provinces)) await this.loadProvinces();
      this.overlay = false;
      this.filterDialog = true;
    },

    async loadProvinces() {
      this.provinces_loaded = false;
      try {
        this.provinces = await this.$axios.$get("province");
        this.provinces_loaded = true;
      } catch (e) {
        console.error("ERR on FETCH provinces (/order/list.vue/): ", e);
      }
    },

    async loadCities() {
      this.cities_loaded = false;

      if (_.isNil(this.filter.province)) {
        this.filter.city = null;
      } else {
        try {
          this.cities = await this.$axios.$get(
            "city/?province_id=" + this.filter.province.province_id
          );
          this.cities_loaded = true;
        } catch (e) {
          console.error("ERR on FETCH cities (/order/basket.vue/): ", e);
        }
      }
    },

    editItem(item) {
      this.overlay = true;
      this.editedIndex = this.rows.indexOf(item);
      this.editedItem = Object.assign({}, this.defaultEditItem, {
        order_id: item.order_id,
        order_stage: item.order_stage,
        send_tracking_code: item.send_tracking_code
      }); // merge item by default object and assign a copy
      this.overlay = false;
      this.edit_dialog = true;
    },

    close() {
      // this.new_dialog = false;
      this.edit_dialog = false;

      this.$nextTick(() => {
        // this.newItem = Object.assign({}, this.defaultNewItem);
        this.editedItem = Object.assign({}, this.defaultEditItem);
        this.editedIndex = -1;
      });
    },

    save() {
      if (this.editedIndex > -1) {
        // update an item
        this.prepareObjectForPatch(this.editedItem)
          .then(preparedItem => {
            this.$axios
              .patch(
                "order/?return-object=true&id=" + preparedItem.order_id,
                preparedItem
              ) // '/' is required at the end of PATCH request
              .then(response => {
                Object.assign(this.rows[this.editedIndex], response.data);

                this.$toast.success("آیتم ویرایش شد.");
                this.close();
              })
              .catch(error => {
                console.log(error);
                // show errors
                if (error.response.status == 403) {
                  this.$toast.error("شما دسترسی لازم را ندارید.");
                } else {
                  Object.entries(error.response.data).forEach(([key, val]) => {
                    val.forEach(error => {
                      this.$toast.error(error);
                    });
                  });
                }
              }); // axios patch
          }) // prepare object
          .catch(error => {
            console.log(error);
          });
      } else {
        // create new item
        // this.prepareObjectForPost(this.newItem)
        //   .then(preparedItem => {
        //     this.$axios
        //       .post("category/", preparedItem)
        //       .then(response => {
        //         this.rows.push(response.data); // insert to data table
        //         this.$toast.success("آیتم اضافه شد.");
        //         this.close();
        //       })
        //       .catch(error => {
        //         // show errors
        //         if (error.response.status == 403) {
        //           this.$toast.error("شما دسترسی لازم را ندارید.");
        //         } else {
        //           Object.entries(error.response.data).forEach(([key, val]) => {
        //             val.forEach(error => {
        //               this.$toast.error(error);
        //             });
        //           });
        //         }
        //       }); // axios post
        //   }) // prepare object
        //   .catch(error => console.log(error));
      }
    },

    prepareObjectForPatch(input) {
      return new Promise(async (resolve, reject) => {
        let output = _.cloneDeep(input);
        resolve(output);
      });
    }
  },

  computed: {
    today() {
      return new Date().toISOString().substr(0, 10);
    }
  }
};
</script>
