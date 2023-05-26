'use strict';

const Translator = require('../components/translator.js');

module.exports = function (app) {
  
  const translator = new Translator();

  app.route('/api/translate')
    .post((req, res) => {
      let { text, locale } = req.body;
      if (locale === 'american-to-british') {
        let words = text.split(" ");
        let translation = translator.toBritishEnglish(text);
        let translatedWords = translation.split(" ");
        let highlightedTranslation = "";
        console.log(words);
        console.log(translatedWords);

        // highlight not working for words w/ spaces:
        // parking lot
        // Rube Goldberg machine
        // hooky / bunk off

        for (let i = 0; i < words.length; i++) {
          console.log(translator.isTranslated(words[i], translatedWords[i], true));
          if (translator.isTranslated(words[i], translatedWords[i], true)) {
            highlightedTranslation += `<span class="highlight">${translatedWords[i]}</span>` + " ";
          } else {
            highlightedTranslation += `${translatedWords[i]}` + " ";
          }
        }
  
        console.log(highlightedTranslation);
        return res.send({
          text: text,
          translation: highlightedTranslation
        });
      }

      if (locale === 'british-to-american') {
        let translation = translator.toAmericanEnglish(text);
        return res.send({
          text: text,
          translation: translation
        });
      }

    });
};
