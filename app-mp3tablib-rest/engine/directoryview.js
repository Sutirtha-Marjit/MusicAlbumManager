const fs = require('fs');
const getBasicResultObj = require('./basicresult');
class DirectoryView{

    static getView(dirPath,filterExtensions=[]){
        const outputArr=[];
        const obj = getBasicResultObj();
        const pr = new Promise((resolve,reject)=>{
            fs.readdir(dirPath,(err,files)=>{
                if(!err){
                    obj.meta.status = true; 
                    const fArr = files.forEach((fObj)=>{
                        const crPath = `${dirPath}\\${fObj}`;
                        const stats = fs.lstatSync(crPath);
                        if(stats.isFile() && filterExtensions.length>0){
                           console.log(stats); 
                           const got = filterExtensions.find((ext)=>{
                                return fObj.indexOf(ext)!==-1
                            });

                            if(got){
                                outputArr.push({
                                    name: crPath,
                                    dir: stats.isDirectory(),
                                    size: stats.size,
                                    creation: stats.ctime
                                });
                            }
                            
                        }else{
                            outputArr.push({
                                name: crPath,
                                dir: stats.isDirectory(),
                                size: stats.size,
                                creation: stats.ctime
                            });
                        }
                        
                        
                    });
                    obj.data = outputArr;
                    resolve(obj);
                }else{
                    obj.meta.status = false;
                    obj.meta.error = err;
                    reject(obj);
                } 
             });
        });

        return pr;
        
    }

}

module.exports = DirectoryView;