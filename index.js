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
                  res.json(data);
                }, function(err){
                  console.log(err);
                });
        } else if (input.intent.name === "스킬"){
                console.log("스킬 is called");
                res.send(makeTextResponse("skill test on"));
        } else if(input.intent.name === "키워드 추천"){
                var keyword = input.action.params.menu;
                console.log(keyword);
                kakaomap.callRestaurantFromKeyword(keyword).then(function(data){
                  console.log(data);
                  res.json(data);
                }, function(err){
                  console.log(err);
                });
        }else {
                res.send(makeTextResponse("unknown intent name."));
        }
});


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


function makeCardImageRsponse (title, image, desc) {
        return {
          "contents":[
            {
              "type":"card.image",
              "cards":[
                {
                  "imageUrl": image,
                  "description": desc,
                  "title": title,
                  "linkUrl": {
                  },
                  "buttons":[
                    {
                      "type": "url",
                      "label": "더보기",
                      "data": {
                        "url": "https://search.daum.net/search?w=img&nil_search=btn&DA=NTB&enc=utf8&q=%EA%B3%A0%EC%96%91%EC%9D%B4"
                      }
                    }
                  ]
                }
              ]
            }
          ]
        }
}


// 추가적인 말풍선 타입은 아래 문서를 참고하세요.
// https://i.kakao.com/docs/?page_id=3198
