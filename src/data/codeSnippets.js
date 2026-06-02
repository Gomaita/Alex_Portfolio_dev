export const codeSnippets = [
  {
    id: 'react-controlled-input',
    title: 'Controlled input',
    language: 'React',
    description: 'Keep form input value in React state.',
    code: 'const [name, setName] = useState("");\n\n<input\n  value={name}\n  onChange={(event) => setName(event.target.value)}\n/>',
  },
  {
    id: 'react-filter-list',
    title: 'Filter a list',
    language: 'React',
    description: 'Derive visible items from search state.',
    code: 'const visibleItems = items.filter((item) =>\n  item.title.toLowerCase().includes(search.toLowerCase())\n);',
  },
  {
    id: 'js-fetch-error',
    title: 'Fetch with error handling',
    language: 'JavaScript',
    description: 'Handle failed HTTP responses and network errors.',
    code: 'try {\n  const response = await fetch(url);\n\n  if (!response.ok) {\n    throw new Error("Request failed");\n  }\n\n  const data = await response.json();\n} catch (error) {\n  setError(error.message);\n}',
  },
  {
    id: 'js-localstorage',
    title: 'localStorage persistence',
    language: 'JavaScript',
    description: 'Store and load local browser data.',
    code: 'localStorage.setItem("projects", JSON.stringify(projects));\n\nconst storedProjects = JSON.parse(\n  localStorage.getItem("projects") || "[]"\n);',
  },
  {
    id: 'sql-basic-select',
    title: 'Filtered SQL query',
    language: 'SQL',
    description: 'Select rows with ordering and a limit.',
    code: 'SELECT name, email\nFROM users\nWHERE role = "developer"\nORDER BY created_at DESC\nLIMIT 10;',
  },
  {
    id: 'git-feature-branch',
    title: 'Feature branch workflow',
    language: 'Git',
    description: 'Create a branch, commit and push it.',
    code: 'git switch -c feature/weather-demo\ngit add .\ngit commit -m "Add weather demo"\ngit push -u origin feature/weather-demo',
  },
]
