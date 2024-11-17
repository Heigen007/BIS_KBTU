<template>
    <div class="container">
        <div class="form-container">
            <h1>Create Assistant</h1>
            <input v-model="assistantName" placeholder="Enter assistant name" class="input-field" />
            <input v-model="instructions" placeholder="Enter assistant instructions" class="input-field" />
            <button @click="loadStubData" class="add-stub-files-button">Load Stub Data</button>
            <button @click="createAssistant" class="create-button">Create Assistant</button>
        </div>
    
        <div class="assistants-container">
            <h2>Assistants:</h2>
            <ul>
            <li v-for="assistant in assistants" :key="assistant.id" class="assistant-item">
                <div>
                    <strong>Name:</strong> {{ assistant.name }}<br>
                    <strong>Id:</strong> {{ assistant.id }}
                </div>
                <router-link :to="`/manage/${assistant.id}/${assistant.vectorStoreId}`" class="manage-link">Manage</router-link>
            </li>
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import axios from '@/axios-config';

interface Assistant {
    id: string;
    name: string;
    vectorStoreId: string;
}

const instructions = ref('');
const assistantName = ref('');
const assistants = ref<Assistant[]>([]);

const createAssistant = async () => {
    const response = await axios.post('/createAnAssistant', { instructions: instructions.value });
    const assistantId = response.data.assistantId;
    const vectorStoreId = response.data.vectorStoreId;
    const assistants = JSON.parse(localStorage.getItem('assistants') || '[]');
    assistants.push({ id: assistantId, name: assistantName.value, vectorStoreId });
    localStorage.setItem('assistants', JSON.stringify(assistants));
    loadAssistantsFromLocalStorage();
};

const loadAssistantsFromLocalStorage = () => {
    const assistantsFromLocalStorage = JSON.parse(localStorage.getItem('assistants') || '[]');
    assistants.value = assistantsFromLocalStorage;
    console.log(assistants);
};

const loadStubData = async () => {
    assistantName.value = 'Ассистент хакатона NFactorial AI CUP 2024';
    instructions.value = 'Ты - ассистент на хакатоне от NFactorial. Отвечай вежливо. Если в файлах нет ответа на вопрос клиента - предлагай связаться по контактам. Самое главное - если в предоставленной информации нет ответа - ни в коем случае не придумывать ответ. Отвечать ТОЛЬКО на те вопросы, ответы на которые есть в предоставленном контексте. Контактные телефоны: 8 707 696 60 35 Асель, 8 701 986 73 33 Алибек';
};

onMounted(() => {
    loadAssistantsFromLocalStorage();
});
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

.input-field {
    display: block;
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.create-button {
    display: block;
    width: 100%;
    padding: 10px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    margin-top: 20px;
}

.create-button:hover {
    background-color: #45a049;
}

.assistants-container {
    margin-top: 20px;
}

.assistants-container h2 {
    margin-bottom: 10px;
}

.assistant-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: #f9f9f9;
}

.manage-link {
    text-decoration: none;
    color: #007BFF;
    font-weight: bold;
}

.manage-link:hover {
    text-decoration: underline;
}
</style>