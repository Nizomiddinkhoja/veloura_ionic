import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { Note } from "../models/note.model";


@Injectable()
export class NoteService {
  constructor(private api: ApiService) {}

  list(): Observable<Note[]> { return this.api.get<Note[]>('/notes'); }
  get(id: number) { return this.api.get<Note>(`/notes/${id}`); }
  create(payload: Note) { return this.api.post<Note>('/notes', payload); }
  update(id: number, payload: Partial<Note>) { return this.api.put(`/notes/${id}`, payload); }
  remove(id: number) { return this.api.delete(`/notes/${id}`); }
}
