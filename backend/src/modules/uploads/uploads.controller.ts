import {
  Controller,
  Get,
  Post,
  Param,
  Res,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiResponse,
} from '@nestjs/swagger';
import { memoryStorage } from 'multer';
import {
  getUploadedImage,
  persistUploadedImage,
} from '../../shared/upload.util';
import { AdminGuard } from '../../guards/admin.guard';
import type { Response } from 'express';

@ApiTags('uploads')
@Controller('uploads')
export class UploadsController {
  @Get(':key')
  @ApiOperation({ summary: 'Get uploaded image through backend proxy' })
  async getFile(@Param('key') key: string, @Res() res: Response) {
    const file = await getUploadedImage(key);

    res.setHeader('Content-Type', file.contentType);
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    if (file.etag) {
      res.setHeader('ETag', file.etag);
    }

    return res.send(file.body);
  }

  @Post('product')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Upload product image (Admin only)' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
          return cb(
            new BadRequestException('Only image files are allowed!'),
            false,
          );
        }
        cb(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  @ApiResponse({ status: 201, description: 'File uploaded successfully' })
  uploadProductFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    return persistUploadedImage(file, { prefix: 'product' }).then((url) => ({
      url,
    }));
  }

  @Post('profile')
  @ApiOperation({ summary: 'Upload profile image' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
          return cb(
            new BadRequestException('Only image files are allowed!'),
            false,
          );
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
    return persistUploadedImage(file, { prefix: 'profile' }).then((url) => ({
      url,
    }));
  }
}
