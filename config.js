import fs from 'fs';

let cfg = null;

export let configPath = {
  path: './config.json'
};

export function getConfig() {
  if (!cfg) {
    cfg = JSON.parse(fs.readFileSync(configPath.path));
  }
  return cfg;
}