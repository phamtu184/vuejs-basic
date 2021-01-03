<template>
  <div class="title">
    <h4 class="title-text">{{title}}</h4>
  </div>
</template>

<script>
export default {
  name: "Title-tab",
  data: () => ({
    
  }),
  props:{
    title:{
      type:String,
      default:'Title name'
    }
  },
  methods:{

  },
  components: {
    
  },
}
</script>

<style scoped>
  .title{
    border: 2px solid #444;
    border-radius: 10px;
  }
  .title-text{
    padding:15px
  }
</style>