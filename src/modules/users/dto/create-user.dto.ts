import { UserCreate, userCreateSchema } from 'src/common/schemas';
import { ZodValidationPipe } from 'src/common/pipes';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto implements UserCreate {
  @ApiProperty({
    description: 'The email of the user',
    example: 'test@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'The name of the user',
    example: 'John Doe',
  })
  name?: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'password',
  })
  password: string;
}

export const CreateUserValidationPipe = new ZodValidationPipe(userCreateSchema);
