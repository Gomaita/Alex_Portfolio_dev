export const interviewQuestions = [
  {
    category: 'JavaScript',
    question: 'What is the difference between let and const?',
    answer:
      '`let` allows reassignment, while `const` prevents reassignment of the binding. Objects declared with `const` can still have their properties changed.',
  },
  {
    category: 'JavaScript',
    question: 'Why do we use async/await?',
    answer:
      'It makes asynchronous code easier to read by letting promises look like step-by-step code, while still requiring try/catch for errors.',
  },
  {
    category: 'React',
    question: 'What is state in React?',
    answer:
      'State is data owned by a component. When state changes, React re-renders the UI so it matches the latest data.',
  },
  {
    category: 'React',
    question: 'What is a controlled form input?',
    answer:
      'A controlled input gets its value from React state and updates that state through an onChange handler.',
  },
  {
    category: 'SQL',
    question: 'What does JOIN do in SQL?',
    answer:
      'JOIN combines rows from multiple tables using a related column, such as a user id shared between users and orders.',
  },
  {
    category: 'Git',
    question: 'Why use branches in Git?',
    answer:
      'Branches let you work on features or fixes separately from the main codebase, making changes easier to review and merge.',
  },
]
