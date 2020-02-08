import { Component } from '@angular/core';
import { FileListWindowComponent } from './components/file-list-window/file-list-window.component';
import { TagEditorWindowComponent } from './components/tag-editor-window/tag-editor-window.component';
import { GeneralRequestsService } from './services/general-requests.service';
import { ActivatedRoute, Router  } from '@angular/router';

@Component({
  selector: 'musicapp-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  wrapStyleObj={};
  title = 'Mp3taglibFrontEnd';
  currentSelectedList = [];
  constructor(private router:Router, private gs:GeneralRequestsService){

    this.wrapStyleObj = {
      backgroundImage:this.gs.getWallpaper()
    };
  }

  onActivate(landedComp:Component){
    
    if(landedComp instanceof FileListWindowComponent){
      const comp = <FileListWindowComponent>landedComp;
      comp.listSelectionDone.subscribe((list)=>{
        this.currentSelectedList = list;
        this.router.navigateByUrl('edit');
      });
    }

    if(landedComp instanceof TagEditorWindowComponent){
      const comp = <TagEditorWindowComponent>landedComp;
      comp.currentSelectedList = this.currentSelectedList;
    }

  }

}
