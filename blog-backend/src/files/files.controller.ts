import {
  Controller,
  Get,
  Query,
  Response,
  StreamableFile,
} from '@nestjs/common';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
  constructor(private readonly fileService: FilesService) {}

  @Get()
  async getFile(
    @Query('path') path: string,
    @Response({ passthrough: true }) response,
  ): Promise<StreamableFile> {
    const [filename, file] = await this.fileService.findFilePath(path);
    response.header(
      'Content-Disposition',
      `attachment; filename="${filename}"`,
    );
    return new StreamableFile(file);
  }
}
