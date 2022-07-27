export class AppResponseDto {
  constructor(
    public statusCode: number,
    public data: any = undefined,
    public message: string = 'Success',
  ) {}
}

export interface BufferedFile {
  field: string;
  file: any;
  filename: string;
  encoding: string;
  mimetype: string;
}
