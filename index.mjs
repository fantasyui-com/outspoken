import XRegExp from 'xregexp';
import generate from 'project-name-generator';
import kebabCase from 'lodash/kebabcase';

export default function outspoken(specification, options) {

  const results = [];

  specification.split(/\n/).map(i => i.trim()).filter(i => i.length).forEach((line, index) => {
    const result = {};

    const matchPipe = XRegExp.exec(line, XRegExp(`^- *(?<text>.+)$`));
    const matchModule = XRegExp.exec(line, XRegExp(`^- *.*using (?<name>[0-9a-z-]+)`));
    const matchData = XRegExp.exec(line, XRegExp(`^\\* *(?<label>[a-zA-Z0-9-]+): *(?<data>.+)$`));

    if (matchPipe) {
      //result.type = 'pipe';
      //result.label = currentLabel;
      result.number = index;
      result.data = matchPipe.text;
      if (matchModule) {
        result.module = matchModule.name;
      }else{
        //result.module = generate({ words: 3}).dashed;
        result.module = kebabCase(matchPipe.text)
      }

      results.push(result);

    }
    else if (matchData) {
      //let content = matchData.data.split(/,/).map(i=>i.trim());
      const content = matchData.data;
      results[results.length - 1][matchData.label] = content;
      //console.log('@>>>>> ' + matchData.label + ':' + matchData.data)
    }


  });
  return results;

}
