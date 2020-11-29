[![Continuous Deployment](https://github.com/kitamstudios/cra-template-kitamstudios/workflows/Continuous%20Deployment/badge.svg)](https://github.com/kitamstudios/cra-template-kitamstudios/actions?query=workflow%3A%22Continuous+Deployment%22)

# Kitam Studios - Template for React Applications

Deployed at [craks-1](https://apps.kitamstudios.com/craks-1)

## Available out of the box

- Core
  - [x] [Folder structure](https://maxrozen.com/guidelines-improve-react-app-folder-structure/)
  - [x] Code splitting per route
  - [x] Unit tests: jest
  - [x] editorconfig, stylelint, [eslint, prettier](https://medium.com/@brygrill/create-react-app-with-typescript-eslint-prettier-and-github-actions-f3ce6a571c97)
  - [x] husky integration
  - [x] Footer with version
  - [x] AppInsights
  - [ ] Loader spinner
  - [ ] PWA: manifest.json, Icon placeholders, Install offline prompt, Update check
- Styling
  - [x] [Material-UI](https://material-ui.com/)
  - [x] [styled-components](https://styled-components.com/)
  - [x] Placeholder images ([lorempixel](https://lorempixel.com/))
- VSCode
  - [x] editorconfig, stylelint, [eslint, prettier](https://medium.com/@brygrill/create-react-app-with-typescript-eslint-prettier-and-github-actions-f3ce6a571c97)
  - [x] Workspace settings
  - [x] Workspace recommended extensions
  - [x] F5 debugging from VSCode
- CI/CD - GitHub Actions
  - [x] Build, lint, unit test
  - [x] Deploy to Azure blob storage
  - [x] Multiple sites per Azure Storage static site [.env, homepage in package.json, HashRouter, base href in index.html, manifest.json replace scope during deploy]

- TODO
  - [ ] Create config along the lines of https://github.com/wesbos/eslint-config-wesbos
  - [ ] Theming
  - [ ] Redux code splitting per route
  - [ ] Add AppInsightsErrorBoundary (throwing "Uncaught ReferenceError: __extends is not defined" right now)

## Useful documents

- [React+TypeScript Cheatsheets](https://github.com/typescript-cheatsheets/react)
- [Official Tutorial: Intro to React](https://reactjs.org/tutorial/tutorial.html)
- [Create React App](https://create-react-app.dev/)
- [Redux](https://redux.js.org/)
- [styled-components](https://styled-components.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `yarn build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
