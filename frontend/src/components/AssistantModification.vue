<template>
    <q-card>
      <q-card-section>
        <div class="text-h6">Modify Assistant</div>
      </q-card-section>
      <q-card-section>
        <q-select
          v-model="selectedAssistant"
          :options="assistants"
          option-value="id"
          option-label="name"
          label="Select Assistant"
          filled
        />
  
        <q-uploader
          ref="uploader"
          label="Add Files to Assistant"
          @added="handleFileSelection"
          :auto-upload="false"
        />
  
        <q-btn @click="uploadFiles" label="Upload Files" color="primary" class="q-mt-md" />
        <q-btn @click="deleteAssistant" label="Delete Assistant" color="negative" class="q-mt-md" />
      </q-card-section>
    </q-card>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  
  const assistants = ref([])
  const selectedAssistant = ref()
  const selectedFiles = ref<File[]>([]) // Array to hold selected files
  
  // Load assistants from localStorage
  const loadAssistantsFromLocalStorage = () => {
    const storedAssistants = JSON.parse(localStorage.getItem('assistants') || '[]')
    assistants.value = storedAssistants
  }
  
  // Handle file selection in q-uploader
  const handleFileSelection = (files: any) => {
    selectedFiles.value = files
  }
  
  // Function to upload files to the selected assistant
  const uploadFiles = async () => {
    if (!selectedAssistant.value || !selectedAssistant.value.vectorStoreId) {
      console.error('Please select an assistant with a valid vectorStoreId')
      return
    }
  
    if (selectedFiles.value.length === 0) {
      console.error('No files selected for upload')
      return
    }
  
    try {
      // Create FormData and append files and vectorStoreId
      const formData = new FormData()
      selectedFiles.value.forEach((file) => {
        formData.append('files', file)
      })
      formData.append('vectorStoreId', selectedAssistant.value.vectorStoreId)
  
      // Send POST request to upload files
      await axios.post('/addFileToAssistant', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      console.log('Files uploaded successfully')
    } catch (error) {
      console.error('Error uploading files:', error)
    }
  }

  const deleteAssistant = () => {
    if (!selectedAssistant.value) {
      console.error('No assistant selected for deletion')
      return
    }
  
    const updatedAssistants = assistants.value.filter(
      (assistant: any) => assistant.id !== selectedAssistant.value.id
    )
  
    localStorage.setItem('assistants', JSON.stringify(updatedAssistants))
    console.log(`Assistant ${selectedAssistant.value.name} deleted successfully`)
  
    // Reload the page
    window.location.reload()
  }
  
  onMounted(loadAssistantsFromLocalStorage)
  </script>
  
  <style scoped>
  .q-uploader {
    width: 100%;
  }
  </style>
  