import * as fs from 'node:fs';
import * as path from 'node:path';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

// Ensure the ./images directory exists
function ensureImagesDirectoryExists() {
   const imagesDir = './images';
   if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir);
   }
}

// Fetch the file and return a buffer
async function fetchImageBuffer(fileLink) {
   const response = await fetch(fileLink);
   if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
   }
   const arrayBuffer = await response.arrayBuffer();
   return Buffer.from(arrayBuffer);
}

// Save buffer to a file
function saveBufferToFile(buffer, filePath) {
   fs.writeFileSync(filePath, buffer);
}

// Convert file to a format suitable for Google Generative AI
function fileToGenerativePart(filePath, mimeType) {
   return {
      inlineData: {
         data: fs.readFileSync(filePath).toString('base64'),
         mimeType,
      },
   };
}

// Main exported function
export async function handleImageAndText(ctx) {
   try {
      const photos = ctx.message.photo;
      const photo = photos[photos.length - 1];

      const fileId = photo.file_id;
      const fileLink = await ctx.telegram.getFileLink(fileId);

      ensureImagesDirectoryExists();

      const buffer = await fetchImageBuffer(fileLink);
      const imagePath = path.join('./images', `photo-${fileId}.png`);
      saveBufferToFile(buffer, imagePath);

      const caption =
         ctx.message.caption ||
         'If you got this text ignore it, it means user only sent an image no captions no text';
      const prompt = ctx.message.text || caption;
      const genAI = new GoogleGenerativeAI(process.env.API_KEY);
      const model = genAI.getGenerativeModel({ model: process.env.MODEL });
      const imagePart = fileToGenerativePart(imagePath, 'image/png');

      const result = await model.generateContent([prompt, imagePart]);

      ctx.reply(result.response.text());
      console.log(result.response.text());

      fs.unlinkSync(imagePath);
   } catch (error) {
      console.error('Error handling image and text:', error.message);
      ctx.reply('Sorry, something went wrong.');
   }
}
