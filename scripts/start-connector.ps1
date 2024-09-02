Set-Location ../pinger-db-producer && curl -i -X POST -H "Accept:application/json" -H "Content-Type:application/json" localhost:8083/connectors/ --data @pg-source-config.json
Set-Location ../scripts