import React, { useState, useEffect } from 'react';
import { Fade, Grow } from '@material-ui/core';

function Login(props) {

	const [user, setUser] = useState({});
	const [type, setType] = useState('Cписок продуктов');

	useEffect(() => {
		props.onLoad(false);
		typing(type);
	}, [type])

	function handleChange(event) {
		const { name, value } = event.target;

		setUser(previous => {
			return {
				...previous,
				[name]: value
			}
		});
	}

	// list's name visual effect
	function typing(text) {
		var i = 0;
		const speed = 60;
		const getText = _.upperFirst(_.lowerCase(text));
		const typeText = document.querySelector('#listName');
		getType();

		function getType() {
			if(i < getText.length) {
				setTimeout(function() {
					typeText.innerHTML += getText.charAt(i);
					i++;
					getType();
				}, speed);
			}
			return (null);
		}
	}


	return (
		<Fade in={true} timeout={500}>
			<form action="/login" method="post" >
				<div className="box">
					<div id="startblock">
						<div id="productTitle">
							<div id="listName"></div>
						</div>
						<input type="hidden" autoFocus={true} />
						<input
							id="username"
							type="text"
							name="street"
							onChange={handleChange}
							value={user.street || ''}
							className="login"
							placeholder="Название улицы:"
							required="required"
						/>
						<input
							type="text"
							name="house"
							onChange={handleChange}
							value={user.house || ''}
							className="login"
							placeholder="Номер дома:"
							required="required"
						/>
						<input
							type="password"
							name="password"
							onChange={handleChange}
							value={user.password || ''}
							className="login"
							placeholder="Пароль:"
							required="required"
						/>

					</div>
				</div>

				<div>
					<button type="submit" className="start">Открыть свой список</button>
				</div>
				<div id="prod">by ⚜️ yaGordeev</div>
			</form>
		</Fade>
	)
};


export default Login;