import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NotesPageRoutingModule } from './notes-routing.module';

import { NotesPage } from './notes.page';
import { NoteService } from "../../services/note.service";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NotesPageRoutingModule
  ],
  providers: [NoteService],
  declarations: [NotesPage]
})
export class NotesPageModule {
}
