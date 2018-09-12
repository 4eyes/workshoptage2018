/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Track the trade of a penguin from one collector to another
 * @param {org.collectable.penguin.Trade} trade - the trade to be processed
 * @transaction
 */
function tradePenguin(trade) {

    var oldOwner = trade.penguin.owner;

    // set the new owner of the penguin
    trade.penguin.owner = trade.newOwner;
    return getAssetRegistry('org.collectable.penguin.Penguin')
        .then(function (assetRegistry) {

            // emit a notification that a trade has occurred
            var tradeNotification = getFactory().newEvent('org.collectable.penguin', 'TradeNotification');
            tradeNotification.penguin = trade.penguin;
            tradeNotification.oldOwner = oldOwner;
            tradeNotification.newOwner = trade.newOwner;
            emit(tradeNotification);

            // persist the state of the penguin
            return assetRegistry.update(trade.penguin);
        });
}


/**
 * Sell the Penguin
 * @param {org.collectable.penguin.Sell} tx - the trade to be processed
 * @transaction
 */
function sellPenguin(tx) {

    var oldOwner = tx.penguin.owner;

    // set the new owner of the penguin
    tx.penguin.owner = tx.newOwner;
    tx.penguin.isForSale = false;
    return getAssetRegistry('org.collectable.penguin.Penguin')
        .then(function (assetRegistry) {

            // emit a notification that a trade has occurred
            var tradeNotification = getFactory().newEvent('org.collectable.penguin', 'TradeNotification');
            tradeNotification.penguin = tx.penguin;
            tradeNotification.oldOwner = oldOwner;
            tradeNotification.newOwner = tx.newOwner;
            emit(tradeNotification);

            // persist the state of the commodity
            return assetRegistry.update(tx.penguin);
        });
}


/**
 * Make the penguin for sale
 * @param {org.collectable.penguin.AddForSale} tx - the transaction to be processed
 * @transaction
 */
function addForSale(tx) {

    // set the new owner of the commodity
    tx.penguin.isForSale = true;
    return getAssetRegistry('org.collectable.penguin.Penguin')
        .then(function (assetRegistry) {
            return assetRegistry.update(tx.penguin);
        });
}

/**
 * Creates some assets
 * @param {org.collectable.penguin._demoSetup} demo - demoSetup
 * @transaction
 */
function setup() {
    var factory = getFactory();
    var NS = 'org.collectable.penguin';
    var collectors = [
        factory.newResource(NS, 'Collector', 'CAROLINE'),
        factory.newResource(NS, 'Collector', 'TRACY'),
        factory.newResource(NS, 'Collector', 'TOM'),
        factory.newResource(NS, 'Collector', 'WHOLESALER')
    ];


    var penguins = [
        factory.newResource(NS, 'Penguin', 'Gentoo'),
        factory.newResource(NS, 'Penguin', 'Macaroni'),
        factory.newResource(NS, 'Penguin', 'Adelie'),
        factory.newResource(NS, 'Penguin', 'African'),
        factory.newResource(NS, 'Penguin', 'Chinstrap'),
        factory.newResource(NS, 'Penguin', 'Emperor'),
        factory.newResource(NS, 'Penguin', 'Galapagos'),
        factory.newResource(NS, 'Penguin', 'Little'),
        factory.newResource(NS, 'Penguin', 'King'),
        factory.newResource(NS, 'Penguin', 'Rockhopper'),
        factory.newResource(NS, 'Penguin', 'Royal'),
        factory.newResource(NS, 'Penguin', 'Snares'),
    ];

    /* add the resource and the traders */
    return getParticipantRegistry(NS + '.Collector')
        .then(function (collectorRegistry) {
            collectors.forEach(function (collector) {

                collector.firstName = collector.getIdentifier().toLowerCase();
                collector.lastName = 'Collector';
            });
            return collectorRegistry.addAll(collectors);
        })
        .then(function () {
            return getAssetRegistry(NS + '.Penguin');
        })
        .then(function (assetRegistry) {
            penguins.forEach(function (penguin) {
                penguin.description = 'My name is ' + penguin.getIdentifier();
                penguin.owner = factory.newRelationship(NS, 'Collector', 'WHOLESALER');
            });
            return assetRegistry.addAll(penguins);
        });
}
