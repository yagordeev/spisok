import React, { Suspense, useState, useEffect } from 'react';
import Bowser from "bowser";

import {
	useTheme,
	Backdrop,
	CircularProgress,
	LinearProgress,
	Slide,
	Snackbar
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';

import {
	BrowserRouter as Router,
	Route,
	Link,
	Redirect,
	withRouter
} from 'react-router-dom'

import List from './components/List.jsx';
import Login from './components/Login.jsx';
import Pwa from './components/Pwa.jsx';

//get device info
const browser = Bowser.getParser(window.navigator.userAgent);
const isSafari = browser.getBrowser().name === 'Safari';
const isChrome = browser.getBrowser().name === 'Chrome';
const standalone = (window.navigator.standalone == true);
const iPhone = browser.getPlatform().model === 'iPhone';
const iOS = browser.getOS().name === 'iOS';
const iosPWA = (iPhone && !standalone && isSafari);

//get query info
const query = new URLSearchParams(location.search);
const n = query.get('error');
const errors = [
	'При регистрации адреса возникла проблема, попробуйте снова',
	'Вы ввели неправильный пароль'
];
const error = errors[n];

//styles for material-ui
const circulTheme = { background: 'rgba(255, 255, 255, 0.5)' };
const linearTheme = {
	position: 'fixed',
	top: '0',
	left: '0',
	width: '100%',
	zIndex: '9'
}
const ColorLinearProgress = withStyles({
	colorPrimary: {
		// backgroundColor: '#ddfeda',
		backgroundColor: 'transparent',
		height: '3px'
	},
	barColorPrimary: {
		backgroundColor: '#78eb56',
		animation: 'MuiLinearProgress-keyframes-indeterminate1 1.8s ease infinite'
	},
})(LinearProgress);


function Main(props) {

	const [isLoading, setLoading] = useState(true); // state for loading effect
	const [account, setAccount] = useState({}); // state for account info

	//loading effect
	function Loading(res) {
		if(res === 'update') { setLoading(true) }
		setTimeout(() => {
			setLoading(false);
		}, 900)
	}

	//get response from server with user's authentication
	useEffect(() => {
		const xhr = new XMLHttpRequest();
		xhr.open('post', '/');
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhr.responseType = 'json';
		xhr.addEventListener('load', () => {
			if(xhr.status === 200) {
				//success
				setAccount({
					address: xhr.response.address,
					list: xhr.response.list,
					auth: xhr.response.auth
				})
			} else {
				//error
				setAccount({
					auth: xhr.response.auth,
					error: xhr.response.error
				});
				setLoading(false);
			}
		});
		xhr.send();
	}, [])


	return (

		<div>

			{isLoading && (
				<ColorLinearProgress style={linearTheme} />
			)}

			{error &&
				<Slide direction="down" in={true} timeout={500}>
					<Alert severity="error">{error}</Alert>
				</Slide>
			}

			{iosPWA && <Pwa onLoad={(result)=>setLoading(result)} />}

			{(account.auth === 'authorized' && !iosPWA)
				&& <List account={account} chrome={isChrome} onLoad={Loading} />
			}

			{(account.auth === 'authorized' && !iosPWA)
				&& <a href="/logout">выйти из списка</a>
			}

			{(account.auth === 'undefined' && !iosPWA)
				&& <Login onLoad={Loading} />
			}

		</div>

	);
}

export default Main;