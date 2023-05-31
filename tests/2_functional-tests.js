const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server.js');
const URL = '/api/translate';

chai.use(chaiHttp);

let Translator = require('../components/translator.js');

suite('Functional Tests', () => {
    suite('POST to /api/translate', () => {
        test('Translation with text and locale fields', done => {
            let body = {
                text: 'No Mr. Bond, I expect you to die.',
                locale: 'american-to-british'
            };
            let translation = 'No <span class="highlight">Mr </span>Bond, I expect you to die.'
            
            chai.request(server)
                .post(URL)
                .send(body)
                .end((err, res) => {
                    assert.property(res.body, 'text');
                    assert.property(res.body, 'translation');
                    assert.equal(res.body.translation, translation);
                    done();
                });
        });

        test('Translation with text and invalid locale field: POST request to /api/translate', done => {
            let body = {
                text: 'No Mr. Bond, I expect you to die.',
                locale: 'ameribob-to-british'
            };

            chai.request(server)
                .post(URL)
                .send(body)
                .end((err, res) => {
                    assert.property(res.body, 'error');
                    assert.equal(res.body.error, 'Invalid value for locale field');
                    done();
                });
        });

        test('Translation with missing text field: POST request to /api/translate', done => {
            let body = {
                locale: 'american-to-british'
            };

            chai.request(server)
                .post(URL)
                .send(body)
                .end((err, res) => {
                    assert.property(res.body, 'error');
                    assert.equal(res.body.error, 'Required field(s) missing');
                    done();
                });
        });

        test('Translation with missing locale field: POST request to /api/translate', done => {
            let body = {
                text: 'No Mr. Bond, I expect you to die.',
            };

            chai.request(server)
                .post(URL)
                .send(body)
                .end((err, res) => {
                    assert.property(res.body, 'error');
                    assert.equal(res.body.error, 'Required field(s) missing');
                    done();
                });
        });

        test('Translation with empty text: POST request to /api/translate', done => {
            let body = {
                text: '',
                locale: 'american-to-british'
            };

            chai.request(server)
                .post(URL)
                .send(body)
                .end((err, res) => {
                    assert.property(res.body, 'error');
                    assert.equal(res.body.error, 'No text to translate');
                    done();
                });
        });

        test('Translation with text that needs no translation: POST request to /api/translate', done => {
            let body = {
                text: 'Mangoes are my favourite fruit.',
                locale: 'american-to-british'
            };

            chai.request(server)
                .post(URL)
                .send(body)
                .end((err, res) => {
                    assert.equal(res.body.translation, 'Everything looks good to me!');
                    done();
                });
        });

    });
});
