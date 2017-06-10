// @flow

export default class SearchResult {
  data: Object;
  term: string;
  strategy: any;

  /**
   * @param {object} data - An element of array callbacked by search function.
   * @param {string} term
   * @param {Strategy} strategy
   */
  constructor(data: Object, term: string, strategy: any) {
    this.data = data;
    this.term = term;
    this.strategy = strategy;
  }

  /**
   * @param {string} beforeCursor
   * @param {string} afterCursor
   * @returns {string[]|undefined}
   */
  replace(beforeCursor: string, afterCursor: string) {
    let replacement = this.strategy.replace(this.data);
    if (replacement !== null) {
      if (Array.isArray(replacement)) {
        afterCursor = replacement[1] + afterCursor;
        replacement = replacement[0];
      }
      const match = this.strategy.matchText(beforeCursor);
      replacement = replacement
        .replace(/\$&/g, match[0])
        .replace(/\$(\d+)/g, (_, p1) => match[parseInt(p1, 10)]);
      return [
        [
          beforeCursor.slice(0, match.index),
          replacement,
          beforeCursor.slice(match.index + match[0].length),
        ].join(''),
        afterCursor,
      ];
    }
  }

  /**
   * @returns {string}
   */
  render(): string {
    return this.strategy.template(this.data, this.term);
  }
}
