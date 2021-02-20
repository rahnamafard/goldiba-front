<template>
  <div>
    <div>
      <!-- Overlay on screen -->
      <v-overlay :value="overlay">
        <v-progress-circular
          indeterminate
          color="primary"
        ></v-progress-circular>
      </v-overlay>
    </div>

    <v-container>
      <v-row>
        <v-col>
          <v-card class="mb-6">
            <v-card-title>
              تنظیمات
            </v-card-title>

            <v-divider></v-divider>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" xs="12" sm="6" md="6" lg="6">
                    <!-- start date -->
                    <v-text-field
                      :value="
                        stats.start_date
                          ? startDateMoment.format('dddd jDD jMMMM jYYYY')
                          : null
                      "
                      label="از تاریخ"
                      prepend-icon="mdi-calendar"
                      id="start-jalali-input"
                      @click:clear="stats.start_date = null"
                      @keydown.enter="loadDiagrams"
                      clearable
                      filled
                      rounded
                    ></v-text-field>
                    <date-picker
                      v-if="page_loaded"
                      v-model="stats.start_date"
                      :clearable="true"
                      element="start-jalali-input"
                      format="YYYY-MM-DD"
                      display-format="dddd jDD jMMMM jYYYY"
                      @change="startDateMoment = $event"
                      @keydown.enter="loadDiagrams"
                      :max="today"
                      :auto-submit="true"
                    />
                  </v-col>

                  <v-col cols="12" xs="12" sm="6" md="6" lg="6">
                    <!-- end date -->
                    <v-text-field
                      :value="
                        stats.end_date
                          ? endDateMoment.format('dddd jDD jMMMM jYYYY')
                          : null
                      "
                      label="تا تاریخ"
                      prepend-icon="mdi-calendar"
                      id="end-jalali-input"
                      @click:clear="stats.end_date = null"
                      @keydown.enter="loadDiagrams"
                      clearable
                      filled
                      rounded
                    ></v-text-field>
                    <date-picker
                      v-if="page_loaded"
                      v-model="stats.end_date"
                      :clearable="true"
                      element="end-jalali-input"
                      format="YYYY-MM-DD"
                      display-format="dddd jDD jMMMM jYYYY"
                      @change="endDateMoment = $event"
                      @keydown.enter="loadDiagrams"
                      :max="today"
                      :auto-submit="true"
                    />

                    <!-- upon -->
                    <!-- <v-select
                      label="بر اساس"
                      prepend-icon="mdi-filter"
                      v-model="stats.upon"
                      item-text="label"
                      item-value="value"
                      :items="upons"
                      filled
                      rounded
                    ></v-select> -->
                  </v-col>

                  <v-btn
                    color="secondary"
                    class="pa-6"
                    @click="loadDiagrams"
                    depressed
                    rounded
                    block
                  >
                    اعمال
                  </v-btn>
                </v-row>
              </v-container>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <v-col sm="6">
          <v-card>
            <!-- info -->
            <v-card-text>
              <bar-chart
                v-if="showChart"
                :chartData="barChartData"
                :options="barChartOptions"
              />
              <div align="center" justify="center" v-else>
                <v-progress-circular
                  class="center"
                  indeterminate
                  color="primary"
                ></v-progress-circular>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col sm="6">
          <v-card>
            <v-card-text>
              <line-chart
                v-if="showChart"
                :chartData="barChartData"
                :options="lineChartOptions"
              />
              <div align="center" justify="center" v-else>
                <v-progress-circular
                  class="center"
                  indeterminate
                  color="primary"
                ></v-progress-circular>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import moment from "moment-jalaali";
var _ = require("lodash");

