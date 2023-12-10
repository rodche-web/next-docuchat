import OpenAI from 'openai'
import { NextResponse } from 'next/server'
import { combineDocuments } from '../utils/combineDocuments'
import {splitTextDocument, loadToVectorStore} from '../utils/vectorStoreUtils'

export async function POST(request) {
    const {message} = await request.json()

    return NextResponse.json({message})
}