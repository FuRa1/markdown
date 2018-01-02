import {
  BlockLexer,
  MarkedOptions,
  LexerReturns,
  Marked,
  RulesBlockGfm,
  RulesBlockBase,
  RulesBlockTables
} from '../';

export interface RulesMyBlockBase extends RulesBlockBase
{
  someAdditionalProperty: string;
}

export class MyBlockLexer<T extends typeof BlockLexer> extends BlockLexer<T>
{
  protected rules: RulesMyBlockBase | RulesBlockGfm | RulesBlockTables;

  static lex(src: string, options?: MarkedOptions, top?: boolean, isBlockQuote?: boolean): LexerReturns
  {
    const lexer = new this(this, options);
    return lexer.getTokens(src, top, isBlockQuote);
  }

  protected static getRulesGfm(): RulesBlockGfm
  {
    console.log(`*** Call getBlockGfm() from extended MyBlockLexer class`);
    return super.getRulesGfm();
  }

  protected isMyBlockGrammar(block: RulesMyBlockBase | RulesBlockGfm | RulesBlockTables): block is RulesMyBlockBase
  {
    return (<RulesMyBlockBase>block).someAdditionalProperty !== undefined;
  }
}

export class MyMarked extends Marked
{
  protected static callBlockLexer(src: string, options?: MarkedOptions): LexerReturns
  {
    // Preprocessing.
    src = src
    .replace(/\r\n|\r/g, '\n')
    .replace(/\t/g, '    ')
    .replace(/\u00a0/g, ' ')
    .replace(/\u2424/g, '\n')
    .replace(/^ +$/gm, '');

    return MyBlockLexer.lex(src, options, true);
  }
}

const html = MyMarked.parse('I am using __markdown__.');
console.log(html);