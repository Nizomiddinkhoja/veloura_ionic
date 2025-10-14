import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from "@ionic/angular";
import { Note } from "../../models/note.model";
import { NoteService } from "../../services/note.service";
import { ToastService } from "../../services/toast.service";
import { addIcons } from 'ionicons'
import { add, trash, create } from 'ionicons/icons'
import { UserRole } from "../../models/user-role";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: 'app-notes',
  templateUrl: './notes.page.html',
  styleUrls: ['./notes.page.scss'],
  standalone: false
})
export class NotesPage implements OnInit {
  notes: Note[] = [];
  filteredNotes: Note[] = [];
  searchTerm: string = '';

  constructor(
    private noteService: NoteService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastService: ToastService,
    private authService: AuthService,
  ) {
    addIcons({add, trash, create})
  }

  ngOnInit() {
    this.loadNotes();
  }

  public get isAdmin() {
    return this.authService.hasRole(UserRole.Admin)
  }

  async loadNotes() {
    const loading = await this.loadingController.create({
      message: 'Загрузка заметкаов...'
    });
    await loading.present();

    try {
      this.notes = await this.noteService.list().toPromise() || [];
      this.filteredNotes = [...this.notes];
    } catch (error) {
      console.error('Ошибка загрузки заметкаов:', error);
      this.toastService.error('Ошибка загрузки заметкаов');
    } finally {
      await loading.dismiss();
    }
  }

  async refreshNotes(event: any) {
    await this.loadNotes();
    event.target.complete();
  }

  filterNotes() {
    if (!this.searchTerm) {
      this.filteredNotes = [...this.notes];
    } else {
      this.filteredNotes = this.notes.filter(note =>
        note.text.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  async openNoteDialog(note?: Note) {
    const isEdit = !!note;
    const alert = await this.alertController.create({
      header: isEdit ? 'Редактировать заметку' : 'Добавить заметку',
      inputs: [
        {
          name: 'text',
          type: 'text',
          placeholder: 'Текст заметки',
          value: note ? note.text : '',
          attributes: {
            required: true
          }
        }
      ],
      buttons: [
        {
          text: 'Отмена',
          role: 'cancel'
        },
        {
          text: isEdit ? 'Сохранить' : 'Добавить',
          handler: async (data) => {
            if (!data.text || !data.text.trim()) {
              this.toastService.warning('Введите текст заметки');
              return false;
            }

            await this.saveNote(data.text, note?.id);
            return true;
          }
        }
      ]
    });

    await alert.present();
  }

  private async saveNote(text: string, id?: number) {
    const loading = await this.loadingController.create({
      message: id ? 'Сохранение изменений...' : 'Создание заметки...'
    });
    await loading.present();

    try {
      const note: Note = {text};
      if (id) {
        await this.noteService.update(id, note).toPromise();
      } else {
        await this.noteService.create(note).toPromise();
      }
      this.toastService.success('Заметка успешно сохранена');
      await this.loadNotes();
    } catch (error) {
      console.error('Ошибка сохранения заметки:', error);
      this.toastService.error('Ошибка сохранения заметки');
    } finally {
      await loading.dismiss();
    }
  }

  async deleteNote(note: Note) {
    const alert = await this.alertController.create({
      header: 'Удалить заметка',
      message: `Вы уверены, что хотите удалить заметку №"${note.id}"?`,
      buttons: [
        {
          text: 'Отмена',
          role: 'cancel'
        },
        {
          text: 'Удалить',
          role: 'destructive',
          handler: () => {
            this.removeNote(note.id!);
          }
        }
      ]
    });

    await alert.present();
  }

  async removeNote(id: number) {
    const loading = await this.loadingController.create({
      message: 'Удаление заметки...'
    });
    await loading.present();

    try {
      await this.noteService.remove(id).toPromise();
      this.toastService.success('Заметка успешно удален');
      await this.loadNotes();
    } catch (error) {
      console.error('Ошибка удаления заметки:', error);
      this.toastService.error('Ошибка удаления заметки');
    } finally {
      await loading.dismiss();
    }
  }
}
