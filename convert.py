import csv
import gzip
import json
import math

def main():
    results = []
    paths = [
        'data/TgasSource_000-000-000.csv.gz',
        'data/TgasSource_000-000-001.csv.gz',
    ]
    for path in paths:
        print 'Processing', path, '...'
        with gzip.open(path, 'rb') as csv_in:
            reader = csv.DictReader(csv_in)
            for row in reader:
                ra = float(row['ra'])
                dec = float(row['dec'])
                parallax = float(row['parallax'])
                # Conver to cartesian coords.
                # http://www.stargazing.net/kepler/rectang.html
                X = math.cos(ra) * math.cos(dec) * parallax
                Y = math.sin(ra) * math.cos(dec) * parallax
                Z = math.sin(dec) * parallax
                name = row['tycho2_id'].strip()
                if not name:
                    name = '?'
                result = [name, X, Y, Z, parallax]
                results.append(result)

    print 'Writing...'

    with open('data/processed.js', 'w') as js_out:
        js_out.write('window.DATA=')
        js_out.write(json.dumps(results))

    with open('data/xyz.csv', 'w') as csv_out:
        for result in results:
            csv_out.write('%f,%f,%f\n' % (result[1], result[2], result[3]))

    print 'Done.'

if __name__ == '__main__':
    main()
