import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TiktokService } from 'src/tiktok/tiktok.service';
import { CreateContentDto } from './dto/create-content.dto';
import Minio from 'minio';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { Prisma } from 'generated/prisma';
import { MINIO_CLIENT } from 'src/core/minio/minio.module';
import { UpdateContentDto } from './dto/update-content.dto';
import { v4 } from 'uuid';

@Injectable()
export class ContentService {
  constructor(
    @Inject(MINIO_CLIENT) private readonly minio: Minio.Client,
    private readonly tiktokService: TiktokService,
    private readonly prisma: PrismaService,
  ) {}

  update(id: string, payload: UpdateContentDto) {
    return this.prisma.content.update({
      where: { id },
      data: payload,
    });
  }

  async findOne(id: string) {
    return this.prisma.content.findUnique({ where: { id } });
  }

  async findAll(accountId?: string, campaignId?: string) {
    const data = await this.prisma.content.findMany({
      where: {
        campaignAccount: { accountId, campaignId },
      },
      include: {
        cover: true,
        statistic: true,
        campaignAccount: {
          select: { account: { select: { followers: true } } },
        },
      },
    });
    const normalize = await Promise.all(
      data.map(async (item) => ({
        ...item,
        cover:
          item.cover &&
          (await this.minio.presignedGetObject('files', item.cover.name)),
        playToFollowers:
          item.statistic!.play / item.campaignAccount.account.followers,
      })),
    );
    return normalize;
  }

  async createMany(
    schema: (typeof CONTENT_SCHEMA)[number] = 'auto',
    payload: CreateContentDto,
  ) {
    switch (schema) {
      case 'auto':
        return this.createAuto(payload);
      case 'manual':
        return this.createManual(payload);
      default:
        throw new BadRequestException('Invalid schema');
    }
  }

  private async createManual(payload: CreateContentDto) {
    const { id } = await this.prisma.campaignAccount
      .findUniqueOrThrow({
        where: {
          campaignAccount: {
            accountId: payload.accountId,
            campaignId: payload.campaignId,
          },
        },
      })
      .catch(() => {
        throw new NotFoundException('Campaign account not found');
      });

    return this.prisma.$transaction(
      payload.manualData?.map(({ statistic, ...content }) =>
        this.prisma.content.create({
          data: {
            ...content,
            campAcctId: id,
            id: v4(),
            statistic: {
              create: statistic,
            },
          },
        }),
      ) ?? [],
    );
  }

  private async createAuto(payload: CreateContentDto) {
    const parsed = payload.urls!.map(this.parseUrl);
    const campaignAccount = await this.prisma.campaignAccount
      .findUniqueOrThrow({
        include: { account: true },
        where: {
          campaignAccount: {
            accountId: payload.accountId,
            campaignId: payload.campaignId,
          },
        },
      })
      .catch(() => {
        throw new NotFoundException('Campaign account not found');
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
          signature: fetched[0].author.signature,
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
        return this.prisma.content.upsert({
          where: { id: val.video.id },
          update: {},
          create: {
            description: val.video.description,
            createTime: new Date(val.video.createTime * 1000),
            campAcctId: campaignAccount.id,
            coverId: prismaFiles[idx].id,
            link: parsed[idx].url,
            duration: val.video.duration,
            id: val.video.id,
            statistic: {
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

export const CONTENT_SCHEMA = ['auto', 'manual'] as const;
