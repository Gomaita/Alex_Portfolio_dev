# Software Tech Icon Sources

Downloaded on: 2026-06-17

These icons are used by the Software Home technology badges. Runtime hotlinks are not used: the app imports local PNG files from `src/assets/icons/software/`.

Most icons were sourced from Devicon SVG files and converted locally to transparent PNG files at 256x256 using Microsoft Edge headless. GitHub and APIs use Simple Icons SVG sources, also converted locally.

| Technology | Local file | Source | Origin URL | Status |
| --- | --- | --- | --- | --- |
| React | `React_PNG.png` | Devicon | `https://raw.githubusercontent.com/devicons/devicon/v2.17.0/icons/react/react-original.svg` | Downloaded and converted |
| JavaScript | `JavaScript_PNG.png` | Devicon | `https://raw.githubusercontent.com/devicons/devicon/v2.17.0/icons/javascript/javascript-original.svg` | Downloaded and converted |
| TypeScript | `TypeScript_PNG.png` | Devicon | `https://raw.githubusercontent.com/devicons/devicon/v2.17.0/icons/typescript/typescript-original.svg` | Downloaded and converted |
| HTML5 | `HTML5_PNG.png` | Devicon | `https://raw.githubusercontent.com/devicons/devicon/v2.17.0/icons/html5/html5-original.svg` | Downloaded and converted |
| CSS3 | `CSS3_PNG.png` | Devicon | `https://raw.githubusercontent.com/devicons/devicon/v2.17.0/icons/css3/css3-original.svg` | Downloaded and converted |
| Node.js | `Node_PNG.png` | Devicon | `https://raw.githubusercontent.com/devicons/devicon/v2.17.0/icons/nodejs/nodejs-original.svg` | Downloaded and converted |
| SQL | `SQL_PNG.png` | Devicon | `https://raw.githubusercontent.com/devicons/devicon/v2.17.0/icons/microsoftsqlserver/microsoftsqlserver-plain.svg` | Downloaded and converted |
| Oracle | `Oracle_PNG.png` | Devicon | `https://raw.githubusercontent.com/devicons/devicon/v2.17.0/icons/oracle/oracle-original.svg` | Downloaded and converted |
| Java | `Java_PNG.png` | Devicon | `https://raw.githubusercontent.com/devicons/devicon/v2.17.0/icons/java/java-original.svg` | Downloaded and converted |
| C# | `CSharp_PNG.png` | Devicon | `https://raw.githubusercontent.com/devicons/devicon/v2.17.0/icons/csharp/csharp-original.svg` | Downloaded and converted |
| Git | `Git_PNG.png` | Devicon | `https://raw.githubusercontent.com/devicons/devicon/v2.17.0/icons/git/git-original.svg` | Downloaded and converted |
| GitHub | `GitHub_PNG.png` | Simple Icons | `https://cdn.simpleicons.org/github/FFFFFF` | Downloaded and converted |
| Cloudflare | `Cloudflare_PNG.png` | Devicon | `https://raw.githubusercontent.com/devicons/devicon/v2.17.0/icons/cloudflare/cloudflare-original.svg` | Downloaded and converted |
| APIs | `API_PNG.png` | Simple Icons / OpenAPI Initiative | `https://cdn.simpleicons.org/openapiinitiative/6BA539` | Downloaded and converted |
| Vite | `Vite_PNG.png` | Devicon | `https://raw.githubusercontent.com/devicons/devicon/v2.17.0/icons/vitejs/vitejs-original.svg` | Downloaded and converted |

Fallback behavior:

- If a local PNG is missing, the badge renders the technology name without an image.
- Missing icons do not break the build because the Home page uses `import.meta.glob` instead of hardcoded required imports.
