var fortunesCookies = [
    '白日依山尽',
    '黄河入海流',
    '欲穷千里目',
    '更上一层楼'
];
exports.getFortune = function(){
    var idx = Math.floor(Math.random()*fortunesCookies.length);
    return  fortunesCookies[idx];
};