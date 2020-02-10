import { Component, OnInit, DoCheck, OnChanges, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Mp3FileBasicData } from '../../datatype/types';
import { Router } from '@angular/router';
import { GeneralRequestsService } from '../../services/general-requests.service';

@Component({
  selector: 'musicapp-tag-editor-window',
  templateUrl: './tag-editor-window.component.html',
  styleUrls: ['./tag-editor-window.component.less']
})
export class TagEditorWindowComponent implements OnInit, DoCheck, OnChanges {

  progress = [];
  currentAudio = null;
  imageExplorerOpen = false;
  batchUpdate = { artist: '', album: '' };
  @Input() currentSelectedList: Array<Mp3FileBasicData> = [];
  imageDirPath = 'C:\\Users\\Sutirtha\\Pictures';
  constructor(private gs: GeneralRequestsService, private sanitizer: DomSanitizer, private router: Router) { }

  public requestAudio(url) {
    this.currentAudio = this.gs.requestAudio(url);
  }

  public requestImage(url) {
    return this.gs.requestImage(url);
  }

  public updateBatch(mode) {
    switch (mode) {
      case 'artist':
        this.currentSelectedList.forEach((el) => {
          el.artist = this.batchUpdate.artist;
          el.tags.performerInfo = el.artist;
        })
        break;

      case 'album':
        this.currentSelectedList.forEach((el) => {
          el.album = this.batchUpdate.album;
          el.tags.album = el.album;
        })
        break;
    }
  }

  onModalClose() {
    this.imageExplorerOpen = false;
  }

  onImageSelector(objID) {
    this.imageExplorerOpen = true;
  }

  saveAll() {
    const arr = this.currentSelectedList.map((item) => {
      return {
        path: item.absolutePath,
        title: item.tags.title,
        album: item.tags.album,
        performerInfo: item.tags.performerInfo,
        trackNumber: item.tags.trackNumber
      };
    });

    this.gs.updateTags(arr, 'batch').subscribe((data) => {
      console.log(data);
    }, (erroData) => {
      console.log(erroData);
    });
  }

  save(id) {

    if (`${id}`) {

      const item = this.currentSelectedList.find((el) => {
        return el.id === id;
      });

      const t = {
        path: item.absolutePath,
        title: item.tags.title,
        album: item.tags.album,
        performerInfo: item.tags.performerInfo,
        trackNumber: item.tags.trackNumber
      };

      this.gs.updateTags(t).subscribe((data) => {

      }, () => {

      });

    }
  }

  getTagDetails(path: string, id = 0) {
    this.progress[id] = 'progress';
    this.gs.getTagDetails(path).subscribe((tagFeed: any) => {
      setTimeout(() => {
        this.currentSelectedList[id].tags = tagFeed.data;
        if (!this.currentSelectedList[id].tags.title) {
          this.currentSelectedList[id].title = this.currentSelectedList[id].name.split('.mp3')[0];
          this.currentSelectedList[id].tags.title = this.currentSelectedList[id].title;
        }
        if (!this.currentSelectedList[id].tags.album) {
          this.currentSelectedList[id].album = ' ';
          this.currentSelectedList[id].tags.album = ' ';
        }
        if (!this.currentSelectedList[id].tags.performerInfo) {
          this.currentSelectedList[id].artist = ' ';
          this.currentSelectedList[id].tags.performerInfo = ' ';
        }
        this.progress[id] = 'done';
      }, 560);

    })
  }

  arrangeTracks() {
    console.log(this.currentSelectedList);
    this.currentSelectedList = this.currentSelectedList.sort((a, b) => {
      return a.tags.trackNumber - b.tags.trackNumber;
    });
    this.currentSelectedList.forEach((f, i) => {
      f.id = i;
    })
  }

  loadAll() {
    this.currentSelectedList.forEach((file) => {
      this.getTagDetails(file.absolutePath, file.id);
    });
  }

  ngOnInit() {
    if (this.currentSelectedList.length === 0) {
      this.router.navigateByUrl('/');
    }
  }

  ngDoCheck() {
    //console.log(arguments);
  }

  ngOnChanges() {
    console.log(arguments);
  }



}
