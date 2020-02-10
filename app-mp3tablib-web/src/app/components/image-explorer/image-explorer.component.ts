import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { GeneralRequestsService } from '../../services/general-requests.service';


@Component({
  selector: 'musicapp-image-explorer',
  templateUrl: './image-explorer.component.html',
  styleUrls: ['./image-explorer.component.less']
})
export class ImageExplorerComponent implements OnInit {

 
  @Input() imageDirPath=null;
  @Output() close = new EventEmitter<any>();
  imageList=[];
  constructor(private gs:GeneralRequestsService) { 

  }

  onClose(){
    this.close.emit({});
  }

  getImagePath(path){
    return this.gs.requestImageAbsolute(path);
  }

  ngOnInit() {
    if(this.imageDirPath){
      this.gs.getImageList().subscribe((listData:any)=>{
        this.imageList = listData.data;
      },(errorData)=>{

      })
    }
    
    
  }

}
