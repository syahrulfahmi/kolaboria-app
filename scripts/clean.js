const fs = require('fs');
const path = require('path');

const dirsToRemove = [
  'node_modules',
  'apps/client/node_modules',
  'apps/client/.nuxt',
  'apps/client/.output'
];

function deleteFolderRecursive(dirPath) {
  const absolutePath = path.resolve(dirPath);
  if (fs.existsSync(absolutePath)) {
    console.log(`[Clean] Removing: ${dirPath}...`);
    try {
      fs.rmSync(absolutePath, { recursive: true, force: true });
      console.log(`[Clean] Successfully removed: ${dirPath}`);
    } catch (err) {
      console.error(`[Clean] Failed to remove ${dirPath}:`, err.message);
    }
  } else {
    console.log(`[Clean] Directory does not exist: ${dirPath}`);
  }
}

console.log('[Clean] Starting workspace clean-up...');
dirsToRemove.forEach(deleteFolderRecursive);
console.log('[Clean] Clean-up finished successfully!');
