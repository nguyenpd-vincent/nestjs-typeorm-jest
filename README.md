# Exercise
```bash
#Create Score
The client would send a payload containing:
    ● player: allow only string: a-zA-Z
    ● score: number > 0
    ● time: string type and represents date and time.

#Get Score
    ● Using a simple id you can retrieve a score.
# Delete Score
    ● Using a simple id you can delete a score.

#Get list of scores
    ● Get all scores by playerX
    ● Get all score after 1st November 2020
    ● Get all scores by player1, player2 and player3 before 1st december 2020 Get all scores after 1 Jan 2020 and before 1 Jan 2021
    ● Get players' history: include
        - top score (time and score) 
        - low score (time and score)
        - average score value for player
        - list of all the scores (time and score) of this player.
```

#  Build and Run
## Setup database:

```bash
# 1: copy docker-compose file from docker-compose.example.yml to docker-compose.yml in root project:
$ cp docker-compose.example.yml docker-compose.yml

# 2: set up your database in your docker-compose.yml file:

# 3: create container database postgres
$ docker-compose up -d
```
## Setup env:

```bash
# 1: copy env from env.example to .env in root project:
$ cp .env.example .env

# 2: then change your environment which maping with database of docker-compose file
```
## Build:
```bash
# build app
$ yarn build
```

## Run:
```bash
# start app with build file
$ yarn start:prod
```


## (Option): Run app with developer

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

# Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

# Tool test:
### 1: POSTMAN: 
- In this source have `tabist.postman_collection.json` file. import it into postman and run requests.

### 2: CURL:
```bash
# create score:
curl --location 'http://localhost:3009/scores' \
--header 'Content-Type: application/json' \
--data '{
    "player":"Nguyen pd",
    "score": 109,
    "time":"2023-08-19T00:05:21.015Z"
}'
```
```bash
# delete one score:
curl --location --request DELETE 'http://localhost:3009/scores/14' \
--data ''
```
```bash
# get history a scores:
curl --location 'http://localhost:3009/scores/history?player=nguyenpd' \
--data ''
```
```bash
# findAll scores:
curl --location 'http://localhost:3009/scores?players=nguyenpd&startDate=2023-01-12%2000%3A00%3A00&endDate=2023-07-13%2023%3A00%3A00' \
--data ''
```

