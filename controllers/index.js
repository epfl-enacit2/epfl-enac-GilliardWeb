'use strict'
var express = require('express');
var router = express.Router();
var moment = require('moment');


var GilliardDb = require('epfl-enac-gilliarddb')(
    { 
      hostname: 'localhost',
      name:'testsequelize',
      username:'root',
      password:'password'
    }
  );

console.log(GilliardDb);


var Sequelize = require('sequelize');
 
var connection = new Sequelize('testsequelize', 'root', 'password');

var Post = connection.define('sensorvalues', {});


/* GET home page.*/
router.get('/', function (req, res, next) {
  res.render('index', {
    title : "test"
  });
});


router.get('/sensor', function (req, res, next) {
  var sensId = req.query.selectSensor;
  var calendar = req.query.calendar;
  var timeBegin = req.query.timeDebut;
  var timeEnd = req.query.timeFin;
  var timeFinal1 = calendar + " " + timeBegin;
  var timeFinal2 = calendar + " " + timeEnd;
  var moment = require('moment');
  //connection.query("SELECT * FROM testsequelize.sensorvalues Where Sensors_SID = \'" + sensId + "\'")
  //connection.query("SELECT * FROM testsequelize.sensorvalues Where Sensors_SID = \'" + sensId + "\' AND CreatedAt BETWEEN \'" + timeFinal1 + "\' AND \'" + timeFinal2 + "\'")
  /*
  Post.findAll({
    where: { Sensors_SID: "DW1" },
    attributes: ['*']
  })
  */
  //connection.query("SELECT * FROM testsequelize.sensorvalues Where Sensors_SID = 'DW1'")
  GilliardDb.models.SensorValues
    .findAll(
    {
        where: { 
            $and: [
                { Sensors_SID: 'DW1' },
                ]}
    })
  .then(function (project) {

      /*
      console.log(project[0][0].Sensors_SID);
      console.log(project[0][0].Value);
      console.log(project[0][0].CreatedAt);
      console.log(project[0]);
      */
      console.log(project);

    res.render('sensor', {
      title:  project[0][0].Sensors_SID,
      sensId: project[0][0].Sensors_SID,
      sensVal: project[0][0].Value,
      sensDate: project[0][0].CreatedAt,
      sensors: project[0],
    });
});
});

//connection.query("SELECT * FROM testsequelize.sensorvalues order by Sensors_SID;")
router.get('/sensors', function (req, res, next) {
  connection.query("Select acquisitionsys.Computername, sensors.SID, boards.BID FROM acquisitionsys INNER JOIN boards ON acquisitionsys.IdAcquisitionSys = boards.AcquisitionSys_IdAcquisitionSys INNER JOIN sensors ON boards.AcquisitionSys_IdAcquisitionSys = sensors.Boards_AcquisitionSys_IdAcquisitionSys")
    .then(function (projects) {
      console.log(projects[0])

      res.render('sensors', {
        title: projects[0]
      });
    });
});



router.get('/graphTEST', function (req, res, next) {
  var Date1 = req.query.datetimepicker1
  var Date2 = req.query.datetimepicker2
  var select = req.query.list
  var obj = []
  var Computername = []
  var SID = []
  var BID = []
  //console.log(JSON.parse(select));
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
  
  //GilliardDb.models.sensorvalues.findAll({
  Post.findAll({
    where: { Sensors_SID: SID, Sensors_Boards_BID : BID, CreatedAt : {$between : ['2016-09-06', '2016-09-07']}, },
    attributes: ['*']
  })
  .then(function (project) {
    console.log(project)
  res.render('graph', {
    Date1 : Date1,
    Date2 : Date2,
    obj : obj,
  });
});
});


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

  GilliardDb.models.SensorValues
    .findAll(
    {
        where: { 
            $and: [
                { Sensors_SID: SID },
                { Sensors_Boards_BID: BID },
                { CreatedAt: {$between : [DateTest, DateTest2]}, }
                ]},
    })
    .then(function (project) {
    console.log(project)
  res.render('graph', {
    Date1 : moment(DateTest).format('YYYY/MM/DD HH:mm:ss'),
    Date2 : moment(DateTest2).format('YYYY/MM/DD HH:mm:ss'),
    obj : obj,
  });
});
});

module.exports = router; 
