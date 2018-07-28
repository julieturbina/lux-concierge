const express = require('express');
const router  = express.Router();
const Procedure = require('../models/procedure.js');
const User     = require('../models/user');
// Test befor uncommenting =======

// router.get('/books/add', (req, res, next) => {
//   res.render("book-add");
// });

/* GET home page */
// router.get('/', (req, res, next) => {
//   res.render('index');
// });

//GET procedure page =======  TESTED! DOnt' touch!!!

router.get('/procedures', (req, res, next) => {
  if (!req.user){
    res.redirect('/login');
  }
  Procedure.find()
    .then(procedures => {
      // console.log(procedures);
      res.render("procedures", { procedures });
    })
    .catch(error => {
      console.log(error);
    });
});

//GET procedure detail view === DONE!!!! tested

router.get('/procedures/:id', (req, res, next) => {
  let procedureId = req.params.id;
  Procedure.findOne({'_id': procedureId})
    .then(procedure => {
      res.render("procedures-detail", { procedure });
    })
    .catch(error => {
      console.log(error);
    });
});

//Get procedure-add page =========== CCCCCCCCCCCCCC

router.get('/procedure-add', (req, res, next) => {
  res.render("procedure-add");
});

// POST new procudures - add to database =============TESTED

router.post('/procedure-add', (req, res, next) => {
  const { title, provider, review } = req.body;
  const newProcedure = new Procedure({ title, provider, review});
  newProcedure.save()
  .then((procedure) => {
    res.redirect('/procedures');
  })
  .catch((error) => {
    console.log(error);
  });
});

// Edit procedures ============= test prior to uncommenting

// router.get('/procedures/edit', (req, res, next) => {
//   res.render("procedure-edit");
// });

// Edit procedures: Name, Provider and Review ============= UUUUUUUUU

router.get('/procedure-edit/:id', (req, res, next) => {
  Procedure.findOne({_id: req.params.id})
  .then((procedure) => {
    console.log('hello: ', procedure)
    res.render("procedure-edit", {procedure});
  })
  .catch((error) => {
    console.log(error);
  });
});

router.post('/procedure-edit/:id', (req, res, next) => {
  const { title, provider, review } = req.body;
  Procedure.update({_id: req.params.id}, { $set: { title, provider, review }})
  .then((procedure) => {
    res.redirect('/procedures');
  })
  .catch((error) => {
    console.log(error);
  });
});

  //Get fashion page===
  router.get('/fashion', (req, res, next) => {
    res.render('fashion');
  });
  
  //Get makeup page===
  router.get('/makeup', (req, res, next) => {
    res.render('makeup');
  });

 //Get Private page to ADD and EDIT existing procedures
router.get('/private', (req, res, next) => {
  res.render('private');
});
  
// Delete procedures ============  goes here if i have the time. 

router.post('/procedures/:id/delete', (req, res, next) => {
  Procedure.findByIdAndRemove(req.params.id)
  .then(() => {
    res.redirect('/procedures');
  })
  .catch( err => next(err));
})


module.exports = router;