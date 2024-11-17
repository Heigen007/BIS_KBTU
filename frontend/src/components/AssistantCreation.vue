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
import axios from '../axios-config'
import { handleNotify } from "../utils/handleNotify";

const assistantName = ref('')
const instructions = ref('')
const uploader = ref()
const selectedFiles = ref<File[]>([])

const handleFileSelection = (files: any) => {
    selectedFiles.value = files
}

const createAssistant = async () => {
    try {
        const response = await axios.post('/createAnAssistant', { instructions: instructions.value })
        const assistantId = response.data.assistantId
        const vectorStoreId = response.data.vectorStoreId

        const assistants = JSON.parse(localStorage.getItem('assistants') || '[]')
        assistants.push({ id: assistantId, name: assistantName.value, vectorStoreId })
        localStorage.setItem('assistants', JSON.stringify(assistants))

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
        }
        handleNotify('Assistant created successfully', 'positive')
        assistantName.value = ''
        instructions.value = ''
        selectedFiles.value = []
        uploader.value.reset()
    } catch (error) {
        console.error('Error creating assistant or uploading files:', error)
        handleNotify('Error creating assistant or uploading files', 'negative')
    }
}
</script>
  
<style scoped>
.q-uploader {
    width: 100%;
}
</style>
  