// import { Document, Media, Header, Footer, Packer, Paragraph } from "docx";
import officegen from 'officegen';
import LookupManager from './dict-lookup';
import genpng from './genpng';
import fs from 'fs';
import { getConfig } from './config.js';

export default async function(data) {
  console.log('Generating document');

  data = data.map(d => {
    return {
      ...d,
      data: (new LookupManager()).lookup(d.sentence, d.words),
    }
  });

  const doc = officegen({
    type: 'docx',
    pageMargins: { top: '6mm', right: '6mm', bottom: '6mm', left: '6mm' },
  });

  doc.on('error', function(err) {
    console.log(err)
  })

  let pObj = null;
  
  let counter = 0;
  for (let di in data) {
    if (counter % 2 === 0) {
      pObj = doc.createP({
        spacing: {
          before: 0,
          after: 0,
          lineRule: 0,
          beforeAutospacing: 0,
          afterAutospacing: 0,
        },
      });
    }
    let d = data[di];
    let res = await genpng(d, counter);
    counter = res.counter;
    let config = getConfig();
    pObj.addImage(res.path, { cx: config.width, cy: config.height });
  }

  if (fs.existsSync('hunzhongwen-document.docx')) {
    fs.unlinkSync('hunzhongwen-document.docx');
  }
  let out = fs.createWriteStream('hunzhongwen-document.docx')
  doc.generate(out);
  
  console.log('Generated hunzhongwen-document.docx');
}