const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var UrlSchema = new Schema({
  originalUrl:String,
  shortUrl:String
});

var Urls = mongoose.model('Urls',UrlSchema);
module.exports = Urls;
