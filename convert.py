import csv
import gzip
import json
import math
import random

from collections import defaultdict

# Decrease for more stars/larger output file/higher visualization GPU
# requirements.
ROUNDING_AMOUNT = 0.05

def randomize(coord, offset=ROUNDING_AMOUNT*2):
    return (coord[0] + random.uniform(-offset, offset),
            coord[1] + random.uniform(-offset, offset),
            coord[2] + random.uniform(-offset, offset))

def doround(x, increment=ROUNDING_AMOUNT):
    # Round to nearest floating point, ensuring only significant digits.
    # http://stackoverflow.com/questions/28425705/python-rounding-a-floating-point-number-to-nearest-0-05
    return round(round(x / increment) * increment,
                 -int(math.floor(math.log10(increment))))

def main():
    paths = [
        'data/TgasSource_000-000-000.csv.gz',
        'data/TgasSource_000-000-001.csv.gz',
        'data/TgasSource_000-000-002.csv.gz',
        'data/TgasSource_000-000-003.csv.gz',
        'data/TgasSource_000-000-004.csv.gz',
        'data/TgasSource_000-000-005.csv.gz',
        'data/TgasSource_000-000-006.csv.gz',
        'data/TgasSource_000-000-007.csv.gz',
        'data/TgasSource_000-000-008.csv.gz',
        'data/TgasSource_000-000-009.csv.gz',
        'data/TgasSource_000-000-010.csv.gz',
        'data/TgasSource_000-000-011.csv.gz',
        'data/TgasSource_000-000-012.csv.gz',
        'data/TgasSource_000-000-013.csv.gz',
        'data/TgasSource_000-000-014.csv.gz',
        'data/TgasSource_000-000-015.csv.gz',
    ]
    results = defaultdict(int)
    count = 0
    for path in paths:
        print 'Processing', path, '...'
        with gzip.open(path, 'rb') as csv_in:
            reader = csv.DictReader(csv_in)
            for row in reader:
                count += 1
                ra = float(row['ra'])
                dec = float(row['dec'])
                parallax = float(row['parallax'])
                # Convert to cartesian coords.
                # http://www.stargazing.net/kepler/rectang.html
                X = math.cos(ra) * math.cos(dec) * parallax
                Y = math.sin(ra) * math.cos(dec) * parallax
                Z = math.sin(dec) * parallax

                # Group nearby points together, and keep track of the number of
                # points in the group.
                coord = (doround(X), doround(Y), doround(Z))
                results[coord] += 1

    print 'Saved', len(results), 'of', count

    print 'Writing...'

    flattened = []
    for coord, count in results.iteritems():
        # Slightly randomize the coordinates within the range of the previous
        # rounding. Otherwise the point "cloud" will appear grid like.
        # grid-like. Visually, this shouldn't make much of a difference.
        flattened.append(list(randomize(coord)) + [count])

    with open('data/processed.js', 'w') as js_out:
        js_out.write('window.DATA=')
        js_out.write(json.dumps(flattened))

    print 'Done.'

if __name__ == '__main__':
    main()
