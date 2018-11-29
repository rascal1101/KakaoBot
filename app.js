var express = require('express');

var http = require('http');

var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


app.get('/keyboard', function(request, response){

  var data = {
    'type' : 'text',
    //'buttons' : ['과일', '채소', '정보']
  }

  response.json(data);
});

app.post('/message', function(request, response){
  var msg = request.body.content;
  console.log(`전달받은 메시지: ${msg}`);

  var send = {};

  switch(msg){
    case '명령어':
      send = {
        'message': {
          'text':
          '추천 : 음식 추천\n정보 : 봇 정보 출력'
        }
      }
      break;

    case '추천':
      var foods = ['떡볶이', '냉면', '짜장면', '탕수육',
      '곱창', '순대국', '치킨', '삼겹살'];
      // var foods = ['김성수', '바보'];
      var index = Math.floor(Math.random()*foods.length);
      send = {
        'message': {
          'text': `${foods[index]}`
        }
      }
      break;

    case '안녕':
      send = {
        'message': {
          'text': '안녕하세요 Rascal입니다'
        }
      }
      break;

    case '바보':
      send = {
        'message': {
          'text': '는 너'
        }
      }
      break;
    case '멍청이':
      send = {
        'message': {
          'text': '도 너'
        }
      }
      break;
    case '정보':
      send = {
        'message': {
          'text': '플러스친구 봇 테스트'
        }
        // ,keyboard: {
        //   'type': 'buttons',
        //   'buttons': ['테스트1', '테스트2']
        // }
      }
      break;

    case '효병이에게 한마디 해줘':
      send = {
        'message': {
          'text': '효병님 일본 잘갔다 오세요'
        }
      }
      break;

    case '뚱박':
      send = {
        'message': {
          'text': '뚱박님 안녕하세요'
        }
      }
      break;

    default:
      send = {
        'message': {
          'text': '알 수 없는 명령입니다!'
        }
      }
      break;
  }

  response.json(send);
});


http.createServer(app).listen(9090, function(){
  console.log('서버 실행 중..');
})
