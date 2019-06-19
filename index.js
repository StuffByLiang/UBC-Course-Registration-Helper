//libraries
const rp = require('request-promise');
const cheerio = require('cheerio');
const express = require('express');
const bodyParser = require('body-parser')
const fs = require('fs');
// var Promise = require('bluebird')

//custom scraping functions
const getLinks = require('./scrape/getLinks')
const getCourseData = require('./scrape/getCourseData')


const app = express();
const port = 3000;

// var history = [];

app.set('view engine', 'ejs'); //set templating engine
app.use( bodyParser.json() );       // to support JSON-encoded bodies POST
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies POST
  extended: true
}));

// index page
app.get('/', function(req, res) {
    res.render('pages/index', {
      data: ""
    }); // render empty page with no data if just a get request
});

// history page
app.get('/history', function(req, res) {
    res.sendFile(__dirname + '/history.txt');
});

// index page but with a form submission
app.post('/', function(req, res) {
  var { prefix, number } = req.body; // get user input into two variables

  var history = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + ": " + number + " " + prefix + "\n"; // get current date
  fs.appendFileSync('history.txt', history); //append this search into history.txt


  var url = `https://courses.students.ubc.ca/cs/courseschedule?pname=subjarea&tname=subj-course&dept=${prefix}&course=${number}`;

  //first get all links to each possible section for a specific course
  getLinks(url)
    .then((links) => {
      return Promise.all(
        links.map((url) => {
          // console.log(url)
          return getCourseData(url);
        })
      )
    })
    .then((data)=> {
      // console.log(data)
      res.render('pages/index', {
        data: data
      });
    })
    .catch(function(err) {
      //handle error
      console.log(err);
    });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`)) // finally open port to be accessed by clients
