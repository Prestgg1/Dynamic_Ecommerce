import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Email düzgün formatda deyil' })
  @IsNotEmpty({ message: 'Email boş ola bilməz' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Şifrə boş ola bilməz' })
  password: string;
}
