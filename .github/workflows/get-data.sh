#!/bin/bash

echo "module.exports.data = " > functions/data.js

mkdir tmp

curl --request GET \
	--url https://api-football-v1.p.rapidapi.com/v2/leagueTable/2833 \
	--header "x-rapidapi-host: api-football-v1.p.rapidapi.com" \
	--header "x-rapidapi-key: $RAPIDAPI_KEY" \
    --output tmp/data.json

echo `cat tmp/data.json` >> functions/data.js

rm -rf tmp/
