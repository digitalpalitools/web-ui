import * as Ods from '../../services/OdsProcessor'

/*
pāli:
(!)
POS
Grammar
Derived from
Neg
Verb
Trans
Case
Meaning in english
in native language
pali root
base
constraction
sanskrit
sk root
Comments
sourse 1
sentence from the pāli cannon 1
sutta name pali 1
source 2
sentence 2
chant name 2
Chapter
Test
*/

const shortName = 'dmbd'

class PaliWord implements Ods.PaliWordBase {
  readonly record: string[]

  constructor(record: string[]) {
    this.record = record
  }

  get pali() {
    return this.record[0]
  }

  get bang() {
    return this.record[1]
  }

  get pos() {
    return this.record[2]
  }

  get grammar() {
    return this.record[3]
  }

  get derivedFrom() {
    return this.record[4]
  }

  get neg() {
    return this.record[5]
  }

  get verb() {
    return this.record[6]
  }

  get trans() {
    return this.record[7]
  }

  get case() {
    return this.record[8]
  }

  get inEnglish() {
    return this.record[9]
  }

  get inRussian() {
    return this.record[10]
  }

  get paliRoot() {
    return this.record[11]
  }

  get base() {
    return this.record[12]
  }

  get construction() {
    return this.record[13]
  }

  get sanskrit() {
    return this.record[14]
  }

  get sanskritRoot() {
    return this.record[15]
  }

  get comments() {
    return this.record[16]
  }

  get source1() {
    return this.record[17]
  }

  get sentence1() {
    return this.record[18]
  }

  get sutta1() {
    return this.record[19]
  }

  get source2() {
    return this.record[20]
  }

  get sentence2() {
    return this.record[21]
  }

  get sutta2() {
    return this.record[22]
  }

  get chapter() {
    return this.record[23]
  }

  get test() {
    return this.record[24]
  }

  groupId() {
    return Ods.makeGroupId(this.pali)
  }

  toCsvRow(): string {
    return Ods.toCsvRow(this.record)
  }

  createTocSummary(): string {
    return `<li><a href="#${this.tocId()}">${this.pali}</a>: ${this.pos}. ${this.inEnglish}</li>`
  }

  createWordData(): string {
    /* eslint-disable */ // ESList is unable to handle the complicated templating + concatenation
    const html = `
  <hr />
  <div>
    <h4 id="${this.tocId()}">${this.pali}</h4>
    <table class="word-info-table-${shortName}">
      <tbody>` +
      (this.pos && `<tr><td>POS</td><td><span>${this.pos}</span></td></tr>`) +
      (this.derivedFrom && `<tr><td>Derived From</td><td><span>${this.derivedFrom}</span></td></tr>`) +
      (this.grammar && `<tr><td>Grammar</td><td><span>${this.grammar}` + (this.verb && `, ${this.verb}`) + (this.neg && `, ${this.neg}`) + (this.trans && `, ${this.trans}`) + (this.case && ` (${this.case})`) + `</span></td></tr>`) +
      (this.inEnglish && `<tr><td>English</td><td><span><strong>${this.inEnglish}</strong></span></td></tr>`) +
      (this.inRussian && `<tr><td>Russian</td><td><span><strong>${this.inRussian}</strong></span></td></tr>`) +
      (this.paliRoot && `<tr><td>Pāli Root</td><td><span>${this.paliRoot}</span></td></tr>`) +
      (this.base && `<tr><td>Base</td><td><span>${this.base}</span></td></tr>`) +
      (this.construction && `<tr><td>Construction</td><td><span>${this.construction}</span></td></tr>`) +
      (this.sanskrit && `<tr><td>Sanskrit</td><td><span>${this.sanskrit}</span></td></tr>`) +
      (this.sanskritRoot && `<tr><td>Sanskrit Root</td><td><span>${this.sanskritRoot}</span></td></tr>`) +
      (this.chapter && `<tr><td>Chapter</td><td><span>${this.chapter}</span></td></tr>`) +
      `</tbody>
    </table>
    <br />` +
    (this.sentence1 && `<span>${this.sentence1}</span><br />`) +
    (this.source1 && `<span class="sutta-source-${shortName}"><i>${this.source1} ${this.sutta1}</i></span><br /><br />`) +
    (this.sentence2 && `<span>${this.sentence2}</span><br />`) +
    (this.source2 && `<span class="sutta-source-${shortName}"><i>${this.source2} ${this.sutta2}</i></span><br /><br />`) +
    (this.chapter && `<span>Chapter:&nbsp;${this.chapter}</span><br /><br />`) +
  `</div>`
    /* eslint-enable */

    return html
  }

