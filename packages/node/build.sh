./node_modules/.bin/tsc \
  -p tsconfig.build.json \
  --outDir dist/esm \
  --module ES6

cp -r src/{views,static} dist/esm

./node_modules/.bin/tsc \
  -p tsconfig.build.json \
  --outDir dist/cjs \
  --declaration false

cp -r src/{views,static} dist/cjs

chmod +x ./dist/cjs/runner.js
