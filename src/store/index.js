import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

const state = {
  todos:[],
};
const getters = {
  allTodo:(state)=>state.todos
};
const actions = {
  getAllTodo:async({commit})=>{
    const res = await axios.get('https://jsonplaceholder.typicode.com/todos');
    commit('setTodo',res.data)
  }
}
const mutations = {
  setTodo(state,data){
    state.todos=data
  }
};
export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
})