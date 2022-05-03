# smart-home

## TODO
- Use something like python to build all artifacts.
- Set up docker.
- Unit tests.
- Create HMI server.
- when getting status of PIR it should return when it was last triggered
- log 404 errors and other warnings. make health serer check warnings
- turn on PIR status light by security server

## Info
Runs security in a microservice so once it has been tested it can run it a seperate docker container to other stuff. That way changes to other docker containers can be done with high confidence that it won't break the security sub-system.

