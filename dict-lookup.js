import hanzi from 'hanzi';
import prettify from './pinyin';
import config from './config.js';
import { checkFilters, replace } from './util';

export default class LookupManager {
  lookup(str, wordsConfig) {
    let words = [];
    str.match(/[^~]+|\~[^\~]+\~/g)
      .forEach(m => {
        if (m[0] == '~' && m[m.length - 1] == '~') {
          words = [ ...words, m ];
        } else {
          words = [ ...words, ...hanzi.segment(m) ];
        }
      });
    let sentenceWords = [];
    let out = words.map(word => {
      if (word[0] == '~' && word[word.length - 1] == '~') {
        sentenceWords.push(word.slice(1, -1));
        return { word: word.slice(1, -1), defs: [], noDecompose: true };
      } else {
        sentenceWords.push(word);
      }
      if (wordsConfig && wordsConfig[word] && wordsConfig[word].define) {
        return {
          word,
          defs: [
            {
              simplified: word,
              pinyin: prettify(wordsConfig[word].pinyin || '???'),
              definition: wordsConfig[word].define,
            },
          ],
        };
      }
      let defs = hanzi.definitionLookup(word);
      if (!defs) { return { word, defs: [] }; }
        defs = defs.map(def => {
          if (wordsConfig && wordsConfig[def.simplified] && wordsConfig[def.simplified].excludeWord) {
            return null;
          }
          let ds = def.definition.split('/').map(replace).filter(d => {
            return checkFilters({ def, d, wordsConfig });
          });
          if (ds.length == 0) {
            return null;
          }
          let definition = ds.slice(0,3).join('/');
          return {
            ...def,
            definition,
            pinyin: prettify(def.pinyin.toLowerCase()),
          };
        })
        .filter(def => def);
      if (defs.length == 0) {
        defs = ['<DEL>'];
      }
      return { word: defs[0].simplified, defs };
    });
    return { sentence: sentenceWords.join(' '), meanings: out };
  }

  deduplicate(data) {
    let words = new Set();
    let meanings = [];
    data.forEach(d => {
      if (!words.has(d.word)) {
        meanings = [ ...meanings, d ];
        words.add(d.word);
      }
    });
    return meanings;
  }
}