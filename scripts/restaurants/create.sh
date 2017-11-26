#!/bin/bash

API="http://localhost:4741"
URL_PATH="/restaurants"

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Token token=${TOKEN}" \
  --data '{
      "name": "'"${NAME}"'",
      "address": "'"${ADDRESS}"'",
      "rating": "'"${RATING}"'",
      "pic_url": "'"${URL}"'",
      "featured": "'"${FEATURED}"'",
      "description": "'"${DESCRIPTION}"'"
  }'

echo
