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
var Sequelize = require('sequelize');
var connection = new Sequelize('testsequelize', 'root', '');
var Post = connection.define('sensorvalues', {});

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
//connection.query("Select acquisitionsys.Computername, sensors.SID, boards.BID FROM acquisitionsys INNER JOIN boards ON acquisitionsys.IdAcquisitionSys = boards.AcquisitionSys_IdAcquisitionSys INNER JOIN sensors ON boards.AcquisitionSys_IdAcquisitionSys = sensors.Boards_AcquisitionSys_IdAcquisitionSys")
router.get('/sensors', function (req, res, next) {
  GilliardDb.models.AcquisitionSys.belongsToMany(GilliardDb.models.Boards, { through: 'IdAcquisitionSys'});
  GilliardDb.models.Boards.belongsToMany(GilliardDb.models.AcquisitionSys, { through: 'IdAcquisitionSys'});

  connection.query(
    `SELECT a.Computername, s.SID, b.BID, s.Unit
      FROM acquisitionsys AS a
      INNER JOIN  boards AS b ON 
        a.IdAcquisitionSys = b.AcquisitionSys_IdAcquisitionSys AND 
        a.Sciper = b.AcquisitionSys_Sciper
      INNER JOIN sensors AS s ON 
        b.AcquisitionSys_IdAcquisitionSys = s.Boards_AcquisitionSys_IdAcquisitionSys AND
        b.AcquisitionSys_Sciper = s.Boards_AcquisitionSys_Sciper AND
        b.BID = s.Boards_BID
        `)
    .then(function (projects) {
      console.log(projects[0])

      res.render('sensors', {
        title: projects[0]
      });
    });
});

router.get('/sensors3', function (req, res) {
  connection.query(
    `SELECT a.Computername, s.SID, b.BID, s.Unit, sv.Value, sv.CreatedAt
      FROM acquisitionsys AS a
      INNER JOIN  boards AS b ON 
        a.IdAcquisitionSys = b.AcquisitionSys_IdAcquisitionSys AND 
        a.Sciper = b.AcquisitionSys_Sciper
      INNER JOIN sensors AS s ON 
        b.AcquisitionSys_IdAcquisitionSys = s.Boards_AcquisitionSys_IdAcquisitionSys AND
        b.AcquisitionSys_Sciper = s.Boards_AcquisitionSys_Sciper AND
        b.BID = s.Boards_BID
      INNER JOIN sensorValues as sv ON 
        s.Boards_AcquisitionSys_IdAcquisitionSys = sv.Sensors_Boards_AcquisitionSys_IdAcquisitionSys AND
        s.Boards_AcquisitionSys_Sciper = sv.Sensors_Boards_AcquisitionSys_Sciper AND
        s.Boards_BID = sv.Sensors_Boards_BID AND
        s.SID = sv.Sensors_SID 
        `)
    .then(function (projects) {
      console.log(projects[0])

      res.json(projects);
    });

})

router.get('/sensors2', function (req, res) {
  GilliardDb.models.AcquisitionSys
    .findAll()
    .then(function(Acqu) {

      GilliardDb.models.Boards
      .findAll({ })
      .then((Boards)=> {
        Acqu[0].dataValues.Boards = Boards;

        // var toto = [
        //   {
        //     AcquisitionSysComputername : 'totoPc1',
        //     boards: [
        //       {
        //         boardName: 'BID1',
        //         sensors:[
        //           {
        //             sensorName: 'Sens1',
        //             unit: '°C',
        //             sensorValues:[
        //               { val: 12.3, date: '12.12.2017' }
        //             ]
        //           }
        //         ]
        //       }
        //     ]
        //   }
        // ]

        res.json(Acqu);
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

  //WHERE s.SID IN ('DW1', 'HA1') and sv.CreatedAt BETWEEN '2016-09-06 11:27:34.996' AND '2016-09-06 12:00:00.000' ORDER BY s.SID
  //WHERE s.SID IN (`+ SID + `) and sv.CreatedAt BETWEEN `+ Date1 +` AND `+ Date2 +` ORDER BY s.SID
     connection.query(
    `SELECT a.Computername, s.SID, b.BID, s.Unit, sv.Value, sv.CreatedAt
      FROM acquisitionsys AS a
      INNER JOIN  boards AS b ON 
        a.IdAcquisitionSys = b.AcquisitionSys_IdAcquisitionSys AND 
        a.Sciper = b.AcquisitionSys_Sciper
      INNER JOIN sensors AS s ON 
        b.AcquisitionSys_IdAcquisitionSys = s.Boards_AcquisitionSys_IdAcquisitionSys AND
        b.AcquisitionSys_Sciper = s.Boards_AcquisitionSys_Sciper AND
        b.BID = s.Boards_BID
      INNER JOIN sensorValues as sv ON 
        s.Boards_AcquisitionSys_IdAcquisitionSys = sv.Sensors_Boards_AcquisitionSys_IdAcquisitionSys AND
        s.Boards_AcquisitionSys_Sciper = sv.Sensors_Boards_AcquisitionSys_Sciper AND
        s.Boards_BID = sv.Sensors_Boards_BID AND
        s.SID = sv.Sensors_SID 
      WHERE s.SID IN ('DW1', 'HA1') and sv.CreatedAt BETWEEN '2016-09-06 11:27:34.996' AND '2016-09-06 12:00:00.000' ORDER BY s.SID
        `)
    .then(function (project) {
      console.log(project)
      var arrayDates = []
      var arrayValues = []
      var k = 0
      project[0].forEach(function(element) {
        arrayDates[k]= moment(element.CreatedAt).utc().format('YYYY/MM/DD HH:mm:ss'),
        arrayValues[k]= element.Value
        k++
      }, this);
      k = 0
      console.log(moment(DateTest).format('YYYY/MM/DD HH:mm:ss'));

      var structuredValues= [];
      for (var i = 0; i < project[0].length; i++) {
         var currentSensorItem = project[0][i];
         var existingSensorObjs = structuredValues.filter(function(sensor){ return sensor.title === currentSensorItem.SID });
         var existingSensor;
 
         if(existingSensorObjs.length > 0){
           existingSensor =  existingSensorObjs[0];
         } else {
           existingSensor = { 
             title: currentSensorItem.SID, 
             values: [],
             dates: []
           };
        }
         existingSensor.values.push(currentSensorItem.Value);
         existingSensor.dates.push(currentSensorItem.CreatedAt);
 
         if(existingSensorObjs.length <= 0){
          structuredValues.push(existingSensor);
          }
      }
    res.render('graph2', {
      Date1 : moment(DateTest).format('YYYY/MM/DD HH:mm:ss'),
      Date2 : moment(DateTest2).format('YYYY/MM/DD HH:mm:ss'),
      obj : obj,
      test : project[0],
      Dates : arrayDates,
      Values : arrayValues,
      structuredValues : structuredValues
    });
  });
});

module.exports = router; 



/*
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
*/    