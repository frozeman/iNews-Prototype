var page = require('webpage').create();
var url = 'http://localhost:3000/article/TeD2B4PfxJ33avugN/2013/05/02/iran-may-be-reconsidering-position-on-syria?_escaped_fragment_=';
 
page.open(url, function (status) {
    var js = page.evaluate(function () {
        return document;
    });
    console.log(js.all[0].outerHTML);
    phantom.exit();
});