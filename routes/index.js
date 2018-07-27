const express = require('express');
const router  = express.Router();
const Procedure = require('../models/procedure.js');

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});



//GET procedure page =======working! DOnt' touch!!!

router.get('/procedures', (req, res, next) => {
  Procedure.find()
    .then(procedures => {
      console.log(procedures);
      res.render("procedures", { procedures });
    })
    .catch(error => {
      console.log(error);
    });
});

//GET book detail view === DONE!!!! tested

router.get('/procedure/:id', (req, res, next) => {
  let procedureId = req.params.id;
  Procedure.findOne({'_id': procedureId})
    .then(procedure => {
      res.render("procedures-detail", { procedure });
    })
    .catch(error => {
      console.log(error);
    });
});

module.exports = router;
