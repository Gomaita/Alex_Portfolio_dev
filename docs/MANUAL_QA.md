# Manual QA Checklist

Use this checklist after running the project locally.

## Core Routes

- `/`
- `/portfolio`
- `/portfolio/market-api-dashboard`
- `/portfolio/project-manager-crud`
- `/portfolio/weather-search-app`
- `/portfolio/github-projects-explorer`
- `/portfolio/programming-cheatsheets`
- `/portfolio/api-state-playground`
- `/portfolio/code-snippet-library`
- `/about`
- `/contact`
- `/cheatsheets`
- `/cheatsheets/react`
- A fake route, to confirm the 404 page works

## Home

- Hero text feels personal and readable.
- CTA buttons go to Portfolio and Cheatsheets, and CV links show ATS and Visual versions.
- Featured project cards link to project details.
- Tech Stack Explorer filters work.
- Interview Prep buttons work.
- API State Playground state buttons work.
- Code Snippet Library search/filter/copy works.

## Portfolio

- Demo index links scroll to the correct sections.
- Market Dashboard loads data or shows a graceful error.
- Project Manager creates, edits, deletes, filters and persists projects.
- Weather Search works with fallback local city data without an API key.
- Weather Search suggestions open, filter cities and select a city.
- Weather Search shows a clear error for a misspelled or unsupported city.
- GitHub Explorer loads real or fallback repository data.
- Project Gallery search and filters work.
- View Details links open the right project page.

## Cheatsheets

- Search filters the grid.
- Category buttons filter correctly.
- Each card opens a detail page.
- Quick section navigation works.
- Copy buttons show feedback.

## Contact And CV

- Email links open a mail client.
- GitHub and LinkedIn links go to the correct profiles.
- `/Alex_Gomez_CV_ATS.pdf` downloads or opens the ATS CV.
- `/Alex_Gomez_CV_Visual.pdf` downloads or opens the Visual CV.
- Contact form is clearly presented as a UI demo.

## Responsive

- Test mobile width around 360px.
- Test tablet width around 768px.
- Test desktop width above 1200px.
- Navbar mobile menu opens and closes.
- Cards do not overflow.
- Code blocks scroll horizontally when needed.

## Accessibility Basics

- Use keyboard Tab navigation.
- Focus rings are visible.
- Buttons have readable labels.
- Inputs have labels or screen-reader labels.
- Color contrast remains readable in dark mode.
