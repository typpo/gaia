import csv
import gzip
import json
import math

def main():
    results = []
    with gzip.open('data/TgasSource_000-000-000.csv.gz', 'rb') as csv_in:
        reader = csv.DictReader(csv_in)
        for row in reader:
            ra = float(row['ra'])
            dec = float(row['dec'])
            # Conver to cartesian coords.
            # http://www.stargazing.net/kepler/rectang.html
            X = math.cos(ra) * math.cos(dec)
            Y = math.sin(ra) * math.cos(dec)
            Z = math.sin(dec)
            name = row['tycho2_id'].strip()
            if not name:
                name = '?'
            result = [name, X, Y, Z]
            results.append(result)

    with open('data/processed.js', 'w') as js_out:
        js_out.write('window.DATA=')
        js_out.write(json.dumps(results))

    with open('data/xyz.csv', 'w') as csv_out:
        for result in results:
            csv_out.write('%f,%f,%f\n' % (result[1], result[2], result[3]))

if __name__ == '__main__':
    main()
