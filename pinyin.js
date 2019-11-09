// MIT https://raw.githubusercontent.com/johnheroy/prettify-pinyin/master/index.js

var replacements = {
  'a': ['ā', 'á', 'ǎ', 'à'],
  'e': ['ē', 'é', 'ě', 'è'],
  'u': ['ū', 'ú', 'ǔ', 'ù'],
  'i': ['ī', 'í', 'ǐ', 'ì'],
  'o': ['ō', 'ó', 'ǒ', 'ò'],
  'ü': ['ǖ', 'ǘ', 'ǚ', 'ǜ']
};

var medials = ['i', 'u', 'ü'];

export default function prettify(str) {
  str = str.replace('v', 'ü');
  var syllables = str.split(' ');

  for (var i = 0; i < syllables.length; i++){
    var syllable = syllables[i];
    var tone = parseInt(syllable[syllable.length-1]);
    
    if (tone <= 0 || tone > 5) {
      console.error('invalid tone number:', tone, 'in', syllable);
    } else if (tone === 5){
      syllables[i] = syllable.slice(0, syllable.length - 1);
    } else {
      for (var j = 0; j < syllable.length; j++){
        var currentLetter = syllable[j];
        var nextLetter = syllable[j + 1];

        // found a vowel
        if (replacements[currentLetter]){
          var replaced;
          var letterToReplace;

          // two consecutive vowels
          if (replacements[nextLetter] && medials.indexOf(currentLetter) >= 0){
            letterToReplace = nextLetter;
          } else {
            letterToReplace = currentLetter;
          }

          replaced = syllable.replace(letterToReplace, replacements[letterToReplace][tone - 1]);
          syllables[i] = replaced.slice(0, replaced.length - 1);
          break;
        }
      }  
    }

  }
  return syllables.join(' ');
};