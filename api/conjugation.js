const rp = require('request-promise');
const $ = require('cheerio');

module.exports = (req, res) => {
  rp(`https://www.babla.ru/${encodeURI('спряжения')}/${encodeURI('польский')}/${encodeURI(req.query.q)}`)
  .then(function(html){
    const presentTimeBlock = $('#conjFull .conj-tense-block', html).first();
    const translate = $('#conjTrans .quick-result-overview a', html).first().text();
    const title = $('.conj-tense-block-header', presentTimeBlock).text();

    const listOfItemElements = $('.conj-item', presentTimeBlock);
    const listOfPersonElements = $('.conj-person', presentTimeBlock);
    const listOfResultElements = $('.conj-result', presentTimeBlock);

    const conjugation = {};

    for (let i = 0; i < listOfItemElements.length; i++) {
      conjugation[listOfPersonElements.eq(i).text()] = listOfResultElements.eq(i).text()
    }

    res.json({
      conjugation,
      translate
    })
  })
  .catch(function (err) {
    console.log(err);
  });
}