<template>
  <div>
    <!-- Overlay on screen -->
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </v-overlay>

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
          <v-chip
            v-show="parent.title"
            class="mr-5"
            :to="
              '/admin/product/category/' + (parent.parent ? parent.parent : '')
            "
          >
            {{ parent.title }}
          </v-chip>
          <!-- <v-divider class="mx-4" inset vertical></v-divider> -->
          <v-spacer></v-spacer>

          <!-- New Item Form -->
          <v-dialog v-model="new_dialog" @click:outside="close" max-width="50%">
            <template v-slot:activator="{ on, attrs }">
              <v-btn dark class="mb-2" v-bind="attrs" v-on="on"
                >دسته جدید</v-btn
              >
            </template>

            <v-card>
              <v-card-title>
                <span>دسته جدید</span>
              </v-card-title>

              <v-divider></v-divider>

              <v-card-text class="pb-0">
                <v-container>
                  <v-row>
                    <v-col class="pb-0">
                      <v-text-field
                        v-model="newItem.title"
                        label="نام دسته"
                        prepend-icon="mdi-form-textbox"
                        filled
                        rounded
                      ></v-text-field>

                      <v-file-input
                        v-model="newItem.cover"
                        label="کاور"
                        accept=".png,.jpg,.jpeg"
                        prepend-icon="mdi-image-size-select-large"
                        show-size
                        filled
                        rounded
                      ></v-file-input>

                      <v-text-field
                        v-model="parent.title"
                        :value="parent.category_id"
                        :label="
                          parent.category_id ? 'زیرمجموعه‌ی' : 'دسته مادر'
                        "
                        prepend-icon="mdi-file-tree"
                        filled
                        rounded
                        disabled
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

          <!-- Edit Item Form -->
          <v-dialog
            v-model="edit_dialog"
            @click:outside="close"
            max-width="50%"
          >
            <v-card>
              <v-card-title>
                <span>ویرایش دسته</span>
              </v-card-title>

              <v-divider></v-divider>

              <v-card-text class="pb-0">
                <v-container>
                  <v-row>
                    <v-col class="pb-0">
                      <v-text-field
                        v-model="editedItem.title"
                        label="نام دسته"
                        prepend-icon="mdi-form-textbox"
                        filled
                        rounded
                      ></v-text-field>

                      <!-- Show old cover -->
                      <div v-show="editedItem.cover !== null">
                        <v-icon>
                          mdi-image-size-select-large
                        </v-icon>
                        <label class="pr-2">کاور:</label>
                        <br />
                        <v-hover>
                          <template v-slot:default="{ hover }">
                            <v-card
                              class="mx-auto pa-0 ma-0 mt-2 border-radius-20 elevation-0 "
                            >
                              <img
                                v-show="editedItem.cover"
                                style="max-width: 100%;"
                                class="pa-0 ma-0 border-radius-20"
                                :src="editedItem.cover"
                              />

                              <v-fade-transition>
                                <v-overlay v-if="hover" absolute>
                                  <v-btn @click="removeCover(editedItem)">
                                    حذف کاور
                                  </v-btn>
                                </v-overlay>
                              </v-fade-transition>
                            </v-card>
                          </template>
                        </v-hover>
                      </div>

                      <!-- choose new cover -->
                      <v-file-input
                        v-model="editedItem.new_cover"
                        v-if="editedItem.cover == null"
                        @change="editedItem.cover_updated = true"
                        label="کاور"
                        accept=".png,.jpg,.jpeg"
                        prepend-icon="mdi-image-size-select-large"
                        show-size
                        filled
                        rounded
                      ></v-file-input>

                      <v-card class="mx-auto elevation-0 mt-4">
                        <v-card-text>
                          <v-icon>
                            mdi-shape
                          </v-icon>
                          <label class="pr-2">دسته مادر:</label>
                          <br />
                          <v-text-field
                            v-model="search"
                            @input="handleSearch"
                            label="جستجوی دسته مادر"
                            filled
                            rounded
                            clearable
                            hint="دسته‌ی مادر را از لیست زیر انتخاب کنید"
                            clear-icon="mdi-close-circle-outline"
                            prepend-icon="mdi-folder-search"
                          ></v-text-field>

                          <v-treeview
                            ref="tree"
                            :items="nested_cats"
                            :search="search"
                            :open.sync="open"
                            item-text="title"
                            item-key="category_id"
                            :value="editedItem.parent"
                            :active="editedItem.parent"
                            @update:active="onUpdate"
                            hoverable
                            activatable
                            rounded
                          >
                            <template v-slot:prepend="{ item }">
                              <v-icon
                                v-if="item.children"
                                v-text="'mdi-folder-network'"
                              ></v-icon>
                              <v-icon v-else v-text="'mdi-folder'"></v-icon>
                            </template>
                          </v-treeview>
                        </v-card-text>
                      </v-card>
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
        </v-toolbar>
        <v-divider></v-divider>
      </template>

      <template v-slot:item.title="{ item }">
        <nuxt-link :to="`/admin/product/category/${item.category_id}`">
          {{ item.title }}
        </nuxt-link>
      </template>

      <template v-slot:item.cover="{ item }">
        <img
          v-if="item.cover"
          style="max-height: 100%; border-radius: 10px; margin: 5px 5px 0 5px"
          :src="item.cover"
        />
        <div v-else>
          <v-icon color="grey">
            mdi-image-remove
          </v-icon>
          <span class="grey--text" style="font-size:0.8em">بدون کاور</span>
        </div>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)">
          mdi-pencil
        </v-icon>
        <v-icon small @click="deleteItem(item)">
          mdi-delete
        </v-icon>
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
var _ = require("lodash"); // to deep_clone json
var FlatToNested = require("flat-to-nested"); // convert flat json to nested json

