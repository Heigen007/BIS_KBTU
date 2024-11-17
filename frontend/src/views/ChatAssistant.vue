<template>
    <div class="chat-container">
        <h1>Chat with Assistant</h1>
        <div class="messages-container">
            <div v-for="(message, index) in messages" :key="index" :class="['message', message.role]">
                <strong>{{ message.role }}:</strong> {{ message.content }}
            </div>
        </div>
        <div class="input-container">
            <input v-model="message" placeholder="Type your message" class="message-input" />
            <button @click="sendMessage" class="send-button">Send</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

const route = useRoute();

const assistantId = route.params.assistantId;
const threadId = ref(route.params.threadId);
const message = ref('');
const messages = ref<{ id: number, role: string, content: string }[]>([]);

const fetchThread = async () => {
    try {
        const response = await axios.get(`/getThreadMessages?threadId=${threadId.value}`);
        response.data.messages.reverse();
        response.data.messages.forEach((message: any, index: number) => {
            messages.value.push({ id: index, role: message.role, content: message.content[0].text.value });
        });
    } catch (error) {
        console.error(error);
        alert('Failed to fetch messages');
    }
};

const sendMessage = async () => {
    if (!message.value) return;

    messages.value.push({ id: messages.value.length, role: 'user', content: message.value });

    try {
        const response = await axios.post('/addMessageToThread', {
            threadId: threadId.value,
            assistantId,
            message: message.value,
        });

        messages.value.push({ id: messages.value.length, role: 'assistant', content: response.data.answer });

    } catch (error) {
        console.error(error);
        alert('Failed to send message');
    } finally {
        message.value = '';
    }
};

onMounted(fetchThread);
</script>

<style>
.chat-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    font-family: Arial, sans-serif;
    background-color: #f4f4f9;
    border-radius: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

h1 {
    text-align: center;
    margin-bottom: 20px;
}

.messages-container {
    max-height: 400px;
    overflow-y: auto;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #fff;
    margin-bottom: 20px;
}

.message {
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 5px;
}

.user {
    background-color: #e1ffc7;
    align-self: flex-end;
}

.assistant {
    background-color: #d1e7ff;
    align-self: flex-start;
}

.input-container {
    display: flex;
    gap: 10px;
}

.message-input {
    flex: 1;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.send-button {
    padding: 10px 20px;
    background-color: #007BFF;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.send-button:hover {
    background-color: #0056b3;
}
</style>