import { Component, DestroyRef, OnInit } from '@angular/core';
import { AlertController, LoadingController } from "@ionic/angular";
import { Note } from "../../models/note.model";
import { NoteService } from "../../services/note.service";
import { ToastService } from "../../services/toast.service";
import { addIcons } from 'ionicons'
import { add, trash, create, filterOutline } from 'ionicons/icons'
import { ModalController } from '@ionic/angular';
import { NotesFilterModalComponent, NotesFilters } from './notes-filter-modal/notes-filter-modal.component';
import { UserRole } from "../../models/user-role";
import { AuthService } from "../../services/auth.service";
import { finalize } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

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
  currentFilters: NotesFilters = {};
  isLoading = true
  private refreshEvent: any

  constructor(
    private noteService: NoteService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastService: ToastService,
    private authService: AuthService,
    private modalController: ModalController,
    private readonly destroyRef: DestroyRef,
  ) {
    addIcons({add, trash, create, filterOutline})
  }

  ngOnInit() {
    this.getNotes();
  }

  public get isAdmin() {
    return this.authService.hasRole(UserRole.Admin)
  }

  onIonRefresh(event: any) {
    this.refreshEvent = event
    this.getNotes()
  }

  private getNotes() {
    this.noteService.list(this.currentFilters)
      .pipe(
        finalize(() => {
          this.isLoading = false
          if (this.refreshEvent) {
            this.refreshEvent.target.complete()
          }
        }),
        takeUntilDestroyed(this.destroyRef),
      ).subscribe({
      next: notes => {
        this.notes = notes;
        this.filteredNotes = [...this.notes];
      },
      error: () => {
        alert('Неверные учетные данные');
      }
    });
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

            const loading = await this.loadingController.create({
              message: note?.id ? 'Сохранение изменений...' : 'Создание заметки...'
            });
            await loading.present();

            try {
              const noteData: Note = {text: data.text};
              if (note?.id) {
                await this.noteService.update(note?.id, noteData).toPromise();
              } else {
                await this.noteService.create(noteData).toPromise();
              }
              this.toastService.success('Заметка успешно сохранена');
              this.getNotes();
              return true;
            } catch (error) {
              console.error('Ошибка сохранения заметки:', error);
              return false;
            } finally {
              await loading.dismiss();
            }
          }
        }
      ]
    });

    await alert.present();
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
          handler: async () => {
            const loading = await this.loadingController.create({
              message: 'Удаление заметки...'
            });
            await loading.present();

            try {
              await this.noteService.remove(note.id!).toPromise();
              this.toastService.success('Заметка успешно удален');
              this.getNotes();
              return true;
            } catch (error) {
              console.error('Ошибка удаления заметки:', error);
              return false;
            } finally {
              await loading.dismiss();
            }
          }
        }
      ]
    });

    await alert.present();
  }

  // Открыть модалку фильтров
  async openFilters() {
    const modal = await this.modalController.create({
      component: NotesFilterModalComponent,
      componentProps: {
        currentFilters: this.currentFilters
      }
    });

    await modal.present();

    const {data} = await modal.onWillDismiss<NotesFilters>();
    if (data) {
      this.currentFilters = data;
      this.getNotes();
    }
  }
}
