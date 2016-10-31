'use strict'
module.exports = function(router){
    router.get('/', function (req, res, next) {
        res.render('index', {
            title : "test"
        });
    });

    router.get('/:id', function (req, res, next) {
        res.render('index', {
            title : "test"
        });
    });

 return router;   
}; 