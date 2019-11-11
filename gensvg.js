import React from 'react';
import ReactDOM from 'react-dom/server';
import svgx from 'svgx';
import convert from 'svpng';
import hanzi from 'hanzi';
import prettify from './pinyin';
import { getConfig } from './config';
import { checkFilters, replace } from './util'; 

const render = svgx(ReactDOM.renderToStaticMarkup);

let checked = new Set();

function define(char, wordsConfig, onlyShort = false) {
  if (checked.has(char)) {
    return null;
  }
  checked.add(char);
  let defs = hanzi.definitionLookup(char);
  if (!defs) { return null; }
  defs = defs.filter(def => def && def.definition).map((def) => {
    def.definition = def.definition
      .split('/')
      .map(replace)
      .filter(d => d && checkFilters({ def, d, wordsConfig, onlyShort }))
      [0];
    return def;
  }).filter(def => def && def.definition);
  return defs[0];
}

function annotateDefinition(def) {
  if (def) {
    return def.definition
      ? '[ ' + def.simplified + ' ' + prettify(def.pinyin.toLowerCase()) + ' → ' + def.definition + ' ]'
      : '[ ' + def.simplified + ' ' + prettify(def.pinyin.toLowerCase()) + ' ]';
  }
  return null;
}

function decompose(str) {
  let arr = hanzi.decompose(str).components1;
  if (!arr) { return null; }
  if (arr.length == 1) {
    return arr;
  } else {
    return arr.filter(e => !e.match(/No glyph available/gi));
  }
}

function annotate(arr, wordsConfig) {
  let ret = [];
  arr.filter(a => {
    if (!a) { return false; }
    if (wordsConfig && wordsConfig[a] && wordsConfig[a].excludeWord) {
      return false;
    }
    return true;
  }).forEach(a => {
    let rdef = hanzi.getRadicalMeaning(a);
    if (rdef != 'N/A') {
      ret = [ ...ret, '< ' + a + ' → ' + rdef + ' >' ];
      return;
    }
    let def = define(a, wordsConfig, true);
    if (def) {
      let d = def.definition
        ? '[ ' + a + ' ' + prettify(def.pinyin.toLowerCase()) + ' → ' + def.definition + ' ]'
        : '[ ' + a + ' ' + prettify(def.pinyin.toLowerCase()) + ' ]';
      ret = [ ...ret, d ];
    } else {
      ret = [ ...ret, '[' + a + ']' ];
    }
  });
  return ret;
}

export default function({ data, meaning, words }) {
  let config = getConfig();
  checked = new Set();
  let i = 52;
  return render(
    <svg xmlns='http://www.w3.org/2000/svg' xmlnsXlink='http://www.w3.org/1999/xlink' width={config.width} height={config.height}>
      <rect width={config.width} height={config.height} stroke='#123456' strokeWidth={2} fill='white' />
      <line x1={12} y1={26-18} x2={12} y2={26} style={{stroke: 'gray', strokeWidth: 1}} />
      <text x={16} y={24} fontSize={18} fontFamily={"Noto Serif CJK SC"}>{data.sentence}</text>
      <text x={16} y={38} fontSize={10} fontFamily={"Noto Serif"} fill="#606060">{meaning}</text>
      {data.meanings.map(e => {
        if (!e.word || e.noDecompose) { return null; }
        e.word = e.word.trim();
        let worddata = words ? words[e.word] : null;
        if ('.,!?。，！？［］[] /|\\（）()'.includes(e.word) || e.word == '' || (worddata && worddata.excludeWord)) {
          return null;
        }
        let elem = <text x={16} y={i} fontSize={10} fontFamily={"Noto Serif CJK SC"}>{e.word}</text>;
        let ret = <React.Fragment key={e.word}>
          {elem}
          {e.defs.map((def) => {
            if (def.definition == '<DEL>' || def.definition.trim() == '') {
              return null;
            }
            let t = <text x={18 + e.word.length * 10} y={i} fontSize={10} fontFamily={"Noto Serif"}>{def.pinyin} → {def.definition}</text>;
            i += 10;
            return t;
          })}
          {(e.word = e.word.trim(), null)}
          {[...e.word].map((w, idx, all) => {
            let d = null;
            let t = null;
            if (e.word.length > 0 && w != e.word) {
              let rdef = hanzi.getRadicalMeaning(w);
              let a = '';
              if (rdef != 'N/A') {
                a = '< ' + w + ' → ' + rdef + ' >';
              } else {
                a = annotateDefinition(define(w, words));
              }
              if (a && a.trim() != '') {
                d = <text x={24} y={i} fontSize={10} fontFamily={"Noto Serif CJK SC"}>{a}</text>;
                i += 11;
              }
            }
            let ls = annotate(decompose(w), words).filter(l => l && l[0][2] != w);
            if (ls.length > 0) {
              t = <text x={32} y={i} fontSize={10} fontFamily={"Noto Serif CJK SC"}>{ls.join(' ').trim()}</text>;
              i += 11;
            }
            return <React.Fragment key={`w${idx}`}>{d}{t}</React.Fragment>;
          })}
          
        </React.Fragment>;
        return ret;
      })}
    </svg>
  );
}