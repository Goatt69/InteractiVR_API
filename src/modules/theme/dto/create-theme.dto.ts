import { ApiProperty } from '@nestjs/swagger';

export class CreateThemeDto {
  @ApiProperty({
    description: 'The name of the theme',
    example: 'Theme 1',
  })
  name: string;

  @ApiProperty({
    description: 'The description of the theme',
    example: 'Theme 1 description',
  })
  description?: string;

  @ApiProperty({
    description: 'The image URL of the theme',
    example: 'https://example.com/image.jpg',
  })
  imageUrl?: string;

  @ApiProperty({
    description: 'The scene URL of the theme',
    example: 'https://example.com/scene.glb',
  })
  sceneUrl?: string;

  @ApiProperty({
    description: 'The skybox URL of the theme',
    example: 'https://example.com/skybox.jpg',
  })
  skyboxUrl?: string;

  @ApiProperty({
    description: 'The difficulty of the theme',
    example: 1,
  })
  difficulty: number;

  @ApiProperty({
    description: 'Whether the theme is locked',
    example: false,
  })
  isLocked: boolean;

  @ApiProperty({
    description: 'The ID of the required theme',
    example: 1,
  })
  requiredThemeId?: number;
}
