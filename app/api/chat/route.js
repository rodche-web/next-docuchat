import { NextResponse } from 'next/server'
import { combineDocuments } from '../utils/combineDocuments'
import {splitTextDocument, loadToVectorStore} from '../utils/vectorStoreUtils'
import { ChatOpenAI } from "langchain/chat_models/openai"
import {PromptTemplate} from 'langchain/prompts'
import {StringOutputParser} from 'langchain/schema/output_parser'
import { RunnablePassthrough, RunnableSequence } from "langchain/schema/runnable"
import { formatConvHistory } from '../utils/formatConvHistory'

const llm = new ChatOpenAI()

let convHistory = []

export async function POST(request) {
    const formData = await request.formData()
    const message = formData.get('message')
    const file = formData.get('document')

    // Vector Store
    const document = await splitTextDocument(file)
    const store = await loadToVectorStore(document)
    const retriever = await store.asRetriever()

    // Prompt Template
    const questionPromptTemplate = `Given some conversation history (if any) and a question, convert it into a standalone question.
    conversation history: {conv_history}
    question:{question}
    standalone question:`

    const answerPromptTemplate = `You are a helpful and enthusiastic knowledge bot who can answer a given question
    based on the context and conversation history provided. 
    Try to find the answer in the context and conversation history. 
    If you really don't know the answer, say "I'm sorry, I don't know the answer to that.". 
    Don't try to make up an answer. Always speak as if you were chatting to a friend.
    context: {context}
    conversation history: {conv_history}
    question: {question}
    answer:`

    const questionPrompt = PromptTemplate.fromTemplate(questionPromptTemplate)
    const answerPrompt = PromptTemplate.fromTemplate(answerPromptTemplate)

    const questionChain = RunnableSequence.from([
        questionPrompt,
        llm,
        new StringOutputParser()
    ])

    const retrieverChain = RunnableSequence.from([
        prevResult => prevResult.standalone_question,
        retriever,
        combineDocuments
    ])

    const answerChain = RunnableSequence.from([
        answerPrompt,
        llm,
        new StringOutputParser()
    ])

    const chain = RunnableSequence.from([
        {
            standalone_question: questionChain,
            original_input: new RunnablePassthrough()
        },
        {
            context: retrieverChain,
            question: ({ original_input }) => original_input.question,
            conv_history: ({ original_input }) => original_input.conv_history
        },
        answerChain
    ])

    const resp = await chain.invoke({
        question: message,
        conv_history: formatConvHistory(convHistory)
    })

    convHistory = [...convHistory, message, resp]

    return NextResponse.json({message: resp})
}