const categories = []
const os = require("os");
const fs = require('fs');
const {ipcRenderer} = require('electron');

const tempDir = os.tmpdir();

function goNext()
{
    if(categories.length >= 3)
    {
        const data = {
            date : "",
            categories1 : categories 
          }
          fs.writeFileSync(tempDir+'//wallpie.json',JSON.stringify(data));
          ipcRenderer.send('close-me')
          
    }
    else
    {
        document.getElementById("11").innerHTML = "Please select atleast 3 category"
    }
}

function selectedId(category,id)
{
    if(document.getElementById(id).style.border != "none")
    {
        document.getElementById(id).style.border = "none";
        const index = categories.indexOf(category);
        if (index > -1) {
        categories.splice(index, 1);
        }
        if(categories.length >= 3)
        {
            document.getElementById("10").style.border = "solid 3px green";
        }
        else
        {
            document.getElementById("10").style.border = "solid 3px red";
        }
    }
    else
    {
        document.getElementById(id).style.border = "solid #333652";
        categories.push(category);
        if(categories.length >= 3)
        {
            document.getElementById("10").style.border = "solid 3px green";
        }
        else
        {
            document.getElementById("10").style.border = "solid 3px red";
        }
    }
}