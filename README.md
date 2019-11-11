# HunZhongWen

CLI Chinese card generator for some study.

## Installing

```bash
$ npm i -g hunzhongwen
# or
$ yarn global add hunzhongwen
```

## Usage

```
Usage: hunzhongwen [options] [command]

Options:
  -V, --version       output the version number
  -d, --data          # accepts path to the data.json
  -o, --output        # `compile` output
  -c, --config        # path to config.json, defaults to ./config.json
  -h, --help          output usage information

Commands:
  compile <sentence>  Compiles a card
  compile-all         Compiles all cards
  init-config         Initialize hunzhongwen projec
```

## Some more data examples

```json
[
  {
    "sentence": "我 去 阅览室 看 书 和 画报。",
    "meaning": "Я пошел в читальный зал почитать книги и журналы.",
    "words": {
      "我": { "excludeWord": true },
      "去": { "excludeWord": true },
      "看": { "include": [ "read" ] },
      "书": { "include": [ "book" ] },
      "和": { "include": [ "and" ], "exclude": [ "Taiwan" ] },
      "画报": { "include": [ "magazine" ] }
    }
  },
  {
    "sentence": "在 我 去 学校 的 时候， 他 去 中国。",
    "meaning": "Когда я пошел в школу, он поехал в Китай.",
    "words": {
      "在": { "define": "When <A...>", "pinyin": "zai4" },
      "的": { "include": [ "possessive" ] },
      "时候": { "define": "<A...>, <B...>", "pinyin": "shi2 hou4" },
      "校": { "include": [ "school" ] },
      "我": { "excludeWord": true },
      "去": { "excludeWord": true },
      "他": { "excludeWord": true },
      "中国": { "excludeWord": true }
    }
  }
]
```