export default {
  name: "OrdersStatistics",

  components: {
    datePicker: () => import("vue-persian-datetime-picker")
  },

  head() {
    return {
      title: this.title
    };
  },

  //   validate({ params }) {
  //     // Check 'id' parameter to be a number
  //     if (params.id) return /^\d+$/.test(params.id);
  //     else return true;
  //   },

  async fetch({ $axios, $auth, error }) {
    // permission check
    // if (!$auth.user.permissions.includes("core.view_order"))
    //   error({ statusCode: 403, message: "" });
  },

  data() {
    return {
      title: "آمار کاربران",

      // overlay
      overlay: false,
      page_loaded: false,

      // configuration
      stats: {
        query: "users",
        start_date: null,
        end_date: null,
        filter: null,
        upon: null
      },
      startDateMoment: moment(),
      endDateMoment: moment(),
      upons: [
        {
          label: "روز",
          value: "day"
        },
        {
          label: "ماه",
          value: "month"
        },
        {
          label: "سال",
          value: "year"
        }
      ],

      // bar chart
      showChart: false,
      barChartData: {
        labels: [],
        datasets: []
      },
      barChartOptions: {
        responsive: true,
        legend: {
          display: true
        },
        title: {
          display: true,
          text: "آمار کاربران (میله‌ای)",
          fontSize: 24,
          fontColor: "#6b7280"
        },
        tooltips: {
          backgroundColor: "#454545"
        },
        scales: {
          xAxes: [
            {
              gridLines: {
                display: true
              }
            }
          ],
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              },
              gridLines: {
                display: true
              }
            }
          ]
        }
      },

      // line chart
      lineChartOptions: {
        responsive: true,
        fill: false,
        legend: {
          display: true
        },
        title: {
          display: true,
          text: "آمار کاربران (خطی)",
          fontSize: 24,
          fontColor: "#6b7280"
        },
        tooltips: {
          backgroundColor: "#454545"
        },
        scales: {
          xAxes: [
            {
              gridLines: {
                display: true
              }
            }
          ],
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              },
              gridLines: {
                display: true
              }
            }
          ]
        }
      }
    };
  },

  mounted() {
    this.loadPage();
  },

  methods: {
    async loadPage() {
      this.overlay = true;
      await this.loadDiagrams();
      this.overlay = false;
      this.page_loaded = true;
    },

    async loadDiagrams() {
      this.showChart = false;
      let labels = [];
      let all_dataset = {
        label: "همه",
        data: [],
        backgroundColor: "#003f5c",
        borderColor: "#003f5c",
        fill: false
      };

      // get all
      try {
        let url = this.addFiltersTo("/statistic/");
        let response = await this.$axios.get(url);
        if (response.data.data.length > 0) {
          let results = response.data.data;
          // convert dates to jalali
          labels = results.map(result => result.period);
          let counts = results.map(result => result.count);
          all_dataset.data = counts;
        } else {
          this.$toast.error("هیچ آیتمی یافت نشد.");
        }
      } catch (error) {
        this.$toast.error("خطا در ارتباط با سرور.");
      }

      // convert labels to jalali
      labels = labels.map(
        label => this.$jalaliDateTime(label, "YYYY/M/DTHH:mm").date
      );

      let datasets = [all_dataset];
      this.updateDiagram(labels, datasets);

      this.showChart = true;
    },

    async goGetData(filter, labels) {
      try {
        let url = this.addFiltersTo("/statistic/");
        let response = await this.$axios.get(url + "&filter=" + filter);
        if (response.data.data.length > 0) {
          let results = response.data.data;
          let my_labels = [];
          let my_data = [];
          labels.forEach(label => {
            let found = results.find(item => item.period === label);
            if (found) {
              my_data.push(found.count);
            } else {
              my_data.push(0);
            }
          });
          return my_data;
        }
      } catch (error) {
        console.log(error);
        this.$toast.error("خطا در ارتباط با سرور.");
        return [];
      }
    },

    updateDiagram(labels, datasets) {
      this.$nextTick(() => {
        this.barChartData.labels = labels;
        this.barChartData.datasets = datasets;
        this.showChart = true;
      });
    },

    queryStr(start, key, val, end) {
      return start + key + "=" + val + end;
    },

    addFiltersTo(url) {
      url += !_.isNil(this.stats.query)
        ? this.queryStr("?", "query", this.stats.query, "")
        : "";
      url += !_.isNil(this.stats.start_date)
        ? this.queryStr("&", "start", this.stats.start_date, "")
        : "";
      url += !_.isNil(this.stats.end_date)
        ? this.queryStr("&", "end", this.stats.end_date, "")
        : "";
      // url += !_.isNil(this.stats.upon)
      //   ? this.queryStr("&", "upon", this.stats.upon, "")
      //   : "";

      return url;
    }
  },

  computed: {
    today() {
      return new Date().toISOString().substr(0, 10);
    }
  }
};
</script>
