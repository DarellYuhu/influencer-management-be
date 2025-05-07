import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import mime from 'mime';

@Injectable()
export class TiktokService {
  constructor(private readonly http: HttpService) {}

  async getVideoInfo({ id, url }: { id: string; url: string }) {
    const params = {
      aweme_id: id,
      iid: '7318518857994389254',
      device_id: '7318517321748022790',
    };
    const headers = {
      accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'accept-language': 'en-US,en;q=0.9',
      'cache-control': 'max-age=0',
      priority: 'u=0, i',
      'sec-ch-ua':
        '"Not A(Brand";v="8", "Chromium";v="132", "Microsoft Edge";v="132"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': 'Windows',
      'sec-fetch-dest': 'document',
      'sec-fetch-mode': 'navigate',
      'sec-fetch-site': 'cross-site',
      'sec-fetch-user': '?1',
      'upgrade-insecure-requests': '1',
      'user-agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36 Edg/132.0.0.0',
    };
    const { data } = await firstValueFrom(
      this.http.get<TiktokResponse>('/aweme/v1/feed/', {
        params,
        headers,
      }),
    );

    const images = await Promise.all([
      this.fetchImageMeta(data.aweme_list[0].author.avatar_larger.url_list[0]),
      this.fetchImageMeta(data.aweme_list[0].video.cover.url_list[0]),
    ]);

    const normalize = {
      url,
      images: {
        avatar: images[0],
        video: images[1],
        fileId: 'will_be_replaced',
      },
      author: {
        uid: data.aweme_list[0].author.uid,
        nickname: data.aweme_list[0].author.nickname,
        signature: data.aweme_list[0].author.signature,
      },
      video: {
        id,
        duration: data.aweme_list[0].video.duration,
        comment: data.aweme_list[0].statistics.comment_count,
        like: data.aweme_list[0].statistics.digg_count,
        download: data.aweme_list[0].statistics.download_count,
        play: data.aweme_list[0].statistics.play_count,
        share: data.aweme_list[0].statistics.share_count,
        forward: data.aweme_list[0].statistics.forward_count,
        lose: data.aweme_list[0].statistics.lose_count,
        lose_comment: data.aweme_list[0].statistics.lose_comment_count,
        whatsapp_share: data.aweme_list[0].statistics.whatsapp_share_count,
        collect: data.aweme_list[0].statistics.collect_count,
        repost: data.aweme_list[0].statistics.repost_count,
      },
    };
    return normalize;
  }

  private async fetchImageMeta(url: string) {
    const response = await firstValueFrom(
      this.http.get(url, { responseType: 'arraybuffer' }),
    );

    const buffer = Buffer.from(response.data);
    const mimeType =
      response.headers['content-type'] || 'application/octet-stream';
    const size = buffer.length;

    const contentDisposition = response.headers['content-disposition'];
    let filename: string | undefined;

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

type TiktokResponse = {
  aweme_list: {
    aweme_id: string;
    desc: string;
    create_time: number;
    author: {
      uid: string;
      nickname: string;
      signature: string;
      avatar_larger: {
        uri: string;
        url_list: string[];
        width: number;
        heigh: number;
      };
    };
    video: {
      cover: {
        uri: string;
        url_list: string[];
        width: number;
        height: number;
      };
      duration: number;
    };
    statistics: {
      comment_count: number;
      digg_count: number;
      download_count: number;
      play_count: number;
      share_count: number;
      forward_count: number;
      lose_count: number;
      lose_comment_count: number;
      whatsapp_share_count: number;
      collect_count: number;
      repost_count: number;
    };
  }[];
};
