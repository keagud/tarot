PORT=8080

.PHONY: build
.PHONY: dev
.PHONY: format

dev:
	(cd ./tarot-backend && npx tsc &&  PORT="$(PORT)" DEBUG=express:* pnpm run serve & echo $$! > ../backend.pid) &\
		(cd ./tarot-frontend &&  VITE_PORT="$(PORT)"  pnpm run dev || (kill `cat ../backend.pid` && rm ../backend.pid -f))

backend:
	cd ./tarot-backend && npx tsc && PORT="$(PORT)" pnpm run serve

build:
	cd ./tarot-backend/ && npx tsc
	cd ./tarot-frontend/ && npx vite build


format:
	cd ./tarot-backend/ && npx prettier  src**/*.{ts,json} --write
	cd ./tarot-frontend/ && npx prettier src/**/*.{ts,json,tsx} --write


