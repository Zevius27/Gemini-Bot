import { handleStart } from './start.Command.js';
// import { handleText } from './improvements/gemini.Text.Handler.js';
import { handleText } from './simple.Text.Handler.js';
import { handleImageAndText } from './simple.Image.Handler.js';

export const registerCommands = (bot) => {
   bot.command('start', handleStart);
   bot.command('help', (ctx) => ctx.reply('Send /start'));

   ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   //////  test it out the handleText
   //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   bot.on('text', handleText);
   bot.on('photo', handleImageAndText);
};
