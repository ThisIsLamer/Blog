import {
  Controller,
  Get,
  Query,
  Response,
  StreamableFile,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { FilesService } from './files.service';
import { GetFilePath } from './dto';
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';

@ApiTags('files')
@Controller('files')
export class FilesController {
  constructor(private readonly fileService: FilesService) {}

  @ApiBody({
    description: 'Get file a path',
    type: GetFilePath,
  })
  @ApiOkResponse({ description: 'File search result' })
  @UseGuards(LocalAuthGuard)
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
