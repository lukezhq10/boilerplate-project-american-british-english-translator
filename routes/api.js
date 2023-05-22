'use strict';

const Translator = require('../components/translator.js');

module.exports = function (app) {
  
  const translator = new Translator();

  app.route('/api/translate')
    .post((req, res) => {
      let { text, locale } = req.body;
      if (locale === 'american-to-british') {
        let translation = translator.americanToBritish(text);
        return res.send({
          text: text,
          translation: translation
        });
      }

      if (locale === 'british-to-american') {
        // let translation = translator.britishtoameri(text);
        return res.send({
          text: text,
          translation: translation
        });
      }

    });
};
