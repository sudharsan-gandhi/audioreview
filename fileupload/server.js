var express = require('express');
var fileUpload = require('express-fileupload');
var app = express(),
    port=3000;
 var mysql=require('mysql');
 var connection =mysql.createConnection({
        host:'192.168.1.102',
        user:'root',
        password:'123456',
        database:'example'
    })
 connection.connect(function(err){
    if(err) throw err
        console.log('you are conected');
 });
// default options 
app.use(fileUpload());
app.use('/data',express.static(_dirname='app/data'));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.get('/',function(req,res){
        res.sendfile(_dirname="app/view/index.html")
        });
app.get('/audio',function(req,res){
    res.sendfile(_dirname="app/view/audio.html")
});
 
app.post('/upload/:id', function(req, res) {
    var file;
    var id=req.params.id;
    console.log('uploading');
    // console.log('Header: '+JSON.stringify(req.files));


    if (!req.files) {
        res.json('No files were uploaded.');
        return;
    }

    sampleFile = req.files.file;
    var fp='app/data/aud_'+Date.now()+'.m4a';
    var heap='data/aud_'+Date.now()+'.m4a';    
    var dburl='http://192.168.1.102:3000/'+heap;
    sampleFile.mv(fp, function(err) {
        if (err) {
            res.status(500).send(err);
        }
        else {
            var q="INSERT INTO `example`.`audio_reviews` (`movie_id`, `audio_url`) VALUES ('"+id+"', '"+dburl+"')";
            console.log("query"+q);
            connection.query(q,function(err,result){
                if(err) throw err
                    console.log(result);
            })

            res.json('File uploaded!');
        }
    });
});
app.get('/getjson',function(req,res){
  var q="select * from movie_details";
  connection.query(q,function(err,result){
    if(err) throw err
        console.log("refreshed");
        console.log("fetched");
        res.json(result);
  })  
})

app.get('/each/:id',function(req,res){
    var id=req.params.id;
    var q='select * from movie_details where id='+id;
    connection.query(q,function(err,result){
        if(err) throw err
            console.log(result);
            res.json(result);
    })
})
app.get('/audio/:id',function(req,res){
    var id=req.params.id;
    console.log('paramid:'+id);
    var q='select audio_url from audio_reviews where movie_id='+id;
    connection.query(q,function(err,result){
        if(err)throw err
            console.log(result);
        res.json(result);
    })
})
app.listen(port,function(success,error){
        console.log("port is open");
})
