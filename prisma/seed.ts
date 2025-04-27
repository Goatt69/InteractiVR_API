// backend/prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// Define types to match your data structure
interface Position {
  x: number;
  y: number;
  z: number;
}

interface Rotation {
  x: number;
  y: number;
  z: number;
}

interface Scale {
  x: number;
  y: number;
  z: number;
}

interface VocabularyItem {
  englishWord: string;
  vietnameseTranslation: string;
  pronunciation: string;
  audioUrl: string | null;
  examples: string[];
}

interface ObjectData {
  name: string;
  objectIdentifier: string;
  modelUrl: string | null;
  thumbnailUrl: string | null;
  position: Position;
  rotation: Rotation;
  scale: Scale;
  interactable: boolean;
  interactionType: string;
  highlightColor: string | null;
  vocabularyItems: VocabularyItem[];
}

interface ThemeData {
  name: string;
  description: string;
  imageUrl: string | null;
  sceneUrl: string;
  skyboxUrl: string;
  difficulty: number;
  isLocked: boolean;
}

interface ImportData {
  theme: ThemeData;
  objects: ObjectData[];
}

async function main() {
  try {
    console.log('Starting seed process...');

    // Get absolute path to the data file
    const dataFilePath = path.resolve('./glb-data.json');
    console.log(`Looking for data file at: ${dataFilePath}`);

    if (!fs.existsSync(dataFilePath)) {
      console.error(`Error: File not found at ${dataFilePath}`);
      return;
    }

    // Read the data file you created
    const jsonData = fs.readFileSync(dataFilePath, 'utf8');
    console.log(`Successfully read data file (${jsonData.length} bytes)`);

    const data = JSON.parse(jsonData) as ImportData;
    console.log(
      `Parsed JSON data. Theme: ${data.theme.name}, Objects: ${data.objects.length}`,
    );

    // Create the theme
    console.log('Creating theme...');
    const theme = await prisma.theme.create({
      data: {
        name: data.theme.name,
        description: data.theme.description,
        imageUrl: data.theme.imageUrl,
        sceneUrl: data.theme.sceneUrl,
        skyboxUrl: data.theme.skyboxUrl,
        difficulty: data.theme.difficulty,
        isLocked: data.theme.isLocked,
      },
    });
    console.log(`Theme created with ID: ${theme.id}`);

    // Create each object with its vocabulary
    console.log('Creating objects and vocabulary...');
    for (const obj of data.objects) {
      console.log(`Creating object: ${obj.name}`);
      const dbObject = await prisma.object.create({
        data: {
          name: obj.name,
          objectIdentifier: obj.objectIdentifier,
          modelUrl: obj.modelUrl,
          thumbnailUrl: obj.thumbnailUrl,
          // Cast the JSON objects properly for Prisma
          position: JSON.parse(JSON.stringify(obj.position)),
          rotation: JSON.parse(JSON.stringify(obj.rotation)),
          scale: JSON.parse(JSON.stringify(obj.scale)),
          interactable: obj.interactable,
          interactionType: obj.interactionType,
          highlightColor: obj.highlightColor,
          themeId: theme.id,
        },
      });
      console.log(`  - Object created with ID: ${dbObject.id}`);

      // Create vocabulary for this object
      for (const vocab of obj.vocabularyItems) {
        console.log(`  - Creating vocabulary: ${vocab.englishWord}`);
        await prisma.vocabulary.create({
          data: {
            englishWord: vocab.englishWord,
            vietnameseTranslation: vocab.vietnameseTranslation,
            pronunciation: vocab.pronunciation,
            audioUrl: vocab.audioUrl,
            examples: vocab.examples,
            objectId: dbObject.id,
          },
        });
      }
    }
    console.log('Seed completed successfully!');
  } catch (error) {
    console.error('Error during seed process:');
    console.error(error);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
