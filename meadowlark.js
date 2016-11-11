var express = require('express');
var app = express();
//设置handlebars试图引擎
var handlebars = require('express3-handlebars').create({defaultLayout:'main'});
app.engine('handlebars',handlebars.engine);
app.set('view engine','handlebars');

app.set('port',process.env.PORT||3000);//设置端口号
app.use(express.static(__dirname + '/public'));//static中间件
//首页路由
app.get('/',function(req,res){
    res.render('home');
});
//about页路由
app.get('/about',function(req,res){
    var randomFortune = fortunes[Math.floor(Math.random()*fortunes.length)];
    res.render('about',{fortune:randomFortune});
});

//404 catch-all处理器 （中间件）
app.use(function(req,res,next){
    res.status(404);
    res.render('404');
});
//500 错误处理器 （中间件）
app.use(function(req,res,next){
    console.log(err.stack);
    res.status(500);
    res.render('500');
});
app.listen(app.get('port'),function(){
    console.log("Express于 http://localhost:" + app.get('port') + "开启成功，按Ctrl+C关闭！");
});

var fortunes = [
    '白日依山尽',
    '黄河入海流',
    '欲穷千里目',
    '更上一层楼'
];