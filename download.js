const fetch = require('node-fetch');

// Fungsi untuk mengunduh video dari URL
async function downloadVideo(url) {
  try {
      const response = await fetch(`https://api.onlinevideoconverter.pro/api/convert?url=${url}`);
      const data = await response.json();

      if (data && data.files && data.files.length > 0) {
          const video = data.files.find(file => file.format === 'mp4' && file.quality === '720p');
           const audio = data.files.find(file => file.format === 'mp3');
          if(video){
              return {type: 'video', url: video.url}
          }else if (audio){
              return { type: 'audio', url: audio.url }
          }else{
            return null
          }
        } else {
          return null;
        }
      } catch (error) {
        console.error('Error downloading video:', error);
        return null;
      }
    }

module.exports = {
    downloadVideo,
};