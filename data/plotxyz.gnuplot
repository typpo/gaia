# Simple proof of concept gnuplot for 3d galaxy viz
# http://www.gnuplot.info/demo/scatter.html
# http://sparky.rice.edu/gnuplot.html
#
set terminal png
set output 'scatter.png'
set style data points
set pointsize 0.000001
set xrange [-1:1]
set yrange [-1:1]
set zrange [-1:1]
set datafile separator ","
splot "xyz.csv" pt 6 with points
