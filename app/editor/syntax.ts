import hljs from 'highlight.js';
import InlineBlot from 'quill/blots/inline';
import QuillSyntax, { CodeBlock } from 'quill/modules/syntax';

const languages = [
  {
    label: 'Bash',
    key: 'bash',
    aliases: ['sh', 'shell', 'zsh'],
    language: hljs.getLanguage('bash'),
  },
  {
    label: 'C++',
    key: 'cpp',
    aliases: ['c', 'cc', 'c++'],
    language: hljs.getLanguage('cpp'),
  },
  {
    label: 'C#',
    key: 'csharp',
    aliases: ['c#'],
    language: hljs.getLanguage('csharp'),
  },
  {
    label: 'Clojure',
    key: 'clojure',
    aliases: ['clj', 'cl2', 'cljc', 'cljs'],
    language: hljs.getLanguage('clojure'),
  },
  {
    label: 'CSS/SCSS',
    key: 'scss',
    aliases: ['css'],
    language: hljs.getLanguage('scss'),
  },
  {
    label: 'Diff',
    key: 'diff',
    aliases: ['patch'],
    language: hljs.getLanguage('diff'),
  },
  {
    label: 'Dockerfile',
    key: 'dockerfile',
    aliases: ['docker'],
    language: hljs.getLanguage('dockerfile'),
  },
  {
    label: 'Elixir',
    key: 'elixir',
    aliases: ['ex', 'exs'],
    language: hljs.getLanguage('elixir'),
  },
  { label: 'Elm', key: 'elm', aliases: [], language: hljs.getLanguage('elm') },
  {
    label: 'Erlang',
    key: 'erlang',
    aliases: ['erl', 'es'],
    language: hljs.getLanguage('erlang'),
  },
  {
    label: 'Go',
    key: 'go',
    aliases: ['golang'],
    language: hljs.getLanguage('go'),
  },
  {
    label: 'Haskell',
    key: 'haskell',
    aliases: ['hs', 'hsc'],
    language: hljs.getLanguage('haskell'),
  },
  {
    label: 'HTML/XML',
    key: 'xml',
    aliases: ['htm', 'html', 'xhtml'],
    language: hljs.getLanguage('xml'),
  },
  {
    label: 'HTTP',
    key: 'http',
    aliases: ['curl', 'http'],
    language: hljs.getLanguage('http'),
  },
  {
    label: 'Java',
    key: 'java',
    aliases: [],
    language: hljs.getLanguage('java'),
  },
  {
    label: 'JavaScript',
    key: 'javascript',
    aliases: ['js', 'node', 'nodejs'],
    language: hljs.getLanguage('javascript'),
  },
  {
    label: 'Kotlin',
    key: 'kotlin',
    aliases: ['kt', 'ktm', 'kts'],
    language: hljs.getLanguage('kotlin'),
  },
  {
    label: 'Objective-C',
    key: 'objectivec',
    aliases: ['obj-c', 'objc'],
    language: hljs.getLanguage('objectivec'),
  },
  {
    label: 'PowerShell',
    key: 'powershell',
    aliases: [],
    language: hljs.getLanguage('powershell'),
  },
  { label: 'PHP', key: 'php', aliases: [], language: hljs.getLanguage('php') },
  {
    label: 'Python',
    key: 'python',
    aliases: ['py'],
    language: hljs.getLanguage('python'),
  },
  {
    label: 'Ruby',
    key: 'ruby',
    aliases: ['jruby', 'rake', 'rb'],
    language: hljs.getLanguage('ruby'),
  },
  { label: 'R', key: 'r', aliases: [], language: hljs.getLanguage('r') },
  {
    label: 'Rust',
    key: 'rust',
    aliases: ['rs'],
    language: hljs.getLanguage('rust'),
  },
  {
    label: 'Scala',
    key: 'scala',
    aliases: [],
    language: hljs.getLanguage('scala'),
  },
  {
    label: 'SQL',
    key: 'sql',
    aliases: ['psql'],
    language: hljs.getLanguage('sql'),
  },
  {
    label: 'Swift',
    key: 'swift',
    aliases: [],
    language: hljs.getLanguage('swift'),
  },
  {
    label: 'Typescript',
    key: 'typescript',
    aliases: ['ts', 'tsx'],
    language: hljs.getLanguage('typescript'),
  },
  {
    label: 'YAML',
    key: 'yaml',
    aliases: ['yml'],
    language: hljs.getLanguage('yaml'),
  },
];

const languageMap: { [key: string]: string } = {};
const filtered = languages.map(({ key, label, aliases }) => {
  languageMap[key] = key;
  aliases.forEach((alias) => {
    languageMap[alias] = key;
  });
  return { key, label };
});

CodeBlock.allowedChildren.push(InlineBlot);

export class Syntax extends QuillSyntax {
  static DEFAULTS = {
    hljs,
    interval: 1000,
    languages: [{ label: 'Plain', key: 'plain' }].concat(filtered),
  };

  highlight(...args: any[]) {
    if (this.quill.selection.mouseDown) {
      return;
    }
    super.highlight(...args);
  }
}

export function identifyLanguage(key: string) {
  return languageMap[key.toLowerCase()] || true;
}
