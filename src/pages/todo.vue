<template>
  <div>
    ToDo
    <ul>
      <li v-for="item in allTodo" v-bind:key="item.id.toString()">{{item.title}}</li>
    </ul>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';
export default {
  name: "ToDo-List",
  data: () => ({}),
  methods: {
    ...mapActions(['getAllTodo'])
  },
  computed:{
    ...mapGetters(['allTodo']),
  },
  created(){
    this.getAllTodo()
  },
  components: {},
};
</script>

<style scoped></style>
