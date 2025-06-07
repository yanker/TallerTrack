import { promises as fs } from 'fs';
import path from 'path';

export async function getGuideContent() {
  try {
    const markdownContent = await fs.readFile(path.join(process.cwd(), 'USAGE_GUIDE.md'), 'utf8');
    return markdownContent;
  } catch (error) {
    console.error('Error reading USAGE_GUIDE.md:', error);
    return '';
  }
}
