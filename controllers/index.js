'use strict'
var express = require('express');
var router = express.Router();
var moment = require('moment');


var GilliardDb = require('epfl-enac-gilliarddb')(
    { 
      hostname: 'localhost',
      name:'testsequelize',
      username:'root',
      password:''
    }
  );

console.log(GilliardDb);


var Sequelize = require('sequelize');
 
var connection = new Sequelize('testsequelize', 'root', '');

var Post = connection.define('sensorvalues', {});


/* GET home page.*/
 //res.render('index', {
    //title : "test"
  //});
//});
router.get('/', function (req, res, next) {
 connection.query("Select acquisitionsys.Computername, sensors.SID, boards.BID FROM acquisitionsys INNER JOIN boards ON acquisitionsys.IdAcquisitionSys = boards.AcquisitionSys_IdAcquisitionSys INNER JOIN sensors ON boards.AcquisitionSys_IdAcquisitionSys = sensors.Boards_AcquisitionSys_IdAcquisitionSys")
    .then(function (projects) {
      console.log(projects[0])

      res.render('sensors', {
        title: projects[0]
      });
    });
});

//connection.query("SELECT * FROM testsequelize.sensorvalues order by Sensors_SID;")
router.get('/sensors', function (req, res, next) {
  GilliardDb.models.AcquisitionSys.belongsToMany(GilliardDb.models.Boards, { through: 'IdAcquisitionSys'});
  GilliardDb.models.Boards.belongsToMany(GilliardDb.models.AcquisitionSys, { through: 'IdAcquisitionSys'});

  connection.query("Select acquisitionsys.Computername, sensors.SID, boards.BID FROM acquisitionsys INNER JOIN boards ON acquisitionsys.IdAcquisitionSys = boards.AcquisitionSys_IdAcquisitionSys INNER JOIN sensors ON boards.AcquisitionSys_IdAcquisitionSys = sensors.Boards_AcquisitionSys_IdAcquisitionSys")
    .then(function (projects) {
      console.log(projects[0])

      res.render('sensors', {
        title: projects[0]
      });
    });
});
/*
GilliardDb.models.AcquisitionSys
    .findAll(
    {
        where: { 
            $and: [
                { IdAcquisitionSys: "1" },
                { Sciper: "240312" }
                ]},
            defaults: {
                IdAcquisitionSys: "1",
                Sciper: "240312",
                Computername: 'enacitpc30',
                Responsible: "mbonjour <mickael.bonjour@epfl.ch>",
                AppVersion: "0.0.1"
        }
    });

GilliardDb.models.AcquisitionSys.belongsToMany(Team, { through: 'IdAcquisitionSys'});
GilliardDb.models.Boards.belongsToMany(User, { through: 'IdAcquisitionSys'});

GilliardDb.models.AcquisitionSys.belongsToMany(Team, { through: 'IdAcquisitionSys'});
GilliardDb.models.Sensors.belongsToMany(Folder, { through: 'IdAcquisitionSys'});


*/

router.get('/graph', function (req, res, next) {
  var Date1 = req.query.datetimepicker1
  var DateTest = new Date (Date1)
  console.log(moment('2016-07-29T10:21:48.000Z').format())
  //console.log(moment(DateTest).isValid()) // false
  var Date2 = req.query.datetimepicker2
  var DateTest2 = new Date (Date2)
  var select = req.query.list

  var obj = []
  var Computername = []
  var SID = []
  var BID = []

  if(Array.isArray(select)){
    for (var j=0; j < select.length; j++) {
      obj[j] = JSON.parse(select[j])
      Computername[j] = obj[j].Computername
      SID[j] = obj[j].SID
      BID[j] = obj[j].BID
      //console.log(obj[j]);
      }
  }
  else{
    obj = JSON.parse(select)
    Computername = obj.Computername
    SID = obj.SID
    BID = obj.BID
   // console.log(obj[0])
  }

  //console.log(obj)
  //var names = req.body['names[]'];
  //var valuesasa = req.body.myAutocomplete
  //var test = req.query.myAutocomplete.getElementsByClassName("ui-autocomplete-multiselect-item");
  //console.log(Date1 + " " + Date2);
  //connection.query("SELECT * FROM testsequelize.sensorvalues Where Sensors_SID = 'DW1'")

  GilliardDb.models.SensorValues
    .findAll(
    {
        where: { 
            $and: [
                { Sensors_SID: SID },
                { Sensors_Boards_BID: BID },
                { CreatedAt: {$between : [moment(DateTest).format(), moment(DateTest2).format()]},}
                ]},
    })
    .then(function (project) {
    console.log(project)
    var arrayDates = []
    var arrayValues = []
    var k = 0
    project.forEach(function(element) {
      arrayDates[k]= moment(element.CreatedAt).utc().format('YYYY/MM/DD HH:mm:ss'),
      arrayValues[k]= element.Value
      k++
    }, this);
    k = 0
    console.log(moment(DateTest).format('YYYY/MM/DD HH:mm:ss'));
  res.render('graph', {
    Date1 : moment(DateTest).format('YYYY/MM/DD HH:mm:ss'),
    Date2 : moment(DateTest2).format('YYYY/MM/DD HH:mm:ss'),
    obj : obj,
    test : project,
    Dates : arrayDates,
    Values : arrayValues
  });
});
});

module.exports = router; 
