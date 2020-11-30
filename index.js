var express = require('express')
var path = require('path');

var bodyParser=require('body-parser');
const fs = require('fs');
const { isPrimitive } = require('util');

var app = express()




app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));

app.use(express.static(path.join(__dirname, 'public')));

const PORT = 3000;
// respond with "hello world" when a GET request is made to the homepage
app.get("/",function(req,res){
})


// POST method route
app.post('/saveimage.php', function (req, res) {
//  console.log(req.body, "is req");

  const imageBitmap = req.body.imageData;
  const fileSavePath=req.body.filePath;
 //   console.log(fileSavePath,"file save path");
//  console.log(imageBitmap!=null," that image exists");
  const count = req.body.count;
  const name = `.${fileSavePath}/IMAGE_${count}.png`;
  var base64Data = imageBitmap.replace(/^data:image\/png;base64,/, "");

 fs.writeFile(name, base64Data, 'base64', function(err) {
    console.log(err);
  });
  
  res.send(JSON.stringify({error:false,message:"test test"}));
})
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));




