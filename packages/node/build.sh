./node_modules/.bin/tsc \
  -p tsconfig.build.json \
  --outDir dist/esm \
  --module ES6

cp -r src/static dist/esm/static

./node_modules/.bin/tsc \
  -p tsconfig.build.json \
  --outDir dist/cjs \
  --declaration false

cp -r src/static dist/cjs/static

chmod +x ./dist/cjs/runner.js
