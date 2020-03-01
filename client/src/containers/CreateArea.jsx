import React, { useState } from 'react';
//import AddIcon from '@material-ui/icons/Add';
//import Fab from '@material-ui/core/Fab';
import Zoom from '@material-ui/core/Zoom';
//import Collapse from '@material-ui/core/Collapse';

function CreateArea(props) {

	const [stateProduct, setProduct] = useState({});

	//typing new products
	function handleChange(event) {
		const { value } = event.target;
		setProduct(previous => {
			return {
				...previous,
				name: value
			}
		});
	}

	//create new products
	function handleClick(event) {
		props.onAdd(stateProduct);
		event.preventDefault();
		setProduct({
			name: '',
			bought: 'no'
		}); //удалить информацию из формы
	}

	return (

		<div className="add">
			<form onSubmit={handleClick} id="CreateArea">
				<input
					type="text"
					className="addNew"
					value={stateProduct.name || ''}
					onChange={handleChange}
					placeholder="Продукты через запятую"
					required="required"
				/>
			</form>
			<label>
				<button button="submit" form="CreateArea" className="plus">┼</button>
			</label>
		</div>
	);
}

export default CreateArea;