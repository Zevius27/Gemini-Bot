import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

export async function handleText(ctx) {
   let textMessage = ctx.message.text;
   const url = process.env.GEMINI_URL;

   try {
      const headers = {
         'Content-Type': 'application/json',
      };
      const body = JSON.stringify({
         contents: [
            {
               parts: [{ text: textMessage }],
            },
         ],
      });

      const response = await fetch(url, {
         method: 'POST',
         headers,
         body,
      });

      ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      //  test it out the fetch request
      /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // console.log(response);
      try {
         if (!response.ok) {
            throw new Error(
               `Request failed with status: ${
                  response.status
               } ${await response.text()}`
            );
         }

         const result = await response.json();
         //  console.log(result['candidates'][0]['content']['parts'][0]['text']);
         
         ctx.reply(result['candidates'][0]['content']['parts'][0]['text']);
         return result;
      } catch (error) {
         console.log('Response was not ok ' + error);
      }
   } catch (error) {
      console.log('Error in text handler' + error);
   }
}
