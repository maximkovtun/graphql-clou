const path = require('path');
const fs = require('fs-extra');
const generateDaoSchema = require('./generateDaoSchema');

const cwd = path.resolve(__dirname);

describe('generateDaoSchema', () => {
  beforeAll(async () => {
    await generateDaoSchema({
      dataModelPath: './fixtures/datamodel.graphql',
      whiteListPath: './fixtures/whitelist.graphql',
      generatedFolderPath: 'generated',
      cwd
    });
  });

  test('generate files should be match to snapshots', async () => {
    const fileNames = fs.readdirSync(path.resolve(cwd, './generated'));
    fileNames.forEach(fileName => {
      const filePath = path.resolve(path.resolve(cwd, './generated', fileName));
      const file = fs.readFileSync(filePath, 'utf8');
      expect(file).toMatchSnapshot();
    });
  });
});
