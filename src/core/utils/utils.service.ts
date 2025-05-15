import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import mime from 'mime';

@Injectable()
export class UtilsService {
  constructor(private readonly http: HttpService) {}

  async fetchImageMeta(url: string) {
    const response = await firstValueFrom(
      this.http.get(url, { responseType: 'arraybuffer' }),
    );

    const buffer = Buffer.from(response.data);
    const mimeType =
      response.headers['content-type'] || 'application/octet-stream';
    const size = buffer.length;

    const contentDisposition = response.headers['content-disposition'];
    let filename: string;

    if (contentDisposition && contentDisposition.includes('filename=')) {
      filename = contentDisposition
        .split('filename=')[1]
        .replace(/["']/g, '') // remove quotes
        .trim();
    } else {
      const extension = mime.getExtension(mimeType);
      filename = `${Date.now()}.${extension}`;
    }

    return {
      buffer,
      mimeType,
      size,
      filename,
    };
  }
}
