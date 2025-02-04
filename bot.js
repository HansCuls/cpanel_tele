require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const fetch = require('node-fetch');
//const JavaScriptObfuscator = require('javascript-obfuscator');
const axios = require('axios');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});
const RAW_GITHUB_URL = 'https://raw.githubusercontent.com/HansCuls/akses1/refs/heads/main/user.json?token=GHSAT0AAAAAAC6GVXGQQKUES53Q5BQ5TIH4Z5CBVAQ'; // Ganti dengan URL raw Anda



/*const inputFile = './bot.js';
const outputFile = './bot.enc.js';

try {
    const inputCode = fs.readFileSync(inputFile, 'utf-8');
    const obfuscationResult = JavaScriptObfuscator.obfuscate(inputCode, {
        compact: true,
         controlFlowFlattening: false,
        deadCodeInjection: false,
        debugProtection: false,
        debugProtectionInterval: false,
        disableConsoleOutput: false,
        domainLock: [],
        domainLockRedirectUrl: 'about:blank',
        forceTransformStrings: [],
        identifierNamesGenerator: 'hexadecimal',
        identifiersPrefix: '',
        ignoreRequire: false,
        log: false,
        numbersToExpressions: false,
        optionsPreset: 'default',
        renameGlobals: false,
        renameProperties: false,
        reservedNames: [],
        reservedStrings: [],
        rotateStringArray: true,
        seed: 0,
        selfDefending: false,
        shuffleStringArray: true,
        simplify: true,
        splitStrings: false,
        stringArray: true,
        stringArrayEncoding: false,
        stringArrayThreshold: 0.8,
         transformObjectKeys: false,
         unicodeEscapeSequence: false
    });

    fs.writeFileSync(outputFile, obfuscationResult.getObfuscatedCode(), 'utf-8');
    console.log(`File ${inputFile} berhasil di-_obfuscate_ dan disimpan ke ${outputFile}`);
} catch (error) {
    console.error('Error during obfuscation:', error);
}*/

// Mengambil variabel lingkungan
const botToken = process.env.BOT_TOKEN;
const ownerId = process.env.OWNER_ID;
const domainPanel = process.env.DOMAIN_PANEL;
const panelApiKey = process.env.PANEL_API_KEY;
const clientApiKey = process.env.CLIENT_API_KEY;
const locationId = process.env.LOCATION_ID;
const nodejsEggId = process.env.NODEJS_EGG;
const botPhotoUrl = process.env.BOT_PHOTO_URL;

// Membuat bot
const bot = new TelegramBot(botToken, { polling: true });

// Nama dan Author
const botName = 'Bot_Cpanel_Hansz';
const botAuthor = 'lorenzo_xavier';

// Inisialisasi data dari file
let adminUsers = [];
let premiumUsers = [];

const adminFile = 'adminID.json';
const premiumFile = 'premiumUsers.json';

try {
  adminUsers = JSON.parse(fs.readFileSync(adminFile, 'utf-8'));
} catch (error) {
  console.error('Error reading admin users:', error);
  fs.writeFileSync(adminFile, '[]', 'utf-8')
}

try {
  premiumUsers = JSON.parse(fs.readFileSync(premiumFile, 'utf-8'));
} catch (error) {
    console.error('Error reading premium users:', error);
    fs.writeFileSync(premiumFile, '[]', 'utf-8')
};

