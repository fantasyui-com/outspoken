import XRegExp from 'xregexp';
import generate from 'project-name-generator';
import kebabCase from 'lodash/kebabCase';
import camelCase from 'lodash/camelCase';

export default function outspoken({source, options}) {

  const output = {
    developmentStatus: {},
    unitTests: {},
    compile: {},
    server: {},
  };

  const lineList = source.split(/\n/);
  const sectionMatcher = /^ *(#{1,6}) *([^\n]+?) *(?:#+ *)?(?:\n+|$)/;

  const state = {
    name: '',
    depth: 0,
    path: [],
  };

  const abstract = [];
  lineList.forEach(function(line) {
    let sectionMatch = sectionMatcher.exec(line);
    if (sectionMatch) { // alter state
      let about = {};
      about.title = sectionMatch[2].trim();
      about.depth = sectionMatch[1].length;
      state.name = about.title;
      state.depth = about.depth;
      state.path[about.depth - 1] = about.title
      state.path = state.path.slice(0, about.depth)
    }
    else { // log data
      if (line.trim()) {
        const previous = abstract[abstract.length - 1];
        const current = {
          depth: state.depth,
          path: state.path.slice(0),
          data: [line]
        };
        if ((previous) && (previous.path.join() === current.path.join())) {
          previous.data.push(line);
        }
        else {
          abstract.push(current);
        }

      } // if line
    }
  });


  // Iterate over abstract syntax extrtacting PROCEDURE DIVISION items
  const content = [];
  abstract.forEach(function(item) {
    if (item.path.includes('PROCEDURE DIVISION')) {
      content.push(item);
    }
  })

  // Interpret special lines
  content.forEach(function(item) {

    const results = [];

    item.data.map(i => i.trim()).filter(i => i.length)
    .forEach((line, index) => {

        const result = {options:{}};

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
          results[results.length - 1].options[matchData.label] = content;
          //console.log('@>>>>> ' + matchData.label + ':' + matchData.data)
        }





    });

    item.data = results;

  })

  //

  console.log(JSON.stringify(content, null, ' '));

// TODO: CODE GENERATION that takes multiple programs under consideration, this will occur on DIVISION LEVEL


  // let moduleImport = [];
  // let moduleRequire = [];
  // results.list.forEach(function(item){
  //   moduleImport.push(`import ${camelCase(item.module)} from '${item.module}';`);
  //   moduleRequire.push(`const ${camelCase(item.module)} = require(${item.module});`);
  //
  // })
  // results.moduleImport = moduleImport.join('\n');
  // results.moduleRequire = moduleRequire.join('\n');
  //
  // let alpha = ['const result = '];
  // let omega = [';'];
  // results.list.forEach(function(item){
  //   alpha.push(`${camelCase(item.module)}(configuration, `);
  //   omega.unshift(`)`);
  // })
  // results.terseCode = alpha.concat(omega).join('');
  //
  // let verboseCode = [];
  // let previousContentName = 'null';
  // results.list.forEach(function(item){
  //   let contentName = camelCase(item.module + '-response');
  //   verboseCode.push(`// ${item.data}`);
  //   verboseCode.push(`const ${contentName} = ${camelCase(item.module)}(configuration, ${previousContentName});\n`);
  //   previousContentName = contentName;
  // })
  // results.verboseCode = verboseCode.join('\n');




  return output;


}
