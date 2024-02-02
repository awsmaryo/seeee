require('dotenv').config();

const Discord = require('discord.js');
const client = new Discord.Client();
const ayarlar = require('./ayarlar.json');

client.on('ready', () => {
  console.log(`Bot ${client.user.tag} is now connected.`);
});

client.on('message', async (msg) => {
  if (!msg.author.bot) {
    const kufurKelimeler = ['aq','amk','pipi','lionelmessi','sülaleni','anani','sik','dinini','muhammedini','allahini','orospu', 'oros', 'piç', 'sq', 'sg', 'ami','göt','zenci','got','vajin'];
    if (kufurKelimeler.some(kelime => msg.content.toLowerCase().includes(kelime))) {
      try {
        // Küfür içeren mesajları sil
        await msg.delete();

        // Kullanıcıyı uyar
        await msg.reply('Küfür etmek yasak!').then(replyMsg => {
          replyMsg.delete({ timeout: 5000 });
        });
      } catch (err) {
        console.error('Hata:', err);
      }
    }
  }
});

// Botu başlat
client.login(process.env.token)
  .then(() => {
    console.log('Bot başarıyla giriş yaptı.');
  })
  .catch((err) => {
    console.error('Bot giriş hatası:', err);
  });
