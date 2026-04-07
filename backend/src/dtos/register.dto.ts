import { IsEmail, IsNotEmpty, MinLength, Matches } from 'class-validator';
import { Match } from 'src/match.decorator';

export class RegisterDto {
  @IsNotEmpty({ message: 'Name boş ola bilməz' })
  name: string;

  @IsEmail({}, { message: 'Email düzgün formatda deyil' })
  @IsNotEmpty({ message: 'Email boş ola bilməz' })
  email: string;

  @IsNotEmpty({ message: 'Password boş ola bilməz' })
  @MinLength(6, { message: 'Password ən azı 6 simvol olmalıdır' })
  @Matches(/[A-Z]/, { message: 'Password ən azı 1 böyük hərf içerməlidir' })
  @Matches(/[0-9]/, { message: 'Password ən azı 1 rəqəm içerməlidir' })
  password: string;

  @IsNotEmpty({ message: 'Password təkrarı boş ola bilməz' })
  @Match('password', { message: 'Passwordlər uyğun deyil' })
  repassword: string;
}
