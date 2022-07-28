import { ApiProperty } from '@nestjs/swagger';

export interface MulterField {
  name: string;

  maxCount?: number;
}

export class FilesUploadDto {
  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
  files: any[];

  @ApiProperty()
  message: string;
}

export class BlogEditDto {
  @ApiProperty()
  blogId: number;

  @ApiProperty()
  message: string;
}

export class BlogRemoveAttachments {
  @ApiProperty()
  blogId: number;

  @ApiProperty({ type: 'array', items: { type: 'number', format: 'binary' } })
  mediaIds: number[];
}

export class DeletingBlog {
  @ApiProperty()
  blogId: number;
}
