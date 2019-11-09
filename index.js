import '@babel/polyfill';

import fs from 'fs';
import path from 'path';
import hanzi from 'hanzi';
import commander from 'commander';
import LookupManager from './dict-lookup';
import gendocx from './gendocx';
import { configPath } from './config.js';
import { named as genpngNamed } from './genpng';

function lookupInData(sentence, data) {
  for (let di in data) {
    let d = data[di];
    if (d.sentence == sentence) {
      return d;
    }
  }
  return null;
}

function getCard(sentence, data = null) {
  let d = lookupInData(sentence, data);
  if (data && d) {
    const l = (new LookupManager()).lookup(sentence, d.words);
    return {
      ...d,
      data: l,
      meaning: d.meaning,
    };
  } else {
    return {
      sentence,
      data: (new LookupManager()).lookup(sentence),
      meaning: '<NO DATA ENTRY>',
    };
  }
}

function compileCard({ sentence, dataPath, output }) {
  hanzi.start();
  let data = null;
  if (dataPath) {
    data = JSON.parse(fs.readFileSync('./data.json').toString());
  }
  let card = getCard(sentence, data);
  genpngNamed(card, output);
}

function compileAll({ dataPath }) {
  hanzi.start();
  fs.readdirSync('.')
    .filter(f => f.match(/^hunzhongwen-.*$/))
    .forEach(f => {
      if (fs.statSync(f).isFile()) {
        fs.unlinkSync(f);
      }
    });
  let raw = fs.readFileSync(dataPath);
  let data = JSON.parse(raw.toString());
  gendocx(data);
}

function initProject() {
  fs.writeFileSync('./data.json', fs.readFileSync(path.join(__dirname, 'data.example.json')));
  fs.writeFileSync('./config.json', fs.readFileSync(path.join(__dirname, 'config.json')));
  console.log('Done! Check data.json and config.json');
}

let cfgDataPath = './data.json';
let cfgOutput = './hunzhongwencard';

let program = new commander.Command();
program
  .version('0.1.0')
  .option('-d, --data')
  .option('-o, --output')
  .option('-c, --config')
  .on('--data', (d) => {
    cfgDataPath = d;
  })
  .on('--output', (o) => {
    cfgOutput = o;
  })
  .on('--config', (c) => {
    configPath.path = c;
  });

program
  .command('compile <sentence>')
  .description('Compiles a card')
  .action((sentence) => {
    compileCard({ sentence, dataPath: cfgDataPath, output: cfgOutput });
  });

program
  .command('compile-all')
  .description('Compiles all cards')
  .action(() => {
    compileAll({ dataPath: cfgDataPath });
  });

program
  .command('init-config')
  .description('Initialize hunzhongwen project')
  .action(initProject);

program
  .on('command:*', (a) => {
    console.error('Invalid command: %s\nSee --help for a list of available commands.', process.argv.join(' '));
    process.exit(1);
  })
  .parse(process.argv);