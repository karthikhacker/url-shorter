const  express = require('express');
const  cors = require('cors');
const  bodyParser = require('body-parser');
const  path = require('path');
const  mongoose = require('mongoose');
const Url = require('./model/urlshort');
const  port = process.env.PORT || 3000;
const  app = express();

mongoose.connect('mongodb://karthik.hacker:hacker24@ds163689.mlab.com:63689/urlshort',(err) => {
   if(err){
     console.log(err);
   }else{
     console.log('Mongodb connected');
   }
});

app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname + '/public')));

//routes
app.get('/new/:shortUrl(*)',(req,res) => {
   var urlToShort = req.params.shortUrl;
   var expression =  /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;
   if(expression.test(urlToShort) === true){
     var shortUrl = Math.floor(Math.random() * 100000);
     var data = new Url({
       originalUrl:urlToShort,
       shortUrl:shortUrl
     });
     data.save(function(err){
        if(err) throw err;
        res.json(data);
     });
   }else{
    res.json({message:'Failed. Not a valid Url'});
   }
});

//redirect to original URl
app.get('/:urlToRedirect',(req,res) => {
  var shorterUrl = req.params.urlToRedirect;
  Url.findOne({'shortUrl':shorterUrl},(err,data) => {
    if(err) throw err;
    var reg = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;
    var originalData = data.originalUrl;
    if(reg.test(originalData)){
      res.redirect(data.originalUrl);
    }else{
      res.json({message:'Url not found'});
    }
  });
});

//server
app.listen(port,() => {
  console.log('App running at port ', port);
})
