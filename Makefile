PORT=8080

.PHONY: build
.PHONY: dev
.PHONY: format

dev:
	(cd ./server && npx tsc &&  PORT="$(PORT)" DEBUG=express:* pnpm run serve & echo $$! > ../backend.pid) &\
		(cd ./web &&  VITE_PORT="$(PORT)"  pnpm run dev || (kill `cat ../backend.pid` && rm ../backend.pid -f))

backend:
	cd ./server && npx tsc && PORT="$(PORT)" pnpm run serve

build:
	cd ./server/ && npx tsc
	cd ./web/ && npx vite build


format:
	cd ./server/ && npx prettier  src**/*.{ts,json} --write
	cd ./web/ && npx prettier src/**/*.{ts,json,tsx} --write


