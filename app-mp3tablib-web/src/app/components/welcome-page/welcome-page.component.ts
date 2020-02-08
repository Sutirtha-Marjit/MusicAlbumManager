import { Component, OnInit } from '@angular/core';
import { GeneralRequestsService } from '../../services/general-requests.service';

@Component({
  selector: 'musicapp-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.less']
})
export class WelcomePageComponent implements OnInit {

  constructor(private gs:GeneralRequestsService) { }

  ngOnInit() {
  }
  
  getWallper(){
    return this.gs.getWallpaper();
  }
}
