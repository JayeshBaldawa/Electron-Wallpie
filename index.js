const axios = require('axios')
const download = require('image-downloader')
const wallpaper = require('wallpaper');
const os = require("os");
const fs = require('fs');
const {ipcRenderer} = require('electron');
var internetAvailable = require("internet-available");


const tempDir = os.tmpdir();
let topics = [];
var diffDays;

internetAvailable({
  // Provide maximum execution time for the verification
  timeout: 1000,
  // If it tries 5 times and it fails, then it will throw no internet
  retries: 5
}).then(() => {
  try {
    if (fs.existsSync(tempDir+'//wallpie.json')) {
      var config = require(tempDir+'//wallpie.json');
      topics = config.categories1;
      console.log(topics)
      diffDays = parseInt((new Date().getTime() - config.date) / (1000 * 60 * 60 * 24));
      if(diffDays == 0)
      {
      const JsonDay = new Date(config.date);
      const sameDateGetter = JsonDay.getDate();
      const currentDay = new Date();
      const currentDateGetter = currentDay.getDate();
      if(currentDateGetter - sameDateGetter > 0)
      {
        diffDays =1;
      }
      }
    }
    else {
      const data = {
        date : new Date().getTime()
      }
      fs.writeFileSync(tempDir+'//wallpie.json',JSON.stringify(data));
      diffDays=1;
    }
  } catch(err) {
    console.error(err)
  }
  
  if(diffDays > 0)
  {
  axios.get(
    "https://api.pexels.com/v1/search?query="+topics[ Math.floor(Math.random() * topics.length)]+"&per_page=80",
    {headers: {
        "Authorization" : "YOUR_PEXELS_API_KEY"
      }
    }
  )
  .then((response) => {
      var response = response.data.photos[Math.floor(Math.random() * 80)].src.original;
      console.log(response);
      downloader(response); 
    },
    (error) => {
      console.log(error);
    }
  );
  }
  downloader = (yurl) => {
    options = {
      url: yurl,
      dest: tempDir+'\\t1.jpeg'     
    }
    
    download.image(options)
      .then(({ filename }) => {
        wallpaper.set(filename);
        config.date = new Date().getTime();
        fs.writeFileSync(tempDir+'//wallpie.json',JSON.stringify(config));
        showNotification();
      })
      .catch((err) => console.error(err))
  }
}).catch(() => {
  alert("No internet - This app requires internet connection to run");
  setTimeout(function(){ ipcRenderer.send('close-me-1'); }, 1000);
});



showNotification = () =>
{
  if(Notification.permission=="granted")
    {
     const notification = new Notification("Wallpie's Update",{
       body:"Your wallpaper just got updated",
     });
    }
}

function resetCategory()
{
  fs.unlink(tempDir+'//wallpie.json', (err) => {
    if (err) {
        throw err;
    }
    alert("Please restart the app again to see effects. App will be automatically shutdown")
    
    setTimeout(function(){ ipcRenderer.send('close-me-1'); }, 1000);
});
}