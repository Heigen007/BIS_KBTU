<template>
    <q-card>
        <q-card-section>
            <h2 class="text-h6">Frequently Asked Questions</h2>
    
            <div class="q-mt-md">
                <q-expansion-item label="How do I upload my knowledge base?" expand-separator>
                    <p class="q-ml-lg">Click on the "MODIFY ASSISTANT" tab in your dashboard, and select your files. Supported formats include PDF, DOCX, TXT and MD. Once uploaded, the files will be processed, and you can manage them as part of your knowledge base.</p>
                </q-expansion-item>
        
                <q-expansion-item label="How can I customize my API?" expand-separator>
                    <p class="q-ml-lg">Use the "API USAGE" tab to view and manage your API settings.</p>
                </q-expansion-item>
        
                <q-expansion-item label="How does AI training work?" expand-separator >
                    <p class="q-ml-lg">Our system allows you to train the AI on your knowledge base, powered by OpenAI</p>
                </q-expansion-item>
        
                <q-expansion-item label="Is my data secure?" expand-separator>
                    <p class="q-ml-lg">Yes, data security is our top priority.</p>
                </q-expansion-item>
        
                <q-expansion-item label="How do I contact support?" expand-separator>
                    <p class="q-ml-lg">If you have any questions, feel free to reach out to our support team.</p>
                    <p class="q-ml-lg">Email: support_test@gmail.com</p>
                    <p class="q-ml-lg">Phone: (123) 456-7890</p>
                </q-expansion-item>
        
                <q-expansion-item label="Can I integrate the API with other platforms?" expand-separator>
                    <p class="q-ml-lg">Yes, our API is designed to be flexible and can be integrated with various platforms and applications. You can refer to our API documentation for specific instructions on connecting with different systems.</p>
                </q-expansion-item>
        
                <q-expansion-item label="What formats are supported for knowledge base uploads?" expand-separator>
                    <p class="q-ml-lg">We support PDF, DOCX, TXT, and Markdown formats. For best results, ensure that your files are well-structured and contain clear headings and content organization.</p>
                </q-expansion-item>
        
                <q-expansion-item label="Can I update my knowledge base after uploading?" expand-separator>
                    <p class="q-ml-lg">Yes, you can update your knowledge base anytime by uploading new files. The AI will automatically process new information during the next training session.</p>
                </q-expansion-item>
            </div>
        </q-card-section>
    </q-card>
</template>
  
<style>
.q-expansion-item .q-item__label {
    font-weight: bold;
}
</style>