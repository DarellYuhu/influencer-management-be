import { IsNumber, IsOptional, IsPositive, Max } from 'class-validator';
import { Content } from 'generated/prisma';

export class UpdateContentDto implements Partial<Content> {
  @IsNumber()
  @IsOptional()
  @IsPositive()
  @Max(5)
  prodComplexity?: number;

  @IsNumber()
  @IsOptional()
  @IsPositive()
  @Max(5)
  messageEmbeding?: number;
}
