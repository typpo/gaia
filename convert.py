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
            Z = math.sin(dec)
            XYZ = [math.cos(ra) * math.cos(dec), math.sin(ra) * math.cos(dec), Z]
            results.append(XYZ)

    with open('data/processed.json', 'w') as json_out:
        json.dump(results, json_out)

    with open('data/xyz.csv', 'w') as csv_out:
        for result in results:
            csv_out.write('%f,%f,%f\n' % (result[0], result[1], result[2]))

if __name__ == '__main__':
    main()
