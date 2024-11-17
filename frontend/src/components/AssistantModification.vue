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
            <q-btn @click="deleteAssistant" label="Delete Assistant" color="negative" class="q-mt-md q-ml-sm" />
        </q-card-section>
    </q-card>
</template>
  
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from '../axios-config'
import { handleNotify } from "../utils/handleNotify";

const assistants = ref([])
const selectedAssistant = ref()
const selectedFiles = ref<File[]>([])
const uploader = ref()

const loadAssistantsFromLocalStorage = () => {
    const storedAssistants = JSON.parse(localStorage.getItem('assistants') || '[]')
    assistants.value = storedAssistants
}

const handleFileSelection = (files: any) => {
    selectedFiles.value = files
}

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
        const formData = new FormData()
        selectedFiles.value.forEach((file) => {
            formData.append('files', file)
        })
        formData.append('vectorStoreId', selectedAssistant.value.vectorStoreId)

        await axios.post('/addFileToAssistant', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })

        handleNotify('Files uploaded successfully', 'positive')

        selectedAssistant.value = null
        selectedFiles.value = []
        uploader.value.reset()
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
    
    selectedAssistant.value = null
    selectedFiles.value = []
    uploader.value.reset()
    handleNotify('Assistant deleted successfully', 'positive')

    loadAssistantsFromLocalStorage()
}

onMounted(loadAssistantsFromLocalStorage)
</script>
  
<style scoped>
.q-uploader {
    width: 100%;
}
</style>