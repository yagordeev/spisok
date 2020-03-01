import React from 'react';
import { Slide, Fade } from '@material-ui/core';

function Pwa(props) {

	props.onLoad(false);

	return (
		<Fade in={true} timeout={500}>
			<Slide direction="down" in={true} timeout={350}>
				<div id="addToHome">
					<div>
						<div className="appIcon">
							<div>
								<img src="/images/apple-touch-icon.png" alt="Список App"/>
							</div>
							<span>Список 🍏</span>
						</div>
						<div className="instruction">
							<div>Установите приложение,<br></br>
							для комфортного использования.</div>
							<div id="addBox">
								Для этого, нажмите<br></br>
								<img id="step1" src="/images/share.svg" alt=""/><br></br>
								Затем на кнопку<br></br>
								<div id="step2">
									<div>На экран «Домой»</div>
									<div className="addApp">+</div>
								</div>
								Как только, наша иконка появится – нажмите
								<span className="iosBlue"> Добавить</span>.
							</div>
							<div className="d4"></div>
						</div>
					</div>
				</div>
			</Slide>
		</Fade>
	)
}

export default Pwa;