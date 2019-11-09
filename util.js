import { getConfig } from './config.js';

function oneOf(fns) {
  for (let i in fns) {
    if (fns[i]()) {
      return true;
    }
  }
  return false;
}

export function replace(d) {
  let config = getConfig();
  config.replace.forEach(([ from, to ]) => {
    d = d.split(/[\s]+/)
      .filter(dd => dd.trim() != '')
      .map(dd => `<START>${dd}<END>`
        .replace(new RegExp(`(<START>|\\.|\\,|\\;|\\:|\s+)${from}(<END>|\\.|\\,|\\;|\\:|\s+)`, 'gi'), `$1${to}$2`)
        .replace('<START>', '')
        .replace('<END>', ''))
    .join(' ')
    .replace(/\s+/, ' ')
    .replace(/\(\s+/, '(')
    .replace(/\s+\)/, ')')
    .replace(/\s+[.]/, '.')
    .replace(/\s+[,]/, ',')
    .replace(/\s+[;]/, ';')
    .replace(/\s+[:]/, ':')
    .replace(/\s+[/]\s+/, '/');
  });
  return d;
}

export function checkFilters({ def, d, wordsConfig, onlyShort }) {
  let config = getConfig();
  for (let fi in config.filter) {
    if (d.match(new RegExp(config.filter[fi], "gi"))) {
      return false;
    }
  }
  if (wordsConfig && wordsConfig[def.simplified] && wordsConfig[def.simplified].include) {
    let fns = wordsConfig[def.simplified].include
      .map(pattern => () => {
        if (!d.match(new RegExp(pattern, "gi"))) {
          return false;
        }
        return true;
      });
    if (!oneOf(fns)) {
      return false;
    }
  }
  if (wordsConfig && wordsConfig[def.simplified] && wordsConfig[def.simplified].exclude) {
    for (let p in wordsConfig[def.simplified].exclude) {
      let pattern = wordsConfig[def.simplified].exclude[p];
      if (d.match(new RegExp(pattern, "gi"))) {
        return false;
      }
    }
  }
  if (onlyShort && d.length > 24) { return false; }
  return true;
}