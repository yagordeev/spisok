import React, { useState, useEffect } from 'react';

function Update(props) {

	const [update, setUpdate] = useState({
		rotate: 'rotate(0deg)',
		info: 'Список обновлен'
	});

	var scroll = '';
	var deg = '';
	var opacity = '';

	var pastTime = null;
	var nowTime = null;
	var timer = null;

	useEffect(() => {
		updateTime();
		window.addEventListener("scroll", handleScroll);
		return () => { window.removeEventListener("scroll", handleScroll) };
	}, [])

	function updateTime() {
		if(!pastTime) {
			const pastD = new Date();
			pastTime = Math.floor(pastD.getTime() / 60000);
		}
		setTimeout(function() {
			updateTime();
			const nowD = new Date();
			nowTime = Math.floor(nowD.getTime() / 60000);
			timer = nowTime - pastTime;
			if(timer >= 15) {
				setUpdate((prev) => {
					return { ...prev, info: 'Список обновляется...' }
				});
				props.onUpdate();
				setTimeout(function() {
					window.location.reload();
					setUpdate((prev) => {
						return { ...prev, info: 'Список обновлен' }
					});
				}, 50);
			} else {
				setUpdate((prev) => {
					return { ...prev, info: 'Обновлено ' + timer + ' мин. назад' }
				});
			}
		}, 60 * 1000);
	}


	function handleScroll() {
		scroll = window.pageYOffset;
		deg = scroll * 2.7;
		opacity = 1 + (scroll / 300);
		if(deg < 0) {
			setUpdate((prev) => {
				return {
					...prev,
					rotate: 'rotate(' + -deg + 'deg)'
				}
			})
		}

		if(timer > 0) {
			document.querySelector('.box').style.opacity = opacity;
			if(scroll < -100) {
				document.querySelector('#spinericon').className += ' rotate';
				setUpdate((prev) => {
					return { ...prev, info: 'Список обновляется...' }
				});
				setTimeout(function() {
					window.location.reload();
				}, 100);
			}
		}
	};



	return (
		<div>
			{!props.chrome && (
				<div style={{width: '20px', margin: '0 auto'}}>
					<div id="spinericon" style={{transform: update.rotate}} className="spinericon">
						<img alt='' src="/images/refresh.svg"/>
					</div>
				</div>
			)}
			<div id="lastUpdate">{update.info}</div>
		</div>
	)
}

export default Update;