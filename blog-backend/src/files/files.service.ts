import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { pipeline } from 'stream';
import * as crypto from 'crypto';
import * as util from 'util';
import * as fs from 'fs';

import { FileEntity } from './file.entity';
import { IBufferedFile } from './dto';
import { BlogEntity } from 'src/blogs/blog.entity';
import { join } from 'path';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
  ) {}

  async findFilesBlogId(blog: BlogEntity) {
    return this.fileRepository.find({ where: { blog } });
  }

  async findFilePath(filePath: string): Promise<[string, fs.ReadStream]> {
    const filename = (
      await this.fileRepository.findOne({
        where: { path: filePath },
      })
    ).name;
    const file = fs.createReadStream(join(process.cwd(), filePath));
    return [filename, file];
  }

  async save(file: FileEntity): Promise<FileEntity> {
    return this.fileRepository.save(file);
  }

  async remove(...ids: number[]) {
    const files = await this.fileRepository.find({ where: { id: In(ids) } });
    await this.fileRepository.remove(files);
  }

  async removeEntity(...files: FileEntity[]) {
    await this.fileRepository.remove(files);
  }

  async uploadFile(fileData: IBufferedFile) {
    const hashedFileName = crypto
      .createHash('md5')
      .update(
        new Date().toString() +
          fileData.filename +
          fileData +
          fileData.mimetype,
      )
      .digest('hex');
    const ext = fileData.filename.substring(
      fileData.filename.lastIndexOf('.'),
      fileData.filename.length,
    );

    const pipelineLoaded = util.promisify(pipeline);
    const writeStream = fs.createWriteStream(`uploads/${hashedFileName + ext}`);
    try {
      await pipelineLoaded(fileData.file, writeStream);
      return hashedFileName + ext;
    } catch (err) {
      return null;
    }
  }
}
