import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WelcomePageComponent } from './components/welcome-page/welcome-page.component';
import { FileListWindowComponent } from './components/file-list-window/file-list-window.component';
import { FileDetailsComponent } from './components/file-details/file-details.component';
import { TagEditorWindowComponent } from './components/tag-editor-window/tag-editor-window.component';


const routes: Routes = [
  {path:'welcome',component:WelcomePageComponent},
  {path:'fileselection',component:FileListWindowComponent},
  {path:'fileselection/:dirPath',component:FileListWindowComponent},
  {path:'details/:filePath',component:FileDetailsComponent},
  {path:'edit',component:TagEditorWindowComponent},
  {path:'**',redirectTo:'welcome'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
