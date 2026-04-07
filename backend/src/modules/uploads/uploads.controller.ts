import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiResponse } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';

@ApiTags('uploads')
@Controller('uploads')
export class UploadsController {
  @Post('profile')
  @ApiOperation({ summary: 'Upload profile image' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `profile-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          return cb(new BadRequestException('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 2 * 1024 * 1024, // 2MB
      },
    }),
  )
  @ApiResponse({ status: 201, description: 'File uploaded successfully' })
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    // Return the URL to the frontend
    // In production, this should be the full URL (e.g. https://api.ironstore.com/uploads/...)
    // But for local dev, it can be relative or full localhost
    const url = `/uploads/${file.filename}`;
    return { url };
  }
}
