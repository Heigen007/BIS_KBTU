export interface Assistant {
    id: string
    name: string
    vectorStoreId: string
}

export interface Message {
    id: number
    role: 'user' | 'assistant'
    content: string
}