'use strict'
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();
//작은 따옴표 사이에 본인이 받으신 token을 paste합니다.
//나중에 보안을 위해서 따로 setting을 하는 방법을 알려드리겠습니다.
//이 토큰이 포함된 파일을 절대 업로드하거나 github에 적용시키지 마세요.
var PAGE_ACCESS_TOKEN = 'EAABzum9EZAbQBAOcnYvdU3281seYvvLku4iPPtnhUpmF5rgDl9zsRb5uYmZASIM9Ko34BzqGIfX9HKgBQIiyE5JbONnDZC5NFIAN6n9xeUi69TloFCroTi8RB98s5fepc6o8L660E3BeJaUPzBUGs1veZC91qOUtJLMTYROWSkCVsSh6NpjC';
app.set('port', (process.env.PORT || 5000));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.get('/', function(req, res) {
    res.send('Hello world');
})
app.get('/webhook', function(req, res) {
    if (req.query['hub.verify_token'] === 'VERIFY_TOKEN') {
        res.send(req.query['hub.challenge']);
    }
    res.send('Error, wrong token');
})
app.post("/webhook", function(req, res) {
    console.log("WEBHOOK GET IT WORKS");
    var data = req.body;
    console.log(data);
    // Make sure this is a page subscription
    if (data.object == 'page') {
        // Iterate over each entry
        // There may be multiple if batched
        data.entry.forEach(function(pageEntry) {
            var pageID = pageEntry.id;
            var timeOfEvent = pageEntry.time;
            // Iterate over each messaging event
            pageEntry.messaging.forEach(function(messagingEvent) {
                if (messagingEvent.optin) {
                    receivedAuthentication(messagingEvent);
                } else if (messagingEvent.message) {
                    receivedMessage(messagingEvent);
                } else if (messagingEvent.postback) {
                    receivedPostback(messagingEvent);
                } else {
                    console.log("Webhook received unknown messagingEvent: ", messagingEvent);
                }
            });
        });
        res.sendStatus(200);
    }
});
function receivedMessage(event) {
    var senderId = event.sender.id;
    var content = event.message.text;
  
    if(content==='대용'){
        sendTextMessage(senderId, '취업하고싶다');
    } else if(content==='바보'){
		sendTextMessage(senderId, '멍청이');
	} else if(content==='돈'){
		sendTextMessage(senderId, '좋아');
	} else if(content==='라면'){
		sendTextMessage(senderId, '맛있지');
	} else if(content==='컴퓨터'){
		sendTextMessage(senderId, '맥북사고싶어');
	} else if(content==='야'){
		sendTextMessage(senderId, '왜');
	}  else{
		sendTextMessage(senderId, '무슨말인지 모르겠어요');
	}
}
function receivedPostback(event) {
    console.log("RECEIVED POSTBACK IT WORKS");
    var senderID = event.sender.id;
    var recipientID = event.recipient.id;
    var timeOfPostback = event.timestamp;
    var payload = event.postback.payload;
    console.log("Received postback for user %d and page %d with payload '%s' " +
        "at %d", senderID, recipientID, payload, timeOfPostback);
    sendTextMessage(senderID, "Postback called");
}
function sendTextMessage(recipientId, message) {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: PAGE_ACCESS_TOKEN },
        method: 'POST',
        json: {
            recipient: { id: recipientId },
            message: { text: message }
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending message: ' + response.error);
        }
    });
}
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'));
})