<template>
    <q-card>
        <q-card-section>
            <div class="text-h6">Chat with Assistant</div>
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
            <q-btn v-if="selectedAssistant" @click="initializeThread" label="Start Chat" color="primary" />
        </q-card-section>
    
        <q-card-section v-if="threadId">
            <div v-for="msg in messages" :key="msg.id" :class="{ 'text-right': msg.role === 'user' }">
                <div :class="['chip', msg.role === 'user' ? 'chip-user' : 'chip-assistant']">
                    {{ msg.content }}
                </div>
            </div>
            <q-input
                v-model="message"
                label="Your Message"
                filled
                @keyup.enter="sendMessage"
                class="q-mt-md"
            />
            <q-btn @click="sendMessage" label="Send" color="primary" class="q-mt-sm" />
        </q-card-section>
    </q-card>
</template>
  
<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import axios from '../axios-config'
import { Assistant, Message } from '../interfaces/interfaces'
import { handleNotify } from "../utils/handleNotify";

const assistants = ref<Assistant[]>([])
const selectedAssistant = ref<Assistant | null>(null)
const threadId = ref<string | null>(null)
const message = ref<string>('')
const messages = ref<Message[]>([])

watch(selectedAssistant, () => {
    threadId.value = null
    messages.value = []
})

const loadAssistantsFromLocalStorage = () => {
    const storedAssistants = JSON.parse(localStorage.getItem('assistants') || '[]')
    assistants.value = storedAssistants as Assistant[]
}

const initializeThread = async () => {
    if (!threadId.value) {
        try {
            const response = await axios.post('/createThread')
            threadId.value = response.data.id
            await fetchThreadMessages()
        } catch (error) {
            handleNotify('Failed to initialize chat', 'negative')
        }
    }
}

const fetchThreadMessages = async () => {
    if (threadId.value) {
        try {
            const response = await axios.get(`/getThreadMessages?threadId=${threadId.value}`)
            messages.value = response.data.messages.map((msg: any, index: number) => ({
                id: index,
                role: msg.role,
                content: msg.content[0].text.value,
            }))
        } catch (error) {
            handleNotify('Failed to fetch messages', 'negative')
        }
    }
}

const sendMessage = async () => {
    if (!message.value || !selectedAssistant.value || !threadId.value) return

    messages.value.push({ id: messages.value.length, role: 'user', content: message.value })

    try {
        const response = await axios.post<{ answer: string }>('/addMessageToThread', {
            threadId: threadId.value,
            assistantId: selectedAssistant.value.id,
            message: message.value,
        })

        messages.value.push({
            id: messages.value.length,
            role: 'assistant',
            content: response.data.answer,
        })
    } catch (error) {
        handleNotify('Failed to send message', 'negative')
    } finally {
        message.value = ''
    }
}

onMounted(loadAssistantsFromLocalStorage)
</script>
  
<style scoped>
.chip {
    display: inline-block;
    padding: 8px 12px;
    border-radius: 16px;
    font-size: 14px;
    line-height: 1.4;
    margin-bottom: 8px;
    max-width: 90%;
    word-wrap: break-word;
    white-space: pre-wrap;
}

.chip-user {
    background-color: #2196f3;
    color: white;
}

.chip-assistant {
    background-color: #4caf50;
    color: white;
}
</style>