import React, { useState, useEffect } from 'react';
import Product from '../containers/Product.jsx';
import CreateArea from '../containers/CreateArea.jsx';
import Update from '../containers/Update.jsx';
import _ from 'lodash';
import { Fade, Zoom } from '@material-ui/core';

// AXIOS
import productService from '../services/axios.js';



function List(props) {


	const [stateProducts, setProducts] = useState([]); //products
	const [count, setCount] = useState(0); //count not checked products

	const address = props.account.address; //user's address
	const list = props.account.list; //user's grocery list name

	//function for update products (initiate from update props)
	function updateProduct() {
		getProducts();
	}
	//counter of not checked products
	function Notify() {
		//fined not checked products from all
		const arrayCount = stateProducts.filter(product => (product.bought !== 'checked' && true))
		setCount(() => arrayCount.length);
		return (arrayCount.length);
	}
	//first page loading -> get initiate 'get products' function
	useEffect(() => {
		stateProducts.length === 0 && getProducts();
	}, [address])

	// get user's products from database
	async function getProducts() {
		const getData = await productService.getAll(list, address);
		props.onLoad(false);
		setProducts(getData.items);
	};

	// add new user's products to database and on page
	function addProduct(products) {
		props.onLoad('update');
		const itemName = _.map((_.toLower(products.name)).split(','), _.trim);
		const allProducts = [];
		stateProducts.forEach(oldItem => {
			allProducts.push(_.toLower(oldItem.name));
		});
		const duplicate = itemName.filter((f) => !allProducts.includes(f));
		duplicate.forEach(product => {
			if(product) {
				setProducts(previous => {
					return [
						...previous,
						{
							name: _.capitalize(product.trim()),
							bought: 'no'
						}
					]
				});
			}
		})
		productService.postOne(list, address, products);
	}

	//check product in database and on page
	function checkProduct(name, hidden) {
		props.onLoad('update');
		var myArray = [];
		var bought = ''
		//проходим по всем продуктам
		stateProducts.forEach(item => {
			//находим редактируемый продукт
			if(item.name === name) {
				//не является удаленным
				if(hidden) {
					bought = 'checked';
				} else {
					//отмечаем или снимаем отметку
					bought = (item.bought === 'checked') ? 'no' : 'checked';
					//редактирум продукт в базе
					productService.checkOne(list, address, item.name);
				}
				//добавляем продукт в массив
				const newItem = { name: item.name, bought: bought }
				myArray.push(newItem);
				//и все остальные продукты
			} else { myArray.push(item); }
		})
		//сохраняем стейт с обновленным продуктом
		setProducts(() => myArray);
	}

	//delete user's product from database and page
	function deleteProduct(name) {
		props.onLoad('update');
		productService.deleteOne(list, address, name);
		setTimeout(() => {
			checkProduct(name, true)
		}, 350);
	}



	return (
		<Fade in={true} timeout={500}>
			<div >

				<Update chrome={props.chrome} onUpdate={updateProduct}></Update>

				<div className="box">

					<Zoom in={count !== 0 && true}>
						<div className="notify"><Notify/></div>
					</Zoom>

					<div id="productTitle">
						<div id="listName">{list}</div>
						<div id="address">{_.upperFirst(_.lowerCase(address))}</div>
					</div>
					<div style={{overflow: 'hidden'}}>
						{stateProducts.map((product, index) => (
							<Product
								key={index}
								id={index}
								productID={product._id}
								name={product.name}
								bought={product.bought}
								onCheck={checkProduct}
								onDelete={deleteProduct}
							/>
						))}
					</div>
				</div>

				<CreateArea onAdd={addProduct}/>

			</div>
		</Fade>
	);
}

export default List;