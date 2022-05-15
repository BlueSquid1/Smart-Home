# smart-home

## TODO
- Use something like python to build all artifacts.
- Set up docker.
- Unit tests.
- Create HMI server.
- log 404 errors and other warnings. make health serer check warnings.
- Make test mode which doesn't raise the siren sound but does everything else. Display on HMI when in test mode.

## Info
Runs security in a microservice so once it has been tested it can run it a seperate docker container to other stuff. That way changes to other docker containers can be done with high confidence that it won't break the security sub-system.

