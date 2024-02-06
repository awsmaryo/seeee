# from transformers import GPT2LMHeadModel, GPT2Tokenizer
import discord
import random
from discord.ext import commands
import nest_asyncio
import torch
#from pyngrok import ngrok
from discord.ext import commands, tasks
#from keep_alive import keep_alive
#keep_alive()

#intents = discord.Intents.all()
#client = discord.Client(intents=intents)

#model_name = "EleutherAI/gpt-neo-125M"
#model = GPT2LMHeadModel.from_pretrained(model_name)
#tokenizer = GPT2Tokenizer.from_pretrained(model_name)

# Asenkron işlemleri desteklemek için nest_asyncio'yu aktifleştir
nest_asyncio.apply()

#ngrok.set_auth_token("2OXyXwBQ7hKFTV2jdhu3XI0Hvcd_hAUHm3VcaXJsrJ9TtrKn")

# Discord botunu oluştur
intents = discord.Intents.default()
intents.message_content = True
bot = commands.Bot(command_prefix='!', intents=intents)

#model.eval()

#public_url = ngrok.connect(8001)

@bot.event
async def on_ready():
    guild_id = 1202901778715246673  # Sunucu ID'si
    channel_id = 1204132912702689400  # Sesli kanal ID'si

    guild = discord.utils.get(bot.guilds, id=guild_id)

    if guild:
        channel = discord.utils.get(guild.voice_channels, id=channel_id)

        if channel:
            voice_channel = await channel.connect()
            voice_channel.play(discord.FFmpegPCMAudio("https://www.youtube.com/watch?v=Cjp6RVrOOW0"), after=lambda e: print('Müzik bitti'))
            voice_channel.source = discord.PCMVolumeTransformer(voice_channel.source)
            voice_channel.source.volume = 1.0
        else:
            print("Belirtilen sesli kanal bulunamadı.")
    else:
        print("Belirtilen sunucu bulunamadı.")

async def on_ready():
    print(f'We have logged in as {bot.user}')
    #print(f'Public URL: {public_url}')

    # Durum değiştirme görevini başlat
    change_status.start()

status_list = ["Kelle Koleksiyoncusu", "Hünkar Efendi", "İmparator", "Racon Avcısı", "Kafa Kesici", "Sultan of Slaughter", "Tahtın Hakimi", "Başkan Beheader", "Kabadayı Kralı", "Tırmık Terörist", "Kafatası Krallığı", "Gözü Dönmüş Efendi", "Baş Kesici Baron", "Kelle Kralı", "Efsane Sultan"]  # İstediğiniz durumları liste olarak belirtin
current_status_index = 0  # Başlangıçta ilk durumu kullanacak

@tasks.loop(seconds=5)  # Durumu her 60 saniyede bir değiştir
async def change_status():
    global current_status_index

    # Durumu liste üzerinde döngüye al
    await bot.change_presence(activity=discord.Game(name=status_list[current_status_index]), status=discord.Status.idle)

    # Bir sonraki duruma geç
    current_status_index = (current_status_index + 1) % len(status_list)

# Kontrol fonksiyonu
def is_valid_guild_and_role(ctx):
    # Kontrol edilecek sunucu ve rol ID'leri
    sunucu_id = ctx.guild.id
    rol_id = None

    if sunucu_id == 1202901778715246673:
        rol_id = 1202904411274346496
    elif sunucu_id == 1149422787958669392:
        rol_id = 1151926488581558352

    # Kontrol
    if rol_id is not None and discord.utils.get(ctx.author.roles, id=rol_id):
        return True
    else:
        return False

