import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const getStrings = async (relativePath) => {
  const filePath = resolve(relativePath);
  const data = await readFile(filePath, { encoding: 'utf8' });
  return data.split('\r\n');
}

const extractDigits = (str) => {
  return str.match(/\d/g) ?? 0;
}

const getCalibrationValue = (digitsArr) => {
  return digitsArr.at(0) + digitsArr.at(-1);
}

const data = await getStrings('./data.txt');
data.splice(-1, 1); // delete auto-inserted blank last line

const sumOfValues = data.reduce((acc, value) => {
  const digits = extractDigits(value);
  const calibrationValue = getCalibrationValue(digits);
  return +acc + +calibrationValue;
}, 0);

console.log(sumOfValues);
