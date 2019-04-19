import * as Ix from 'ix';

export default function outspoken(str) {
    // console.log(`OUTSPOKEN ${str}`)
    let list = str.split(/\n/)

    let counter = 0;
    async function* gen(list) {

      for(let x = 0; x < list.length; x++){
        let item = list[x];
        yield new Promise(resolve => {
          setTimeout(function() {
            counter ++;
            resolve(item);
            //console.log("fast promise is done");
          }, 2000);
        });

      }

    }

    const results = Ix.AsyncIterable.from(gen(list))
      .filter(x => true)
      .map(x => x);

      return results;

}
