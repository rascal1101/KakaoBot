module.exports = {
  callRestaurantFromCategory: function(place){
    return new Promise(function(resolve, reject){
      var md = require("./kakaomap.js");
      md.getPlaceXY(place, resolve, reject);
    });
  },
  callRestaurantFromKeyword: function(keyword){
    return new Promise(function(resolve, reject){
      var md = require("./kakaomap.js");
      md.getRestaurantFromKeyword(1, keyword, resolve, reject);
    })
  },
  getRestaurantFromKeyword: function(pc, keyword, resolve, reject){
    const http = require('http');
    var size = 15;
    var page = 1;
    if(pc==-1){
      size = 1;
    }else{
      page = pc;
    }
    var encodedQuery = "query=" + encodeURIComponent(keyword);
    const options = {
      hostname: 'dapi.kakao.com',
      port: 80,
      path: `/v2/local/search/keyword.json?${encodedQuery}&size=${size}&page=${page}`,
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
        if(pc==-1){
          var pageCount = parsedData.meta.pageable_count;
          if(pageCount > 0){
            pc = Math.floor(Math.random() * pageCount)+1;
            console.log(`pc : ${pc}`)
            this.getRestaurantFromKeyword(pc,keyword,resolve,reject);
          }else{
            reject("pageable count error");
          }
        }else if(pc>0){
          if(parsedData.meta.total_count > 0){
            var len = parsedData.documents.length;

            var indices = [];
            while(indices.length < 5){
              var index = Math.floor(Math.random() * len);
              if(indices.indexOf(index) === -1) indices.push(index);
            }
            var arr = [];
            for(var i=0;i<indices.length;i++){
              arr.push(parsedData.documents[i]);
            }
            var data = {"restaurants" : arr};
            // var index = Math.floor(Math.random() * len);
            // var data = parsedData.documents[index];

            // var data = {
            //   "place_url": parsedData.documents[index].place_url
            // };
            resolve(data);
          }else{ // 주소 검색 다시
            reject("keyword search fail");
          }

        }else {
          reject("pageable count error");
        }

      });
    });

    req.on('error', (e) => {
      console.error(`problem with request: ${e.message}`);
    });
    req.end();

  },
  getPlaceXY:function(place, resolve, reject){
    const http = require('http');
    var encodedQuery = "query=" + encodeURIComponent(place);
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
        if(parsedData.meta.total_count > 0){
          var x = parsedData.documents[0].x;
          var y = parsedData.documents[0].y;
          console.log(
  `place : ${place}
  x : ${x}
  y : ${y}`);
          this.getRandomRestaurant(-1,x,y,resolve,reject);
        }else{ // 주소 검색 다시
          reject("x,y 실패");
        }


      });
    });

    req.on('error', (e) => {
      console.error(`problem with request: ${e.message}`);
    });
    req.end();

  },


  getRandomRestaurant: function(pc,x,y,resolve,reject){
    const http = require('http');
    var size = 15;
    var page = 1;
    if(pc==-1){
      size = 1;
    }else{
      page = pc;
    }
    const options = {
      hostname: 'dapi.kakao.com',
      port: 80,
      path: `/v2/local/search/category.json?category_group_code=FD6&x=${x}&y=${y}&radius=1000&size=${size}&page=${page}`,
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
        if(pc==-1){
          var pageCount = parsedData.meta.pageable_count;
          if(pageCount > 0){
            pc = Math.floor(Math.random() * pageCount)+1;
            console.log(`pc : ${pc}`)
            this.getRandomRestaurant(pc,x,y,resolve,reject);
          }else{
            reject("pageable count error");
          }
        }else if(pc>0){
          if(parsedData.meta.total_count > 0){
            var len = parsedData.documents.length;

            var indices = [];
            while(indices.length < 5){
              var index = Math.floor(Math.random() * len);
              if(indices.indexOf(index) === -1) indices.push(index);
            }
            var arr = [];
            for(var i=0;i<indices.length;i++){
              arr.push(parsedData.documents[i]);
            }
            var data = {"restaurants" : arr};
            // var index = Math.floor(Math.random() * len);
            // var data = parsedData.documents[index];
            // var data = {
            //   "place_name" : parsedData.documents[index].place_name,
            //   "road_address_name" : parsedData.documents[index].road_address_name,
            //   "place_url": parsedData.documents[index].place_url
            // };

            resolve(data);
          }else{
            reject("category search fail");
          }

        }else{
          reject("page count error");
        }
      });
    });

    req.on('error', (e) => {
      console.error(`problem with request: ${e.message}`);
    });
    req.end();

  }


}