  tocId = () => `${this.pali.replace(/\s/g, '')}`

  includeInDictionary = () => !!this.inEnglish && !!this.inRussian

  includeInRootCsv = () => true

  sortKey = () => Ods.padTrailingNumbers(this.pali)
}

const createPaliWord: Ods.PaliWordFactory = (x) => new PaliWord(x)

export const dmbOds: Ods.OdsType = {
  name: 'Devamitta Pāli Dictionary',
  shortName,
  author: 'Devamitta Bhikkhu',
  description: 'A detailed Pāli language word lookup',
  accentColor: 'green',
  icon:
    // eslint-disable-next-line max-len
    'iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAARwSURBVHhe7ZpPbBdFFMffLC1iagrGEv+ksRU4EDnIgYQbNz0Y9eBBNCYYPJB4BG4k8vv9Eg89YJQLZ8KBaIknTTT+OZhoPOiFqKhVKBIlQGiU1KT0347f2Xm/pP3t7tud2d1mCPtpdua9bXe68+a9eTO7Sy0tLS0tLS33LYp69D5peoD1sqzgmju4ehb192jjR5zT9lcCHerimkdZK4+m7/A/zrGWpkMvo91nWXNC4ZbmUT9kVW+u4iZPoz6DG12ypzLo0i8od1vFAU1foN3nWEvTofPoyWusORFxXZVJ3MB7OL6ld+hxPlcfinawlI2inSw5U5cB+uxDcHyJERllvS4m6AgNs5xGh2MAw9M4TlmxNobgVxMsr6dD2+ABj7DmTBMGMC55GDcmu6072e1t8h99QzMGMCOm6A2W6yEvzlfDNIDhea7rIS/OK0yAhrIGmMENfIj6E9R/21MFaHoGYbCZterkdXRDDKDpU+ThV5HHX4Q2ieOz5LyESmbtcavUQnZHY9rFkhfuIdBDoiNhVbaWiLazVAdmElRWXMMGhcB6FF1jSSamEZbqYASLrMdYthylB1E+YRU//AwQ0yJLMhGSVJ0sD4z2KD2F0q8PTKWLC4kzXFZmmetsBt09KnR/uT3QrAHc25/hOpvBVBgXGuAy17k0a4DI0QM0XUG5YJUMBj2geAI0u0+RsEJAYV2n6VfW0gx6gLwJuo7jjhXzCcsDLD9xncbNAwpH39CsAVY82lf0M0tZjNEUbU2k6STDmEVZHgEYwMcDtGgAM0PYUb9IT6KUltr5obSGeysEDP3UNyS6vzFkAB7gvg4wzw3/RPmfVTLop77iDBCAB/i0rzB2RJeskkG/41IGME+se0kWKCTEEJDngX7HJQ9Q5dzfEF4IWMqkwnwDlHR/Q5geEImZYJw6tAW1FAKBeMCqZ/uxaIAIP/tR57/MiUIxgPL0gB79lUxkeWjhLZEhvtcNYJBXhPkG0LRIe2iWtUKaNYCuYAB5RbiX6zQKW+pXEHwladYA1dqXVoRDXKeRdpMZhBsCcibIx2ENYAg3BORMkI9DCjSE6wE9uoHOzLHmQkAhYJ4IVEHOBFnENEq/sVyKZg2wSndZ8kXeGg+isZM8LjxTzKBZAwzRvyz5UfRwZBDHCdDga4AxrmWWEcdVcM8ETvFvcDfAu8nrqGNWEYnp4eQxtz+umcAxAxjKGuAl6tLH2IV9TvOIs3KfpM24xmOKHt1Gp26yVozDJqhPOQOo5B3cC9zxcm98NX3NUjVcMsHwRoRAWSL6iKVqlJ8Ib9EJ93VDUwb4A/H7FcvVKO8BzqNvaMYAmt5G/MasVUOVXAt4TICG+g2g6QI6/wFr1VkQnhCvJwgPmMZxyIo1MUX/oCz+MMsjAxjqMsAljPzrSJUHMfpVl79ZFM8DS34eoJDbz6J0/Vx+CR2ew3W/w4Tf0Mnkc/liulhGyd/0/MB/s54OvYn/lb/20MkToEOpeadLb6E8YJWWlpaWlpaWlrUQ/Q9HV+w91xA1IwAAAABJRU5ErkJggg==',
  paliWordFactory: createPaliWord,
}
