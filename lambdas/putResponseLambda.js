'use strict';

console.log('Loading function');

const doc = require('dynamodb-doc');

const dynamo = new doc.DynamoDB();
var AWS = require('aws-sdk'),
   uuid = require('uuid'),
   documentClient = new AWS.DynamoDB.DocumentClient(); 
   
   
function doMatch(str1, str2, matchStr) {
    if (str1.includes(matchStr) && str2.includes(matchStr)) {
        console.log(str1 + "matches with" + str2);
        return true;
    }
    return false;
}


const putResponse = (payload, callback) => {
    if (typeof payload === "string") {
        payload = JSON.parse(payload);
    }
    
    var qTotal = 0;
    
    var tableName = "responses";
    var item = payload;
    
    var qfCorrect = 0;
    var qfAngerCorrect = 0;
    var qfFearCorrect = 0;
    var qfHappyCorrect = 0;
    var qfSadCorrect = 0;
    
    var qbCorrect = 0;
    var qbAngerCorrect = 0;
    var qbFearCorrect = 0;
    var qbHappyCorrect = 0;
    var qbSadCorrect = 0;
    
    var qsliderCorrect = 0;
    var qsliderAngerCorrect = 0;
    var qsliderFearCorrect = 0;
    var qsliderHappyCorrect = 0;
    var qsliderSadCorrect = 0;
    
    
    
    console.log("testing");

    for (var key in item) {

        if (key.startsWith('qf')) {
            if (doMatch(key,item[key],"Anger")) {
                qfAngerCorrect++;
            }
            if (doMatch(key,item[key],"Fear")) {
                qfFearCorrect++;
            }
            if (doMatch(key,item[key],"Happ")) {
                qfHappyCorrect++;
            }
            if (doMatch(key,item[key],"Sad")) {
                qfSadCorrect++;
            }
        }
        
        if (key.startsWith('qb')) {
            if (doMatch(key,item[key],"Anger")) {
                qbAngerCorrect++;
            }
            if (doMatch(key,item[key],"Fear")) {
                qbFearCorrect++;
            }
            if (doMatch(key,item[key],"Happ")) {
                qbHappyCorrect++;
            }
            if (doMatch(key,item[key],"Sad")) {
                qbSadCorrect++;
            }
        }
        
        if (key.startsWith('qslider')) {
            if (doMatch(key,item[key],"Anger")) {
                qsliderAngerCorrect++;
            }
            if (doMatch(key,item[key],"Fear")) {
                qsliderFearCorrect++;
            }
            if (doMatch(key,item[key],"Happ")) {
                qsliderHappyCorrect++;
            }
            if (doMatch(key,item[key],"Sad")) {
                qsliderSadCorrect++;
            }
        }
        
        
    }
    qTotal = Number(item['q01']) + 
            Number(item['q02']) + 
            Number(item['q03']) + 
            Number(item['q04']) + 
            Number(item['q05']) + 
            Number(item['q06']) + 
            Number(item['q07']) + 
            Number(item['q08']) + 
            Number(item['q09']) + 
            Number(item['q10']) + 
            Number(item['q11']) + 
            Number(item['q12']) + 
            Number(item['q13']) + 
            Number(item['q14']) + 
            Number(item['q15']) + 
            Number(item['q16']);

    qfCorrect = qfAngerCorrect + qfFearCorrect + qfHappyCorrect + qfSadCorrect;
    qbCorrect = qbAngerCorrect + qbFearCorrect + qbHappyCorrect + qbSadCorrect;
    qsliderCorrect = qsliderAngerCorrect + qsliderFearCorrect + qsliderHappyCorrect + qsliderSadCorrect;
    console.log(qfCorrect);
    console.log(qbCorrect);
    console.log(qsliderCorrect);

    
    // Prepare Item
    item['id'] = uuid.v1();
    item['timestamp'] = Date.now();
    item['date'] = Date();
    item["qfCorrect"] = qfCorrect;
    item["qfAngerCorrect"] = qfAngerCorrect;
    item["qfFearCorrect"] = qfFearCorrect;
    item["qfHappyCorrect"] = qfHappyCorrect;
    item["qfSadCorrect"] = qfSadCorrect;

    item["qbCorrect"] = qbCorrect;
    item["qbAngerCorrect"] = qbAngerCorrect;
    item["qbFearCorrect"] = qbFearCorrect;
    item["qbHappyCorrect"] = qbHappyCorrect;
    item["qbSadCorrect"] = qbSadCorrect;

    item["qsliderCorrect"] = qsliderCorrect;
    item["qsliderAngerCorrect"] = qsliderAngerCorrect;
    item["qsliderFearCorrect"] = qsliderFearCorrect;
    item["qsliderHappyCorrect"] = qsliderHappyCorrect;
    item["qsliderSadCorrect"] = qsliderSadCorrect;
    
    item['qTotal'] = qTotal;
    
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
