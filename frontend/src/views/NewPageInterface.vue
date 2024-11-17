<template>
    <q-layout view="lHh Lpr lFf">
      <q-page-container>
        <q-page padding>
          <q-tabs v-model="activeTab" dense @update:model-value="saveTabToLocalStorage">
            <q-tab name="creation" label="Create Assistant" />
            <q-tab name="modification" label="Modify Assistant" />
            <q-tab name="chat" label="Chat with Assistant" />
          </q-tabs>
  
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
          </q-tab-panels>
        </q-page>
      </q-page-container>
    </q-layout>
  </template>
  
  <script setup lang="ts">
  import AssistantCreation from '../components/AssistantCreation.vue'
  import AssistantModification from '../components/AssistantModification.vue'
  import AssistantChat from '../components/AssistantChat.vue'
  import { ref, onMounted, onBeforeMount } from 'vue'
  
  // Initialize activeTab from localStorage or default to 'creation'
  const activeTab = ref(localStorage.getItem('activeTab') || 'creation')
  
  // Save the selected tab to localStorage
  const saveTabToLocalStorage = (newTab: string) => {
    localStorage.setItem('activeTab', newTab)
  }
  
  // Set up to load the saved tab on mount
  onBeforeMount(() => {
    const savedTab = localStorage.getItem('activeTab')
    if (savedTab) {
      activeTab.value = savedTab
    }
  })
  </script>
  