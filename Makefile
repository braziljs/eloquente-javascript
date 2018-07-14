CHAPTERS := $(basename $(shell ls [0-9][0-9]_*.md) .md)

SVGS := $(wildcard img/*.svg)

all: html book.pdf book_mobile.pdf book.epub book.mobi

html: $(foreach CHAP,$(CHAPTERS),html/$(CHAP).html) html/js/acorn_codemirror.js \
      code/skillsharing.zip code/solutions/20_3_a_public_space_on_the_web.zip html/js/chapter_info.js

html/%.html: %.md
	node src/render_html.js $< > $@
	node src/build_code.js $<

html/js/chapter_info.js: $(foreach CHAP,$(CHAPTERS),$(CHAP).md) code/solutions/* src/chapter_info.js
	node src/chapter_info.js > html/js/chapter_info.js

html/js/acorn_codemirror.js: node_modules/codemirror/lib/codemirror.js \
	                     node_modules/codemirror/mode/javascript/javascript.js \
	                     node_modules/codemirror/mode/css/css.js \
	                     node_modules/codemirror/mode/xml/xml.js \
	                     node_modules/codemirror/mode/htmlmixed/htmlmixed.js \
	                     node_modules/codemirror/addon/edit/matchbrackets.js \
	                     node_modules/acorn/dist/acorn.js \
	                     node_modules/acorn/dist/walk.js
	node_modules/.bin/uglifyjs $^ -m -o $@

code/skillsharing.zip: html/21_skillsharing.html
	rm -f $@
	cd code; zip skillsharing.zip skillsharing/*.js* skillsharing/public/*.*

code/solutions/20_3_a_public_space_on_the_web.zip: $(wildcard code/solutions/20_3_a_public_space_on_the_web/*)
	rm -f $@
	cd code/solutions; zip 20_3_a_public_space_on_the_web.zip 20_3_a_public_space_on_the_web/*

test: html
	@for F in $(CHAPTERS); do echo Testing $$F:; node src/run_tests.js $$F.md; done
	@node src/check_links.js
	@echo Done.

tex: $(foreach CHAP,$(CHAPTERS),pdf/$(CHAP).tex) pdf/hints.tex $(patsubst img/%.svg,img/generated/%.pdf,$(SVGS))

book.pdf: tex pdf/book.tex
	cd pdf && sh build.sh book > /dev/null
	mv pdf/book.pdf .	

pdf/book_mobile.tex: pdf/book.tex
	cat pdf/book.tex | sed -e 's/natbib}/natbib}\n\\usepackage[a5paper, left=5mm, right=5mm]{geometry}/' | sed -e 's/setmonofont.Scale=0.8./setmonofont[Scale=0.75]/' > pdf/book_mobile.tex

book_mobile.pdf: pdf/book_mobile.tex tex
	cd pdf && sh build.sh book_mobile > /dev/null
	mv pdf/book_mobile.pdf .	

pdf/hints.tex: $(foreach CHAP,$(CHAPTERS),$(CHAP).md) src/extract_hints.js
	node src/extract_hints.js | node src/render_latex.js - > $@

img/generated/%.pdf: img/%.svg
	inkscape --export-pdf=$@ $<

pdf/%.tex: %.md
	node src/render_latex.js $< > $@

book.epub: epub/titlepage.xhtml epub/toc.xhtml epub/hints.xhtml $(foreach CHAP,$(CHAPTERS),epub/$(CHAP).xhtml) \
           epub/content.opf.src epub/style.css src/add_images_to_epub.js
	rm -f $@
	grep '<img' epub/*.xhtml | sed -e 's/.*src="\([^"]*\)".*/\1/' | xargs -I{} rsync -R "{}" epub
	node src/add_images_to_epub.js
	cd epub; zip -X ../$@ mimetype
	cd epub; zip -X ../$@ -r * -x mimetype -x *.src

epub/toc.xhtml: epub/toc.xhtml.src $(foreach CHAP,$(CHAPTERS),epub/$(CHAP).xhtml) epub/hints.xhtml
	node src/generate_epub_toc.js $^ > $@

epub/%.xhtml: %.md src/render_html.js
	node src/render_html.js --epub $< > $@

epub/hints.xhtml: $(foreach CHAP,$(CHAPTERS),$(CHAP).md) src/extract_hints.js src/render_html.js
	node src/extract_hints.js | node src/render_html.js --epub - > $@

epubcheck: book.epub
	epubcheck book.epub 2>&1 | grep -v 'img/.*\.svg'

book.mobi: book.epub img/cover.jpg
	ebook-convert book.epub book.mobi --output-profile=kindle --cover=img/cover.jpg --remove-first-image
