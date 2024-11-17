import { createRouter, createWebHistory } from 'vue-router';
import CreateAssistant from '../views/CreateAssistant.vue';
import ManageAssistant from '../views/ManageAssistant.vue';
import ChatAssistant from '../views/ChatAssistant.vue';
import NewPageInterface from '../views/NewPageInterface.vue';

const routes = [
    { path: '/a', component: CreateAssistant },
    { path: '/', component: NewPageInterface },
    { path: '/manage/:id/:vectorStoreId', component: ManageAssistant },
    { path: '/chat/:threadId/:assistantId', component: ChatAssistant },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;