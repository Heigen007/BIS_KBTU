<template>
    <q-layout view="lHh Lpr lFf">
        <q-page-container>
            <q-page padding>
                <q-tabs v-model="activeTab" dense @update:model-value="saveTabToLocalStorage">
                    <q-tab name="creation" label="Create Assistant" />
                    <q-tab name="modification" label="Modify Assistant" />
                    <q-tab name="chat" label="Chat with Assistant" />
                    <q-tab name="api" label="API Usage" />
                    <q-tab name="faq" label="FAQ/Contact" />
                </q-tabs>
                <keep-alive>
                    <q-tab-panels v-model="activeTab">
                        <q-tab-panel name="creation">
                            <AssistantCreation />
                        </q-tab-panel>
                        <q-tab-panel name="modification">
                            <AssistantModification />
                        </q-tab-panel>
                        <q-tab-panel name="chat">
                            <AssistantChat />
                        </q-tab-panel>
                        <q-tab-panel name="api">
                            <AssistantAPIUsage />
                        </q-tab-panel>
                        <q-tab-panel name="faq">
                            <FAQContact />
                        </q-tab-panel>
                    </q-tab-panels>
                </keep-alive>
            </q-page>
        </q-page-container>
    </q-layout>
</template>
  
<script setup lang="ts">
import AssistantCreation from '../components/AssistantCreation.vue'
import AssistantModification from '../components/AssistantModification.vue'
import AssistantChat from '../components/AssistantChat.vue'
import AssistantAPIUsage from '../components/AssistantAPIUsage.vue'
import FAQContact from '../components/FAQContact.vue'
import { ref, onBeforeMount } from 'vue'

const activeTab = ref(localStorage.getItem('activeTab') || 'creation')

const saveTabToLocalStorage = (newTab: string) => {
    localStorage.setItem('activeTab', newTab)
}

onBeforeMount(() => {
    const savedTab = localStorage.getItem('activeTab')
    if (savedTab) {
        activeTab.value = savedTab
    }
})
</script>