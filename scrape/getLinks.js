const rp = require('request-promise');
const cheerio = require('cheerio');

const getLinks = (url) => {
  const options = {
    uri: url,
    transform: function (body) {
      return cheerio.load(body);
    }
  };

  return rp(options)
    .then(($) => {
      var links = [];
      $('tr td:nth-child(2) a').each(function() {
          links.push( 'https://courses.students.ubc.ca' + $(this).attr('href') );
      });

      return links;
    })
    .catch((err) => {
      return err;
    });
}

module.exports = getLinks;
