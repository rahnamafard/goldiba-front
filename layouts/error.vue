<template>
  <div class="container">
    <h1 v-if="error.statusCode === 404">صفحه پیدا نشد</h1>
    <h1 v-else-if="error.statusCode === 403">
      شما اجازه دسترسی به این صفحه را ندارید.
    </h1>
    <h1 v-else>خطایی رخ داده است</h1>
    <v-btn @click="goBack()">برگشت</v-btn>
    <nuxt-link to="/">صفحه اصلی</nuxt-link>
  </div>
</template>

<script>
export default {
  props: ["error"],
  layout: "default", // you can set a custom layout for the error page

  methods: {
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>