// Fungsi untuk menghitung runtime bot
function getRuntime() {
  const uptime = process.uptime();
  const hours = Math.floor(uptime / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = Math.floor(uptime % 60);
  return `${hours} Jam ${minutes} Menit ${seconds} Detik`;
};

//pembersihan file yang sudah lama
 // Use promises version
const path = require('path');

async function cleanUpDownloads(downloadDir, maxAgeDays) {
    try {
        const files = await fs.readdir(downloadDir);
        const maxAgeMs = maxAgeDays * 24 * 60 * 60 * 1000;

        for (const file of files) {
            const filePath = path.join(downloadDir, file);
            const stats = await fs.stat(filePath);
            const fileAgeMs = Date.now() - stats.mtimeMs;

            if (fileAgeMs > maxAgeMs) {
                console.log(`Menghapus file: ${filePath}`);
                await fs.unlink(filePath);
            }
        }
        console.log(`Pembersihan file selesai di direktori ${downloadDir}`)

    } catch (error) {
        console.error("Gagal melakukan pembersihan:", error);
    }
};

const downloadDir = __dirname; // Gunakan direktori tempat bot berjalan
const cleanUpInterval = 24 * 60 * 60 * 1000; // 1 hari dalam milidetik
const maxAgeDays = 3; // Atur default 3 hari, bisa diganti menjadi 7 atau konfigurasi lain

    
setInterval(() => {
  cleanUpDownloads(downloadDir, maxAgeDays)
  console.log('Pembersihan file dijadwalkan.')
}, cleanUpInterval);

//
async function loadUsersFromRaw() {
  try {
    const response = await axios.get(RAW_GITHUB_URL);
    return response.data;
  } catch (error) {
    console.error('Gagal memuat users.json dari raw GitHub:', error);
    return null;
  }
}

async function verifyUser(users) {
  return new Promise((resolve) => {
    readline.question('Masukkan User ID: ', (userId) => {
      readline.question('Masukkan Password: ', (password) => {
        const user = users.find(
          (u) => u.id === userId && u.password === password
        );

        if (user) {
          console.log('Verifikasi berhasil!');
          resolve(user); // Kembalikan objek user jika verifikasi berhasil
        } else {
          console.log('Verifikasi gagal. ID atau password salah.');
          resolve(null); // Kembalikan null jika verifikasi gagal
        }
        readline.close();
      });
    });
  });
}

function handleTelegramBot(telegramId, telegramPassword) {
  // Di sini, Anda akan memasukkan logika untuk menangani bot Telegram Anda.
  // Misalnya, inisialisasi bot, mengatur event listener, dan mengirim pesan.

  console.log(`Menjalankan bot Telegram untuk user ID: ${telegramId}`);
  // Contoh placeholder:
  // const bot = new TelegramBot(telegramPassword, { polling: true });
  // bot.on('message', (msg) => {
  //   bot.sendMessage(msg.chat.id, `Halo, ${msg.from.first_name}!`);
  // });
}

async function main() {
  const users = await loadUsersFromRaw();

  if (!users) {
    console.error('Gagal memuat daftar user, bot tidak dijalankan.');
    return;
  }

  const verifiedUser = await verifyUser(users);

  if (!verifiedUser) {
    console.log('Verifikasi gagal, bot tidak dijalankan.');
    return;
  }

  handleTelegramBot(verifiedUser.id, verifiedUser.password); // Menjalankan bot untuk user yang terverifikasi
}

main();

// =========================================================================
// Handle /start command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const sender = msg.from.username;
  const menuText = `
Halo @${sender}, Saya adalah ${botName}

  🤖 Nama Bot: ${botName}
  👤 Pembuat: @${botAuthor}
  ⏱️ Runtime: ${getRuntime()}
  
  /cekid - Cek ID Telegram
  
  ===== MENU PREMIUM =====
  /panel - Info Membuat Panel
  /ramlist - Daftar RAM dan CPU

  ===== MENU DOWNLOADER =====
  /yt <link> - Download Video/Audio YouTube
  /tiktok <link> - Download Video TikTok
  /ig <link> - Download Video Instagram
  
  ===== MENU OWNER =====
  /addowner <user_id> - Tambah Owner
  /delowner <user_id> - Hapus Owner
  /addprem <user_id> - Tambah Premium
  /delprem <user_id> - Hapus Premium
  /listsrv - Daftar Server
  /delsrv <server_id> - Hapus Server
  /createadmin <panel_name>,<telegram_id> - Buat Admin Panel
  /listadmin - Daftar Admin Panel
  /rprtadm - report admin
  =====[HanszIdBot]=====
`;

  const keyboard = {
      reply_markup: {
          inline_keyboard: [
              [{ text: '💾 Ramlist', callback_data: 'ramlist' }],

          ]
      }
  };
  bot.sendMessage(chatId, menuText, keyboard);
});


