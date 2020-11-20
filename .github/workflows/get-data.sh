#!/bin/bash

curl --request GET \
	--url https://api-football-v1.p.rapidapi.com/v2/leagueTable/2338 \
	--header "x-rapidapi-host: api-football-v1.p.rapidapi.com" \
	--header "x-rapidapi-key: $RAPIDAPI_KEY" \
    --output functions/data.json

git config --local user.email "manueljesusnunezruiz@gmail.com@gmail.com"
git config --local user.name "LaLiga-Bot"
git add functions/data.json
git commit -m "Generado fichero con datos"