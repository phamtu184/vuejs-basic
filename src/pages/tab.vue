<template>
  <div class="container">
    <title-tab :title="titleOf"/>
    <child-tab 
      v-for="(tab, index) in tabs"
      :key="index"
      :buttonTab="tab.name"
      :id="tab.id"
      :isActive="selected===tab.id"
      v-on:selectTab="selectTab"
    />
    <content-tab :content="contentOf"/>
  </div>
</template>

<script>
import TitleTab from '../components/titleTab'
import ChildTab from '../components/childTab'
import ContentTab from '../components/contentTab'
export default {
  name: "Tab",
  data: () => ({
    tabs:[
      {id:'0',name:'tab 1',title:'title 1',content:'content 1'},
      {id:'1',name:'tab 2',title:'title 2',content:'content 2'},
      {id:'2',name:'tab 3',title:'title 3',content:'content 3'}
    ],
    selected:''
  }),
  methods:{
    selectTab(id){
      this.selected=id
    }
  },
  computed:{
    contentOf(){
      if(this.selected) return this.tabs.find(e=>e.id===this.selected).content
      return ''
    },
    titleOf(){
      if(this.selected) return this.tabs.find(e=>e.id===this.selected).title
      return ''
    }
  },
  beforeCreate(){
    console.log('beforeCreate')
  },
  created(){
    // Gọi api, call ajax
    console.log('created')
  },
  beforeMount(){
    console.log('beforeMount')
  },
  mounted(){
    //Nếu muốn sử dụng jquery -> chỉ truy xuất DOM được trong mouted
    console.log('mounted')
  },
  beforeUpdate(){
    console.log('beforeUpdate')
  },
  updated(){
    //gọi khi data thay đổi
    console.log('updated')
  },
  beforeDestroy(){
    console.log('beforeDestroy')
  },
  destroyed(){
    //destroy các thư viện bênh thứ 3
    console.log('destroyed')
  },
  components: {
    TitleTab,
    ChildTab,
    ContentTab
  },
}
</script>

<style scoped>

</style>