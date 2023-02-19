# Moob Platform Web Application

## Front-end Tech

- Server-side React Rendered app with [NextJS](https://nextjs.org/)
- React-powered [Bootstrap](https://getbootstrap.com/) components with [Reactstrap](https://reactstrap.github.io/)
- API communication with [Axios JS](https://github.com/axios/axios)
- [Redux](https://redux.js.org/) for state management with (Redux Saga)[https://redux-saga.js.org/]

## Pre-requisites

- Install Node version manager. This allows you to switch Node versions as needed. MacOS/Linux version is [here](https://github.com/nvm-sh/nvm). Windows version is [here](https://github.com/coreybutler/nvm-windows)

## Setup for the project

### Step 1: Make sure you are on the correct branch!

You should always branch off the `develop` branch. As this is the branch that has the most current work.

### Step 2: Get the .env file

You'll need the `.env` file for this project to get our local configuration keys/settings. This file must be placed inside the `web` directory.

## Running Development Server

`npm run dev`

Application will be available in http://localhost:4300

**Entry point is server.js, which controls API proxying in development mode (will map our API project's local server to our local running web server)**

## Deploying Application to Elastic Beanstalk

This app is configured for deployment to an Elastic Beanstalk environment. To set up this project to deploy to Elastic Beanstalk on your machine:

1. Install [Elastic Beanstalk CLI](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3.html)
1. Initialize your project to use Elastic Beanstalk `eb init`
1. Select `us-west-2` region
1. You will be prompted to add necessary IAM access id and secret key
1. Select the `Boom Platform` application
1. Select the `BoomPlatformWebApp--staging` environment

You should now be able to deploy the application to staging

### Deployment

`npm run deploy`

This command will trigger the `predeploy` script, which removes any existing .next folder, runs `npm install`, repairs package-lock.json file(this solves issues on AWS), updates package.json version, upload the changes of version to bitbucket and runs a production build of the app. The build files will be generated in the .next folder. To avoid updating the version run `npm run deploy:noUpdateVersion`

Once files are generated, they are deployed to elastic beanstalk.

Files needed for deployment:

`.ebextensions` = Environment config files
`.elasticbeanstalk` = Application config
`.npmrc` = Needed to remove issues on server with the deployment making directories
`.next` = The production files
`public` = Our static assets
`next.config.js` = NextJs config file
`server.js` = Our app entry point
`package-lock.json`
`package.json`

# Dev notes

### Note on NODE_ENV

The environment sets NODE_ENV = 'live'. We can't use 'production' as usual, because this prevents the server from installing devDependencies in package.json which are needed for our project
