import { promises as fs } from 'fs';
import  move from './lib/lib.js';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

// Define the directory structure and the file content
const __dirname = dirname(fileURLToPath(import.meta.url));
const testDir = join(__dirname, "testing");

const sourceFolder = join(testDir, 'folder');
const sourceFile = join(sourceFolder, 'file.txt');
const sourceFile2 = join(sourceFolder, 'file2.txt');

const destinationFolder = join(testDir, 'secondFolder');
const sourceFile2Copy = join(destinationFolder, 'file2.txt');
const destinationFile = join(destinationFolder, 'file.txt');
const fileCopy = join(destinationFolder, "file2--1.txt")
// Function to create directories and the file
async function createDirectoriesAndFile() {
  await fs.mkdir(sourceFolder, { recursive: true });
  await fs.writeFile(sourceFile, 'This is a text file in a subfolder.');
  await fs.writeFile(sourceFile2, 'This is a text file in a subfolder.');
  await fs.mkdir(destinationFolder, { recursive: true });
  await fs.writeFile(sourceFile2Copy, 'This is a text file in a subfolder.');

  
}

// Function to check if the file exists and move it
async function moveFile() {
  try {
    await fs.rename(sourceFile, destinationFile);
    console.log('File moved successfully.');
  } catch (error) {
    console.error('Error moving file:', error);
  }
}

// Function to check if the file was moved successfully
async function checkFileMoved() {
  try {
    await fs.access(destinationFile);
    await fs.access(fileCopy);
    console.log('The files exists in the second folder.');
    return true;
  } catch {
    console.log('The file does not exist in the second folder.');
    return false;
  }
}

// Function to clean up test data
async function cleanupTestData() {
  try {
  await fs.rm(testDir, { recursive: true, force: true });
    console.log('Test data deleted successfully.');
  } catch (error) {
    console.error('Error deleting test data:', error);
  }
}

// Main function
async function main() {
  try {
    await createDirectoriesAndFile();

    await move(sourceFile, destinationFolder, false, false, true)
    await move(sourceFile2, destinationFolder, false, "auto", true)

    const fileMoved = await checkFileMoved();
    console.log(`File move result: ${fileMoved ? 'Success' : 'Failure'}`);

    await cleanupTestData();
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

// Call the main function
main();
