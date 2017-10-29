'use strict';

console.log('Loading function');

const doc = require('dynamodb-doc');

const dynamo = new doc.DynamoDB();
var AWS = require('aws-sdk'),
   uuid = require('uuid'),
   documentClient = new AWS.DynamoDB.DocumentClient(); 
   
   
const putResponse = (payload, callback) => {
    if (typeof payload === "string") {
        payload = JSON.parse(payload);
    }    
    
    var tableName = "responses";
    var item = payload;
    item['id'] = uuid.v1();
    item['timestamp'] = Date.now();
    item['date'] = Date();

    var params = {
        TableName: tableName,
        Item: item
    };
    console.log('putting Item:', JSON.stringify(params, null, 2));
    dynamo.putItem(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else     console.log(data);           // successful response
        callback(err, data);
    });
}


/**
 * Demonstrates a simple HTTP endpoint using API Gateway. You have full
 * access to the request and response payload, including headers and
 * status code.
 *
 * To scan a DynamoDB table, make a GET request with the TableName as a
 * query string parameter. To put, update, or delete an item, make a POST,
 * PUT, or DELETE request respectively, passing in the payload to the
 * DynamoDB API as a JSON body.
 */
exports.handler = (event, context, callback) => {
    console.log('Received event:', JSON.stringify(event, null, 2));

    const done = (err, res) => callback(null, {
        statusCode: err ? '400' : '200',
        body: err ? err.message : JSON.stringify(res),
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
        },
    });

    switch (event.httpMethod) {
        case 'POST':
            putResponse(event.body, done);
            break;
        default:
            done(new Error(`Unsupported method "${event.httpMethod}"`));
    }
};
