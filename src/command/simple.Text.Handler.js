import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

export async function handleText(ctx) {
   const genAI = new GoogleGenerativeAI(`${process.env.API_KEY}`);
   const model = genAI.getGenerativeModel({ model: `${process.env.MODEL}` });
   const result = await model.generateContent(ctx.message.text);
   // console.log(result.response.text());
   ctx.reply(result.response.text());
}
