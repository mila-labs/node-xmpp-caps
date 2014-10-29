#
# Makefile for node-xmpp-caps
#

test: lint
	@./node_modules/.bin/mocha

lint:
	@./node_modules/.bin/jshint ./index.js ./test.js

test-coverage: lint
	@./node_modules/.bin/istanbul cover \
	./node_modules/.bin/_mocha --report lcovonly && \
	cat ./coverage/lcov.info | ./node_modules/.bin/coveralls
