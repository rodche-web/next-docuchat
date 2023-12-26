import { FaissStore } from "langchain/vectorstores/faiss";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

export async function splitTextDocument (file) {
    try {
        let output = ''

        if (file.type === 'text/plain') {
            const loader = new TextLoader(file)
            const text = await loader.load()
            const splitter = new RecursiveCharacterTextSplitter({
                chunkSize: 500,
                chunkOverlap: 50
            })
        
            output = await splitter.splitDocuments(text)
        } else if (file.type === 'application/pdf') {
            const loader = new PDFLoader(file);
            output = await loader.load();
        } else {
            console.log('Error')
            return
        }
    
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

