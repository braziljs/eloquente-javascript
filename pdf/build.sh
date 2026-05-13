xelatex $1.tex
xelatex $1.tex
makeindex -o $1.ind $1.idx
makeindex -o $1.ind $1.idx
xelatex $1.tex
while ( grep -q '^LaTeX Warning: Label(s) may have changed' $1.log) \
do xelatex $1.tex; done
