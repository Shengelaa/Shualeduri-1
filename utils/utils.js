import fs from 'fs/promises';

export const readFile = async (filePath, isParsed) => {
  const data = await fs.readFile(filePath, 'utf-8');

  return isParsed ? JSON.parse(data) : data;
};

export const writeFile = async (filePath, data, isParsed) => {
  return await fs.writeFile(filePath, isParsed ? JSON.stringify(data) : data);
};