let modelName = "دسته";

export default {
  name: "ProductCategoryList",

  head: {
    title: modelName + " ها"
  },

  validate({ params }) {
    // Check 'id' parameter to be a number
    if (params.id) return /^\d+$/.test(params.id);
    else return true;
  },

  async fetch({ $axios, $auth, error }) {
    // permission check
    if (!$auth.user.permissions.includes("core.view_category"))
      error({ statusCode: 403, message: "" });
  },

  data() {
    return {
      child_title: modelName + " ها",

      // overlay
      overlay: false,

      // model definition
      parent: {
        category_id: null,
        title: "",
        cover: [],
        parent: null
      },
      newItem: {
        category_id: null,
        title: "",
        cover: [],
        parent: null
      },
      editedItem: {
        category_id: null,
        title: "",
        cover: [],
        parent: [],
        new_cover: [],
        cover_updated: false
      },
      editedIndex: -1,
      defaultEditItem: {
        category_id: null,
        title: "",
        cover: [],
        parent: [],
        new_cover: [],
        cover_updated: false
      },
      defaultNewItem: {
        category_id: null,
        title: "",
        cover: [],
        parent: null
      },
      nested_cats: [], // editing item category treeview

      search: "",
      open: [],
      allOpened: false,
      lastOpen: [],

      // dialogs
      new_dialog: false,
      edit_dialog: false,

      // data table
      headers: [
        {
          text: "نام " + modelName,
          align: "start",
          sortable: true,
          value: "title"
        },
        { text: "کاور", value: "cover", sortable: false },

        { text: "عملیات", value: "actions", sortable: false }
      ],
      rows: [],
      loadingTable: false
    };
  },

  watch: {
    dialog(val) {
      val || this.close();
    },

    // require for react to route from `/url/foo` to `/url/bar`
    $route(to, from) {
      let passed_id = to.params.id ? to.params.id : null;
      this.updateParent(passed_id);
    }
  },

  mounted() {
    let passed_id = this.$route.params.id ? this.$route.params.id : null;
    this.updateParent(passed_id);
  },

  methods: {
    async updateParent(passed_id) {
      this.loadingTable = true;
      if (passed_id) {
        try {
          let response = await this.$axios.get(
            "category/?id=" + passed_id
          ); // get parent category

          console.log(response);
          if (response.data.length > 0) {
            this.parent = response.data[0]; // parent category found
          } else {
            this.parent = Object.assign({}, this.defaultNewItem); // parent category doesn't exists
          }
          this.loadTable();
        } catch (error) {
          console.log(error);
        }
      } else {
        this.parent = Object.assign({}, this.defaultNewItem); // passed_id is null
        this.loadTable();
      }
    },

    loadTable() {
      let parent_id = this.parent.category_id
        ? this.parent.category_id
        : "null";
      this.loadingTable = true;
      this.$axios
        .get("category/?parent=" + parent_id)
        .then(response => {
          let categories = response.data;

          // null or undefined response
          if (!categories) {
            this.$toast.error("خطا در بارگذاری");
            return;
          }

          if (categories.length <= 0) {
            this.$toast.show("زیردسته‌ای در این طبقه‌بندی وجود ندارد.");
          }

          this.rows = categories;
          this.loadingTable = false;
        })
        .catch(error => {
          console.log(error);
        });
    },

    editItem(item) {
      this.editedIndex = this.rows.indexOf(item);
      this.editedItem = Object.assign({}, this.defaultEditItem, item); // merge item by default object and assign a copy
      this.editedItem.parent = [].concat(this.editedItem.parent);

      // clear nested category tree search for new edit
      this.open = [];
      this.search = "";

      // get categories and convert to nested json
      let flatToNested = new FlatToNested({ id: "category_id" });
      this.overlay = true;
      this.$axios
        .get("category")
        .then(response => {
          let categories = response.data;
          this.nested_cats = flatToNested.convert(categories).children;
          this.overlay = false;
          this.edit_dialog = true;
        })
        .catch(error => {
          this.editedIndex = -1;
          this.$toast.error("خطا در ارتباط با سرور.");
        });
    },

    deleteItem(item) {
      const index = this.rows.indexOf(item);
      let cat_id = item.category_id;
      if (confirm("از حذف این آیتم مطمئنید؟")) {
        // delete item
        this.$axios
          .delete("category/" + cat_id + "/")
          .then(response => {
            this.$toast.success("دسته «" + item.title + "» با موفقیت حذف شد.");
            this.rows.splice(index, 1);
          })
          .catch(error => {
            console.log(error);
            if (error.response.status == 403) {
              this.$toast.error("شما دسترسی لازم را ندارید.");
            } else if (error.response.status == 500) {
              this.$toast.error(
                "برای حذف یک دسته، آن دسته نباید زیردسته‌ای داشته باشد."
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
    },

    close() {
      this.new_dialog = false;
      this.edit_dialog = false;

      this.$nextTick(() => {
        this.newItem = Object.assign({}, this.defaultNewItem);
        this.editedItem = Object.assign({}, this.defaultEditItem);
        this.editedIndex = -1;
      });
    },

    // update parent in editedItem on selection
    onUpdate(selection) {
      this.editedItem.parent = [].concat(selection);
    },

    // handle search and filter in parent category tree (edit item panel)
    handleSearch: function(val) {
      if (val) {
        if (!this.allOpened) {
          this.lastOpen = this.open;
          this.allOpened = true;
          this.$refs.tree.updateAll(true);
        }
      } else {
        this.$refs.tree.updateAll(false);
        this.allOpened = false;
        this.open = this.lastOpen;
      }
    },

    removeCover(item) {
      item.cover = null;
      item.new_cover = null;
      item.cover_updated = true;
    },

    save() {
      if (this.editedIndex > -1) {
        // update an item
        this.prepareObjectForPatch(this.editedItem)
          .then(preparedItem => {
            this.$axios
              .patch(
                "category/?id=" + preparedItem.category_id,
                preparedItem
              )
              .then(response => {
                if (response.data.parent == this.parent.category_id) {
                  // parent category not changed
                  Object.assign(this.rows[this.editedIndex], response.data);
                } else {
                  // parent category changed
                  this.rows.splice(this.editedIndex, 1);
                }
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
        this.prepareObjectForPost(this.newItem)
          .then(preparedItem => {
            this.$axios
              .post("category/", preparedItem)
              .then(response => {
                this.rows.push(response.data); // insert to data table
                this.$toast.success("آیتم اضافه شد.");
                this.close();
              })
              .catch(error => {
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
              }); // axios post
          }) // prepare object
          .catch(error => console.log(error));
      }
    },

    prepareObjectForPost(input) {
      return new Promise(async (resolve, reject) => {
        let output = _.cloneDeep(input); // BEST WAY TO CLONE A JSON EVER!

        // base64 conversion for cover if it is not: null || undefined
        if (!_.isNil(output.cover)) {
          if (output.cover instanceof File) {
            output.cover = await this.$base64(output.cover);
          } else {
            output.cover = null; // cover == []
          }
        }

        // set parent
        output.parent = this.parent.category_id;

        resolve(output);
      });
    },

    prepareObjectForPatch(input) {
      return new Promise(async (resolve, reject) => {
        let output = _.cloneDeep(input);

        // base64 conversion for cover if it is not: null || undefined
        if (output.cover_updated) {
          if (_.isNil(output.new_cover)) {
            output.cover = null; // new_cover == null
          } else {
            if (output.new_cover instanceof File) {
              output.cover = await this.$base64(output.new_cover);
            } else {
              delete output.cover; // new_cover == [] (possibly not reachable at all!)
            }
          }
        } else {
          // if (new_cover == 'no_new_cover') remove prop from obj for PATCH request
          delete output.cover;
        }

        // set parent
        if (output.parent !== null) {
          if (output.parent.length > 0) output.parent = output.parent[0];
          else output.parent = null;
        }

        resolve(output);
      });
    }
  }
};
</script>
