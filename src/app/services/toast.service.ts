import { Injectable } from '@angular/core'
import { AlertController, ToastController } from '@ionic/angular/standalone'
import { addIcons } from 'ionicons'
import { checkmarkCircle, closeCircle, warningOutline } from 'ionicons/icons'
import { AlertButton } from '@ionic/angular'

@Injectable({
  providedIn: 'root',
})
export class ToastService {

  constructor(
    private readonly alertController: AlertController,
    private readonly toastController: ToastController,
  ) {
    addIcons({checkmarkCircle, closeCircle, warningOutline})
  }

  async alert(message: string, actionText: string, actionHandler: () => any, cancelHandler?: () => any) {
    const buttons: AlertButton[] = []

    if (cancelHandler) {
      buttons.push({
        text: 'Отмена',
        role: 'cancel',
        handler: cancelHandler,
      })
    }

    buttons.push({
      text: actionText,
      role: 'confirm',
      handler: actionHandler,
    })

    const alert = await this.alertController.create({
      backdropDismiss: false,
      header: message,
      buttons,
    })

    await alert.present()

    return alert
  }

  error(message: string) {
    this.presentToast(message, 'close-circle', 'danger')
  }

  success(message: string) {
    this.presentToast(message, 'checkmark-circle', 'success')
  }

  warning(message: string) {
    this.presentToast(message, 'warning-outline', 'warning')
  }

  private async presentToast(message: string, icon: string, color: string) {
    const toast = await this.toastController.create({
      duration: 3000,
      position: 'bottom',
      color,
      icon,
      message,
    })

    await toast.present()
  }
}
