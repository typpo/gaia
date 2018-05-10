#!/bin/bash
# Downloads GAIA TGAS data.

pushd `dirname $0`

# The original source is now offline:
# http://casdc.china-vo.org/mirror/Gaia/dr1/tgas_source/csv/
wget -r -nH -nd -np -R *.txt -R index.html http://casdc.china-vo.org/mirror/Gaia/dr1/tgas_source/csv/

popd
