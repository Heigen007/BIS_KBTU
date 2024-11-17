const { OpenAI } = require('openai');
const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

const openai = new OpenAI({
    apiKey: process.env['API_KEY'],
});

function timeout(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

app.post('/createAnAssistant', async (req, res) => {
    const instructions = req.body.instructions;
    
    try {
        const vectorStore = await openai.beta.vectorStores.create({
            name: 'MyVectorStore',
            expires_after: { anchor: 'last_active_at', days: 3 }
        });
        console.log("Vector Store created: " + vectorStore.id);

        const assistant = await openai.beta.assistants.create({
            instructions,
            model: "gpt-4o",
            tools: [{ type: 'file_search' }],
            tool_resources: {
                file_search: {
                    vector_store_ids: [vectorStore.id]
                }
            },
            temperature: 0.3
        });
        console.log("Assistant created: " + assistant.id);

        res.json({ assistantId: assistant.id, vectorStoreId: vectorStore.id });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/addFileToAssistant', upload.array('files'), async (req, res) => {
    const files = req.files;
    const vectorStoreId = req.body.vectorStoreId;

    try {
        const fileUploads = files.map(file => openai.files.create({
            file: fs.createReadStream(file.path),
            purpose: "assistants"
        }));
        const uploadedFiles = await Promise.all(fileUploads);
        const fileIds = uploadedFiles.map(f => f.id);
        for (let i = 0; i < fileIds.length; i++) {
            await openai.beta.vectorStores.files.create(
                vectorStoreId,
                {
                    file_id: fileIds[i]
                }
            );
        }
        console.log("Files uploaded and attached to vector store");
        res.json({ message: "Files added successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    } finally {
        files.forEach(file => fs.unlink(file.path, err => {
            if (err) console.error('Failed to delete uploaded file', err);
        }));
    }
});

app.post('/addStubFilesToAssistant', async (req, res) => {
    const vectorStoreId = req.body.vectorStoreId;

    try {
        await loadFilesStubToFileVectorStore(vectorStoreId);
        console.log("Stub files added to vector store");
        res.json({ message: "Stub files added successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/createThread', async (req, res) => {
    try {
        let thread = await openai.beta.threads.create({
            messages: []
        });
        console.log("Thread created: " + thread.id);
        res.json({ id: thread.id });
    } catch (error) {
        console.log(error);
        res.json({ error: error });
    }
})

app.post('/addMessageToThread', async (req, res) => {
    var threadId = req.body.threadId;
    var assistantId = req.body.assistantId;
    var message = req.body.message;
    try {
        await openai.beta.threads.messages.create(threadId, {
            "role": "user",
            "content": message
        });
        console.log("Message added to thread: " + message);
        var run = await openai.beta.threads.runs.create(
            threadId,
            { assistant_id: assistantId }
        );
        console.log("Run created: " + run.id);
        const runId = run.id;
        var response = { status: 'started' };
        while (response.status != 'completed') {
            await timeout(1000);
            run = await openai.beta.threads.runs.retrieve(
                threadId,
                runId
            );
            response.status = run.status;
            console.log(response.status);
        }
        const threadMessages = await openai.beta.threads.messages.list(threadId)

        console.log("Run completed");
        res.json({ answer: beautifyMessage(threadMessages.data[0].content[0].text.value) });
    } catch (error) {
        console.log(error);
        res.json({ error: error });
    }
})

app.get('/getThreadMessages', async (req, res) => {
    var threadId = req.query.threadId;
    try {
        const threadMessages = await openai.beta.threads.messages.list(threadId);
        console.log("Messages retrieved");
        res.json({ messages: threadMessages.data });
    } catch (error) {
        console.log(error);
        res.json({ error: error });
    }
})

function beautifyMessage(message) {
    return message.replace(/【[^】]*】/g, '');
}

function loadFilesStubToFileVectorStore(vectorStoreId) {
    const fileUploads = [
        'uploads/wifi.docx',
        'uploads/Адрес.docx',
        'uploads/Жюри.docx',
        'uploads/Инструкции для сдачи проекта.docx',
        'uploads/Инструкции.docx',
        'uploads/Критерии оценки.docx',
        'uploads/Регламент по дням.docx',
        'uploads/Контакты.docx',
    ].map(file => openai.files.create({
        file: fs.createReadStream(file),
        purpose: "assistants"
    }));
    return Promise.all(fileUploads).then(uploadedFiles => {
        const fileIds = uploadedFiles.map(f => f.id);
        return Promise.all(fileIds.map(fileId => openai.beta.vectorStores.files.create(
            vectorStoreId,
            {
                file_id: fileId
            }
        )));
    });
}



app.listen(3000, () => {
    console.log('Server is running on port 3000');
});