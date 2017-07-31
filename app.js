var fs = require('fs');
var _ = require('lodash');
var flatten = require('flat');
var restify = require('restify');
var nodeExcel = require('excel-export');
var util = require('util');

//const fileName = '201705.json';
const encodingName = 'utf8';

function getFileName(fileName) {
	var returnValue = util.format('data\\%s',fileName);
	return returnValue;
}
function getExpenses(req, res, next) {
	let fileName = req.params.period + ".json";
	var rawFile = fs.readFile(getFileName(fileName), encodingName, (err,data) => {
		var content = JSON.parse(data);
		var transactions = content.data.transactions;
		var flatTransactions = _.map(transactions, flatten)
		var lst = _.map(flatTransactions,mapRecord)
		/*
		var returnValue = exportToExcel(lst);
		res.setHeader('Content-Type', 'application/vnd.openxmlformats');
    	res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");
    	res.end(returnValue, 'binary');
		*/
		res.send(lst, {'content-type': 'application/json; charset=utf-8'});
		return next();
	});
}

function getExpense(req,res,next) {
	var idExpense = req.params.idExpense;
	let fileName = req.params.period + ".json";
	var rawFile = fs.readFile(getFileName(fileName), encodingName, (err,data) => {
		var content = JSON.parse(data);
		var transactions = content.data.transactions;
		var flatTransact = flatten(transactions[idExpense]);
		var lst = _.map(flatTransact,mapRecord )
		var returnValue = exportToExcel(lst);
		res.setHeader('Content-Type', 'application/vnd.openxmlformats');
    	res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");
    	res.end(returnValue, 'binary');
		return next();
	});
}

function exportToExcel(data) {
	var rows = [];
	_.forEach(data,function(el) {
		rows.push(_.toArray(el));
	});
	var columns = [
      {'caption':'Día', 'type':'string', width:28.7109375},//, beforeCellWrite: function(){} },
      {'caption':'Categoría', 'type':'string'},
      {'caption':'Descripción', 'type':'string'},
      {'caption':'Método de Pago', 'type':'string'},
      {'caption':'Monto', 'type':'string'}
    ];
    var conf ={};
    //conf.stylesXmlFile = "styles.xml";
    conf.name = "expenses";
    conf.cols = columns;
    conf.rows = rows;
    var returnValue = nodeExcel.execute(conf);
    return returnValue;
}

function mapRecord(record) {
	var recordDate = new Date(record.displayDate);
	var recordMonth = recordDate.getMonth() + 1;
	var recordDay = recordDate.getDate() + 1;
	return {
		date: record['displayDate'],
		month: recordMonth,
		day: recordDay,
		category:record['category.name'],
		note: record['note'],
		account: record['account.name'],
		amount: record['amount']
	}
}
var server = restify.createServer();
var serverPort = process.env.PORT || 3000;
server.get('/expenses/:period', getExpenses);
server.get('/expenses/:period/:idExpense',getExpense);
server.listen(serverPort, function(){
	console.log('Listening on ' + serverPort);
});