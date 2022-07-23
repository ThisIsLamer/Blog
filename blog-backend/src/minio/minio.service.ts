import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MinioService } from 'nestjs-minio-client';
import * as crypto from 'crypto';
import { BufferedFile } from './dto';

@Injectable()
export class MinioClientService {
  private readonly bucket = this.configService.get<string>('MINIO_BASE_BUCKET');

  constructor(
    private readonly minioService: MinioService,
    private readonly configService: ConfigService,
  ) {}

  public get client() {
    return this.minioService.client;
  }

  async upload(file: BufferedFile) {
    const temp_filename = Date.now().toString();
    const hashedFileName = crypto
      .createHash('md5')
      .update(temp_filename + file.originalname + file.size)
      .digest('hex');
    const ext = file.originalname.substring(
      file.originalname.lastIndexOf('.'),
      file.originalname.length,
    );
    const metaData = {
      'Content-Type': file.mimetype,
      'X-Amz-Meta-Testing': 1234,
    };
    const filename = hashedFileName + ext;
    const fileName = `${filename}`;
    const fileBuffer = file.buffer;
    const fileSize = file.size;
    this.client.putObject(
      this.bucket,
      fileName,
      fileBuffer,
      fileSize,
      metaData,
      (err, res) => {
        if (err)
          throw new HttpException(
            'Error uploading file',
            HttpStatus.BAD_REQUEST,
          );
      },
    );

    return {
      url: `${this.configService.get<string>(
        'MINIO_ENDPOINT',
      )}:${this.configService.get<string>(
        'MINIO_PORT',
      )}/${this.configService.get<string>('MINIO_BUCKET')}/${filename}`,
      hashedFileName,
    };
  }

  async delete(objetName: string) {
    this.client.removeObject(this.bucket, objetName, (err) => {
      if (err)
        throw new HttpException(
          'Oops Something wrong happend',
          HttpStatus.BAD_REQUEST,
        );
    });
  }
}
