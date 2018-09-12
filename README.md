# Workshoptage 2018 - Blockchain Workshop

Let's build a Blockchain application based on [Hyperledger Fabric](https://www.hyperledger.org/projects/fabric)
and [Hyperledger Composer](https://www.hyperledger.org/projects/composer).

## About us
The workshop is held by  [Waleed El Sayed](https://www.linkedin.com/in/waleed-el-sayed-039b62113/) and [Markus Stauffiger](https://www.linkedin.com/in/stauffiger/),
both member of the [Blockchain consultancy and engineering team at **4eyes**](https://www.4eyes.ch/) 

## Supported platforms

These instructions are only for MacOSX and Linux (Debian or Ubuntu).

## Prerequisites
- cURL -> MacOSX: http://macappstore.org/curl & Ubuntu: $ sudo apt install curl 
- git -> https://git-scm.com/book/en/v2/Getting-Started-Installing-Git
- Docker & Docker Compose -> https://docs.docker.com/compose/install/
- nodejs (8lts version) & npm -> https://nodejs.org/en/download/package-manager/

## Quick start

### Clone the Repository
- $ git clone https://github.com/4eyes/workshoptage2018.git
- $ cd workshoptage2018

### Fabric
- $ cd fabric

if you want to change the domain name of your organisation, you can change the DOMAIN variable value in .env file.
if you want to change the logging level of the peers you can change the FABRIC_LOGGING_LEVEL variable value from INFO to DEBUG in .env file.

#### download fabric binaries & docker images
- $ ./scripts/download.sh -m binaries
- $ ./scripts/download.sh -m images

#### Build the fabric network (for first time setup)
- $ ./fabric.sh -m build

now if you run 'docker ps' you wil see that all containers are running

### Composer
- $ cd composer/

#### Install Composer (for first time setup)
- $ ./composer.sh -m build

#### Deploy the network and create the cards (Business network name is 'penguin') (for first time setup)
- $ ./composer.sh -m deploy     # business network name is 'penguin' & it will take a while ;)

### Rest Server & mongo containers (Business network name is 'penguin') (for first time setup)

Before you start the rest server, you must follow this tutorial (beginning from: Configuring the REST server to use an authentication strategy) 
https://hyperledger.github.io/composer/latest/integrating/enabling-rest-authentication

add the clientID and clientSecret values to COMPOSER_PROVIDERS object in fabric/.env

#### Create rest & mongo containers
- $ cd rest-server/
- $ ./rest-server.sh -m build   # business network name is 'penguin'

### Angular
- $ cd angular/
- $ npm install
- $ npm start
- Open http://localhost:4200/ on your browser
- Click on "Sign in with github"
- Enter the user name and password of your github account and sign in
- Enter your new user Id, first name and surname and sign up

## Dem setup (creates some assets)
- Open new terminal window
- $ cd composer/
- $ ./composer.sh -m demoSetup
- got to your browser and update the browser window where your application is running
- Click on "Sign in with github"
- Now some assets have been created

## Further Usage

### Start or stop the network (not for first time setup)
- $ cd fabric
- $ ./fabric.sh -m start
- $ ./fabric.sh -m stop

### Remove the network including the data 
- $ cd fabric
- $ ./fabric.sh -m down

### Recreate the containers without losing the data (not for first time setup)
- $  cd fabric/
- $ ./fabric.sh -m recreate

### If you want to update your business network (not for first time setup)
- $ cd composer/
- $ ./composer.sh -m upgrade    # business network name is 'penguin'

### Start or stop composer-cli container (not for first time setup)
- $ cd composer/
- $ ./composer.sh -m start
- $ ./composer.sh -m stop

### Recreate the container without losing the data (not for first time setup)
- $ cd composer/
- $ ./composer.sh -m recreate

### Remove the composer container including the data 
- $ cd composer
- $ ./composer.sh -m down

### Start or stop the rest Server & mongo containers (not for first time setup) (not for first time setup)
- $ cd rest-server/
- $ ./rest-server.sh -m start
- $ ./rest-server.sh -m stop

### Recreate the containers without losing the data (not for first time setup)
- $ cd rest-server/
- $ ./rest-server.sh -m recreate

### Remove the rest & mongo containers including the data 
- $ cd rest-server/
- $ ./rest-server.sh -m down

## Hints
- composer business network (penguin) is adapted from [https://github.com/caroline-church/collectable-penguin-app/blob/master/collectable-penguin-network.bna]
- The client app (angular) is adapted from [https://github.com/caroline-church/collectable-penguin-app]

## Links
- Hyperledger Fabric Documentation: https://hyperledger-fabric.readthedocs.io/en/release-1.1/
- Hyperledger Composer Documentation: https://hyperledger.github.io/composer/latest/installing/installing-index.html
- Hyperledger Composer Playground: https://composer-playground.mybluemix.net/
