import axios from 'axios';

export default {
	getAll: (list, address) => {
		return (
			axios.post(`/get/product`, {
				list: list,
				address: address
			})
			.then(function(response) {
				// console.log(response);
				return (response.data);
			})
			.catch(function(error) {
				console.log(error);
			})
		)
	},
	postOne: (list, address, product) => {
		return (
			axios.post(`/add/product`, {
				list: list,
				address: address,
				name: product.name,
				bought: product.bought
			})
			.then(function(response) {
				// console.log(response);
				return (response);
			})
			.catch(function(error) {
				console.log(error);
			})
		)
	},
	deleteOne: (list, address, name) => {
		return (
			axios.post(`/delete/product/`, {
				list: list,
				address: address,
				name: name
			})
			.then(function(response) {
				// console.log(response);
				return (response);
			})
			.catch(function(error) {
				console.log(error);
			})
		)
	},
	checkOne: (list, address, name, bought) => {
		return (
			axios.post(`/check/product/`, {
				list: list,
				address: address,
				name: name
			})
			.then(function(response) {
				// console.log(response);
				return (response.data);
			})
			.catch(function(error) {
				console.log(error);
			})
		)
	},
}