import json
import csv
from collections import defaultdict

def ndd():
        return defaultdict(ndd)

dictionaryOfLocales = ndd()

with open("UI-strings.csv") as localisationFile:
    csvReader = csv.reader(localisationFile)
    next(csvReader)
    listOfLocales = next(csvReader)[1:]
    for row in csvReader:
        row[0] = row[0].split("__")
        for index, entry in enumerate(row[1:]):
            if entry:
                dictionaryOfLocales[listOfLocales[index]][row[0][0]][row[0][1]] = entry
        for controlName in dictionaryOfLocales['en']:
            for shortID in dictionaryOfLocales['en'][controlName]:
                dictionaryOfLocales['xx'][controlName][shortID]='^{}$'.format(dictionaryOfLocales['en'][controlName][shortID])

    for locale in dictionaryOfLocales:
        print("---------------------------------------------------------")
        print("Updating Locale {}".format(locale))
        print(json.dumps(dictionaryOfLocales[locale], indent=2, ensure_ascii=False, sort_keys=True))
        json.dump(dictionaryOfLocales[locale], open(
            "./public/locales/translation.{}.json".format(locale), "w+"), indent=2, ensure_ascii=False, sort_keys=True)
        print("---------------------------------------------------------")

