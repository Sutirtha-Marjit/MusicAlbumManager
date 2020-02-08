import { Component, OnInit , Input, Output, EventEmitter, OnChanges} from '@angular/core';

@Component({
  selector: 'musicapp-image-upload-control',
  templateUrl: './image-upload-control.component.html',
  styleUrls: ['./image-upload-control.component.less']
})
export class ImageUploadControlComponent implements OnInit, OnChanges {

  @Input() currentImaageSource=null;
  editedImageData=null;
  constructor() { 

  }

  ngOnChanges(changes){
    
  }

  showData(){
    console.log(this.editedImageData);
  }

  ngOnInit() {
    
  }

}
