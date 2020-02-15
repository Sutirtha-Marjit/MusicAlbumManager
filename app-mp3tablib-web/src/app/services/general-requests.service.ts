import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class GeneralRequestsService {

  private sessionName = 'musicappSession';
  constructor(private $http:HttpClient) { 

  }

  public getDrives(){
    return this.$http.get(`${this.getLocalAPIRoot()}/drives`);
  }

  public recentlyUsedDirectories(val=null){
    let result:Array<any> = null;
    if(val){
      result=JSON.parse(window.localStorage.getItem(this.sessionName));
      if(result){
        if(!result.includes(val)){
          result.push(val);
        }
        
      }else{
        result=[];
        result.push(val);
      }
      
      window.localStorage.setItem(this.sessionName,JSON.stringify(result));
      return result;
    }else{
      result = JSON.parse(window.localStorage.getItem(this.sessionName));
      return result;
    }
    
  }

  public getWallpaper(){
    return `${this.getLocalAPIRoot()}/wallpaper/main`;
  }

  private getLocalAPIRoot(){
    return window.sessionStorage.getItem('localApiRoot') || 'http://localhost:3002/v1/api';
    
  }

  public requestAudio(path:string){
    if(path){
      const pathTorequest = window.btoa(path);
      const url = `${this.getLocalAPIRoot()}/audio/request/${pathTorequest}`; 
      return url;
    }
  }

  requestImageAbsolute(path:string){

    const url = `${this.getLocalAPIRoot()}/photo/request/${btoa(path)}`;
    return url;
    
  }

  public requestImage(path:string){
    if(path){
      const pathTorequest = window.btoa(path);
      const url = `${this.getLocalAPIRoot()}/photo/frombuffer/request/${pathTorequest}`; 
      
      return url;
    }
  }

  public getImageList(){
    return this.$http.get(`${this.getLocalAPIRoot()}/directory/image/list`);
  }

  public getDirectoryDetails(path:string){
    if(path){
      const pathTorequest = window.btoa(path);
      const url = `${this.getLocalAPIRoot()}/dir/analysis/${pathTorequest}`;
      return this.$http.get(url,{});
    }    
  }

  public getTagDetails(path:string){
    if(path){
      const pathTorequest = window.btoa(path);      
      const url = `${this.getLocalAPIRoot()}/get/tags`;
      return this.$http.post(url,{fileName:pathTorequest});
    }
  }

  public updateTags(dataToPost:any,mode='single'){
    const url = `${this.getLocalAPIRoot()}/update/tags/${mode}`;
    return this.$http.post(url,dataToPost);
  }

  public updateAlbumArt(dataToPost){
    return this.$http.post( `${this.getLocalAPIRoot()}/update/albumart`,dataToPost);
  }

}