bot.on('callback_query', (callbackQuery) => {
    if (callbackQuery.data === 'start') {
        const chatId = callbackQuery.message.chat.id;
        const pushname = callbackQuery.message.from.username;
        const menuText = `
Halo @${pushname}, Saya adalah ${botName}

  🤖 Nama Bot: ${botName}
  👤 Pembuat: @${botAuthor}
  ⏱️ Runtime: ${getRuntime()}
  
  /cekid - Cek ID Telegram
  
  ===== MENU PREMIUM =====
  /panel - Info Membuat Panel
  /ramlist - Daftar RAM dan CPU

  ===== MENU DOWNLOADER =====
  /yt <link> - Download Video/Audio YouTube
  /tiktok <link> - Download Video TikTok
  /ig <link> - Download Video Instagram
  
  ===== MENU OWNER =====
  /addowner <user_id> - Tambah Owner
  /delowner <user_id> - Hapus Owner
  /addprem <user_id> - Tambah Premium
  /delprem <user_id> - Hapus Premium
  /listsrv - Daftar Server
  /delsrv <server_id> - Hapus Server
  /createadmin <panel_name>,<telegram_id> - Buat Admin Panel
  /listadmin - Daftar Admin Panel
  =====[HanszIdBot]=====
  
`;
        const message = menuText;
        const keyboard = {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '💾 ʀᴀᴍʟɪsᴛ', callback_data: 'ramlist' }],

                ]
            }
        };
        bot.answerCallbackQuery(callbackQuery.id);
        bot.editMessageText(message, {
            chat_id: chatId,
            message_id: callbackQuery.message.message_id,
            reply_markup: keyboard,
            parse_mode: 'Markdown'
        });
    }
});

// =========================================================================



// Handle /cekid command
bot.onText(/\/cekid/, (msg) => {
  const chatId = msg.chat.id;
  const sender = msg.from.username;
  const id = msg.from.id;
  const text = `
Halo @${sender} 👋
    
👤 Dari: ${id}
  └🙋🏽 Kamu
  
ID Telegram Kamu: ${id}
Nama Kamu: @${sender}
 
Pengembang: @${botAuthor}`;
    const keyboard = {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'RevanOFC', url: 'https://t.me/revanstorejb' }, { text: '-', url: 'https://t.me/revanstorejb' }],
                [{ text: '-', url: 'https://t.me/revanstorejb' }]
            ]
        }
    };
    bot.sendPhoto(chatId, botPhotoUrl, { caption: text, parse_mode: 'Markdown', reply_markup: keyboard });
});

// =========================================================================
// Handle /ramlist command
bot.onText(/\/ramlist/, (msg) => {
  const chatId = msg.chat.id;
  const sender = msg.from.username;
  const text = `
*Halo @${sender} 👋*
    
– RAM dan CPU –
• 1GB - 25% CPU
• 2GB - 50% CPU
• 3GB - 75% CPU
• 4GB - 100% CPU
• 5GB - 200% CPU
• 6GB - 200% CPU
• 7GB - 200% CPU
• 8GB - 200% CPU
• 9GB - 225% CPU
• 10GB - 250% CPU
• UNLI - UNLI% CPU

– @lorenzo_xavier –
`;
  const keyboard = {
      reply_markup: {
          inline_keyboard: [
              [{ text: '🖥️ Buy Panel', url: 'https://t.me/lorenzo_xavier/buy_panel' }, { text: '👤 Buy Admin', url: 'https://t.me/lorenzo_xavier/buyadminp & ptpanel' }],
              [{ text: '🇲🇨 Buy Vps', url: 'https://t.me/lorenzo_xavier/buyvps' }]
          ]
      }
  };
  bot.sendPhoto(chatId, botPhotoUrl, { caption: text, parse_mode: 'Markdown', reply_markup: keyboard });
});

const message = 'message';
const keyboard = {
  reply_markup: {
  inline_keyboard: [
  [{ text: '💾 ʀᴀᴍʟɪsᴛ', callback_data: 'ramlist' }],

            ]
        }
    };
    
