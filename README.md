This project was made by [yaGordeev](http://yagordeev.com).

This is a fully working and very useful application: [check it](https://spisok.yagordeev.com).<br>
The purpose of this post was to demonstrate `React` (ES6 & Hooks), HTTP API calls to a `Node.js/Express` with secure `Axios` requests at the backend, using a `MongoDB/Mongoose` database, `Passport.js` authentication with sessions stored in Mongo database and prepared for deployment on `Heroku`.<br>
It also has `swipe to delete` function as on iOS and working by a touch or with the mouse.

## Before you start

```bash
$ cd Grocery List
```

1) You need to instal all node modules

```bash
$ npm install
```

2) Get your free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster and name your database `GroceryList`.<br>

Or install [local MongoDB](https://docs.mongodb.com/manual/installation/):
```bash
$ mongod
#open another command line window and run mongo:
$ mongo
$ use GroceryList
```

3) Set up your .env file.

```bash
$ touch .env
```
Write inside:
```bash
SECRET=<your secret code>
DB=mongodb+srv://admin-<username>:<password>@<cluster0>/GroceryList
```

4) Test your app in developer mode
```bash
$ npm run dev
```

## Available Scripts

In the project directory, you can run:

### `npm dev`

Builds the app for development to the `client/dist` folder and runs the app.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any webpack/node errors in the console.

### `npm server`

Runs the app without rebuilding webpack.<br>
The page will reload if you make edits in `index.js` file due to `nodemon`.<br>

### `npm run build`

Builds the app for production to the `client/dist` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>

### `npm run start`
Basic run for your app.<br>
This can help you test your web application with latest web package build before deploying.
<br>
Now your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.


## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment
