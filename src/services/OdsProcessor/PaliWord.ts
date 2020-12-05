/*
  Fields
  - "Pāli1"
  - "Pāli2"
  - "Fin"
  - "POS"
  - "Grammar"
  - "Derived from"
  - "Neg"
  - "Verb"
  - "Trans"
  - "Case"
  - "Meaning IN CONTEXT"
  - "Sanskrit"
  - "Sk Root"
  - "Family"
  - "Pāli Root"
  - "V"
  - "Grp"
  - "Sgn"
  - "Root Meaning"
  - "Base"
  - "Construction"
  - "Derivative"
  - "Suffix"
  - "Compound"
  - "Compound Construction"
  - "Source1"
  - "Sutta1"
  - "Example1"
  - "Source 2"
  - "Sutta2"
  - "Example 2"
  - "Antonyms"
  - "Synonyms – different word"
  - "Variant – same constr or diff reading"
  - "Commentary"
  - "Notes"
  - "Stem"
  - "Pattern"
  - "Buddhadatta"
  - "2"
*/

export class PaliWord {
  readonly record: string[]

  constructor(record: string[]) {
    this.record = record
  }

  get pali1() {
    return this.record[0]
  }

  get pali2() {
    return this.record[1]
  }

  get fin() {
    return this.record[2]
  }

  get pos() {
    return this.record[3]
  }

  get grammar() {
    return this.record[4]
  }

  get derivedFrom() {
    return this.record[5]
  }

  get neg() {
    return this.record[6]
  }

  get verb() {
    return this.record[7]
  }

  get trans() {
    return this.record[8]
  }

  get case() {
    return this.record[9]
  }

  get inEnglish() {
    return this.record[10]
  }

  get sanskrit() {
    return this.record[11]
  }

  get sanskritRoot() {
    return this.record[12]
  }

  get family() {
    return this.record[13]
  }

  get paliRoot() {
    return this.record[14]
  }

  get v() {
    return this.record[15]
  }

  get grp() {
    return this.record[16]
  }

  get sgn() {
    return this.record[17]
  }

  get rootMeaning() {
    return this.record[18]
  }

  get base() {
    return this.record[19]
  }

  get construction() {
    return this.record[20]
  }

  get derivative() {
    return this.record[21]
  }

  get suffix() {
    return this.record[22]
  }

  get compound() {
    return this.record[23]
  }

  get compoundConstruction() {
    return this.record[24]
  }

  get source1() {
    return this.record[25]
  }

  get sutta1() {
    return this.record[26]
  }

  get example1() {
    return this.record[27]
  }

  get source2() {
    return this.record[28]
  }

  get sutta2() {
    return this.record[29]
  }

  get example2() {
    return this.record[30]
  }

  get antonyms() {
    return this.record[31]
  }

  get synonyms() {
    return this.record[32]
  }

  get variant() {
    return this.record[33]
  }

  get commentary() {
    return this.record[34]
  }

  get notes() {
    return this.record[35]
  }

  get stem() {
    return this.record[36]
  }

  get pattern() {
    return this.record[37]
  }

  get buddhadatta() {
    return this.record[38]
  }

  get two() {
    return this.record[39]
  }

  get groupId() {
    const parts = this.pali1.split(' ')

    if (!Number.isNaN(parseInt(parts[parts.length - 1], 10))) {
      return parts.slice(0, parts.length - 1).join(' ')
    }

    return this.pali1
  }

  toCsvRow(): string {
    return this.record.map((x) => `"${x}"`).join('\t')
  }

  createTocSummary(): string {
    return `<li><a href="#${this.tocId()}">${this.pali1}</a>: ${this.pos}, ${this.inEnglish}</li>`
  }

  createWordData(): string {
    /* eslint-disable */ // ESList is unable to handle the complicated templating + concatenation
    const html = `
  <hr />
  <div>
    <h4 id="${this.tocId()}">${this.pali1}</h4>
    <table class="word-info-table">
      <tbody>` +
      `<tr><td>Pāli</td><td><span>${this.pali2}</span></td></tr>` +
      (this.grammar && `<tr><td>Grammar</td><td><span>${this.grammar}` + (this.verb && `, ${this.verb}`) + (this.neg && `, ${this.neg}`) + (this.trans && `, ${this.trans}`) + (this.case && ` (${this.case})`) + `</span></td></tr>`) +
      (this.inEnglish && `<tr><td>English</td><td><span><strong>${this.inEnglish}</strong></span></td></tr>`) +
      (this.family && `<tr><td>Family</td><td><span>${this.family}</span></td></tr>`) +
      (this.paliRoot && `<tr><td>Root</td><td><span>${this.paliRoot}<sup>${this.v}</sup>${this.grp} ${this.sgn} (${this.rootMeaning})</span></td></tr>`) +
      (this.base && `<tr><td>Base</td><td><span>${this.base}</span></td></tr>`) +
      (this.construction && `<tr><td>Construction</td><td><span>${this.construction}</span></td></tr>`) +
      (this.derivative && `<tr><td>Derivative</td><td><span>${this.derivative} (${this.suffix})</span></td></tr>`) +
      (this.compound && `<tr><td>Compound</td><td><span>${this.compound} (${this.compoundConstruction})</span></td></tr>`) +
      (this.antonyms && `<tr><td>Antonym</td><td><span>${this.antonyms}</span></td></tr>`) +
      (this.synonyms && `<tr><td>Synonym</td><td><span>${this.synonyms}</span></td></tr>`) +
      (this.variant && `<tr><td>Variant</td><td><span>${this.variant}</span></td></tr>`) +
      (this.sanskrit && `<tr><td>Sanskrit</td><td><span>${this.sanskrit}</span></td></tr>`) +
      (this.sanskritRoot && `<tr><td>Sanskrit Root</td><td><span>${this.sanskritRoot}</span></td></tr>`) +
      (this.commentary && `<tr><td>Commentary</td><td><span>${this.commentary}</span></td></tr>`) +
      (this.notes && `<tr><td>Notes</td><td><span>${this.notes}</span></td></tr>`) +
      `</tbody>
    </table>
    <br />` +
    (this.example1 && `<span>${this.example1}</span><br />`) +
    (this.source1 && `<span class="sutta-source"><i>${this.source1} ${this.sutta1}</i></span><br /><br />`) +
    (this.example2 && `<span>${this.example2}</span><br />`) +
    (this.source2 && `<span class="sutta-source"><i>${this.source2} ${this.sutta2}</i></span><br /><br />`) +
  `</div>`
    /* eslint-enable */

    return html
  }

  private tocId = () => `${this.pali1.replace(/\s/g, '')}`
}
