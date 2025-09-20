import { Injectable, inject, signal } from '@angular/core';

import { SupabaseService } from '../../database/supabase-service';

@Injectable({
  providedIn: 'root',
})
export class UploadImageService {
  private supabaseService = inject(SupabaseService);
  private supabase = this.supabaseService.supabase;
  currentFile: undefined = undefined;
  uploadFile = signal<boolean>(false);
  filePath = signal<string>('');
  finalFilePathImage = signal<string | null>(null)
  VALID_TYPES = ['bmp', 'jpg', 'jpeg', 'png', 'webp'];

  verifyImage(file: any, fileName: string = '') {
    const pattern = /[\^*@!"#$%&/()=?¡!¿'\\áéíóúüñÑÁÉÍÓÚÛÜ]/gi;
    const name = file.name.split('').reverse().join('');
    const ext = name.split('.')[0].split('').reverse().join('');
    let newName =
      new Date().getTime().toString() +
      '---' +
      name.split('.')[1].split('').reverse().join('').split(' ').join('_').replace(pattern, '');

    if (!this.VALID_TYPES.includes(ext)) {
      alert(`Archivos de tipo ${ext} no están permitidos`);
      return { valid: false, filePath: null, file: null, newName };
    }
    const filePath = `${newName}.${ext}`;
    return {
      valid: true,
      filePath,
      file,
      newName,
    };
  }

  async uploadImage(file: any, bucketName: string, filePath: string) {
    return await this.supabase.storage.from(bucketName).upload(filePath, file, {
      upsert: true,
    });
  }

  async getImage(bucketName: string, filePath: string) {
    const fileName = filePath.replace(`${bucketName}/`, '');
    return this.supabase.storage.from(bucketName).getPublicUrl(fileName);
  }
}
