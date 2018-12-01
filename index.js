'use strict';

const http = require('http');
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
                console.log(place + "를 주문하셨습니다");
                // var template = makeTextResponse("place set");
                // console.log(template);
                getXY(place,res);
                // callRestAPI(res,-1);
        }else {
                res.send(makeTextResponse("unknown intent name."));
        }
});
function getXY(place, in_res){
  var encodedQuery = "query=" + encodeURIComponent(place);
  //console.log(encodedQuery);
  const options = {
    hostname: 'dapi.kakao.com',
    port: 80,
    path: `/v2/local/search/keyword.json?${encodedQuery}`,
    method: 'GET',
    headers: {
      'Authorization' : 'KakaoAK 7c0fba7f9a1f3de771a1bac7085e3fcc'
    }
  };

  const req = http.request(options, (res) => {
    res.setEncoding('utf8');
    var rawData = '';
    res.on('data', (chunk) => {
      rawData += chunk;
    });
    res.on('end', () => {
      const parsedData = JSON.parse(rawData);
      // console.log('Success to get data');
      // console.log(parsedData); //place -> x,y 변경
      if(parsedData.meta.total_count > 0){
        var x = parsedData.documents[0].x;
        var y = parsedData.documents[0].y;
        console.log(
`place : ${place}
x : ${x}
y : ${y}`);
        callRestAPI(in_res,-1,x,y);
      }else{ // 주소 검색 다시
        in_res.send();
      }


    });
  });

  req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
  });
  req.end();


}


function callRestAPI(in_res, pc, x, y){
  var size = 15;
  if(pc==-1){
    size = 1;
  }
  const options = {
    hostname: 'dapi.kakao.com',
    port: 80,
    path: `/v2/local/search/category.json?category_group_code=FD6&x=${x}&y=${y}&radius=1000&size=${size}`,
    method: 'GET',
    headers: {
      'Authorization' : 'KakaoAK 7c0fba7f9a1f3de771a1bac7085e3fcc'
    }
  };


  const req = http.request(options, (res) => {
    res.setEncoding('utf8');
    var rawData = '';
    res.on('data', (chunk) => {
      rawData += chunk;
    });
    res.on('end', () => {
      const parsedData = JSON.parse(rawData);
      //console.log(parsedData.documents[0].place_url);
      console.log('Success to get data');
      //console.log(parsedData.meta);
      if(pc==-1){
        pc = Math.floor(Math.random() * parsedData.meta.pageable_count);
        console.log(`pc : ${pc}`)
        callRestAPI(in_res,pc,x,y);
      }else{
        //console.log(parsedData);
        if(parsedData.meta.total_count > 0){
          var len = parsedData.documents.length;
          var index = Math.floor(Math.random() * len);
          in_res.json({
            "place_url": parsedData.documents[index].place_url
          });
        }else{ //파싱이 제대로 안된 경우

        }

      }
    });
  });

  req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
  });
  req.end();

}//callRestAPI end

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
