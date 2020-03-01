import React from 'react';
import ReactDOM from 'react-dom';
import Main from './Main';

//get all files from folder for webpack
function requireAll(r) { r.keys().forEach(r); }
requireAll(require.context('./public/images', true, /\.png|jpe?g|svg/));
requireAll(require.context('./public/scss', true, /\.css|scss|sass/));

ReactDOM.render(<Main />, document.getElementById('root'));