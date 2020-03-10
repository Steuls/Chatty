import { Body, Controller, Post } from "@nestjs/common";
import * as aposToLexForm from "apos-to-lex-form";
import { WordTokenizer, SentimentAnalyzer, PorterStemmer } from "natural";
import * as SpellCorrector from "spelling-corrector";
import * as SW from "stopword";

@Controller("sentiment")
export class SentimentController {
  @Post()
  createSentiment(@Body("text") text: string) {
    const tokenizer = new WordTokenizer();
    const corrector = new SpellCorrector();
    corrector.loadDictionary();

    const lexedText = aposToLexForm(text); // turns words like you're to you are
    const casedText = lexedText.toLowerCase(); // lowercase as case doesn't affect it
    const alphaOnlyText = casedText.replace(/[^a-zA-Z\s]+/g, ""); // remove special characters like ? ! etc
    const tokenizedText = tokenizer.tokenize(alphaOnlyText); // split the sentences into words to be sentimentized

    tokenizedText.forEach((word, index) => {
      tokenizedText[index] = corrector.correct(word); // spell check each word
    });

    const filteredText = SW.removeStopwords(tokenizedText); // remove stop words such as but and what

    const analyzer = new SentimentAnalyzer("English", PorterStemmer, "afinn");
    const value = analyzer.getSentiment(filteredText);
    return {
      Sentiment: value,
      originalText: text
    };
  }
}
