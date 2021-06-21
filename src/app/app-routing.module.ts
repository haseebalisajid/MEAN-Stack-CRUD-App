import { NgModule } from '@angular/core';
import { Routes, RouterModule } from "@angular/router";
import { FileUploadComponent } from './file-upload/file-upload.component';
import { CardComponent } from './card/card.component';

const routes: Routes = [
  { path: "", component: CardComponent },
  { path: "addUser", component: FileUploadComponent },
  { path: "editUser/:id", component: FileUploadComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
