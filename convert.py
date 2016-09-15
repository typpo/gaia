import csv
import gzip
import json
import math

from rtree import index

# Anything <= this threshold will be combined into one.
DISTANCE_THRESHOLD = 1.5

props = index.Property()
props.dimension = 3
props.dat_extension = 'data'
props.idx_extension = 'index'
tree = index.Index('3d_index', properties=props)

def distance(c1, c2):
    return math.pow(c1[0] - c2[0], 2) + math.pow(c1[1] - c2[1], 2) + math.pow(c1[2] - c2[2], 2)

def main():
    #results = []
    coords = []
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
    for path in paths:
        print 'Processing', path, '...'
        count = 0
        with gzip.open(path, 'rb') as csv_in:
            reader = csv.DictReader(csv_in)
            for row in reader:
                ra = float(row['ra'])
                dec = float(row['dec'])
                parallax = float(row['parallax'])
                # Conver to cartesian coords.
                # http://www.stargazing.net/kepler/rectang.html
                X = math.cos(ra) * math.cos(dec)
                Y = math.sin(ra) * math.cos(dec)
                Z = math.sin(dec)
                name = row['tycho2_id'].strip()
                if not name:
                    name = '?'
                #result = [name, X, Y, Z, parallax]
                #results.append(result)
                coord = (X*parallax, Y*parallax, Z*parallax)
                coord_obj = {
                    'id': count,
                    'coord': coord,
                }
                coords.append(coord_obj)
                tree.insert(count, coord, obj=coord_obj)

                count += 1


    with open('data/processed.js', 'w') as js_out:
        js_out.write('window.DATA=')
        final_coords = []
        merged_ids = set()
        print 'Reducing from', len(coords), '...'
        for coord_obj in coords:
            if coord_obj['id'] in merged_ids:
                # Already merged this one.
                continue

            # TODO(ian): Convert to bounding box intersection.
            nearest = tree.nearest(coord_obj['coord'], 5, 'raw')
            for near in nearest:
                if distance(near['coord'], coord_obj['coord']) < DISTANCE_THRESHOLD:
                    merged_ids.add(near['id'])

            final_coords.append(coord_obj['coord'])

        print 'Writing', len(final_coords), '...'
        js_out.write(json.dumps(final_coords))

    tree.close()

    '''
    with open('data/xyz.csv', 'w') as csv_out:
        for result in results:
            csv_out.write('%f,%f,%f\n' % (result[1], result[2], result[3]))
    '''

    print 'Done.'

if __name__ == '__main__':
    main()
