# How to deploy

## Requirements

Node 18.x
Postgresql-13

So far works for both Linux/Windows OS

## Create .env file

```
# Ports for REST API
HOST=0.0.0.0
PORT=3001

# Postgresql Database Creds
DB_HOST=
DB_PORT=
DB_NAME=
DB_USER=
DB_PASS=

NODE_ENV=dev
```

## Install node modules

```
npm install
```

## And run!!

```
node index.js
```

### How protocol works?

Byte[0]
0 - In some parameters/messages - if 1 than length cannot be changed
1-7 - Reserved

Byte[1]-[2]