import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NotesPageRoutingModule } from './notes-routing.module';

import { NotesPage } from './notes.page';
import { NoteService } from "../../services/note.service";
import { NotesFilterModalComponent } from './notes-filter-modal/notes-filter-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NotesPageRoutingModule
  ],
  providers: [NoteService],
  declarations: [NotesPage, NotesFilterModalComponent]
})
export class NotesPageModule {
}