// event callback ramlist
bot.on('callback_query', (callbackQuery) => {
  if (callbackQuery.data === 'ramlist') {
    bot.answerCallbackQuery(callbackQuery.id);
    const ramListMessage = "– RAM dan CPU –\n• 1GB - 25% CPU\n• 2GB - 50% CPU\n• 3GB - 75% CPU\n• 4GB - 100% CPU\n• 5GB - 200% CPU\n• 6GB 200% CPU\n• 7GB - 200% CPU\n• 8GB - 200% CPU\n• 9GB 225% CPU\n• 10GB 250% CPU\n• UNLI - UNLI% CPU\n – @lorenzo_xavier –";
    bot.editMessageText(ramListMessage, {
      chat_id: callbackQuery.message.chat.id,
      message_id: callbackQuery.message.message_id,
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Kembali ke Menu Start', callback_data: 'start' }]
        ]
      }
    });
  }
});
// =========================================================================
// Handle add premium
bot.onText(/\/addprem (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const userId = match[1];
  if (msg.from.id.toString() === ownerId) {
    if (!premiumUsers.includes(userId)) {
      premiumUsers.push(userId);
        fs.writeFileSync(premiumFile, JSON.stringify(premiumUsers, null, 2), 'utf-8');
      bot.sendMessage(chatId, `ID ${userId} berhasil ditambahkan ke premium.`);
    } else {
      bot.sendMessage(chatId, `ID ${userId} sudah ada di premium.`);
    }
  } else {
    bot.sendMessage(chatId, 'Perintah ini khusus owner.');
  }
});

// =========================================================================
// Handle del premium
bot.onText(/\/delprem (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const userId = match[1];
  if (msg.from.id.toString() === ownerId) {
    const index = premiumUsers.indexOf(userId);
    if (index !== -1) {
      premiumUsers.splice(index, 1);
        fs.writeFileSync(premiumFile, JSON.stringify(premiumUsers, null, 2), 'utf-8');
      bot.sendMessage(chatId, `ID ${userId} berhasil dihapus dari premium.`);
    } else {
      bot.sendMessage(chatId, `ID ${userId} tidak ada di premium.`);
    }
  } else {
    bot.sendMessage(chatId, 'Perintah ini khusus owner.');
  }
});

// =========================================================================
// Handle add owner
bot.onText(/\/addowner (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const userId = match[1];
  if (msg.from.id.toString() === ownerId) {
    if (!adminUsers.includes(userId)) {
      adminUsers.push(userId);
      fs.writeFileSync(adminFile, JSON.stringify(adminUsers, null, 2), 'utf-8');
      bot.sendMessage(chatId, `ID ${userId} berhasil ditambahkan sebagai owner.`);
    } else {
      bot.sendMessage(chatId, `ID ${userId} sudah menjadi owner.`);
    }
  } else {
    bot.sendMessage(chatId, 'Perintah ini khusus owner.');
  }
});

// =========================================================================
// Handle del owner
bot.onText(/\/delowner (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const userId = match[1];
    if (msg.from.id.toString() === ownerId) {
        const index = adminUsers.indexOf(userId);
        if (index !== -1) {
            adminUsers.splice(index, 1);
            fs.writeFileSync(adminFile, JSON.stringify(adminUsers, null, 2), 'utf-8');
            bot.sendMessage(chatId, `ID ${userId} berhasil dihapus dari owner.`);
        } else {
            bot.sendMessage(chatId, `ID ${userId} bukan owner.`);
        }
    } else {
        bot.sendMessage(chatId, 'Perintah ini khusus owner.');
    }
});

// =========================================================================
// Handle /panel command
bot.onText(/\/panel/, (msg) => {
  const chatId = msg.chat.id;
  const sender = msg.from.username;
  const text = `
*Halo @${sender} 👋*
    
Untuk membuat panel, ketik /RAM username,idtelegram
Contoh: /1gb contohuser,1234567890
Untuk melihat daftar RAM, ketik /ramlist
`;
    const keyboard = {
        reply_markup: {
            inline_keyboard: [
                [{ text: '🖥️ Beli Panel', url: 'https://t.me/lorenzo_xavier/buy_panel' }, { text: '👤 Beli Admin', url: 'https://t.me/lorenzo_xavier/buyadminp & ptpanel' }],
                [{ text: '🇲🇨 Beli Vps', url: 'https://t.me/lorenzo_xavier/buyvps' }]
            ]
        }
    };
  bot.sendPhoto(chatId, botPhotoUrl, { caption: text, parse_mode: 'Markdown', reply_markup: keyboard });
});

