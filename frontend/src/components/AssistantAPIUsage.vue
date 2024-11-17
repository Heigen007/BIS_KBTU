<template>
    <q-card>
        <q-card-section>
            <div class="text-h6">API Usage</div>
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
        </q-card-section>
  
        <q-card-section v-if="selectedAssistant">
            <h6>Assistant ID: <strong>{{ selectedAssistant.id }}</strong></h6>
            <div>
                This is the unique identifier for the selected assistant. Use it to create a conversation thread and to send messages.
            </div>
        </q-card-section>
  
        <q-card-section v-if="selectedAssistant">
            <h6>Code Examples</h6>

            <q-expansion-item label="JavaScript Example" expand-separator>
                <h7>1. Create a Conversation Thread</h7>
                <pre><code class="language-javascript">
const createThread = async () => {
  try {
    const response = await axios.post('/createThread');
    const threadId = response.data.id;
    console.log('Thread ID:', threadId);
  } catch (error) {
    console.error('Error creating thread:', error);
  }
};
                </code></pre>

            <h7 class="q-mt-md">2. Send a Message</h7>
            <pre><code class="language-javascript">
const sendMessage = async (threadId, assistantId, message) => {
  try {
    const response = await axios.post('/addMessageToThread', {
      threadId: threadId,
      assistantId: assistantId,
      message: message,
    });
    console.log('Assistant Response:', response.data.answer);
  } catch (error) {
    console.error('Error sending message:', error);
  }
};
            </code></pre>
            </q-expansion-item>

            <q-expansion-item label="cURL Example" expand-separator>
                <h7>1. Create a Conversation Thread</h7>
                <pre><code class="language-bash">
curl -X POST /createThread -H "Content-Type: application/json"
                </code></pre>

                <h7 class="q-mt-md">2. Send a Message</h7>
                <pre><code class="language-bash">
curl -X POST /addMessageToThread -H "Content-Type: application/json" -d '{
  "threadId": "THREAD_ID",
  "assistantId": "ASSISTANT_ID",
  "message": "Your message here"
}'
                </code></pre>
            </q-expansion-item>
        </q-card-section>
    </q-card>
</template>
  
<script setup lang="ts">
import { ref, onMounted } from 'vue'

const assistants = ref([])
const selectedAssistant = ref()

const loadAssistantsFromLocalStorage = () => {
    const storedAssistants = JSON.parse(localStorage.getItem('assistants') || '[]')
    assistants.value = storedAssistants
}

onMounted(loadAssistantsFromLocalStorage)
</script>

<style scoped>
.q-mt-md {
    margin-top: 16px;
}

pre {
    background-color: #f5f5f5;
    padding: 10px;
    border-radius: 8px;
    overflow-x: auto;
    font-size: 14px;
}

code {
    font-family: 'Courier New', monospace;
}

h6 {
    margin: 10px;
}
</style>