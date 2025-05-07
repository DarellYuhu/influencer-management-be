import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { TiktokService } from 'src/tiktok/tiktok.service';
import { CreateContentDto } from './dto/create-content.dto';
import Minio from 'minio';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { Prisma } from 'generated/prisma';
import { MINIO_CLIENT } from 'src/core/minio/minio.module';

@Injectable()
export class ContentService {
  constructor(
    @Inject(MINIO_CLIENT) private readonly minio: Minio.Client,
    private readonly tiktokService: TiktokService,
    private readonly prisma: PrismaService,
  ) {}

  async createMany(payload: CreateContentDto) {
    const parsed = payload.urls.map(this.parseUrl);
    const campaignAccount = await this.prisma.campaignAccount.findUnique({
      include: { account: true },
      where: {
        campaignAccount: {
          accountId: payload.accountId,
          campaignId: payload.campaignId,
        },
      },
    });
    const fetched = await Promise.all(
      parsed.map((val) => this.tiktokService.getVideoInfo(val)),
    );

    if (!campaignAccount.account.avatarId) {
      await this.minio.putObject(
        'files',
        fetched[0].images.avatar.filename,
        fetched[0].images.avatar.buffer,
        fetched[0].images.avatar.size,
      );
      await this.prisma.account.update({
        where: { id: payload.accountId },
        data: {
          avatar: {
            create: {
              mimeType: fetched[0].images.avatar.mimeType,
              name: fetched[0].images.avatar.filename,
              path: `/${fetched[0].images.avatar.filename}`,
            },
          },
        },
      });
    }

    const minioUpload = await Promise.all(
      fetched.map((val) => {
        return this.minio.putObject(
          'files',
          val.images.video.filename,
          val.images.video.buffer,
          val.images.video.size,
        );
      }),
    );

    const prismaFiles = await this.prisma.file.createManyAndReturn({
      select: { id: true },
      data: minioUpload.map((_, idx): Prisma.FileCreateManyInput => {
        return {
          name: fetched[idx].images.video.filename,
          path: `/${fetched[idx].images.video.filename}`,
          mimeType: fetched[idx].images.video.mimeType,
        };
      }),
    });

    await this.prisma.$transaction(
      fetched.map((val, idx) => {
        return this.prisma.content.create({
          data: {
            campAcctId: campaignAccount.id,
            coverId: prismaFiles[idx].id,
            link: parsed[idx].url,
            duration: val.video.duration,
            id: val.video.id,
            Statistic: {
              create: {
                comment: val.video.comment,
                download: val.video.download,
                forward: val.video.forward,
                like: val.video.like,
                play: val.video.play,
                share: val.video.share,
              },
            },
          },
        });
      }),
    );
  }

  private parseUrl(url: string) {
    const match = url.match(
      /(https:\/\/www\.tiktok\.com\/@[\w.-]+\/video\/(\d+))/,
    );
    if (!match) {
      throw new BadRequestException('Invalid TikTok video URL');
    }
    return {
      id: match[2],
      url: match[1],
    };
  }
}
