import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule       } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FileListWindowComponent } from './components/file-list-window/file-list-window.component';
import { FileDetailsComponent } from './components/file-details/file-details.component';
import { ErrorBoxComponent } from './components/error-box/error-box.component';
import { PreloaderComponent } from './components/preloader/preloader.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { WelcomePageComponent } from './components/welcome-page/welcome-page.component';
import { TagEditorWindowComponent } from './components/tag-editor-window/tag-editor-window.component';
import { ImageUploadControlComponent } from './components/image-upload-control/image-upload-control.component';
import { ImageExplorerComponent } from './components/image-explorer/image-explorer.component';

@NgModule({
  declarations: [
    AppComponent,
    FileListWindowComponent,
    FileDetailsComponent,
    ErrorBoxComponent,
    PreloaderComponent,
    WelcomePageComponent,
    TagEditorWindowComponent,
    ImageUploadControlComponent,
    ImageExplorerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [HttpClient],
  bootstrap: [AppComponent]
})
export class AppModule { }
