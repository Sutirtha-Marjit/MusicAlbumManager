const port = process.env.port || 3002;
const atob = require('atob');
const express = require('express');
const NodeID3 = require('node-id3');
const https = require('https');
const bodyParser = require('body-parser');
const app = express();
const apiRoot = '/v1/api/';
const getBlankResultObject = require('./engine/basicresult');
const DirectoryView = require('./engine/directoryview');
const TagLibManagement = require('./engine/taglib.update');
const fs = require('fs');
const wallPaperURL = 'https://hips.hearstapps.com/rbk.h-cdn.co/assets/cm/14/51/548fc40f14fc2_-_rbk-50-easy-ways-to-feel-sexy-listening-to-music-s2.jpg';

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('./webapp'));

 app.use((req,res,next)=>{
     res.setHeader('Access-Control-Allow-Origin',"*");
     res.setHeader('Access-Control-Allow-Headers',"content-type");
     res.setHeader('Access-Control-Allow-Request-Method',"OPTIONS ,GET, POST, UPDATE, DELETE, PUT");
     
     next();
 });



app.get(`${apiRoot}`,(req,res)=>{
    const r = getBlankResultObject();
    r.meta.status = true;
    r.data = {result:'You reached at the root of api'};
    res.json(r);
});

app.get(`${apiRoot}audio/request/:audiopathEncripted`,(req,res)=>{
    const audioPath = atob(req.params.audiopathEncripted);
    res.sendFile(audioPath);
});

app.get(`${apiRoot}photo/request/:imagepathEncripted`,(req,res)=>{
    const audioPath = atob(req.params.imagepathEncripted);
    res.sendFile(audioPath);
});

app.get(`${apiRoot}wallpaper/main`,(req,res)=>{
    const dataArr=[];
    https.get(wallPaperURL,(imageMessage)=>{
        console.log(imageMessage.headers);
        imageMessage.on('data',(chunk)=>{
            dataArr.push(chunk);
        }).on('end',()=>{
            const buffer = Buffer.concat(dataArr);
            res.setHeader('content-type',imageMessage.headers['content-type']);
            res.send(buffer);
        })
    });
});


app.get(`${apiRoot}photo/frombuffer/request/:imagepathEncripted`,(req,res)=>{
    const imagePath = atob(req.params.imagepathEncripted);
    TagLibManagement.getAlbumArt(imagePath).then((artData)=>{
        res.setHeader('Content-Type',`image/${artData.mime}`);
        res.send(artData.imageBuffer);
    }).catch((e)=>{
        const url = `${__dirname}/default.image.png`;
        res.sendFile(url);
    })
});

app.get(`${apiRoot}dir/analysis/:dirpathEncripted`,(req,res)=>{
    const r = getBlankResultObject();
    r.meta.status = true;
    const dirPath = atob(req.params.dirpathEncripted);
    fs.readdir(dirPath,(error,dirStatus)=>{
        if(!error){
            const refinedData= dirStatus.filter((f)=>{
                return f.indexOf('.mp3')>-1;
            })
            r.data = {result:{dir:dirPath,files:refinedData}};
            res.json(r);
        }else{
            r.data = {error:true,details:error};
            res.json(r);
        }
    });
});

app.post(`${apiRoot}get/tags`,(req,res)=>{
    let retrievedFilename=null;
    const r = getBlankResultObject();
    
    if(req.body.fileName){
        try{
            retrievedFilename = atob(req.body.fileName);  
            console.log(retrievedFilename);
            TagLibManagement.getCurrentTags(retrievedFilename).then((tags)=>{
                r.data = tags;
                res.json(r);
            }).catch((e)=>{
                res.status(500);
                r.data = {error:true, details:e};  
                res.json(r);
            });
            
        }catch(e){
            res.status(500);
            r.data = {error:true, details:'Wrong encryption'}; 
            res.json(r);          
        }        
    }else{
        res.status(500);
        r.data = {error:true, details:'no file name'}; 
        res.json(r); 
    }    
});

app.post(`${apiRoot}update/tags/:mode`,(req,res)=>{  
    
    switch(req.params.mode){

        case 'batch':
            TagLibManagement.updateTagsBatch(req.body);
            res.json({});
        break;   

        default:
            TagLibManagement.updateTags(req.body.path,req.body).then((statusData)=>{
                res.json(statusData);
            }).catch((errorData)=>{
                res.statusCode = 500;
                res.json(errorData);
            }); 
        break;    
    }
       
});

app.get('/test',(req,res)=>{
    const url = `${__dirname}/default.image.png`;
    res.sendFile(url);
});

app.get(`${apiRoot}directory/info`,(req,res)=>{
    DirectoryView.getView('C:\\Users\\Sutirtha\\Pictures',['.jpg']).then((data)=>{
        res.json(data);
    }).catch((erroData)=>{
        res.statusCode = 500;
        res.json(erroData);

    })
});

app.listen(port,()=>{
    console.clear();
    console.log(`Application started at ${port}`);
});

