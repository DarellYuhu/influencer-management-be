import { ArrayNotEmpty, IsArray, IsString } from 'class-validator';

export class CreateNicheDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  name: string[];
}
