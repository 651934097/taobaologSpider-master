
var model = require('./modelA');
var server = require("./server");
exports.home = function(req, res, next) {
  model.find(function(err, docs) {
    if (err) return next(err);
    // console.log(docs.length)
    res.send(docs);
  });
};

exports.modelName = function(req, res) {
  res.send('my model name is ' + model.modelName);
};

exports.insert = function(req, res, next) {
  // model.create({name: 'inserting ' + Date.now()}, function(err, doc) {
  //   if (err) return next(err);
  //   res.send(doc);
  // });
    server(req,res);
};