@bot.command(name='m', help='Belirtilen sayıda mesajı belirtilen kullanıcıya gönderir.')
async def mesajat(ctx, kac_kere: int, hedef_kullanici_id: int, *, mesaj_icerigi):
    # Hedef kullanıcıya belirtilen sayıda mesaj gönder
    hedef_kullanici = bot.get_user(hedef_kullanici_id)

    if hedef_kullanici:
        for _ in range(kac_kere):
            await hedef_kullanici.send(mesaj_icerigi)
        await ctx.send(f'{kac_kere} adet mesaj {hedef_kullanici.name} kullanıcısına gönderildi.')
    else:
        await ctx.send('Hedef kullanıcı bulunamadı.')

# Kategori ve kanal oluşturma fonksiyonu
async def create_category_and_channels(guild, category_name, count):
    # Mevcut kategorilerin sayısını kontrol et
    existing_categories = [c.name for c in guild.categories]
    category_count = 2  # Başlangıçtan itibaren GUZEL2'den başlasın

    while f'{category_name}{category_count}' in existing_categories:
        category_count += 1

    # Yeni kategori oluştur
    category = await guild.create_category(f'{category_name}{category_count}')

    # SXXS kanallarını oluştur ve @here etiketle
    for i in range(1, count + 1):
        channel_name = f'SXXS-{i}'
        channel = await guild.create_text_channel(channel_name, category=category)
        await channel.send('@here')

    return category

# !ken komutu
@bot.command(name='ken', help='SXXS içeren tüm kanalları kaldırır.')
@commands.check(is_valid_guild_and_role)
async def delete_channels(ctx):
    # "sxxs" içeren tüm kanalları bul ve kaldır
    for channel in ctx.guild.channels:
        if 'sxxs' in channel.name.lower():
            await channel.delete()

    await ctx.send('SXXS içeren tüm kanallar kaldırıldı.')

# !kan komutu
@bot.command(name='kan', help='Guzel kategori ve SXXS kanalları oluşturur.')
@commands.check(is_valid_guild_and_role)
async def create_channel(ctx, count: int, category_name: str = 'guzel'):
    # Kategori oluştur veya varsa bul
    category = discord.utils.get(ctx.guild.categories, name=category_name)

    # Kategori yoksa veya kanal sayısı 50'yi geçerse yeni kategori oluştur
    if not category or len(category.channels) >= 50:
        category = await create_category_and_channels(ctx.guild, category_name, count)
        await ctx.send(f'Yeni kategori "{category.name}" oluşturuldu ve içine {count} tane SXXS kanalı yapıldı.')
    else:
        # Var olan kategoriye SXXS kanalları ekleyip @here etiketle
        for i in range(1, count + 1):
            channel_name = f'SXXS-{i}'
            channel = await ctx.guild.create_text_channel(channel_name, category=category)
            await channel.send('@here')

        await ctx.send(f'"{category.name}" adlı kategoriye {count} tane SXXS kanalı yapıldı.')

#@bot.command(name='kullan')
#async def kullan(ctx, *args):
    # Kullanıcının girdiği soru
    #soru = ' '.join(args)

    # Soru cümlesini tokenize et
    #soru_input_ids = tokenizer.encode(soru, return_tensors="pt")

    # Dikkat maskesini oluştur
    #soru_attention_mask = torch.ones(soru_input_ids.shape, dtype=torch.long)

    # Modelden cevap al
   #with torch.no_grad():
      #  cevap = model.generate(input_ids=soru_input_ids, attention_mask=soru_attention_mask, max_length=100, num_beams=5, no_repeat_ngram_size=2, top_k=50, top_p=0.95, temperature=0.7)

    # Cevabı decode et
    #decoding_result = tokenizer.decode(cevap[0], skip_special_tokens=True)

    # Modelin cevabını yazdır
    #print("Modelin Cevabı: ", decoding_result)

    # Kullanıcının DM'ine cevabı gönder
    #await ctx.author.send("Modelin Cevabı: " + decoding_result)

# Botu çalıştır
bot.run('MTIwMjkwMDU2MDg5MDY5MTY3NA.GmmAwa.bmuJHJdZy1-ksirJ5flMWQQFdkkwAllFpWPIsY')

while True:
    pass
