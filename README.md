# Postgres & Kafka example

A simple setup for listening to postgres table inserts using debezium and kafka.
Run it with:

```bash
docker-compose up --build --attach web-server
```

Wait until the web server is ready and go to `localhost:8080` in your browser to watch the changes live.
