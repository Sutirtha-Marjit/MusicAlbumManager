import { Component, OnInit , Output, EventEmitter} from '@angular/core';
import { GeneralRequestsService } from '../../services/general-requests.service';
import { Mp3FileBasicData} from '../../datatype/types';


@Component({
  selector: 'musicapp-file-list-window',
  templateUrl: './file-list-window.component.html',
  styleUrls: ['./file-list-window.component.less']
})
export class FileListWindowComponent implements OnInit {


  dirPath='';
  mp3list:Array<Mp3FileBasicData>=[];
  listForNext:Array<Mp3FileBasicData>=[];
  ranID = window['ranID'];
  @Output() listSelectionDone = new EventEmitter<Array<Mp3FileBasicData>>();
  constructor(private gs:GeneralRequestsService) { }

  ngOnInit() {
    
  }

  goNext(){   
    
    this.listForNext.forEach((obj)=>{
      // if(this.dirPath.charAt(this.dirPath.length-1) === '/'){
      //   this.dirPath = this.dirPath.substr(0,this.dirPath.length-2);
      // }
      obj.absolutePath = `${this.dirPath}/${obj.name}`;
    })
    this.listSelectionDone.emit(this.listForNext);
  }

  selectionChangeReflect(e){
    
    setTimeout(()=>{
      this.listForNext =  this.mp3list.filter((file)=>{
        return file.selected;
      });
    },200);
    
  }

  deselectAll(){
    this.mp3list.forEach((file)=>{
      file.selected=false;
    });
    this.selectionChangeReflect({});
  }

  selectAll(){
    this.mp3list.forEach((file)=>{
      file.selected=true;
    });
    this.selectionChangeReflect({});
  }

  getDirectoryDetails(){
    this.mp3list = null;
    this.gs.getDirectoryDetails(this.dirPath).subscribe((feed:any)=>{
      this.gs.recentlyUsedDirectories(this.dirPath);
      if(feed && feed.meta.status && feed.data.result.files.length>0){
        this.mp3list = [];
        feed.data.result.files.forEach((file,index)=>{
          this.mp3list.push({
            id:index,
            name:file,
            selected:false
          });
        });         
        
      }
    });
  }

}
