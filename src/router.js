
import Vue from 'vue'
import VueRouter from 'vue-router'

const Project = () => import('./pages/project.vue')
const Template = () => import('./pages/templates.vue')
const Tab = () => import('./pages/tab.vue')
Vue.use(VueRouter)

export default new VueRouter({
    routes: [
        {path: '/', component: Project},
        {path: '/template', component: Template},
        {path: '/tab', component: Tab}
    ]
})
