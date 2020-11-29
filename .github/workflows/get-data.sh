#!/bin/bash

curl --request GET \
	--url https://api-football-v1.p.rapidapi.com/v2/leagueTable/2833 \
	--header "x-rapidapi-host: api-football-v1.p.rapidapi.com" \
	--header "x-rapidapi-key: $RAPIDAPI_KEY" \
    --output functions/data.json

cp -a functions/data.json telegram/functions/data.json