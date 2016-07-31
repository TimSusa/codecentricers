# Quickstart

# Please be aware of using an official github webtoken to let this application work:
- Go to the github settings and generate a personal token
- Put that token into the right place at the file: ```app/variant/generic/scripts/conf-develop.js```
- When serving the project, you should have connection to the github api

## Installation
```
  npm install
  bower install (optional)
```

## Serve Project:

```
  grunt serve --variant=generic --flavor=develop
```

## Test
```
  grunt test --variant=generic --flavor=develop
```

## CI Build:

```
  grunt cibuild --variant=generic --flavor=develop

  or

  make use of the build-frontend.sh script
```
