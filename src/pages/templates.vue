<template>
  <div>
    <span class="title">
      Template
      <span class="header-total">
        {{templates.length}} TOTAL
      </span>
    </span>
    <Table :templates="templates" :selected="selected" :onSelect="onSelect" />
  </div>
</template>

<script>
import Table from "../components/table.vue";
export default {
  name: "Template",
  data: () => ({
    templates: JSON.parse(localStorage.getItem("templates"))
      ? JSON.parse(localStorage.getItem("templates"))
      : [],
    selected: [],
  }),
  components: {
    Table,
  },
  methods: {
    onSelect(items) {
      this.selected = items;
    },
  },
};
</script>

<style scoped>
.title {
  font-size: 1.35em;
  color: #202124;
}
.header-total{
  margin-left: 20px;
  font-size: 12px;
  color: #a3a3a3;
}
</style>