// =========================================================================
// Handle panel creation commands
const ramOptions = {
    '1gb': { memory: '1024', cpu: '25', disk: '1024',password:'111' },
    '2gb': { memory: '2048', cpu: '50', disk: '2048',password:'222' },
    '3gb': { memory: '3072', cpu: '75', disk: '6144',password:'333' },
    '4gb': { memory: '4048', cpu: '100', disk: '4048',password:'444' },
    '5gb': { memory: '5048', cpu: '200', disk: '5048',password:'555' },
    '6gb': { memory: '6048', cpu: '200', disk: '6048',password:'666' },
    '7gb': { memory: '7048', cpu: '200', disk: '7048',password:'777' },
    '8gb': { memory: '8048', cpu: '200', disk: '8048',password:'888' },
    '9gb': { memory: '9048', cpu: '225', disk: '9048',password:'999' },
    '10gb': { memory: '10000', cpu: '250', disk: '10000',password:'000' },
    'unli': { memory: '0', cpu: '0', disk: '0',password:'121' },
};

Object.keys(ramOptions).forEach(ram => {
  bot.onText(new RegExp(`\/${ram} (.+)`), async (msg, match) => {
    const chatId = msg.chat.id;
    const text = match[1];
    const isPremium = premiumUsers.includes(String(msg.from.id));
    
    if (!isPremium) {
        bot.sendMessage(chatId, 'Anda bukan pengguna premium. Beli atau minta addprem ke owner.', {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: 'Owner', url: 'https://t.me/lorenzo_xavier' }
                    ]
                ]
            }
        });
        return;
    }

    const t = text.split(',');
    if (t.length < 2) {
      bot.sendMessage(chatId, 'Penggunaan salah, ketik /panel.');
      return;
    }

    const username = t[0];
    const telegramId = t[1];
    const name = `${username}-${ram}`;
    const password = `${username}${ramOptions[ram].password}`;
    const email = `${username}panel@gmail.com`;

    try {
      const response = await fetch(`${domainPanel}/api/application/users`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${panelApiKey}`
        },
        body: JSON.stringify({
          email: email,
          username: username,
          first_name: username,
          last_name: username,
          language: 'en',
          password: password,
        })
      });
      const data = await response.json();
       if (data.errors) {
         if (data.errors[0].meta.rule === 'unique' && data.errors[0].meta.source_field === 'email') {
        bot.sendMessage(chatId, 'Email sudah terdaftar. Gunakan email lain.');
           } else {
            bot.sendMessage(chatId, `Error: ${JSON.stringify(data.errors[0], null, 2)}`);
            }
           return;
      }
      const user = data.attributes;
      const response2 = await fetch(`${domainPanel}/api/application/servers`, {
        method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${panelApiKey}`
          },
        body: JSON.stringify({
          name: name,
          user: user.id,
          egg: parseInt(nodejsEggId),
          docker_image: 'ghcr.io/parkervcp/yolks:nodejs_18',
          startup: 'if [[ -d .git ]] && [[ {{AUTO_UPDATE}} == "1" ]]; then git pull; fi; if [[ ! -z ${NODE_PACKAGES} ]]; then /usr/local/bin/npm install ${NODE_PACKAGES}; fi; if [[ ! -z ${UNNODE_PACKAGES} ]]; then /usr/local/bin/npm uninstall ${UNNODE_PACKAGES}; fi; if [ -f /home/container/package.json ]; then /usr/local/bin/npm install; fi; /usr/local/bin/${CMD_RUN}',
            environment: {
              INST: 'npm',
                USER_UPLOAD: '0',
                AUTO_UPDATE: '0',
                CMD_RUN: 'npm start'
            },
          limits: {
            memory: ramOptions[ram].memory,
            swap: 0,
            disk: ramOptions[ram].disk,
            io: 500,
            cpu: ramOptions[ram].cpu
          },
          feature_limits: {
            databases: 5,
            backups: 5,
            allocations: 1
          },
          deploy: {
            locations: [parseInt(locationId)],
            dedicated_ip: false,
            port_range: []
          }
        })
      });
      const data2 = await response2.json();
      const server = data2.attributes;

      bot.sendMessage(chatId, `Data Panel Anda:
Username: ${username}
Email: ${email}
ID: ${user.id}
RAM: ${server.limits.memory === 0 ? 'Unlimited' : server.limits.memory} MB
Disk: ${server.limits.disk === 0 ? 'Unlimited' : server.limits.disk} MB
CPU: ${server.limits.cpu}%`);

      if (botPhotoUrl) {
         bot.sendPhoto(telegramId, botPhotoUrl, {
            caption: `Paket Untuk @${telegramId}
Login: ${domainPanel}
Email: ${email}
Username: ${user.username}
Password: ${password}
==============================
Jangan lupa ganti password
==============================`
            });
           bot.sendMessage(chatId, 'Data panel dikirim ke ID yang tertera.');
         }
    } catch (error) {
      bot.sendMessage(chatId, `Error: ${error.message}`);
    }
  });
});
// =========================================================================
// Handle /listsrv command
bot.onText(/\/listsrv/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const isAdmin = adminUsers.includes(String(userId));
    if (!isAdmin) {
        bot.sendMessage(chatId, 'Perintah ini khusus owner.', {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: 'Owner', url: 'https://t.me/lorenzo_xavier' }
                    ]
                ]
            }
        });
        return;
    }
  let page = 1;
    try {
        let f = await fetch(`${domainPanel}/api/application/servers?page=${page}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${panelApiKey}`
            }
        });
        let res = await f.json();
        let servers = res.data;
        let messageText = "Daftar Server:\n\n";
        for (let server of servers) {
            let s = server.attributes;

            let f3 = await fetch(`${domainPanel}/api/client/servers/${s.uuid.split('-')[0]}/resources`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${clientApiKey}`
                }
            });
            let data = await f3.json();
            let status = data.attributes ? data.attributes.current_state : s.status;

            messageText += `ID Server: ${s.id}\n`;
            messageText += `Nama Server: ${s.name}\n`;
            messageText += `Status: ${status}\n\n`;
        }
        bot.sendMessage(chatId, messageText);
    } catch (error) {
        console.error(error);
        bot.sendMessage(chatId, 'Terjadi kesalahan, coba lagi.');
    }
});

// =========================================================================
// Handle /delsrv command
bot.onText(/\/delsrv (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const serverId = match[1];
    const isAdmin = adminUsers.includes(String(msg.from.id));
    if (!isAdmin) {
        bot.sendMessage(chatId, 'Perintah ini khusus owner.', {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: 'Owner', url: 'https://t.me/lorenzo_xavier' }
                    ]
                ]
            }
        });
        return;
    }
    if (!serverId) {
        bot.sendMessage(chatId, 'Format salah, format: /delsrv id_server.');
        return;
    }
    try {
        let f = await fetch(`${domainPanel}/api/application/servers/${serverId}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${panelApiKey}`
            }
        });
        let res = f.ok ? { errors: null } : await f.json();
        if (res.errors) {
            bot.sendMessage(chatId, 'Tidak ada server dengan ID tersebut.');
        } else {
            bot.sendMessage(chatId, 'Server berhasil dihapus.');
        }
    } catch (error) {
        console.error(error);
        bot.sendMessage(chatId, 'Terjadi kesalahan tak terduga.');
    }
});

// =========================================================================
// Handle /createadmin command
bot.onText(/\/createadmin (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const isAdmin = adminUsers.includes(String(userId));
    if (!isAdmin) {
        bot.sendMessage(chatId, 'Perintah ini khusus owner.', {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: 'Owner', url: 'https://t.me/lorenzo_xavier' }
                    ]
                ]
            }
        });
        return;
    }
    const commandParams = match[1].split(',');
    const panelName = commandParams[0].trim();
    const telegramId = commandParams[1].trim();
    if (commandParams.length < 2) {
        bot.sendMessage(chatId, 'Format salah!');
        return;
    }
    const password = panelName + "2323";
    try {
        const response = await fetch(`${domainPanel}/api/application/users`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${panelApiKey}`
            },
            body: JSON.stringify({
                email: `${panelName}@gmail.com`,
                username: panelName,
                first_name: panelName,
                last_name: "ADMIN",
                language: "en",
                root_admin: true,
                password: password
            })
        });
        const data = await response.json();
          if (data.errors) {
                bot.sendMessage(chatId, JSON.stringify(data.errors[0], null, 2));
                return;
           }
        const user = data.attributes;
        const userInfo = `
TYPE: Admin Panel
ID: ${user.id}
Username: ${user.username}
Email: ${user.email}
Nama: ${user.first_name} ${user.last_name}
Bahasa : ${user.language}
Admin: ${user.root_admin}
Dibuat : ${user.created_at}
Login: ${domainPanel}
`;
        bot.sendMessage(chatId, userInfo);
        bot.sendMessage(telegramId, `Paket Admin Panel
        Berikut data akun anda ⤵️
Login: ${domainPanel}
Email: ${user.email}
Username: ${panelName}
Password: ${password}
==============================
Jangan Lupa ubah password
Jika ada masalah silahkan segera hubungi saya melalui @donasi_gw_bot
==============================`);
    } catch (error) {
        console.error(error);
        bot.sendMessage(chatId, 'Ada kesalahan, coba lagi.');
    }
});

