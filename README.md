# AgriGuard IoT UAT Survey

A responsive, frontend-only User Acceptance Testing survey for **AgriGuard IoT: Solar-Powered Smart Scarecrow System**. It is built with HTML5, CSS3, and vanilla JavaScript and can be deployed to GitHub Pages.

## Project overview

The survey is a guided 11-step form for respondent consent, profile details, rating-scale evaluation, and open-ended feedback. The question text and categories follow the supplied survey reference. N/A is accepted as a valid response and excluded from numerical means.

## Folder structure

- `index.html` - multi-step survey and Formspree form
- `style.css` - responsive visual design and accessibility states
- `script.js` - survey configuration, rendering, validation, navigation, and calculation functions
- `thank-you.html` - successful submission destination
- `admin.html` - clearly labeled dashboard scaffold with no fabricated data

## Run in VS Code

Open this folder in VS Code and open `index.html` with a static server extension such as Live Server, or serve the folder with any simple static web server. No build step or package installation is required.

## Configure Formspree

1. Create a form at [Formspree](https://formspree.io/).
2. The supplied endpoint `https://formspree.io/f/myeypzjp` is already configured in `index.html`. Replace it there if you later use a different Formspree form.
3. Keep the `_next` field pointed at `thank-you.html` for the success redirect. Formspree may require the deployed site URL in its allowed redirect settings.
4. Test with a non-sensitive response before distributing the survey.

The endpoint is public by design, but no Formspree private API key or admin password belongs in these frontend files.

## Mean calculation

`calculateMean(values)` converts valid values to numbers, keeps only values from 1 through 5, and computes `sum / count`. `calculateSurveyResults()` calculates per-question, per-category, and overall means. `interpretation(mean)` applies the requested ranges from Strongly Agree through Strongly Disagree.

The browser calculation represents the current form only. A submitted Formspree response is not automatically included in `admin.html`.

## N/A handling

N/A is submitted as the string `NA`, which is intentionally ignored by `calculateMean()`. It is never treated as zero. A question answered N/A remains a valid completed question.

## GitHub Pages deployment

Push this folder to a GitHub repository, then choose **Settings > Pages**, select the deployment branch and root folder, and save. Because the project uses relative links and no server-side code, it works from a GitHub Pages subpath.

## Frontend-only aggregation limitation

GitHub Pages cannot securely aggregate Formspree submissions. Reading response data directly from the browser would expose credentials or depend on provider-specific access and CORS behavior. The dashboard therefore shows placeholders and does not pretend that live data exists.

## Recommended architecture for actual results

Keep Formspree as the intake layer, then use a protected server-side process or scheduled automation to export responses into a controlled spreadsheet/database. Calculate aggregates in that trusted environment and expose only non-sensitive summary data through an authenticated API or a generated static JSON file. Never put Formspree private API keys, respondent exports, or admin credentials in `script.js` or any public GitHub Pages file.
