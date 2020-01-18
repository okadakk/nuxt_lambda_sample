# nuxt_lambda_sample

> nuxt を lambda で 動かしてみた

## Initial Setup
```
$ touch .env

$ mkdir layers/nodejs/node_modules
$ cd layers/nodejs/node_modules
$ ln -s ../../../node_modules/** .
```

## Build Setup

```
$ yarn run build
$ sls deploy
```
