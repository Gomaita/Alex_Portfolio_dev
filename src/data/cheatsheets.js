const i = (code, note) => ({ code, note })

export const cheatsheets = [
  {
    id: 'python',
    slug: 'python',
    title: 'Python',
    category: 'Programming Language',
    description:
      'Quick reference for Python syntax, data types, functions, loops, classes and common patterns.',
    iconText: 'Py',
    accent: 'cyan',
    sections: [
      {
        title: 'Variables & Types',
        items: [
          i('name = "Alex"', 'String variable'),
          i('age = 25', 'Integer number'),
          i('price = 19.99', 'Floating point number'),
          i('is_active = True', 'Boolean value'),
          i('value = None', 'Empty or missing value'),
        ],
      },
      {
        title: 'Lists & Dictionaries',
        items: [
          i('numbers = [1, 2, 3]', 'List of values'),
          i('numbers.append(4)', 'Add item to list'),
          i('first = numbers[0]', 'Read by index'),
          i('user = {"name": "Alex", "role": "Developer"}', 'Dictionary object'),
          i('role = user.get("role")', 'Safe dictionary access'),
        ],
      },
      {
        title: 'Conditionals & Loops',
        items: [
          i('if age >= 18:\n    print("Adult")', 'Basic conditional'),
          i('elif age > 12:\n    print("Teen")', 'Alternative condition'),
          i('else:\n    print("Child")', 'Fallback branch'),
          i('for item in numbers:\n    print(item)', 'Loop over list'),
          i('while count < 5:\n    count += 1', 'Loop while condition is true'),
        ],
      },
      {
        title: 'Functions & Classes',
        items: [
          i('def greet(name):\n    return f"Hello {name}"', 'Function with return value'),
          i('def add(a, b=0):\n    return a + b', 'Default parameter'),
          i('class User:\n    def __init__(self, name):\n        self.name = name', 'Basic class'),
          i('user = User("Alex")', 'Create class instance'),
          i('print(user.name)', 'Read instance attribute'),
        ],
      },
      {
        title: 'Files & Built-ins',
        items: [
          i('with open("file.txt", "r") as file:\n    content = file.read()', 'Read a file safely'),
          i('with open("file.txt", "w") as file:\n    file.write("Hello")', 'Write text to a file'),
          i('len(numbers)', 'Get collection length'),
          i('sorted(numbers)', 'Return sorted list'),
          i('sum(numbers)', 'Add numeric values'),
        ],
      },
    ],
  },
  {
    id: 'c',
    slug: 'c',
    title: 'C',
    category: 'Programming Language',
    description:
      'Quick reference for C structure, variables, arrays, pointers, functions and control flow.',
    iconText: 'C',
    accent: 'blue',
    sections: [
      {
        title: 'Basic Structure',
        items: [
          i('#include <stdio.h>', 'Import standard input/output'),
          i('int main(void) {\n    return 0;\n}', 'Program entry point'),
          i('printf("Hello\\n");', 'Print text to console'),
        ],
      },
      {
        title: 'Variables & Operators',
        items: [
          i('int age = 25;', 'Integer variable'),
          i('float price = 19.99f;', 'Floating point variable'),
          i('char grade = \'A\';', 'Single character'),
          i('int total = a + b;', 'Addition operator'),
        ],
      },
      {
        title: 'Conditionals & Loops',
        items: [
          i('if (age >= 18) {\n    printf("Adult");\n}', 'If statement'),
          i('else {\n    printf("Minor");\n}', 'Else branch'),
          i('for (int i = 0; i < 5; i++) {\n    printf("%d", i);\n}', 'For loop'),
          i('while (count < 5) {\n    count++;\n}', 'While loop'),
        ],
      },
      {
        title: 'Functions & Arrays',
        items: [
          i('int add(int a, int b) {\n    return a + b;\n}', 'Function returning int'),
          i('int numbers[3] = {1, 2, 3};', 'Fixed size array'),
          i('numbers[0] = 10;', 'Update array item'),
          i('sizeof(numbers) / sizeof(numbers[0])', 'Calculate array length'),
        ],
      },
      {
        title: 'Pointers',
        items: [
          i('int *ptr = &age;', 'Pointer to variable address'),
          i('printf("%d", *ptr);', 'Dereference pointer'),
          i('ptr = NULL;', 'Empty pointer'),
        ],
      },
    ],
  },
  {
    id: 'cpp',
    slug: 'cpp',
    title: 'C++',
    category: 'Programming Language',
    description:
      'Quick reference for C++ syntax, strings, vectors, functions, classes and standard library basics.',
    iconText: 'C++',
    accent: 'cyan',
    sections: [
      {
        title: 'Basic Structure',
        items: [
          i('#include <iostream>', 'Input/output library'),
          i('int main() {\n    return 0;\n}', 'Program entry point'),
          i('std::cout << "Hello" << std::endl;', 'Print to console'),
        ],
      },
      {
        title: 'Variables & Strings',
        items: [
          i('int age = 25;', 'Integer variable'),
          i('double price = 19.99;', 'Decimal number'),
          i('bool active = true;', 'Boolean value'),
          i('std::string name = "Alex";', 'String value'),
        ],
      },
      {
        title: 'Vectors',
        items: [
          i('std::vector<int> nums = {1, 2, 3};', 'Dynamic array'),
          i('nums.push_back(4);', 'Add item'),
          i('nums.at(0);', 'Safe indexed access'),
          i('nums.size();', 'Vector length'),
        ],
      },
      {
        title: 'Control Flow',
        items: [
          i('if (age >= 18) {\n    std::cout << "Adult";\n}', 'Conditional'),
          i('for (int n : nums) {\n    std::cout << n;\n}', 'Range-based loop'),
          i('while (count < 5) {\n    count++;\n}', 'While loop'),
        ],
      },
      {
        title: 'Functions & Classes',
        items: [
          i('int add(int a, int b) {\n    return a + b;\n}', 'Function'),
          i('class User {\npublic:\n    std::string name;\n};', 'Simple class'),
          i('User user;\nuser.name = "Alex";', 'Create object and set property'),
        ],
      },
    ],
  },
  {
    id: 'csharp',
    slug: 'csharp',
    title: 'C#',
    category: 'Programming Language',
    description:
      'Quick reference for C# variables, lists, methods, classes and common control flow.',
    iconText: 'C#',
    accent: 'violet',
    sections: [
      {
        title: 'Basic Structure',
        items: [
          i('using System;', 'Import namespace'),
          i('class Program {\n    static void Main() {}\n}', 'Console app entry point'),
          i('Console.WriteLine("Hello");', 'Print text'),
        ],
      },
      {
        title: 'Variables & Strings',
        items: [
          i('int age = 25;', 'Integer'),
          i('double price = 19.99;', 'Decimal number'),
          i('bool active = true;', 'Boolean'),
          i('string name = "Alex";', 'String'),
          i('$"Hello {name}"', 'String interpolation'),
        ],
      },
      {
        title: 'Lists & Control Flow',
        items: [
          i('List<int> nums = new List<int>();', 'Create list'),
          i('nums.Add(1);', 'Add list item'),
          i('if (age >= 18) { }', 'Conditional'),
          i('foreach (int n in nums) { }', 'Loop over list'),
        ],
      },
      {
        title: 'Methods',
        items: [
          i('static int Add(int a, int b) {\n    return a + b;\n}', 'Method with return'),
          i('static void Log(string text) {\n    Console.WriteLine(text);\n}', 'Void method'),
          i('Add(2, 3);', 'Call method'),
        ],
      },
      {
        title: 'Classes',
        items: [
          i('class User {\n    public string Name { get; set; }\n}', 'Class with property'),
          i('User user = new User();', 'Create instance'),
          i('user.Name = "Alex";', 'Set property'),
        ],
      },
    ],
  },
  {
    id: 'java',
    slug: 'java',
    title: 'Java',
    category: 'Programming Language',
    description:
      'Quick reference for Java classes, variables, arrays, ArrayList, methods and loops.',
    iconText: 'Ja',
    accent: 'blue',
    sections: [
      {
        title: 'Basic Structure',
        items: [
          i('public class Main { }', 'Class declaration'),
          i('public static void main(String[] args) { }', 'Program entry point'),
          i('System.out.println("Hello");', 'Print to console'),
        ],
      },
      {
        title: 'Variables & Strings',
        items: [
          i('int age = 25;', 'Integer'),
          i('double price = 19.99;', 'Decimal number'),
          i('boolean active = true;', 'Boolean'),
          i('String name = "Alex";', 'String object'),
        ],
      },
      {
        title: 'Arrays & ArrayList',
        items: [
          i('int[] nums = {1, 2, 3};', 'Array'),
          i('nums[0]', 'Read array item'),
          i('ArrayList<String> names = new ArrayList<>();', 'Dynamic list'),
          i('names.add("Alex");', 'Add item'),
        ],
      },
      {
        title: 'Control Flow',
        items: [
          i('if (age >= 18) { }', 'Conditional'),
          i('for (int i = 0; i < 5; i++) { }', 'For loop'),
          i('for (String name : names) { }', 'Enhanced for loop'),
          i('while (count < 5) { count++; }', 'While loop'),
        ],
      },
      {
        title: 'Methods & Classes',
        items: [
          i('static int add(int a, int b) {\n    return a + b;\n}', 'Static method'),
          i('class User {\n    String name;\n}', 'Simple class'),
          i('User user = new User();', 'Create object'),
        ],
      },
    ],
  },
  {
    id: 'html',
    slug: 'html',
    title: 'HTML',
    category: 'Web',
    description:
      'Quick reference for HTML structure, semantic elements, forms, tables and accessibility basics.',
    iconText: 'HTML',
    accent: 'cyan',
    sections: [
      {
        title: 'Basic Document',
        items: [
          i('<!doctype html>', 'HTML5 document type'),
          i('<html lang="en">', 'Root element with language'),
          i('<meta name="viewport" content="width=device-width, initial-scale=1.0">', 'Responsive viewport'),
          i('<title>Page title</title>', 'Browser tab title'),
        ],
      },
      {
        title: 'Text Tags',
        items: [
          i('<h1>Main heading</h1>', 'Primary heading'),
          i('<p>Paragraph text</p>', 'Paragraph'),
          i('<strong>Important</strong>', 'Strong importance'),
          i('<em>Emphasis</em>', 'Emphasized text'),
        ],
      },
      {
        title: 'Links, Images & Lists',
        items: [
          i('<a href="/about">About</a>', 'Link'),
          i('<img src="image.jpg" alt="Description">', 'Accessible image'),
          i('<ul><li>Item</li></ul>', 'Unordered list'),
          i('<ol><li>Step</li></ol>', 'Ordered list'),
        ],
      },
      {
        title: 'Forms & Tables',
        items: [
          i('<label for="email">Email</label>', 'Input label'),
          i('<input id="email" type="email">', 'Email field'),
          i('<button type="submit">Send</button>', 'Submit button'),
          i('<table><tr><td>Cell</td></tr></table>', 'Basic table'),
        ],
      },
      {
        title: 'Semantic & Accessibility',
        items: [
          i('<header>...</header>', 'Page header'),
          i('<main>...</main>', 'Primary content'),
          i('<nav aria-label="Main navigation">', 'Accessible navigation'),
          i('<button aria-label="Close menu">', 'Label icon-only buttons'),
        ],
      },
    ],
  },
  {
    id: 'css',
    slug: 'css',
    title: 'CSS',
    category: 'Web',
    description:
      'Quick reference for CSS selectors, layout, responsive design, transitions and variables.',
    iconText: 'CSS',
    accent: 'blue',
    sections: [
      {
        title: 'Selectors & Box Model',
        items: [
          i('.card { color: white; }', 'Class selector'),
          i('#app { min-height: 100vh; }', 'ID selector'),
          i('* { box-sizing: border-box; }', 'Predictable sizing'),
          i('padding: 1rem;', 'Inner spacing'),
          i('margin: 1rem;', 'Outer spacing'),
        ],
      },
      {
        title: 'Flexbox',
        items: [
          i('display: flex;', 'Enable flex layout'),
          i('justify-content: center;', 'Main axis alignment'),
          i('align-items: center;', 'Cross axis alignment'),
          i('gap: 1rem;', 'Space between items'),
        ],
      },
      {
        title: 'Grid',
        items: [
          i('display: grid;', 'Enable grid layout'),
          i('grid-template-columns: repeat(3, 1fr);', 'Three equal columns'),
          i('grid-column: span 2;', 'Span columns'),
          i('gap: 1rem;', 'Grid spacing'),
        ],
      },
      {
        title: 'Responsive & Positioning',
        items: [
          i('@media (max-width: 768px) { }', 'Responsive breakpoint'),
          i('position: relative;', 'Position relative to normal flow'),
          i('position: absolute;', 'Position relative to parent'),
          i('inset: 0;', 'Set all offsets to zero'),
        ],
      },
      {
        title: 'Transitions & Variables',
        items: [
          i('transition: all 0.2s ease;', 'Smooth property changes'),
          i(':root { --accent: #22d3ee; }', 'CSS variable'),
          i('color: var(--accent);', 'Use variable'),
          i('transform: translateY(-4px);', 'Move element visually'),
        ],
      },
    ],
  },
  {
    id: 'javascript',
    slug: 'javascript',
    title: 'JavaScript',
    category: 'Programming Language',
    description:
      'Quick reference for JavaScript variables, functions, arrays, objects, DOM and fetch.',
    iconText: 'JS',
    accent: 'cyan',
    sections: [
      {
        title: 'Variables & Functions',
        items: [
          i('const name = "Alex";', 'Constant binding'),
          i('let count = 0;', 'Mutable binding'),
          i('function greet(name) {\n  return `Hello ${name}`;\n}', 'Function declaration'),
          i('const add = (a, b) => a + b;', 'Arrow function'),
        ],
      },
      {
        title: 'Arrays',
        items: [
          i('const nums = [1, 2, 3];', 'Array literal'),
          i('nums.map((n) => n * 2);', 'Transform items'),
          i('nums.filter((n) => n > 1);', 'Filter items'),
          i('nums.reduce((sum, n) => sum + n, 0);', 'Reduce to a value'),
        ],
      },
      {
        title: 'Objects',
        items: [
          i('const user = { name: "Alex" };', 'Object literal'),
          i('user.name', 'Dot access'),
          i('const { name } = user;', 'Destructuring'),
          i('{ ...user, role: "Developer" }', 'Object spread'),
        ],
      },
      {
        title: 'Control Flow & DOM',
        items: [
          i('if (age >= 18) { }', 'Conditional'),
          i('for (const item of items) { }', 'Loop iterable'),
          i('document.querySelector(".card")', 'Select DOM element'),
          i('button.addEventListener("click", handleClick)', 'Listen to events'),
        ],
      },
      {
        title: 'Fetch API',
        items: [
          i('const res = await fetch(url);', 'Make HTTP request'),
          i('const data = await res.json();', 'Parse JSON response'),
          i('if (!res.ok) throw new Error("Failed");', 'Handle failed status'),
          i('try { } catch (error) { }', 'Catch runtime errors'),
        ],
      },
    ],
  },
  {
    id: 'typescript',
    slug: 'typescript',
    title: 'TypeScript',
    category: 'Programming Language',
    description:
      'Quick reference for TypeScript types, interfaces, unions, generics and React props basics.',
    iconText: 'TS',
    accent: 'blue',
    sections: [
      {
        title: 'Basic Types',
        items: [
          i('let name: string = "Alex";', 'String type'),
          i('let age: number = 25;', 'Number type'),
          i('let active: boolean = true;', 'Boolean type'),
          i('let value: string | null = null;', 'Nullable union'),
        ],
      },
      {
        title: 'Arrays & Objects',
        items: [
          i('const nums: number[] = [1, 2, 3];', 'Array of numbers'),
          i('const names: Array<string> = ["Alex"];', 'Generic array'),
          i('const user: { name: string } = { name: "Alex" };', 'Object shape'),
        ],
      },
      {
        title: 'Functions',
        items: [
          i('function add(a: number, b: number): number {\n  return a + b;\n}', 'Typed function'),
          i('const log = (text: string): void => {};', 'Void return'),
          i('function greet(name = "User") {}', 'Default parameter inference'),
        ],
      },
      {
        title: 'Interfaces & Aliases',
        items: [
          i('interface User { name: string; age: number; }', 'Interface'),
          i('type ID = string | number;', 'Type alias'),
          i('type Status = "idle" | "loading" | "error";', 'Literal union'),
        ],
      },
      {
        title: 'Generics & React Props',
        items: [
          i('function identity<T>(value: T): T {\n  return value;\n}', 'Generic function'),
          i('type ButtonProps = { label: string; onClick: () => void; };', 'React props type'),
          i('function Button({ label }: ButtonProps) { }', 'Typed props usage'),
        ],
      },
    ],
  },
  {
    id: 'sql',
    slug: 'sql',
    title: 'SQL',
    category: 'Database',
    description:
      'Quick reference for SQL queries, filtering, joins, grouping and data modification.',
    iconText: 'SQL',
    accent: 'cyan',
    sections: [
      {
        title: 'SELECT & WHERE',
        items: [
          i('SELECT * FROM users;', 'Read all columns'),
          i('SELECT name, email FROM users;', 'Read specific columns'),
          i('WHERE age >= 18', 'Filter rows'),
          i('WHERE name LIKE "A%"', 'Pattern matching'),
        ],
      },
      {
        title: 'ORDER BY & GROUP BY',
        items: [
          i('ORDER BY created_at DESC', 'Sort newest first'),
          i('LIMIT 10', 'Limit result count'),
          i('GROUP BY role', 'Group rows'),
          i('COUNT(*) AS total', 'Count grouped rows'),
        ],
      },
      {
        title: 'INSERT & UPDATE',
        items: [
          i('INSERT INTO users (name) VALUES ("Alex");', 'Create row'),
          i('UPDATE users SET name = "Alex" WHERE id = 1;', 'Update row'),
          i('DELETE FROM users WHERE id = 1;', 'Delete row'),
        ],
      },
      {
        title: 'JOIN',
        items: [
          i('SELECT * FROM orders\nJOIN users ON orders.user_id = users.id;', 'Inner join'),
          i('LEFT JOIN profiles ON profiles.user_id = users.id', 'Keep left rows'),
          i('ON table_a.id = table_b.a_id', 'Join condition'),
        ],
      },
      {
        title: 'Useful Clauses',
        items: [
          i('DISTINCT role', 'Unique values'),
          i('BETWEEN 10 AND 20', 'Range filter'),
          i('IN ("admin", "editor")', 'Match list of values'),
          i('HAVING COUNT(*) > 1', 'Filter grouped results'),
        ],
      },
    ],
  },
  {
    id: 'git',
    slug: 'git',
    title: 'Git',
    category: 'Tools',
    description:
      'Quick reference for Git setup, branches, commits, remotes, merge, stash and useful commands.',
    iconText: 'Git',
    accent: 'violet',
    sections: [
      {
        title: 'Setup & Repository Basics',
        items: [
          i('git config --global user.name "Alex"', 'Set username'),
          i('git config --global user.email "email@example.com"', 'Set email'),
          i('git init', 'Create repository'),
          i('git status', 'Check working tree'),
        ],
      },
      {
        title: 'Commits',
        items: [
          i('git add .', 'Stage changes'),
          i('git commit -m "Add feature"', 'Create commit'),
          i('git log --oneline', 'Compact history'),
          i('git diff', 'View unstaged changes'),
        ],
      },
      {
        title: 'Branches',
        items: [
          i('git branch', 'List branches'),
          i('git switch -c feature/demo', 'Create and switch branch'),
          i('git switch main', 'Switch branch'),
          i('git branch -d feature/demo', 'Delete branch'),
        ],
      },
      {
        title: 'Remote',
        items: [
          i('git remote -v', 'List remotes'),
          i('git remote add origin <url>', 'Add remote'),
          i('git push -u origin main', 'Push and track branch'),
          i('git pull', 'Fetch and merge remote changes'),
        ],
      },
      {
        title: 'Merge & Stash',
        items: [
          i('git merge feature/demo', 'Merge branch'),
          i('git stash', 'Temporarily save changes'),
          i('git stash pop', 'Restore stashed changes'),
          i('git restore file.js', 'Discard file changes'),
        ],
      },
    ],
  },
  {
    id: 'bash',
    slug: 'bash',
    title: 'Bash / Terminal',
    category: 'Tools',
    description:
      'Quick reference for terminal navigation, files, search, processes, environment variables and redirection.',
    iconText: '$',
    accent: 'cyan',
    sections: [
      {
        title: 'Navigation',
        items: [
          i('pwd', 'Print current directory'),
          i('ls', 'List files'),
          i('cd folder', 'Enter folder'),
          i('cd ..', 'Move up one directory'),
        ],
      },
      {
        title: 'Files & Folders',
        items: [
          i('touch file.txt', 'Create file'),
          i('mkdir src', 'Create folder'),
          i('cp a.txt b.txt', 'Copy file'),
          i('mv old.txt new.txt', 'Move or rename'),
        ],
      },
      {
        title: 'Search',
        items: [
          i('grep "text" file.txt', 'Search text in file'),
          i('find . -name "*.js"', 'Find files by pattern'),
          i('cat file.txt', 'Print file content'),
          i('head file.txt', 'Show first lines'),
        ],
      },
      {
        title: 'Processes & Permissions',
        items: [
          i('ps aux', 'List processes'),
          i('kill 1234', 'Stop process by PID'),
          i('chmod +x script.sh', 'Make script executable'),
          i('sudo command', 'Run with elevated permissions'),
        ],
      },
      {
        title: 'Environment & Redirection',
        items: [
          i('export API_KEY=value', 'Set environment variable'),
          i('echo $API_KEY', 'Read environment variable'),
          i('command > output.txt', 'Redirect output'),
          i('command | grep text', 'Pipe output to another command'),
        ],
      },
    ],
  },
  {
    id: 'react',
    slug: 'react',
    title: 'React',
    category: 'Framework',
    description:
      'Quick reference for React components, props, state, events, lists, effects and forms.',
    iconText: 'Re',
    accent: 'cyan',
    sections: [
      {
        title: 'Component & Props',
        items: [
          i('function Card() {\n  return <div />;\n}', 'Function component'),
          i('function UserCard({ name }) { }', 'Receive props'),
          i('<UserCard name="Alex" />', 'Pass prop'),
          i('{children}', 'Render nested content'),
        ],
      },
      {
        title: 'State & Events',
        items: [
          i('const [count, setCount] = useState(0);', 'State hook'),
          i('setCount(count + 1);', 'Update state'),
          i('<button onClick={handleClick}>Click</button>', 'Click event'),
          i('event.preventDefault();', 'Prevent form submit reload'),
        ],
      },
      {
        title: 'Conditional Rendering',
        items: [
          i('{isLoading && <Spinner />}', 'Render when true'),
          i('{error ? <Error /> : <Content />}', 'Either/or rendering'),
          i('{items.length === 0 && <EmptyState />}', 'Empty state'),
        ],
      },
      {
        title: 'Lists',
        items: [
          i('{items.map((item) => <Card key={item.id} />)}', 'Render list'),
          i('key={item.id}', 'Stable key for list items'),
          i('items.filter((item) => item.active)', 'Filter before rendering'),
        ],
      },
      {
        title: 'useEffect & Forms',
        items: [
          i('useEffect(() => {\n  fetchData();\n}, []);', 'Run on mount'),
          i('useEffect(() => {\n  return () => cleanup();\n}, []);', 'Cleanup effect'),
          i('<input value={name} onChange={(e) => setName(e.target.value)} />', 'Controlled input'),
          i('<form onSubmit={handleSubmit}>', 'Form submit handler'),
        ],
      },
    ],
  },
]

export const cheatsheetCategories = [
  'All',
  'Programming Language',
  'Web',
  'Tools',
  'Framework',
  'Database',
]

export function getCheatsheetBySlug(slug) {
  return cheatsheets.find((cheatsheet) => cheatsheet.slug === slug)
}
