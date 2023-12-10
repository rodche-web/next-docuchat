// import { config } from 'dotenv'
// config()
import { FaissStore } from "langchain/vectorstores/faiss";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

export async function splitTextDocument (path) {
    try {
        const loader = new TextLoader(path);
        const text = await loader.load();
    
        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 500,
            chunkOverlap: 50
        })
    
        const output = await splitter.splitDocuments(text)
    
        return output
    } catch (error) {
        console.log(error)
    }
}

export async function loadToVectorStore (docs) {
    try {
        const vectorStore = await FaissStore.fromDocuments(
            docs,
            new OpenAIEmbeddings()
        );

        return vectorStore
    } catch (error) {
        console.log(error)
    }
}

// Main Program
// const document = await splitTextDocument('artwar.txt')
// const store = await loadToVectorStore(document)
// const result = await store.similaritySearch('What are the plans?')
// console.log(result)
