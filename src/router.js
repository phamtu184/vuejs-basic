
import Vue from 'vue'
import VueRouter from 'vue-router'

const Project = () => import('./pages/project.vue')
const Template = () => import('./pages/templates.vue')
const Tab = () => import('./pages/tab.vue')
const Todo = () => import('./pages/todo.vue')
// const Loading = () => import('./components/loading.vue')

Vue.use(VueRouter)

export default new VueRouter({
    routes: [
        {path: '/', component: Project},
        {path: '/template', component: Template},
        {path: '/tab', component: Tab},
        {path: '/todo', component: Todo}
    ]
})
