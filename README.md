# SCAM

Scala API in Play framework
AngularJS front-end
Mongo DB 

# About

The baseline for the project was generated from https://github.com/yohangz/scala-play-angular-seed
This repository established 3 major functionality keys
	1: Establish a proxy connection between the Front-end UI and the Back-end API
	2: Create a build script for the basic layout of a Scala/Play framework project
	3: Link the Angular CLI to the SBT run command so that both the front-end and back-end are run at the same time

This allowed development work to begin quickly, albeit at a cost. The binding of the the two applications means that multiple instances of the API cannot be run to assist in load balancing. Some future version will correct this and seperate out the different functions to their logical parts.

# Install Instructions
* TO-DO *

# Endpoints

## A set of generalized Endpoints is is provided to the user. For basic RESTful functions (Get, Put, and Post). *Delete is excluded because a logical delete is used with the STATUS field in database*

```
****** Offset and limit not implemented yet
GET /v1/g/*table*/*key*/*value*/?offset=#&limit=# controllers.GeneralController.get(table: String, key: String, value: String|number, offset: number, limit: number)

offset and limit default to 0 (limit of 0 is no limit)
```

```
****** Offset and limit not implemented yet
GET /v1/g/*table*/?offset=#&limit=# controllers.GeneralController.getMultiple(offset: number, limit: number)

offset and limit default to 0 (limit of 0 is no limit)
```

```
POST /v1/g/*table* controllers.GeneralController.post
```

```
****** In Progress
PUT /v1/g/*table* controllers.GeneralController.put
```

## Specific endpoint logic is available and can be created on requirement

```
****** In Progress
PUT /v1/s/admin/login controllers.AdminController.login
```

