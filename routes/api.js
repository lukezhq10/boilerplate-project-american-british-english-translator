'use strict';

const Translator = require('../components/translator.js');

module.exports = function (app) {
  
  const translator = new Translator();

  app.route('/api/translate')
    .post((req, res) => {
      let { text, locale } = req.body;
      
      if (text === undefined || !locale) {
        return res.json({
          error: 'Required field(s) missing'
        });
      }

      if (text === '') {
        return res.json({
          error: 'No text to translate'
        });
      }

      if (locale !== 'american-to-british' && locale !== 'british-to-american') {
        return res.json({
          error: 'Invalid value for locale field'
        });
      }

      if (locale === 'american-to-british') {
        let translation = translator.toBritishEnglish(text);

        if (text === translation) {
          return res.json({
            text: text,
            translation: 'Everything looks good to me!'
          });
        } else {
          console.log(translation);
          return res.json({
            text: text,
            translation: translation
          });
        }
      }

      if (locale === 'british-to-american') {
        let translation = translator.toAmericanEnglish(text);

        if (text === translation) {
          return res.json({
            text: text,
            translation: 'Everything looks good to me!'
          });
        } else {
          return res.json({
            text: text,
            translation: translation
          });
        }
      }

    });
};
