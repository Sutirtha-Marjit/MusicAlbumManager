const NodeID3 = require('node-id3');
const fs = require('fs');

class TagLibManagement {
    constructor() { }
    static getCurrentTags(fileName) {
        const pr = new Promise((resolve,reject)=>{
            const fileBuffer = fs.readFileSync(fileName)
            try{
                const tagsData = NodeID3.getTagsFromBuffer(fileBuffer);
                if(tagsData){
                    resolve(tagsData);
                } 
            }catch(e){
               reject(e); 
            }
            
        })
        
        return pr;
    }

    static updateAlbumArtBatch(albumartFile,listOfFilePaths,callback){
       let count=0;
       const albumartData = fs.readFileSync(albumartFile);
       const onComplete = ()=>{
        count++;
        console.log(`albumart updated ${Math.ceil((count/listOfFilePaths.length)*100)}`);
        if(count===listOfFilePaths.length){
            console.log('Albumart batch update complete');
            callback({});
        }
       };       

       listOfFilePaths.forEach((path)=>{
          this.updateAlbumArt(albumartFile,path,albumartData).then(onComplete).catch(onComplete);
       });

    }

    static updateAlbumArt(albumartFile,musicFile,bufferData=null){

        let albumartData = bufferData ? bufferData : fs.readFileSync(albumartFile);

        const pr = new Promise((resolve,reject)=>{
            const updatedTags = {
                image:{
                    mime:'jpg',
                    type:{
                        id:3,
                        name:'front cover'
                    },
                    imageBuffer:albumartData    
                }
            };
            const success = NodeID3.update(updatedTags,musicFile);
            success ? resolve(updatedTags) : reject(updatedTags);
        });
        
        return pr;
    }

    static updateTagsBatch(userProvidedBatchTags){

        const statusArr=[];
        let count=0;
        const updateStatus = (id,title,status)=>{
            statusArr[id]={id,title,status};
            count++;
            console.log(`${Math.ceil((count/userProvidedBatchTags.length)*100)}% done`);
            if(count===userProvidedBatchTags.length){
                console.log('Batch Operation complete');
                return true;
            }
        };
        userProvidedBatchTags.forEach((el,i)=>{
            const id = i;
            if(el.path){
              this.updateTags(el.path,el).then(()=>{
                updateStatus(id,el.title,true);
              }).catch(()=>{
                updateStatus(id,el.title,false);
              })
            }
        });

        console.log(statusArr);
    }

    static updateTags(fileName, userProvidedTags) {

        const {title,album,performerInfo,trackNumber} = userProvidedTags;
        const updatedTags = {title,album,performerInfo,trackNumber};
        return new Promise((resolve,reject)=>{
            
            fs.stat(fileName,(err, stats)=>{
                if(!err){
                  const success = NodeID3.update(updatedTags,fileName);
                  if(success){
                    resolve({success});
                  }else{
                    reject({success});
                  }  
                }else{
                    reject({success}); 
                }                
            });
            
            
        });        
    }

    static getAlbumArt(fileName){
        const pr = new Promise((resolve,reject)=>{
            TagLibManagement.getCurrentTags(fileName).then((dataTags)=>{
                if(dataTags.image && dataTags.image.imageBuffer){
                    const buffer = Buffer.from(dataTags.image.imageBuffer);                
                    resolve({imageBuffer:buffer,mime:dataTags.image.mime});
                }else{
                    reject({}); 
                }
                
            }).catch((e)=>{
                reject(e);
            });
        });
        
        return pr;
    }
}

module.exports = TagLibManagement;

