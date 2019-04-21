import XRegExp from 'xregexp';
import generate from 'project-name-generator';
import kebabCase from 'lodash/kebabCase';
import camelCase from 'lodash/camelCase';

export default function outspoken(specification, options) {

  const results = {list:[]};

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

      results.list.push(result);

    }
    else if (matchData) {
      //let content = matchData.data.split(/,/).map(i=>i.trim());
      const content = matchData.data;
      results.list[results.list.length - 1][matchData.label] = content;
      //console.log('@>>>>> ' + matchData.label + ':' + matchData.data)
    }


  });

  let moduleImport = [];
  let moduleRequire = [];
  results.list.forEach(function(item){
    moduleImport.push(`import ${camelCase(item.module)} from '${item.module}';`);
    moduleRequire.push(`const ${camelCase(item.module)} = require(${item.module});`);

  })
  results.moduleImport = moduleImport.join('\n');
  results.moduleRequire = moduleRequire.join('\n');

  let alpha = ['const result = '];
  let omega = [';'];
  results.list.forEach(function(item){
    alpha.push(`${camelCase(item.module)}(configuration, `);
    omega.unshift(`)`);
  })
  results.terseCode = alpha.concat(omega).join('');

  let verboseCode = [];
  let previousContentName = 'null';
  results.list.forEach(function(item){
    let contentName = camelCase(item.module + '-response');
    verboseCode.push(`// ${item.data}`);
    verboseCode.push(`const ${contentName} = ${camelCase(item.module)}(configuration, ${previousContentName});\n`);
    previousContentName = contentName;
  })
  results.verboseCode = verboseCode.join('\n');


  return results;

}
