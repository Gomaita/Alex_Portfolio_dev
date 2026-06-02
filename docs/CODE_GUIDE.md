# Code Guide

## 1. Overview

This portfolio is a React application for Alex Gómez, a Junior Software Developer with a Multimedia Engineering and 3D/interactive background. The site presents a landing page, technical demos, project case studies, cheatsheets, contact information and documentation.

The project is organized around a simple idea: pages handle routes, components render reusable UI, data files store structured content, and services handle external API logic.

## 2. Entry Point

`src/main.jsx` mounts the React application into the HTML root element and wraps the app with `BrowserRouter`.

`src/App.jsx` defines the main layout with `Navbar`, routed page content and `Footer`.

React Router controls which page renders for each URL.

## 3. Folder Structure

`src/components` contains reusable UI components and technical demos.

`src/pages` contains route-level pages such as Home, Portfolio, About, Contact, Cheatsheets and ProjectDetail.

`src/data` contains structured content used by the UI: projects, cheatsheets, skills, tech stack and interview questions.

`src/services` contains API logic. Keeping API code here avoids mixing fetch logic directly into UI components.

`public` contains public files served from the root URL, such as the downloadable CV.

`docs` contains documentation for understanding and deploying the project.

## 4. Routing

`/` renders the Home page.

`/portfolio` renders the Portfolio page with technical demos and project cards.

`/portfolio/:slug` renders a dynamic project detail page.

`/about` renders the About page.

`/contact` renders the Contact page.

`/cheatsheets` renders the cheatsheet index.

`/cheatsheets/:slug` renders one cheatsheet detail page.

`*` renders the NotFound page for missing routes.

## 5. Components

`Navbar` renders desktop and mobile navigation with active route styles.

`Footer` renders a simple footer with ownership and stack information.

`Hero` renders the main landing section with profile copy, CTA links and CV download.

`ProjectCard` renders one project preview and links to `/portfolio/:slug`.

`MarketDashboard` fetches crypto prices from CoinGecko and displays loading, error and data states.

`ProjectManagerDemo` demonstrates local CRUD, controlled forms, filters and localStorage.

`WeatherSearchDemo` demonstrates a weather lookup UI with validation, service separation, fallback data and conditional rendering.

`GitHubProjectsExplorer` demonstrates public API consumption, dynamic lists, filtering and sorting.

`TechStackExplorer` groups skills by category and allows category filtering.

`InterviewPrepTool` provides a small study tool with categories, answers and progress.

`ApiStatePlayground` demonstrates idle, loading, success, error and empty UI states.

`CodeSnippetLibrary` renders searchable, copyable snippets for practical development patterns.

`LearningRoadmap` explains the current learning focus and connects web development with the 3D/interactive background.

`Cheatsheets` renders the searchable cheatsheet index.

`CheatsheetDetail` renders a dynamic pocket-reference page with copyable snippets.

## 6. Data Files

`projects.js` contains project metadata and case-study content.

`cheatsheets.js` contains all cheatsheet pages and snippets.

`skills.js` contains simple skill names for the Home grid.

`techStack.js` groups technologies by category and level.

`interviewQuestions.js` contains questions for the interview prep mini tool.

`codeSnippets.js` contains small reusable snippets for the snippet library.

`learningRoadmap.js` contains the roadmap cards used on the About page.

`socialLinks.js` contains public contact links.

## 7. Services

`marketApi.js` fetches prices from CoinGecko.

`weatherApi.js` prepares OpenWeatherMap integration with `VITE_OPENWEATHER_API_KEY` and falls back to mock data when no key exists.

`githubApi.js` fetches public GitHub repositories and returns fallback data if the request fails or is rate-limited.

Services keep external data logic separate from UI rendering.

## 8. State Management

The project uses React `useState` for local component state.

`useEffect` is used for side effects such as fetching data or syncing localStorage.

Forms are controlled by React state, meaning input values are stored in state and updated through `onChange`.

Search, filters and sorting are handled with state plus derived arrays.

Project Manager stores data in `localStorage` so changes remain after refresh.

## 9. API Handling

API demos use `async/await` and `try/catch`.

Loading state shows skeletons or temporary UI.

Error state shows readable messages instead of crashing.

Fallback data keeps demos usable even when public APIs fail or keys are missing.

## 10. Styling

The project uses Tailwind CSS utility classes.

The visual style is dark with cyan, blue and violet accents.

Most UI is built from cards, badges, buttons and responsive grids.

Hover and focus states are included to make navigation feel clearer.

## 11. CV Download

The PDF should be placed at:

```text
public/Alex_Gomez_CV.pdf
```

Links in the app point to:

```text
/Alex_Gomez_CV.pdf
```

Avoid exposing unnecessary private information in the UI.

## 12. How To Add A New Project

1. Add a new object in `src/data/projects.js`.
2. Include `slug`, `title`, `description`, `technologies`, `features`, `technicalHighlights`, `challenges` and `improvements`.
3. The Project Gallery will render the card automatically.
4. The detail page will work at `/portfolio/your-slug`.
5. If there is a demo section, add a `demoRoute` hash link.

## 13. How To Add A New Cheatsheet

1. Add a new object in `src/data/cheatsheets.js`.
2. Give it a unique `slug`.
3. Add `sections`, each with `items`.
4. Each item needs `code` and `note`.
5. Visit `/cheatsheets/your-slug`.

## 14. How To Add A New API Demo

1. Create a service in `src/services`.
2. Create a component in `src/components`.
3. Add loading, error, empty and success states.
4. Normalize external data before rendering it.
5. Integrate the component in Portfolio.
6. Add a project entry in `projects.js`.

## 15. Common Beginner Explanations

A component is a reusable piece of UI.

Props are values passed from a parent component to a child component.

State is data that changes over time and causes the UI to update.

A service is a helper file for API or integration logic.

A dynamic route is a URL with a variable part, such as `/portfolio/:slug`.

localStorage is browser storage that persists after refresh.

A variable of environment is configuration that should not be hard-coded.

The public folder contains files served directly from the site root.

## 16. Manual Testing Checklist

- Visit `/`, `/portfolio`, `/about`, `/contact`, `/cheatsheets`.
- Open project detail pages.
- Open cheatsheet detail pages.
- Test navbar desktop and mobile.
- Test Market API loading/error behavior.
- Test Project Manager create, edit, delete, filters and reset.
- Test Weather Search empty, loading, fallback and clear states.
- Test GitHub Explorer search, filter and sorting.
- Test cheatsheet search, filters and copy buttons.
- Test CV download link.
- Test responsive layout on mobile.
- Run a production build locally before deployment.
