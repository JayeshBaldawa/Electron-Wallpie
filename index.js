const axios = require('axios')
const download = require('image-downloader')
const wallpaper = require('wallpaper');
const os = require("os");
const fs = require('fs');

const tempDir = os.tmpdir();
const topics = ["Road","Nature","Gaming","Black","Gadget","Forest","Beach","quotes","Sea","Abstract","Sports","Vehicles","waterfall"];
var diffDays;
try {
  if (fs.existsSync(tempDir+'//wallpie.json')) {
    var config = require(tempDir+'//wallpie.json');
    diffDays = parseInt((new Date().getTime() - config.date) / (1000 * 60 * 60 * 24));
    console.log(config.date)
    config.date = new Date().getTime()
    fs.writeFileSync(tempDir+'//wallpie.json',JSON.stringify(config));
    console.log(config.date);
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
  "https://api.pexels.com/v1/search?query="+topics[ Math.floor(Math.random() * 9)]+"&per_page=80",
  {headers: {
      "Authorization" : "563492ad6f91700001000001b979afd1876e4e7e981ed8254ecd4002"
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
      console.log('Saved to', filename) 
      wallpaper.set(filename);
      showNotification();
    })
    .catch((err) => console.error(err))
}

showNotification = () =>
{
  if(Notification.permission=="granted")
    {
     const notification = new Notification("Wallpie's Update",{
       body:"Your wallpaper just got updated",
     });
    }
}