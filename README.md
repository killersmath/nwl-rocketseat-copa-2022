# NWL - Copa 2022 Full Stack Application

This project is part of 10th edition of Rocketseat NWL program.

**Project Structure**
- Mobile
  - Expo and React Native Mobile application
- Server
  - NodeJS and Fastify Backend Application
- Web
  - NextJS Application

![Project Apresentation](project-apresentation.png)

## Requirements

  - Yarn, Npm or Pnpm package manager
    - Recommended: **Yarn**
  - NodeJS
  - Node: v18+
  - Typescript
  - SQL

## Mobile

 For running this porject, it required to generate a AUTH2 credentials in (https://console.cloud.google.com/apis/credentials)[google cloud console] for the Expo application. Read more about in https://docs.expo.dev/guides/authentication/#google

> :warning: Do not commit secret environments on .env files. It's recommended to save these variables in .env.local or .env.development.local files.

**environments template**
```
API_URL=YOUR_API_URL
GOOGLE_CLIENT_ID=YOUR_API_KEY
```

After preparing all the environment for this project, it's necessary to install the dependencies.

```
yarn install
``` 

Also, since the Auth2 Google Autentication require the expo autention, you also need to create a expo account for using the redirection url method. When you've created your account then you can advance to next steps.

```
npx expo login
```

For checking if you are logged in then it is recommended to run the below command:

```
npx expo whoaim
```

If it returned the proper nickname then you are able to start up the project

```
yarn start
```

## Web

Write it Later.

## Server

Write it Later.
