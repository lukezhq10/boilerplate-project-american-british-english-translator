const chai = require('chai');
const assert = chai.assert;

const Translator = require('../components/translator.js');
let translator = new Translator();

suite('Unit Tests', () => {
    suite('Translate to British English', () => {
        test('Mangoes are my favorite fruit.', () => {
            let input = 'Mangoes are my favorite fruit.';
            assert.equal(translator.toBritishEnglish(input), 'Mangoes are my favourite fruit.');
        });

        test('I ate yogurt for breakfast.', () => {
            let input = 'I ate yogurt for breakfast.';
            assert.equal(translator.toBritishEnglish(input), 'I ate yoghurt for breakfast.');
        });

        test("We had a party at my friend's condo.", () => {
            let input = "We had a party at my friend's condo.";
            assert.equal(translator.toBritishEnglish(input), "We had a party at my friend's flat.");
        });

        test("Can you toss this in the trashcan for me?", () => {
            let input = "Can you toss this in the trashcan for me?";
            assert.equal(translator.toBritishEnglish(input), "Can you toss this in the bin for me?");
        });

        test("The parking lot was full.", () => {
            let input = "The parking lot was full.";
            assert.equal(translator.toBritishEnglish(input), "The car park was full.");
        });

        test("Like a high tech Rube Goldberg machine.", () => {
            let input = "Like a high tech Rube Goldberg machine.";
            assert.equal(translator.toBritishEnglish(input), "Like a high tech Heath Robinson device.");
        });

        test("To play hooky means to skip class or work.", () => {
            let input = "To play hooky means to skip class or work.";
            assert.equal(translator.toBritishEnglish(input), "To bunk off means to skip class or work.");
        });

        test("No Mr. Bond, I expect you to die.", () => {
            let input = "No Mr. Bond, I expect you to die.";
            assert.equal(translator.toBritishEnglish(input), "No Mr Bond, I expect you to die.");
        });

        test("Dr. Grosh will see you now.", () => {
            let input = "Dr. Grosh will see you now.";
            assert.equal(translator.toBritishEnglish(input), "Dr Grosh will see you now.");
        });

        test("Lunch is at 12:15 today.", () => {
            let input = "Lunch is at 12:15 today.";
            assert.equal(translator.toBritishEnglish(input), "Lunch is at 12.15 today.");
        });
    });

    
    suite('Translate to American English', () => {
        test("We watched the footie match for a while.", () => {
            let input = "We watched the footie match for a while.";
            assert.equal(translator.toAmericanEnglish(input), "We watched the soccer match for a while.");
        });

        test("Paracetamol takes up to an hour to work.", () => {
            let input = "Paracetamol takes up to an hour to work.";
            assert.equal(translator.toAmericanEnglish(input), "Tylenol takes up to an hour to work.");
        });

        test("First, caramelise the onions.", () => {
            let input = "First, caramelise the onions.";
            assert.equal(translator.toAmericanEnglish(input), "First, caramelize the onions.");
        });

        test("I spent the bank holiday at the funfair.", () => {
            let input = "I spent the bank holiday at the funfair.";
            assert.equal(translator.toAmericanEnglish(input), "I spent the public holiday at the carnival.");
        });

        test("I had a bicky then went to the chippy.", () => {
            let input = "I had a bicky then went to the chippy.";
            assert.equal(translator.toAmericanEnglish(input), "I had a cookie then went to the fish-and-chip shop.");
        });

    });
        
    

});
