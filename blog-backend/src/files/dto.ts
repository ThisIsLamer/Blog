import { ApiProperty } from '@nestjs/swagger';

export class IAppResponseDto {
  constructor(
    public statusCode: number,
    public data: any = undefined,
    public message: string = 'Success',
  ) {}
}

export interface IBufferedFile {
  field: string;
  file: any;
  filename: string;
  encoding: string;
  mimetype: string;
}

export class GetFilePath {
  @ApiProperty({ type: 'string', format: 'binary' })
  path: string;
}
