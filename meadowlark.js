var express = require('express');//引入express
var fortune = require('./lib/fortune.js');
var app = express();
var bodyParser = require('body-parser');
var formidable = require('formidable');

//设置handlebars视图引擎
var handlebars = require('express3-handlebars').create({
    defaultLayout:'main',
    helpers :{
        section: function(name, options){
            if(!this._sections) this._sections = {};
            this._sections[name] = options.fn(this);
            return null;
        }
    }
});
app.engine('handlebars',handlebars.engine);
app.set('view engine','handlebars');

app.set('port',process.env.PORT||3000);//设置端口号

// parse application/x-www-form-urlencoded  
app.use(bodyParser.urlencoded({ extended: true }));
// parse application/json  
app.use(bodyParser.json()); 



//查询路由字符串中的test=1
app.use(function(req,res,next){
    res.locals.showTests = app.get('env') !== 'production'&& req.query.test==='1';
    next();
});


app.use(express.static(__dirname + '/public'));//static中间件
/*********************************************************************************
 * 天气组件
 *********************************************************************************/
    //天气假数据
    function getWeatherData(){
        return{
            locations:[
                {
                    name       :'Portland',
                    forecastUrl:'http://wunderground.com/US/OR/Portland.html',
                    iconUrl    :'http://icons-ak.wxug.com/i/c/k/cloudy.gif',
                    weather    :'Overcast',
                    temp       :'54.1 F (12.3 C)',
                },
                {
                    name       :'Bend',
                    forecastUrl:'http://wunderground.com/US/OR/Bend.html',
                    iconUrl    :'http://icons-ak.wxug.com/i/c/k/partlycloudy.gif',
                    weather    :'Partly Cloudy',
                    temp       :'55.0 F (12.8 C)',
                },
                {
                    name       :'Manzanita',
                    forecastUrl:'http://wunderground.com/US/OR/Manzanita.html',
                    iconUrl    :'http://icons-ak.wxug.com/i/c/k/rain.gif',
                    weather    :'Light Rain',
                    temp       :'55.0 F (12.8 C)',
                },
            ],
        };
    }
    //为res.locals.partials添加数据
    app.use(function(req,res,next){
        if(!res.locals.partials)res.locals.partials = {};
        res.locals.partials.weather = getWeatherData();
        next();
    });
/*********************************************************************************
 * [END]天气组件
 *********************************************************************************/


//首页路由
app.get('/',function(req,res){
    res.render('home');
});
//about页路由
app.get('/about',function(req,res){
    res.render('about',{
        fortune:fortune.getFortune(),
        pageTestScript:'qa/tests-about.js'
    });
});
app.get('/tour/oregon-coast',function(req,res){
    res.render('tour/oregon-coast');
});
app.get('/tour/hood-river',function(req,res){
    res.render('tour/hood-river');
});
app.get('/tour/request-group-rate',function(req,res){
    res.render('tour/request-group-rate');
});
app.get('/newsletter',function(req,res){
    //目前CSRF提供虚拟值，以后会学到
    res.render('newsletter',{csrf:'CSRF token goes here'});
});
app.get('/thank-you', function(req, res){
	res.render('thank-you');
});
app.post('/process',function(req,res){
    if(req.xhr||req.accepts('json,html')==='json'){
        res.send({success:true});
    }else{
        res.redirect(303, '/thank-you');
    }
});
app.get('/contest/vacation-photo',function(req,res){
    var now = new Date();
    res.render('contest/vacation-photo',{
        year:now.getFullYear(),month:now.getMonth()
    });
});
app.post('/contest/vacation-photo/:year/:month',function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req,function(err,fields,files){
        if(err){
            return res.redirect(303,'/error');
        }
        console.log('received fields:');
        console.log(fields);
        console.log('received files:');
        console.log(files);
        res.redirect(303,'/thank-you');
    });
});


app.get('/jquerytest', function(req, res){
	res.render('jquerytest');
});
app.get('/nursery-rhyme', function(req, res){
	res.render('nursery-rhyme');
});
app.get('/data/nursery-rhyme', function(req, res){
	res.json({
		animal: 'squirrel',
		bodyPart: 'tail',
		adjective: 'bushy',
		noun: 'heck',
	});
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



