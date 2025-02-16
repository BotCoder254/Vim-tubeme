const express = require('express');
const cors = require('cors');
const ytdl = require('@distube/ytdl-core');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());

const cleanFileName = (fileName) => {
  return fileName
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .toLowerCase();
};

// Utility function to clean up watch.html files
const cleanupWatchFiles = () => {
  const directory = __dirname;
  const files = fs.readdirSync(directory);
  
  files.forEach(file => {
    if (file.endsWith('-watch.html')) {
      try {
        fs.unlinkSync(path.join(directory, file));
        console.log(`Cleaned up: ${file}`);
      } catch (err) {
        console.error(`Error deleting ${file}:`, err);
      }
    }
  });
};

// Clean up any existing watch.html files on server start
cleanupWatchFiles();

app.get('/video/download', async (req, res) => {
  try {
    const { videoId, format } = req.query;
    if (!videoId) {
      return res.status(400).json({ error: 'Video ID is required' });
    }

    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    
    if (!ytdl.validateURL(videoUrl)) {
      return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    let info;
    try {
      info = await ytdl.getInfo(videoUrl, {
        lang: 'en',
        requestOptions: {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
            'Accept': '*/*',
            'Accept-Language': 'en-US,en;q=0.9',
            'Connection': 'keep-alive'
          }
        }
      });
    } catch (infoError) {
      console.error('Info error:', infoError);
      // Clean up watch files after error
      cleanupWatchFiles();
      return res.status(500).json({ 
        error: 'Failed to get video info',
        details: infoError.message 
      });
    }

    const videoTitle = cleanFileName(info.videoDetails.title);
    
    if (format === 'audio') {
      res.header('Content-Type', 'audio/mpeg');
      res.header('Content-Disposition', `attachment; filename="${videoTitle}.mp3"`);
      
      const audioFormats = ytdl.filterFormats(info.formats, 'audioonly');
      if (!audioFormats.length) {
        cleanupWatchFiles();
        throw new Error('No audio formats available');
      }

      const bestAudio = audioFormats.sort((a, b) => b.audioBitrate - a.audioBitrate)[0];
      
      if (bestAudio.contentLength) {
        res.header('Content-Length', bestAudio.contentLength);
      }

      const stream = ytdl.downloadFromInfo(info, {
        format: bestAudio,
        filter: 'audioonly',
        quality: 'highestaudio',
        requestOptions: {
          maxRetries: 3,
          backoff: { delay: 1000, maxDelay: 60000 },
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
            'Accept': '*/*',
            'Accept-Language': 'en-US,en;q=0.9',
            'Connection': 'keep-alive'
          }
        }
      });

      stream.on('error', (error) => {
        console.error('Stream error:', error);
        cleanupWatchFiles();
        if (!res.headersSent) {
          res.status(500).json({ error: 'Download stream error', details: error.message });
        }
      });

      let downloadedBytes = 0;
      stream.on('data', (chunk) => {
        downloadedBytes += chunk.length;
        if (bestAudio.contentLength) {
          const progress = (downloadedBytes / bestAudio.contentLength) * 100;
        }
      });

      stream.on('end', () => {
        cleanupWatchFiles();
      });

      stream.pipe(res);

    } else {
      res.header('Content-Type', 'video/mp4');
      res.header('Content-Disposition', `attachment; filename="${videoTitle}.mp4"`);
      
      const videoFormats = ytdl.filterFormats(info.formats, format => {
        return format.hasVideo && format.hasAudio && format.container === 'mp4';
      });

      if (!videoFormats.length) {
        cleanupWatchFiles();
        throw new Error('No suitable video formats available');
      }

      const bestVideo = videoFormats.sort((a, b) => {
        const aRes = a.height || 0;
        const bRes = b.height || 0;
        return bRes - aRes;
      })[0];

      if (bestVideo.contentLength) {
        res.header('Content-Length', bestVideo.contentLength);
      }

      const stream = ytdl.downloadFromInfo(info, {
        format: bestVideo,
        quality: 'highest',
        requestOptions: {
          maxRetries: 3,
          backoff: { delay: 1000, maxDelay: 60000 },
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
            'Accept': '*/*',
            'Accept-Language': 'en-US,en;q=0.9',
            'Connection': 'keep-alive'
          }
        }
      });

      stream.on('error', (error) => {
        console.error('Stream error:', error);
        cleanupWatchFiles();
        if (!res.headersSent) {
          res.status(500).json({ error: 'Download stream error', details: error.message });
        }
      });

      let downloadedBytes = 0;
      stream.on('data', (chunk) => {
        downloadedBytes += chunk.length;
        if (bestVideo.contentLength) {
          const progress = (downloadedBytes / bestVideo.contentLength) * 100;
        }
      });

      stream.on('end', () => {
        cleanupWatchFiles();
      });

      stream.pipe(res);
    }

  } catch (error) {
    console.error('Download error:', error);
    cleanupWatchFiles();
    if (!res.headersSent) {
      res.status(500).json({ 
        error: 'Failed to download video',
        details: error.message 
      });
    }
  }
});

app.get('/video/info', async (req, res) => {
  try {
    const { videoId } = req.query;
    if (!videoId) {
      return res.status(400).json({ error: 'Video ID is required' });
    }

    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const info = await ytdl.getInfo(videoUrl, {
      lang: 'en',
      requestOptions: {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
          'Accept': '*/*',
          'Accept-Language': 'en-US,en;q=0.9',
          'Connection': 'keep-alive'
        }
      }
    });
    
    const formats = {
      audio: ytdl.filterFormats(info.formats, 'audioonly').length > 0,
      video: ytdl.filterFormats(info.formats, format => format.hasVideo && format.hasAudio).length > 0
    };

    // Clean up watch files after getting info
    cleanupWatchFiles();

    res.json({
      title: info.videoDetails.title,
      length: info.videoDetails.lengthSeconds,
      author: info.videoDetails.author.name,
      available: true,
      formats: formats
    });
  } catch (error) {
    console.error('Info error:', error);
    cleanupWatchFiles();
    res.status(500).json({ 
      error: 'Failed to get video info',
      details: error.message,
      available: false
    });
  }
});

// Add new endpoints for home, trending, and search
// app.get('/home', async (req, res) => {
//   try {
//     // Your home feed logic here
//     const data = {
//       data: [], // Your video data array
//       continuation: null // Optional continuation token
//     };
//     res.json(data);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// app.get('/tranding', async (req, res) => {
//   try {
//     // Your trending videos logic here
//     const data = {
//       data: [], // Your trending videos array
//       continuation: null // Optional continuation token
//     };
//     res.json(data);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// app.get('/search', async (req, res) => {
//   try {
//     const { query, token } = req.query;
//     if (!query) {
//       return res.status(400).json({ error: 'Search query is required' });
//     }

//     // Your search logic here
//     const data = {
//       data: [], // Your search results array
//       continuation: null // Optional continuation token
//     };
//     res.json(data);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 