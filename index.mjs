import XRegExp from 'xregexp';
import generate from 'project-name-generator';
import kebabCase from 'lodash/kebabCase';
import camelCase from 'lodash/camelCase';

export default function outspoken({ source, options }) {

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
      /////////////////////////////////////
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
          code: [line]
        };
        if ((previous) && (previous.path.join() === current.path.join())) {
          previous.code.push(line);
        }
        else {
          abstract.push(current);
        }

      } // if line
    }
  });


  // Iterate over abstract syntax of the entire readme file extrtacting PROCEDURE DIVISION items, and skipping over the rest
  const content = [];
  abstract.forEach(function(item) {
    if (item.path.includes('PROCEDURE DIVISION')) {
      content.push(item);
    }
  })

  // Interpret special lines within the string lines of code
  content.forEach(function(item) {
    const results = [];
    item.code.map(i => i.trim()).filter(i => i.length).forEach((line, index) => {
        const result = {
          arguments: {}
        };
        const matchPipe = XRegExp.exec(line, XRegExp(`^- *(?<text>.+)$`));
        const matchModule = XRegExp.exec(line, XRegExp(`^- *.*using (?<name>[0-9a-z-]+)`));
        const matchData = XRegExp.exec(line, XRegExp(`^\\* *(?<label>[a-zA-Z0-9-]+): *(?<data>.+)$`));
        if (matchPipe) {
          result.number = index;
          result.data = matchPipe.text;
          if (matchModule) {
            result.module = matchModule.name;
          }
          else {
            result.module = kebabCase(matchPipe.text)
          }
          results.push(result);
        }
        else if (matchData) {
          //let content = matchData.data.split(/,/).map(i=>i.trim());
          const label = matchData.label;
          let content = matchData.data;
          if(label.endsWith('List')){
            content = matchData.data.split(/,/).map(i=>i.trim()).filter(i=>i);
          }
          results[results.length - 1].arguments[label] = content;
        }
      });
    item.code = results;
  })

  // Convert content to programs object
  const programs = {};
  content.forEach(function(item) {
    let name = item.path[item.path.length - 1]; // let camelName = camelCase(item.path.join('-'));
    if (!programs[name]) programs[name] = { meta: { name, path: item.path }, data: [] };
    programs[name].data = programs[name].data.concat(item.code);
  })

  // CODE GENERATION DIVISION
  Object.keys(programs).forEach(function(programName) {
    const program = programs[programName];
    program.meta.module = {};
    program.meta.code = {};
    let moduleImport = [];
    let moduleRequire = [];
    program.data.forEach(function(item, index) {
      moduleImport.push(`import ${camelCase(item.module)} from '${item.module}';`);
      moduleRequire.push(`const ${camelCase(item.module)} = require(${item.module});`);
    });
    program.meta.module.import = moduleImport.join('\n');
    program.meta.module.require = moduleRequire.join('\n');
    let alpha = ['const result = '];
    let omega = [';'];
    program.data.forEach(function(item, index) {
      alpha.push(`${camelCase(item.module)}(${JSON.stringify(item.arguments)}, `);
      omega.unshift(`)`);
    })
    program.meta.code.terse = alpha.concat(omega).join('');
    let verboseCode = [];
    let previousContentName = 'null';
    program.data.forEach(function(item, index) {
      let contentName = camelCase(item.module + '-response');
      verboseCode.push(`// ${item.data}`);
      verboseCode.push(`const ${contentName} = ${camelCase(item.module)}(${JSON.stringify(item.arguments)}, ${previousContentName});\n`);
      previousContentName = contentName;
    })
    program.meta.code.verbose = verboseCode.join('\n');
  });


  // console.log(JSON.stringify(programs, null, ' '));

  const ready = function(){
    // check if all modules are present
  }

  const compile = function(){
    // create program.mjs
    // create testing.mjs
  }

  const test = function(){
    // run testing.mjs
  }

  const serve = function(){
    // run program.mjs
  }

  const response = {
    debug:programs,

    ready,
    compile,
    test,
    serve,
  }

  return response;


}