// =========================================================================
// Handle /listadmin command
bot.onText(/\/listadmin/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const isAdmin = adminUsers.includes(String(userId));
    if (!isAdmin) {
        bot.sendMessage(chatId, 'Perintah ini khusus owner.', {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: 'Owner', url: 'https://t.me/revanstorejb' }
                    ]
                ]
            }
        });
        return;
    }
    let page = '1';
    try {
        let f = await fetch(`${domainPanel}/api/application/users?page=${page}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${panelApiKey}`
            }
        });
        let res = await f.json();
        let users = res.data;
        let messageText = "Daftar Admin Panel:\n\n";
        for (let user of users) {
            let u = user.attributes;
           if (u.root_admin) {
                messageText += `ID: ${u.id} - Status: ${u.attributes?.user?.server_limit === null ? 'Inactive' : 'Active'}\n`;
                messageText += `${u.username}\n`;
                messageText += `${u.first_name} ${u.last_name}\n\n`;
                messageText += 'By BokekAcytyl';
            }
        }
        messageText += `Page: ${res.meta.pagination.current_page}/${res.meta.pagination.total_pages}\n`;
        messageText += `Total Admin Panel: ${res.meta.pagination.count}`;
        const keyboard = [
            [
                { text: 'Kembali', callback_data: JSON.stringify({ action: 'back', page: parseInt(res.meta.pagination.current_page) - 1 }) },
                { text: 'Lanjut', callback_data: JSON.stringify({ action: 'next', page: parseInt(res.meta.pagination.current_page) + 1 }) }
            ]
        ];
        bot.sendMessage(chatId, messageText, {
            reply_markup: {
                inline_keyboard: keyboard
            }
        });

    } catch (error) {
        console.error(error);
        bot.sendMessage(chatId, 'Terjadi kesalahan, coba lagi.');
    }
});

