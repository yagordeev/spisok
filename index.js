require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
var passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const _ = require('lodash');


// IMPORT MODELS
const Item = require('./server/models/mongo.js');
const List = require('./server/models/mongo.js');

const addressSchema = new mongoose.Schema({
	username: { type: String, unique: true },
	password: String
});

addressSchema.plugin(passportLocalMongoose);
const Address = mongoose.model('Address', addressSchema);

const app = express();

app.use(express.static('./client/dist/')); //webpack files
app.use(express.static('./client/src/public')); //other public files

// mongo passport session
app.use(session({
	secret: process.env.SECRET,
	resave: false,
	store: new MongoStore({
		mongooseConnection: mongoose.connection,
		touchAfter: 24 * 3600
	}),
	cookie: { maxAge: Date.now() + (30 * 24 * 60 * 60 * 1000) }, //now + 30 days
	saveUninitialized: false
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

var db = process.env.DB;
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);
mongoose.connect(db, { useNewUrlParser: true });
mongoose.set('useCreateIndex', true);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// passportLocalMongoose
passport.use(Address.createStrategy());
passport.serializeUser(Address.serializeUser());
passport.deserializeUser(Address.deserializeUser());

//check if authenticated and send back response
app.post('/', function(req, res) {
	if(req.isAuthenticated()) {
		res.status(200).json({
			address: req.user.username,
			list: 'Список Продуктов',
			auth: 'authorized',
		});
	} else {
		res.json({
			auth: 'undefined'
		});
	}
})

//login function
app.route('/login')

	.post(function(req, res) {
		const street = _.lowerCase(req.body.street).trim(); //user's street
		const house = _.lowerCase(req.body.house).trim(); //user's house
		req.body.username = street + '_' + house; //req.body.username feature for passport.js
		const myaddress = req.body.username; //address=username
		Address.findOne({ username: myaddress }, function(err, foundAddress) {
			if(!foundAddress) {
				//register new address
				Address.register({
					username: myaddress
				}, req.body.password, function(err) {
					if(err) {
						console.log(err);
					} else {
						passport.authenticate('local', {
							successRedirect: '/',
							failureRedirect: '/?error=0' //problems with registration = bugs
						})(req, res, function() {});
					}
				});
			} else {
				//authenticate user
				passport.authenticate('local', {
					successRedirect: '/',
					failureRedirect: '/?error=1' //wrong login or password
				})(req, res, function() {
					console.log(myaddress, req.body.password);
				});
			}
			//create empty grocery list if not exist for user's address
			List.findOne({ name: 'Список Продуктов', address: myaddress }, function(err, foundItems) {
				if(!foundItems) {
					const list = new List({
						name: 'Список Продуктов',
						address: myaddress
					});
					list.save();
				}
			});
		});
	})

//logout function
app.get('/logout', function(req, res) {
	req.logout('/');
	res.redirect('/');
});

//get user's products from database
app.post(`/get/product`, (req, res) => {
	if(req.isAuthenticated()) {
		const myaddress = req.user.username;
		const groceryList = req.body.list;
		List.findOne({ name: groceryList, address: myaddress }, function(err, foundItems) {
			if(!err) {
				return res.status(200).send(foundItems);
			} else {
				console.log(err);
				res.send(false);
			}
		});
	}
});

//add products to user's grocery list
app.post(`/add/product`, (req, res) => {
	if(req.isAuthenticated()) {
		const myaddress = req.body.address;
		const groceryList = req.body.list;
		//get array from new products
		const itemName = _.map((_.toLower(req.body.name)).split(','), _.trim);
		//find user's grocery list
		List.findOne({ name: groceryList, address: myaddress }, function(err, foundList) {
			if(!foundList) {
				console.log('List not found for ' + myaddress);
				res.send(false);
			} else {
				const allProducts = [];
				//add lodash rules (to lowerCase)
				foundList.items.forEach(oldItem => {
					allProducts.push(_.toLower(oldItem.name));
				});
				//look for duplicates
				const noDuplicate = itemName.filter((f) => !allProducts.includes(f));
				//continue if noDuplicate is not empty
				if(noDuplicate) {
					noDuplicate.forEach(newItem => {
						const newProduct = _.capitalize(newItem.trim());
						if(newProduct != '') {
							const item = new Item({
								name: newProduct,
								bought: 'no'
							});
							foundList.items.push(item);
						}
					});
					foundList.save(); //and save
					console.log('added');
					res.send(true);
				}
			}
		})
	}
})

//check as bought or uncheck users's product
app.post(`/check/product/`, async (req, res) => {
	if(req.isAuthenticated()) {
		const myaddress = req.body.address;
		const groceryList = req.body.list;
		const product = req.body.name;
		List.findOne({ address: myaddress, name: groceryList }, function(err, foundList) {
			if(!foundList) {
				console.log('nothing for check');
				res.send(false);
			} else {
				//find product from user's list
				const result = foundList.items.filter(item => item.name == product);
				//get actual bought status
				const bought = result[0].bought;
				//update status
				List.updateOne({
						address: myaddress,
						name: groceryList,
						'items.name': product
					}, {
						$set: { 'items.$.bought': (bought === 'checked') ? 'no' : 'checked' }
					},
					function(err) {
						if(err) { console.log(err) }
						console.log('check: ' + bought);
						res.send(true);
					});
			}
		});
	}
});

//delete users's product
app.post(`/delete/product/`, async (req, res) => {
	if(req.isAuthenticated()) {
		const myaddress = req.body.address;
		const groceryList = req.body.list;
		const product = req.body.name;
		List.findOne({ name: groceryList, address: myaddress }, function(err, foundList) {
			if(!foundList) {
				console.log('list not found');
				res.send(false);
			} else {
				List.updateOne({
						address: myaddress,
						name: groceryList,
						'items.name': product
					}, {
						$pull: { items: { name: product } }
					},
					function(err) {
						if(err) { console.log(err) }
						console.log('delete: ' + product);
						res.send(true);
					});
			}
		});
	}
})

//redirect to home page from any 404
app.get('*', function(req, res) {
	res.redirect('/');
});

app.listen(process.env.PORT || 3000, function() {
	console.log('Server is ready on :3000')
});
