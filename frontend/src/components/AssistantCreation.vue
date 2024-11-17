<template>
    <q-card>
      <q-card-section>
        <div class="text-h6">Create Assistant</div>
      </q-card-section>
      <q-card-section>
        <q-input v-model="assistantName" label="Assistant Name" filled />
        <q-input v-model="instructions" label="Instructions" type="textarea" filled />
  
        <q-uploader
          ref="uploader"
          label="Upload Files"
          @added="handleFileSelection"
          :auto-upload="false"
        />
  
        <q-btn @click="createAssistant" label="Create Assistant" color="primary" class="q-mt-md" />
      </q-card-section>
    </q-card>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import axios from 'axios'
  
  // State variables
  const assistantName = ref('')
  const instructions = ref('')
  const uploader = ref(null) // Reference to q-uploader
  const selectedFiles = ref<File[]>([]) // Array to store selected files
  
  // Capture files selected in q-uploader
  const handleFileSelection = (files: any) => {
    selectedFiles.value = files
  }
  
  // Function to create assistant and upload files
  const createAssistant = async () => {
    try {
      // Step 1: Create the assistant
      const response = await axios.post('/createAnAssistant', { instructions: instructions.value })
      const assistantId = response.data.assistantId
      const vectorStoreId = response.data.vectorStoreId
  
      // Step 2: Save the assistant information in localStorage
      const assistants = JSON.parse(localStorage.getItem('assistants') || '[]')
      assistants.push({ id: assistantId, name: assistantName.value, vectorStoreId })
      localStorage.setItem('assistants', JSON.stringify(assistants))
  
      // Step 3: Upload files using axios if files are selected
      if (selectedFiles.value.length > 0) {
        const formData = new FormData()
        selectedFiles.value.forEach((file) => {
          formData.append('files', file)
        })
        formData.append('vectorStoreId', vectorStoreId)
  
        await axios.post('/addFileToAssistant', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        console.log('Files uploaded successfully')
      } else {
        console.log('No files selected for upload')
      }
  
      loadAssistantsFromLocalStorage()
    } catch (error) {
      console.error('Error creating assistant or uploading files:', error)
    }
  }
  
  // Load assistants from localStorage
  const loadAssistantsFromLocalStorage = () => {
    const assistants = JSON.parse(localStorage.getItem('assistants') || '[]')
    console.log('Loaded assistants:', assistants)
  }
  </script>
  
  <style scoped>
  .q-uploader {
    width: 100%;
  }
  </style>
  