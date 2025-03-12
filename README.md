# Fahrzeug-Kosten-React

A React application to calculate and visualize vehicle leasing costs including:
- Leasing payments
- Extra kilometer costs
- Energy costs (separated for work and private use)
- Insurance costs
- Tax returns

## Deployment

The application is automatically deployed to GitHub Pages on every push to the main branch using GitHub Actions.

You can access the live application at: https://ebborode.github.io/fahrzeug-kosten-react

## Development

### Available Scripts

In the project directory, you can run:

#### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

#### `npm test`

Launches the test runner in the interactive watch mode.

#### `npm run build`

Builds the app for production to the `build` folder.

#### `npm run deploy`

Manually deploys the application to GitHub Pages.

## GitHub Actions

This project uses GitHub Actions to automatically deploy to GitHub Pages on every push to the main branch. The workflow configuration can be found in `.github/workflows/deploy.yml`.