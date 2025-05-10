import { ThemeUpdate, themeUpdateSchema } from 'src/common/schemas';
import { ZodValidationPipe } from 'src/common/pipes';

export class UpdateThemeDto implements Partial<ThemeUpdate> {
    requiredThemeId?: number;
    isLocked?: boolean;
    difficulty?: number;
    name?: string;
    description?: string;
    imageUrl?: string;
    sceneUrl?: string;
    skyboxUrl?: string;
}

export const UpdateThemeValidationPipe = new ZodValidationPipe(themeUpdateSchema);