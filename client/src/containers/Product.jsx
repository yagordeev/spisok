import React, { useState, useEffect } from 'react';
import { Collapse } from '@material-ui/core';

function Product(props) {
	//скрываем удаленные элементы
	const [hidden, setHidden] = useState(false);
	//сохраняем данные swipe to delete
	const [motion, setMotion] = useState({ firstX: 0, firstY: 0, position: 0, distance: 0, onclick: true });
	//сохраняем положение элемента swipe to delete
	const [trans, setTrans] = useState({ transform: 'translateX(0px)' })



	//анимационная презентация функции swipe to delete
	useEffect(() => {
		if(props.id === 0) {
			setTimeout(() => {
				setTrans({ transform: 'translateX(-50px)', transition: 'transform 0.5s cubic-bezier(0.215, 0.61, 0.355, 1)' });
			}, 1000)
			setTimeout(() => {
				setTrans({ transform: 'translateX(0px)', transition: 'transform 0.5s cubic-bezier(0.215, 0.61, 0.355, 1)' });
			}, 1700)
		}
	}, [])



	//проверка отметки check
	function checkClick() {
		//swipe to delete не используется && нет кнопки delete
		if(motion.onclick && motion.distance === 0) {
			props.onCheck(props.name, false);
			setMotion((prev) => {
				return {
					...prev,
					firstX: 0,
					firstY: 0,
					position: 0,
					distance: 0
				}
			})
			setTrans((prev) => {
				return {
					...prev,
					transform: 'translateX(0px)',
					transition: 'transform 0.15s linear'
				}
			});
		}
		//кнопка delete активна
		if(motion.onclick && motion.distance === 80) {
			setMotion((prev) => {
				return {
					...prev,
					firstX: 0,
					firstY: 0,
					position: 0,
					distance: 0
				}
			})
			setTrans((prev) => {
				return {
					...prev,
					transform: 'translateX(0px)',
					transition: 'transform 0.15s linear'
				}
			});
			// console.log('1: ' + motion.onclick);
		}
	}

	//удаляем элемент
	function handleClick() {
		//кнопка delete активна
		if(motion.onclick && motion.distance === 80) {
			const txt = 'Удалить "' + props.name + '" из списка?';
			setHidden(prev => !prev);
			props.onDelete(props.name);
		}
	}


	//инициализация свайпа
	function start(e) {
		//один палец
		if(e.targetTouches.length == 1) {
			var touch = e.changedTouches[0];
			//сохраняем начальное положение клика и элемента
			setMotion((prev) => {
				return {
					firstX: touch.pageX,
					firstY: touch.pageY,
					position: touch.pageX + prev.distance,
					distance: prev.distance,
					onclick: true,
					trigger: 'start' //определяем источник действия
				}
			});
		}
	}
	//происходит свайп
	function move(e) {
		if(e.targetTouches.length == 1) {
			var touch = e.changedTouches[0];
			//позиция элемента на странице
			var pagePosX = touch.pageX;
			var pagePosY = touch.pageY;
			//длина удаления от элемента (позиция элемента - позицию клика)
			var calcDistance = Math.floor(motion.position - pagePosX);
			//длина свайпа
			var swipeLengthX = Math.abs(motion.firstX - pagePosX)
			//длина вертикального свайпа
			var swipeLengthY = Math.abs(motion.firstY - pagePosY);
			//определяем свайп влево и устанавливаем размер >=0! && <=80!
			var swipeLeft = calcDistance <= 80 && calcDistance >= 0;
			//фиксируем отсутствие скролинга страницы
			var noScroll = swipeLengthX > swipeLengthY;
			//используем условия
			if(swipeLeft && noScroll) {
				//сохраняем длину свайпа
				setMotion((prev) => {
					return {
						...prev,
						distance: calcDistance,
						onclick: false,
						trigger: 'move' //определяем источник действия
					}
				});
				//сохраняем положение элемента
				setTrans(() => {
					return {
						transform: 'translateX(' + -calcDistance + 'px)',
						transition: 'transform 0s linear',
						trigger: 'move' //определяем источник действия
					}
				})
			}
		}
	}
	//свайп прекращен
	function end(e) {
		//свернуть, если блок смещен >0! && на <=50! п.
		if(motion.distance > 0 && motion.distance <= 50) {
			setMotion((prev) => {
				return {
					...prev,
					firstX: 0,
					distance: 0,
					onclick: false,
					// trigger: 'end 1' //определяем источник действия
				}
			});
			setTrans({
				transform: 'translateX(0px)',
				transition: 'transform 0.15s linear',
				// trigger: 'end 1' //определяем источник действия
			})
			// console.log('02: ' + motion.onclick);
		}
		//развернуть, если блок смещен >50! && <80!
		if(motion.distance < 80 && motion.distance > 50) {
			setMotion((prev) => {
				return {
					...prev,
					firstX: 0,
					distance: 80,
					// trigger: 'end 2' //определяем источник действия
				}
			});
			setTrans({
				transform: 'translateX(-80px)',
				transition: 'transform 0.15s linear',
				// trigger: 'end 2' //определяем источник действия
			});
			// console.log('03: ' + motion.onclick);
		}
		//разрешаем onclick
		if(e.type === 'touchend') {
			setTimeout(() => {
				setMotion((prev) => {
					return {
						...prev,
						onclick: true,
						// trigger: 'end 4' //определяем источник действия
					}
				});
			}, 250)
		}
	}


	//инициализация свайпа мышкой
	function dragStart(e) {
		e.persist();
		setMotion((prev) => {
			return {
				...prev,
				firstX: e.clientX,
				position: e.clientX + prev.distance,
				onclick: true,
				// trigger: 'dragStart' //определяем источник действия
			}
		});
	}

	//происходит свайп мышью
	function dragMove(e) {
		//проверяем что свайп мышкой инициирован
		if(motion.firstX > 0) {
			//позиция элемента на странице
			var pagePosX = e.clientX;
			//длина удаления от элемента (позиция элемента - позиция клика)
			var calcDistance = Math.floor(motion.position - pagePosX);
			//длина свайпа
			var swipeLengthX = Math.abs(motion.firstX - pagePosX)
			//определяем свайп влево и устанавливаем размер от >0! && <80!
			var swipeLeft = calcDistance < 80 && calcDistance > 0;
			//используем условие
			if(swipeLeft) {
				setMotion((prev) => {
					return {
						...prev,
						distance: calcDistance,
						onclick: false,
						// trigger: 'dragMove' //определяем источник действия
					}
				});
				setTrans(() => {
					return {
						transform: 'translateX(' + -calcDistance + 'px)',
						transition: 'transform 0s linear',
						// trigger: 'dragMove' //определяем источник действия
					}
				})
			}
		}
	}

	//свайп мышью прекращен
	function dragEnd(e) {
		//отключаем отслеживание перемещения мыши
		if(e.type === 'mouseout' || e.type === 'mouseup') {
			window.removeEventListener('mousemove', dragEnd, false);
		}
		//свернуть, если блок смещен на >0! && <=50! п.
		if(motion.distance > 0 && motion.distance <= 50) {
			setMotion((prev) => {
				return {
					...prev,
					firstX: 0,
					distance: 0,
					onclick: false,
					// trigger: 'dragEnd 1' //определяем источник действия
				}
			});
			setTrans({
				transform: 'translateX(0px)',
				transition: 'transform 0.15s linear',
				// trigger: 'dragEnd 1' //определяем источник действия
			})
			// console.log('2: ' + motion.onclick);
		}
		//развернуть, если блок смещен >50! && <80!
		if(motion.distance < 80 && motion.distance > 50) {
			setMotion((prev) => {
				return {
					...prev,
					firstX: 0,
					distance: 80,
					// trigger: 'dragEnd 2' //определяем источник действия
				}
			});
			setTrans({
				transform: 'translateX(-80px)',
				transition: 'transform 0.15s linear',
				trigger: 'dragEnd 2' //определяем источник действия
			});
			// console.log('3: ' + motion.onclick);
		}
		//разрешаем onclick
		if(e.type === 'mouseup') {
			setTimeout(() => {
				setMotion((prev) => {
					return {
						...prev,
						onclick: true,
						trigger: 'dragEnd 4' //определяем источник действия
					}
				});
			}, 250)
		}
	}


	if(props.bought !== 'checked') {
		return (
			<Collapse in={!hidden} collapsedHeight={0} {...{timeout: 500}} >
				<div onClick={checkClick} className='item grow' style={{opacity: hidden ? '0' : 1}}>
					<label
						onTouchStart={start}
						onTouchMove={move}
						onTouchEnd={end}
						onMouseDown={dragStart}
						onMouseMove={dragMove}
						onMouseUp={dragEnd}
						onMouseOut={dragEnd}
						style={trans} className='list'>
						<div>
							<div className='checkdot'></div>
						</div>
						<span>{props.name}</span>
					</label>
					<label onClick={handleClick} className='delete'>
						Удалить
					</label>
				</div>
			</Collapse>);
	} else {
		return (
			<Collapse in={!hidden} collapsedHeight={0} {...{timeout: 500}}>
				<div onClick={checkClick} className='item grow checked' style={{opacity: hidden ? '0' : 1}}>
					<label
						onTouchStart={start}
						onTouchMove={move}
						onTouchEnd={end}
						onMouseDown={dragStart}
						onMouseMove={dragMove}
						onMouseUp={dragEnd}
						onMouseOut={dragEnd}
						style={trans} className="list checked">
						<div>
							<div onClick={checkClick} className="checkdot checked">✓</div>
						</div>
						<span className="line-through">{props.name}</span>
					</label>
						<label onClick={handleClick}  className="delete">
						Удалить
					</label>
				</div>
			</Collapse>
		);
	}
}

export default Product;