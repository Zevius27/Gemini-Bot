import express from 'express';
import dotenv from 'dotenv';
import { Telegraf } from 'telegraf';
import { registerCommands } from './command/index.Commander.js';


dotenv.config();

const app = express();

const bot = new Telegraf(process.env.BOT_TOKEN);

app.use(express.json());

app.get('/', (req, res) => {
  console.log('Get Request received');
  console.log(req.body);
  res.send('Get Request recived');
});

app.post('/', (req, res) => {
  console.log('Post request received');
  console.log(req.body);
  res.send('Post request received');
});

app.use(bot.webhookCallback('/webhook'));
registerCommands(bot);

bot.telegram.setWebhook(`${process.env.WEBHOOK_URL}/webhook`);

app.listen(process.env.PORT, (err) => {
  if (err) {
    console.log(`Server Error: ${err}`);
  } else {
    console.log(`Server is running on port ${process.env.PORT}`);
  }
});
