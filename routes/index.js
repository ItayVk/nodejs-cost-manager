// Requiring everything we need
const express = require('express');
const url = require('url');
const router = express.Router();
const Cost = require('../models/Cost');
const querystring = require("querystring");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Cost Management' });
});

// Use the get method to gat all the data about the developers of the project
router.get('/about', function(req, res, next) {
  res.json(200, [{"firstname":"Itay","lastname":"Vekselbum","id":211871827,"email":"etay2010@gmail.com"},
    {"firstname":"Dor","lastname":"Bergel","id":322271792,"email":"dor.bergel9@gmail.com"},
    {"firstname":"Eyal","lastname":"Avni","id":212211734,"email":"eyalavni6@gmail.com"}]);
});

/* Making a post request to add a new cost to the database */
router.post('/addcost', function (req, res, next) {
  /* Extracting all the values from the json sent by the user */
  const user_id = Number(req.body.user_id);
  let year = req.body.year;
  let month = req.body.month;
  let day = req.body.day;
  const category = req.body.category;
  const sum = Number(req.body.sum);
  const description = req.body.description;

  /* Validating the year month and day */
  if(year === '' || month === '' || day === '' || month > 12 || month < 1 || day < 1 || day > 31){
    const date = new Date();
    year = date.getFullYear();
    month = date.getMonth() + 1;
    day = date.getDate();
  }
  /* Creating a new Cost object to add to the database */
  const cost = new Cost({
    user_id: user_id,
    year: year,
    month: month,
    day: day,
    category: category,
    description:description,
    sum: sum
  });
  // Validating that one of the parameters is not empty
  if(user_id !== undefined && sum !== undefined && description !== undefined && category !== undefined) {
    // If all the parameters are not empty add the cost to the database
    // Using the mongoose save function to add the new cost to the database
    cost.save().then(result => {
      // If succeeded redirecting to the main route
      res.redirect('/');
    }).catch(err => {
      // If not succeeded printing the error to the console
      console.error(err);
    });
  } else {
    // If one of the parameters is empty send an error to the user
    res.send("one of the parameters are undefined");
  }
});

// Use the get method to get a report of user's costs, you can filter it by month and year
router.get('/report', function (req, res, next) {

  // Creating the filters for the final result
  let filter = {};
  let filtered_document;
  const categories = {
    food: [],
    health: [],
    housing: [],
    sport: [],
    education: [],
    transportation: [],
    other: []
  };

  // Clean the query - url.parse is deprecated
  const queryObject = url.parse(req.url,true).query;
  const user_id = queryObject.user_id;
  const year = queryObject.year;
  const month = queryObject.month;

  // DEBUG SECTION
  console.log('user_id= ', user_id);
  console.log('year= ', year);
  console.log('month= ', month);

  // We decided to send all documents if year or month unsent
  if(year === undefined || month === undefined)
  {
    filter = {};
  }
  else{
    // Creating the filter if the month and year are set
    filter = {
      user_id: user_id,
      year: year,
      month: month};
  }
  console.log('filter: ', filter);

  // Fetching all the costs from the database by the find method
  Cost.find(filter).then((docs) => {
    console.log('Costs.find --> docs: ', docs);
    filtered_document = docs;
    // Sorting the documents to their categories
    filtered_document.forEach(doc => categories[doc.category].push({
      day: doc.day,
      description: doc.description,
      sum: doc.sum
    }));
    // Present the sorted documents to the user
    res.json(categories);
  }).catch((err) => {
    // Printing the error if it occurs
    console.log('Costs.find --> err: ', err);
    filtered_document = "Error Occurred"
    res.status(500).json({ error: "Internal Server Error" });
  });
});

// Export the router
module.exports = router;