import colors from "vuetify/es5/util/colors";

export default {
  // mode: "universal",
  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: "%s - " + process.env.npm_package_name,
    title: process.env.npm_package_name || "",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: process.env.npm_package_description || ""
      }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
  },

  /*
   ** Customize the progress-bar color
   */
  loading: {
    color: "#25bfd5",
    // height: "4px",
    rtl: true,
    throttle: 0
  },

  /*
   ** Global CSS
   */
  css: ["@/assets/css/fonts.scss", "@/assets/css/main.scss"],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    "~/plugins/base64.js",
    {
      src: "~/plugins/localStorage.js",
      ssr: false
    },
    {
      src: "~/plugins/jalaliDateTime.js",
      ssr: false
    },
    {
      src: "~/plugins/jalali-calendar.js",
      ssr: false
    },
    { src: "~plugins/allCharts.js", ssr: false }
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: ["@nuxtjs/vuetify", "@nuxtjs/google-analytics"],
  build: {
    transpile: ["vue-persian-datetime-picker"]
  },

  /*
   ** Nuxt.js modules
   */
  modules: [
    "@nuxtjs/axios", // Doc: https://axios.nuxtjs.org/usage
    "@nuxtjs/pwa",
    "@nuxtjs/auth",
    "@nuxtjs/toast"
  ],

  /*
   ** Toast
   */

  toast: {
    position: "bottom-left",
    keepOnHover: true,
    duration: 3000,
    className: "my-toast-error",
    containerClass: "my-taost-container",
    iconPack: "mdi",
    action: {
      icon: "close",
      onClick: (e, toastObject) => {
        toastObject.goAway(0);
      }
    }
  },

  /*
   ** Authentication
   */
  auth: {
    strategies: {
      local: {
        endpoints: {
          login: {
            url: "/auth/login/",
            method: "post",
            propertyName: "token"
          },
          logout: {},
          // user: false
          user: { url: "/auth/user/", method: "get", propertyName: "user" }
        },
        tokenType: "token"
      }
    },
    redirect: {
      login: "/user/login"
    }
  },

  /*
   ** Middlewares
   */
  // router: {
  //   middleware: ["auth"]
  // },

  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    baseURL: "http://localhost:8000/api"
    // baseURL: "http://135.181.168.71:8000/api"
  },

  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    rtl: true,
    customVariables: ["~/assets/css/variables.scss"],
    theme: {
      dark: false,
      themes: {
        light: {
          // primary: colors.blue.darken2,
          // accent: colors.grey.darken3,
          // secondary: colors.amber.darken3,
          // info: colors.teal.lighten1,
          // warning: colors.amber.base,
          // error: colors.deepOrange.accent4,
          // success: colors.green.accent3,

          primary: "#f7c4c9",
          accent: "#ffcdbb",
          secondary: "#25bfd5",
          info: "#75706e"
        }
      }
    }
  },

  VuePersianDatetimePicker: {
    name: "date-picker",
    props: {
      inputFormat: "YYYY-MM-DD HH:mm",
      format: "jYYYY-jMM-jDD HH:mm",
      editable: false,
      inputClass: "form-control my-custom-class-name",
      placeholder: "Please select a date",
      altFormat: "YYYY-MM-DD HH:mm",
      color: "#00acc1",
      autoSubmit: false
      //...
      //... And whatever you want to set as default
      //...
    }
  },

  googleAnalytics: {
    id: "UA-159219462-1"
  },

  moment: {
    defaultTimezone: "Asia/Tehran",
    Timezone: "Asia/Tehran"
  },

  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {}
  }
};
