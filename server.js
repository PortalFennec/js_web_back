const express = require('express');
const {MongoClient, ObjectId} = require('mongodb');

const app = express();
const port = 8000;

app.use(express.json());
app.use(express.static('public'));

async function getDbCollection(dbAddress, dbName, dbCollectionName){
	const client = new MongoClient(dbAddress);
	await client.connect();
	const db = client.db(dbName);
	return db.collection(dbCollectionName);
};

app.get('/computer_cart', async function(req, res){
	const collection = await getDbCollection('mongodb://127.0.0.1', 'CartApp', 'computer_cart');
	const data = await collection.find({}).toArray();
	console.log("Data from MongoDB: ", data);
	res.send(data);
});

app.get('/computer_cart/:id', async function(req, res){
	const collection = await getDbCollection('mongodb://127.0.0.1', 'CartApp', 'computer_cart');
	const data = await collection.findOne({_id: new ObjectId(req.params.id)});
	res.send(data);
});

app.post('/computer_cart', async function(req, res){
	const cart = {...req.body, done:false};
	const collection = await getDbCollection('mongodb://127.0.0.1', 'CartApp', 'computer_cart');
	await collection.insertOne(cart);
	res.send(cart);
});

app.patch('/computer_cart/:id', async function(req, res){
	const collection = await getDbCollection('mongodb://127.0.0.1', 'CartApp', 'computer_cart');
	const data = await collection.updateOne({_id: new ObjectId(req.params.id)}, {'$set': req.body});
	res.send({});
});

app.delete('/computer_cart/:id', async function(req, res){
	const collection = await getDbCollection('mongodb://127.0.0.1', 'CartApp', 'computer_cart');
	await collection.deleteOne({_id: new ObjectId(req.params.id)});
	res.send({});
});

app.listen(port, function(){
	console.log('Server is started');
})