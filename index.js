'use strict';

// const http = require('http');

var kakaomap = require('./lib/kakaomap.js');

const express = require('express'),
bodyParser = require('body-parser'),
app = express().use(bodyParser.json());

app.use(express.static('public'));

app.listen(process.env.PORT || 80, () => console.log('webhook is listening'));

app.get('/', function(req, res){
        res.send("This server is for only ChatbotSkill");
});

let catImage = "http://k.kakaocdn.net/dn/vgnxa/btqq3mQAI0c/QRMTkWPkvXWun1qvOe7B8K/resize.jpg"

app.post('/webhook', (req, res) => {
        let input = req.body;
        console.log(JSON.stringify(input)); //req를 디버깅 하려면 주석을 푸세요.

        if (input.intent.name === "intent1") {
                console.log("intent1 is called.")
                res.send(makeTextResponse("this is intent 1/one/일"));
        } else if (input.intent.name === "intent2") {
                console.log("intent2 is called")
                res.send(makeCardImageRsponse("고양이", catImage, "이것은 고양이 이미지"));
        } else if (input.intent.name === "추천") {
                var place = input.action.params.place;
                console.log(place + "를 입력하셨습니다");
                kakaomap.callRestaurantFromCategory(place).then(function(data){
                  console.log("index.js");
                  console.log(data);
                  var responseData = makeCardImageRsponse();
                  var arr = [];
                  for(var i=0;i<data.restaurants.length;i++){
                    var title = data.restaurants[i].place_name;
                    var desc = data.restaurants[i].road_address_name;
                    var place_url = data.restaurants[i].place_url;
                    arr.push(makeCard('0',desc,title,place_url));
                  }
                  responseData.contents[0].cards = arr;
                  console.log(responseData);
                  res.send(responseData);
                }, function(err){
                  console.log(err);
                });
        } else if (input.intent.name === "스킬"){
                console.log(makeTextResponse2("skill test on"));
                res.send(makeTextResponse2("skill test on"));
        } else if(input.intent.name === "키워드 추천"){
                var keyword = input.action.params.menu;
                console.log(keyword);
                kakaomap.callRestaurantFromKeyword(keyword).then(function(data){
                  console.log(data);
                  res.json(data.restaurants[0]);
                }, function(err){
                  console.log(err);
                });
        }else {
                res.send(makeTextResponse("unknown intent name."));
        }
});
function makeTextResponse2(text){
  return {
      "version": "2.0",
      "template": {
          "outputs": [
              {
                  "simpleText": {
                      "text": text
                  }
              }
          ]
      }
  };
}

function makeTextResponse(text) {
        return {
          "contents": [
              {
                "type": "text",
                "text": text
              }
            ]
        }
}


function makeCardImageRsponse () {
        return   {
        "contents":
        [
          {
            "type":"card.image",
            "cards":
            [
            ]
          }
        ]
      }
}

function makeCard(image_url, desc, title, place_url){
  return {
    "imageUrl":"http://blogfiles.naver.net/20130116_176/yasiyam79_1358324331432NupBg_JPEG/tumblr_lsawu3nzs01qi23vmo1_500_large.jpg",
    "description": desc,
    "title": title,
    "linkUrl": {
    },
    "buttons":[
      {
        "type":"url",
        "label":"카카오맵에서 열기",
        "data":{
          "url" : place_url
        }
      }
    ]
  };
}


// 추가적인 말풍선 타입은 아래 문서를 참고하세요.
// https://i.kakao.com/docs/?page_id=3198
