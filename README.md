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