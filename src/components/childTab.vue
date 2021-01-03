<template>
  <div v-bind:class="{active:isActive}" class="btn-tab" v-on:click="handleClick">
    <span class="btn-tab-content">{{buttonTab}}</span>
  </div>
</template>

<script>
export default {
  name: "child-tab",
  props:{
    buttonTab:{
      type:String,
      default:"Button Tab"
    },
    isActive:{
      type:Boolean,
      default:false
    },
    id:String
  },
  data: () => ({
    
  }),
  methods:{
    handleClick(){
      this.$emit('selectTab', this.id)
    }
  },
  components: {
    
  },
}
</script>

<style scoped>
  .btn-tab{
    background-color:  rgb(255, 236, 208);
    display: inline-block;
    border:1px solid #333;
    border-radius: 5px;
    transition: all 0.5s;
    cursor: pointer;
    margin:5px
  }
  .btn-tab:hover{
    background-color: rgb(255, 200, 118);
  }
  .btn-tab-content{
    padding:15px
  }
  .active{
    background-color: chocolate;
  }
</style>