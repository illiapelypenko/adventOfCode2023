import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const suitableValues = {
  red: 12,
  green: 13,
  blue: 14,
};

const getLinesFromFile = async (relativePath) => {
  const filePath = resolve(relativePath);
  const data = await readFile(filePath, { encoding: 'utf8' });
  const lines = data.split('\r\n');
  if (lines.at(-1) === '') lines.pop();
  return lines;
}

const parseLine = (line) => {
  const id = line.split(':')[0].split(' ')[1];
  const setsStr = line.split(':')[1].split(';'); // (12 blue, 2 green)[]

  return setsStr.reduce((acc, str) => {
    const colorAmount = str.trim().split(', '); // 12 blue[]
    const setObj = colorAmount.reduce((set, str) => {
      const [amount, color] = str.split(' '); // [12, blue]
      set[color] = amount;

      if(suitableValues[color] < amount) acc.isSuitable = false;

      return set;
    }, {
      green: 0,
      blue: 0,
      red: 0,
    });

    acc.sets.push(setObj);

    return acc;
  }, {
    isSuitable: true,
    sets: [],
    id,
    minValues: {
      green: 0,
      blue: 0,
      red: 0,
    }
  });
}

const lines = await getLinesFromFile('./data.txt');

const sumOfSuitableIds = lines.reduce((sum, line) => {
  const lineObj = parseLine(line);
  if (lineObj.isSuitable) sum += +lineObj.id;
  return sum;
}, 0);

console.log(sumOfSuitableIds);

const powerOfSets = lines.reduce((sumOfPower, line) => {
  const lineObj = parseLine(line);

  for (const obj of lineObj.sets) {
    for (const [color, value] of Object.entries(obj)) {
      if (lineObj.minValues[color] < +value) lineObj.minValues[color] = +value;
    }
  }

  const power = Object.values(lineObj.minValues).reduce((acc, value) => acc * value, 1);

  return sumOfPower + power;
}, 0);

console.log(powerOfSets);
