import { ApiProperty } from '@nestjs/swagger';
import { ZodValidationPipe } from 'src/common/pipes';
import { UserLogin, userLoginSchema } from 'src/common/schemas';

export class LoginUserDto implements UserLogin {
  @ApiProperty({
    description: 'The email of the user',
    example: 'test@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'password',
  })
  password: string;
}
export const LoginUserValidationPipe = new ZodValidationPipe(userLoginSchema);
