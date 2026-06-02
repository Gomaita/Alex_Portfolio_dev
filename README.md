# Alex Gómez — Software Developer Portfolio

## Description

A personal portfolio built with React, Vite and Tailwind CSS to showcase frontend projects, API consumption, CRUD operations, dynamic routes, cheatsheets and interactive developer tools.

## Purpose

This project is designed to demonstrate practical junior developer skills through small but complete technical demos. The goal is to show real application patterns: fetching data, handling errors, organizing components, validating forms, storing local state, filtering lists and building responsive UI.

It also reflects a Multimedia Engineering background with experience and interest in 3D environments, real-time tools, VR, Unity, Unreal Engine, shaders and interactive experiences.

## Tech Stack

- React
- Vite
- Tailwind CSS
- React Router
- Framer Motion
- Recharts
- Lucide React

## Main Features

- Responsive landing page
- Technical project portfolio
- Dynamic project detail pages
- Market API Dashboard
- Project Manager CRUD
- Weather Search App
- GitHub Projects Explorer
- Programming Cheatsheets
- Tech Stack Explorer
- Interview Prep Mini Tool
- API State Playground
- Code Snippet Library
- Search/filter UI examples
- localStorage persistence
- Data-driven components
- Dark UI
- Downloadable CV
- 404 page

## Project Structure

```text
src/components
```

Reusable UI components, layout pieces and technical demos.

```text
src/pages
```

Routed pages such as Home, Portfolio, Project Detail, About, Contact, Cheatsheets and NotFound.

```text
src/data
```

Structured content such as projects, skills, cheatsheets, tech stack groups, snippets and interview questions.

```text
src/services
```

API logic separated from components, including CoinGecko, OpenWeatherMap-ready weather data and GitHub repositories.

```text
public
```

Public assets served from the site root. The downloadable CV should be placed here as `Alex_Gomez_CV.pdf`.

```text
docs
```

Project documentation, code guide and deployment checklist.

## Documentation

- `docs/CODE_GUIDE.md` explains the architecture, routing, components, data files, services and common React concepts.
- `docs/DEPLOY_CHECKLIST.md` lists checks for local testing and deployment.
- `docs/MANUAL_QA.md` gives a route-by-route checklist for visual and functional review.

## How to Run Locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deployment

Prepared for Vercel, Netlify or GitHub Pages.

## Environment Variables

```bash
VITE_OPENWEATHER_API_KEY=
```

The Weather Search App can work with fallback data if no API key is configured. Add an OpenWeatherMap key only if you want live weather results. Without an API key, it uses a local city list for suggestions and demo weather data. If a city is not found, the UI shows a clear error instead of displaying fake weather.

## CV

The downloadable CV file should be placed at:

```text
public/Alex_Gomez_CV.pdf
```

The UI links point to:

```text
/Alex_Gomez_CV.pdf
```

## What This Project Demonstrates

- React component architecture
- State management
- API services
- Loading and error states
- Forms and validation
- Filtering and sorting
- Routing and dynamic routes
- Reusable UI
- Responsive design
- Data-driven pages
- localStorage persistence
- Public API fallback strategies
- Documentation and deployment preparation

## Future Improvements

- Backend API
- Authentication
- Real database
- Testing
- More project case studies
- Downloadable cheatsheets
- Real contact form endpoint
- Screenshots for project detail pages
- Personal domain and analytics
- More examples connected to real databases
