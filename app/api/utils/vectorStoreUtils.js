import { FaissStore } from "langchain/vectorstores/faiss";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

export async function splitTextDocument (file) {
    try {
        const loadedData = file
        const loader = new TextLoader(loadedData);
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

