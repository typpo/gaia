#!/bin/bash
# Downloads GAIA TGAS data.

wget -r -nH -nd -np -R *.txt -R index.html http://cdn.gea.esac.esa.int/Gaia/tgas_source/csv/
