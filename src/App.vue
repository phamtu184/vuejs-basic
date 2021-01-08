<template>
  <div class="container2">
    <div id="app">
      <br />
      <router-link to="/">Project</router-link> |
      <router-link to="/template">Template</router-link>|
      <router-link to="/tab">Tab</router-link>|
      <router-link to="/todo">To do</router-link>
    </div>

    <router-view />
  </div>
</template>

<script>
import Vue from "vue";
import VueMaterial from "vue-material";
import "vue-material/dist/vue-material.min.css";
import "vue-material/dist/theme/default.css";
import "bootstrap/dist/css/bootstrap.css";

Vue.use(VueMaterial);

export default {
  name: "App",
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.container2 {
  padding: 30px;
}
.center {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