//
bot.onText(/\/yt (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const url = match[1];
  bot.sendMessage(chatId, "Sedang memproses video/audio...");
    const result = await downloadVideo(url);

    if (result) {
        if(result.type === 'video'){
            bot.sendVideo(chatId, result.url).then(() => bot.sendMessage(chatId, "Video berhasil dikirim."));
        }else if(result.type === 'audio'){
          bot.sendAudio(chatId, result.url).then(() => bot.sendMessage(chatId, "Audio berhasil dikirim."))
        }
    } else {
        bot.sendMessage(chatId, "Gagal mendownload video/audio.");
    }

});

bot.onText(/\/tiktok (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const url = match[1];
    bot.sendMessage(chatId, "Sedang memproses video TikTok...");
        const result = await downloadVideo(url);

        if (result) {
            if(result.type === 'video'){
                bot.sendVideo(chatId, result.url).then(() => bot.sendMessage(chatId, "Video berhasil dikirim."));
            }else if(result.type === 'audio'){
              bot.sendAudio(chatId, result.url).then(() => bot.sendMessage(chatId, "Audio berhasil dikirim."))
            }
        } else {
            bot.sendMessage(chatId, "Gagal mendownload video TikTok.");
        }

});

bot.onText(/\/ig (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const url = match[1];
    bot.sendMessage(chatId, "Sedang memproses video Instagram...");
        const result = await downloadVideo(url);

        if (result) {
             if(result.type === 'video'){
                bot.sendVideo(chatId, result.url).then(() => bot.sendMessage(chatId, "Video berhasil dikirim."));
            }else if(result.type === 'audio'){
              bot.sendAudio(chatId, result.url).then(() => bot.sendMessage(chatId, "Audio berhasil dikirim."))
            }
        } else {
            bot.sendMessage(chatId, "Gagal mendownload video Instagram.");
        }

});

bot.on('polling_error', (error) => {
    console.error(`Terjadi error polling:`, error);
});

console.log(`🤖 ${botName} berjalan... jangan lupa donasinya`);


