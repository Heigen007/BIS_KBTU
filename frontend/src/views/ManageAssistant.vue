<template>
    <div class="container">
        <div class="form-container">
            <h1>Manage Assistant</h1>
            <input type="file" @change="onFileChange" multiple class="file-input" />
            <button @click="addFilesToAssistant" class="add-files-button">Add Files</button>
        </div>
        <button @click="addStubFiles" class="add-stub-files-button">Load Stub Files</button>
        <button @click="startChat" class="start-chat-button">Start Chat</button>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const router = useRouter();
const assistantId = route.params.id;
const vectorStoreId = route.params.vectorStoreId;
const selectedFiles = ref<FileList | null>(null);

const onFileChange = (event: Event) => {
    const input = event.target as HTMLInputElement;
    selectedFiles.value = input.files;
};

const addFilesToAssistant = async () => {
    if (!selectedFiles.value) return;

    const formData = new FormData();
    formData.append('vectorStoreId', vectorStoreId.toString());
    Array.from(selectedFiles.value).forEach((file) => {
        formData.append('files', file);
    });

    try {
        await axios.post('/addFileToAssistant', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        alert('Files added successfully');
    } catch (error) {
        console.error(error);
        alert('Failed to add files');
    }
};

const startChat = async () => {
    try {
        const response = await axios.post('/createThread');
        const threadId = response.data.id;
        router.push(`/chat/${threadId}/${assistantId}`);
    } catch (error) {
        console.error(error);
        alert('Failed to start chat');
    }
};

const addStubFiles = async () => {
    try {
        await axios.post('/addStubFilesToAssistant', { vectorStoreId });
        alert('Stub files added successfully');
    } catch (error) {
        console.error(error);
        alert('Failed to add stub files');
    }
};
</script>

<style>
.container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    font-family: Arial, sans-serif;
}

.form-container {
    margin-bottom: 20px;
}

.file-input {
    display: block;
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.add-files-button {
    display: block;
    width: 100%;
    padding: 10px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
}

.add-files-button:hover {
    background-color: #45a049;
}

.start-chat-button {
    display: block;
    width: 100%;
    padding: 10px;
    background-color: #007BFF;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    margin-top: 20px;
}

.start-chat-button:hover {
    background-color: #0056b3;
}

.add-stub-files-button {
    display: block;
    width: 100%;
    padding: 10px;
    background-color: #FF5722;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    margin-top: 20px;
}

.add-stub-files-button:hover {
    background-color: #E64A19;
}
</style>