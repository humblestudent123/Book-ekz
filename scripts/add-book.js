const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const booksJsonPath = path.join(repoRoot, 'src', 'books.json');
const booksDir = path.join(repoRoot, 'public', 'books');
const coversDir = path.join(repoRoot, 'public', 'covers');

function parseArgs(argv) {
  const result = {};

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];

    if (!token.startsWith('--')) {
      continue;
    }

    const key = token.slice(2);
    const nextValue = argv[i + 1];

    if (!nextValue || nextValue.startsWith('--')) {
      result[key] = true;
      continue;
    }

    result[key] = nextValue;
    i += 1;
  }

  return result;
}

function printUsage() {
  console.log(`
Usage:
  npm run add-book -- --title "Название" --author "Автор" --book "C:\\path\\book.txt" --cover "C:\\path\\cover.jpg"

Optional:
  --year 2024
  --genres "Роман,Драма"
  --tags "Классика,Философия"
  --description "Краткое описание"
  `);
}

function ensureFileExists(filePath, label) {
  if (!filePath || !fs.existsSync(filePath)) {
    console.error(`${label} not found: ${filePath || 'missing path'}`);
    process.exit(1);
  }
}

function getNextId(books) {
  return books.reduce((maxId, book) => Math.max(maxId, Number(book.id) || 0), 0) + 1;
}

function toAsciiSlug(value) {
  return String(value)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}

function splitList(value) {
  if (!value) {
    return [];
  }

  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function copyAsset(sourcePath, targetDir, fileNameBase) {
  const sourceExt = path.extname(sourcePath) || '.txt';
  const targetName = `${fileNameBase}${sourceExt.toLowerCase()}`;
  const targetPath = path.join(targetDir, targetName);

  fs.copyFileSync(sourcePath, targetPath);

  return targetName;
}

function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help || args.h) {
    printUsage();
    return;
  }

  const title = String(args.title || '').trim();
  const author = String(args.author || '').trim();
  const bookFile = args.book;
  const coverFile = args.cover;

  if (!title || !author || !bookFile || !coverFile) {
    printUsage();
    process.exit(1);
  }

  ensureFileExists(bookFile, 'Book file');
  ensureFileExists(coverFile, 'Cover file');
  ensureFileExists(booksJsonPath, 'Catalog file');

  ensureDir(booksDir);
  ensureDir(coversDir);

  const books = JSON.parse(fs.readFileSync(booksJsonPath, 'utf8'));
  const nextId = getNextId(books);
  const slug = toAsciiSlug(`${title}-${author}`) || `book-${nextId}-${Date.now()}`;

  const bookAssetName = copyAsset(bookFile, booksDir, `${slug}-text`);
  const coverAssetName = copyAsset(coverFile, coversDir, `${slug}-cover`);

  const newBook = {
    id: nextId,
    title,
    author,
    year: args.year ? Number(args.year) : null,
    genres: splitList(args.genres),
    tags: splitList(args.tags),
    description: String(args.description || '').trim(),
    cover: `/covers/${coverAssetName}`,
    content: `/books/${bookAssetName}`
  };

  books.push(newBook);
  fs.writeFileSync(booksJsonPath, `${JSON.stringify(books, null, 2)}\n`, 'utf8');

  console.log(`Added book #${nextId}: ${title}`);
  console.log(`Cover: ${newBook.cover}`);
  console.log(`Text: ${newBook.content}`);
}

main();
