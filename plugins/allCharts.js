import Vue from "vue";
import { mixins, Bar, Doughnut, Line, Pie } from "vue-chartjs";
const { reactiveProp } = mixins;

const registerComponent = function(name, originalComponent) {
  Vue.component(name, {
    extends: originalComponent,
    mixins: [reactiveProp],
    props: ["chartData", "options"],

    // data() {
    //   return {
    //     default_options: {
    //       legend: {
    //         labels: {
    //           fontFamily: "IRANYekan"
    //         }
    //       },

    //       title: {
    //         fontFamily: "IRANYekan"
    //       },

    //       tooltips: {
    //         titleFontFamily: "IRANYekan",
    //         bodyFontFamily: "IRANYekan"
    //       },

    //       scales: {
    //         yAxes: [
    //           {
    //             ticks: {
    //               beginAtZero: true,
    //               fontFamily: "IRANYekan"
    //             }
    //           }
    //         ],
    //         xAxes: [
    //           {
    //             ticks: {
    //               fontFamily: "IRANYekan"
    //             }
    //           }
    //         ]
    //       },
    //       responsive: true
    //     }
    //   };
    // },

    mounted() {
      // default styles
      if (this.options.legend) {
        this.options.legend.labels = {
          ...this.options.legend.labels,
          fontFamily: "IRANYekan"
        };
      }
      if (this.options.title) {
        this.options.title = { ...this.options.title, fontFamily: "IRANYekan" };
      }
      if (this.options.tooltips) {
        this.options.tooltips = {
          ...this.options.tooltips,
          titleFontFamily: "IRANYekan",
          bodyFontFamily: "IRANYekan"
        };
      }
      if (this.options.scales) {
        if (this.options.scales.yAxes) {
          this.options.scales.yAxes.forEach(item => {
            item.ticks = { ...item.ticks, fontFamily: "IRANYekan" };
          });
        }

        if (this.options.scales.xAxes) {
          this.options.scales.xAxes.forEach(item => {
            item.ticks = { ...item.ticks, fontFamily: "IRANYekan" };
          });
        }
      }

      // render
      this.renderChart(
        this.chartData,
        this.options
      );
    }
  });
};

registerComponent("BarChart", Bar);
registerComponent("DoughnutChart", Doughnut);
registerComponent("LineChart", Line);
registerComponent("PieChart", Pie);
