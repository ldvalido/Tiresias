var fs = require('fs');
var _ = require('lodash');
var flatten = require('flat');
var restify = require('restify');

function getExpenses(req, res, next) {
	var rawFile = fs.readFile('data\\march.json', 'utf8', (err,data) => {
		var content = JSON.parse(data);
		var transactions = content.data.transactions;
		var flatTransactions = _.map(transactions, flatten)

		res.send(flatTransactions);
		return next();
	});
}

function getExpense(req,res,next) {
	var idExpense = req.params.idExpense;
	var rawFile = fs.readFile('data\\march.json', 'utf8', (err,data) => {
		var content = JSON.parse(data);
		var transactions = content.data.transactions;
		var flatTransact = flatten(transactions[idExpense]);
		res.send(flatTransact);
		return next();
	});
}

var server = restify.createServer();
server.get('/expenses', getExpenses);
server.get('/expenses/:idExpense',getExpense);
server.get('/echo',function(){console.log('Hello')});
server.listen(process.env.PORT || 3000, function(){
	console.log('Listening');
});