const mongoose = require('mongoose');

const itemsSchema = new mongoose.Schema({
	name: String,
	bought: String
});

const listSchema = new mongoose.Schema({
	name: String,
	address: String,
	items: [itemsSchema]
});


module.exports = mongoose.model('Item', itemsSchema);
module.exports = mongoose.model('List', listSchema);