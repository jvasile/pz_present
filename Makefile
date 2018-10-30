all: index.html presentation.svg leaflet.js leaflet.css svg-pan-zoom.js

index.html:
	ln -s presentation.html index.html

# Needed for the serverless version
leaflet.css:
	wget "http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.css"

leaflet.js:
	wget "http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.js"

# Needed for the ariutta version that requires a server
svg-pan-zoom.js:
	wget "https://raw.githubusercontent.com/ariutta/svg-pan-zoom/master/dist/svg-pan-zoom.js"

%.svg: %.dia
	@dia -e $@ $<

clean:
	@rm -f presentation.svg leaflet.js leaflet.css panzoom.js

deps:
	npm install connect server

debian:
	dpkg -l | grep -q "^ii  dia " || apt install -y dia

serve:
	node server.js &
