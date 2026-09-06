import fs from 'fs';
import path from 'path';

const controllersDir = path.join(process.cwd(), 'src', 'controllers');

const files = fs.readdirSync(controllersDir).filter(f => f.endsWith('.js'));

for (const file of files) {
  const filePath = path.join(controllersDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Check if it already has logger import
  if (!content.includes('import { logger } from')) {
    // Add import after the first import or at top
    content = "import { logger } from '../utils/logger.js';\n" + content;
  }

  // Replace console.log and console.error
  content = content.replace(/console\.log\(/g, 'logger.info(');
  content = content.replace(/console\.error\(/g, 'logger.error(');

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Updated ${file}`);
}
