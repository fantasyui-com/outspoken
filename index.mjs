import * as Ix from 'ix';

export default function outspoken(specification, options) {


  specification.split(/\n/).forEach((line)=>{

      registered.forEach((matcher)=>{
        const match = XRegExp.exec(line, XRegExp(matcher.expression) );
        if(match) {
          result.push({name:matcher.event, data:match})
        }
      })

    });

  return results;
}
