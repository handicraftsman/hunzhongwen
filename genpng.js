import fs from 'fs';
import path from 'path';
import svpng from 'svpng';
import gensvg from './gensvg'; 

export default async function(d, counter) {
  const svg = 'hunzhongwen-out' + counter.toString() + '.svg';
  const png = 'hunzhongwen-out' + counter.toString() + '.png';
  if (fs.existsSync(svg)) { fs.unlinkSync(svg); }
  if (fs.existsSync(png)) { fs.unlinkSync(png); }
  console.log('Generating ' + svg);
  fs.writeFileSync(svg, gensvg(d));
  console.log('Generated ' + svg);
  console.log('Generating ' + png);
  await svpng(svg, png, {
    width: 1200,
    trim: true,
    overwrite: true,
  });
  console.log('Generated ' + png);
  return {
    path: png,
    counter: counter + 1,
  }
}

export async function named(d, name) {
  const svg = name + '.svg';
  const png = name + '.png';
  if (fs.existsSync(svg)) { fs.unlinkSync(svg); }
  if (fs.existsSync(png)) { fs.unlinkSync(png); }
  console.log('Generating ' + svg);
  fs.writeFileSync(svg, gensvg(d));
  console.log('Generated ' + svg);
  console.log('Generating ' + png);
  await svpng(svg, png, {
    width: 1200,
    trim: true,
    overwrite: true,
  });
  console.log('Generated ' + png);
  return png;
}