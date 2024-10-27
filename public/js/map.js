var history = [];

function get(url, params, callback) {
    if (params) {
        let paramsArray = [];
        Object.keys(params).forEach(key => paramsArray.push(key + '=' + params[key]));
        if (url.search(/\?/) === -1) {
            url += '?' + paramsArray.join('&')
        } else {
            url += '&' + paramsArray.join('&')
        }
    }
    console.log(url);
    fetch(url,{
        method: 'GET',
    }).then((response) => response.json())
    .then((json) => {
        callback(json);
    }).catch((error) => {
        alert(error)
    })
  }
//------------------地图初始化--------------------

var map = L.map('map', {
    zoomSnap: 0, 
    zoomControl: false,
}).setView([30.55, 114.32], 13.5);

L.tileLayer('https://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}', {
    attribution: '&copy; <a href="https://webrd02.is.autonavi.com/copyright">GaodeMap</a> contributors'
}).addTo(map);


//-------------------地点搜索----------------------

var tips = [];

var currentLocation = 'aaa';

function debounce(callback, delay) {
    let timeout = 0;
    return function(e) {
        clearTimeout(timeout);
        timeout = setTimeout( () => {
            callback(e);
        }, delay)
    };
}

function transition (location) {
    map.setView(location['location'].split(',').reverse(), 16)
}

function updateLocationList() {

    var list = document.getElementById('content_wrapper');
    list.innerHTML = '';

    //点击地点
    tips.forEach( (tip) => {
        console.log(tip)
        var listItem = document.createElement('li');
        listItem.textContent = tip['name'];
        listItem.onclick = () => {
            transition(tip);

            var center = map.getCenter();
            var scale = map.getZoom();
            history = [{
                'type': 'init',
                'map': [center.longtitude, center.latitude, scale]
            }];
            history.__proto__ = Array.prototype;
         
            currentLocation = tip['name'];
        };
        list.appendChild(listItem)
    })
}

document.addEventListener('DOMContentLoaded', function() {
    //获取地点列表
    document.querySelector(".searchbox_input").addEventListener('input', 
        debounce(e => {
            let value = e.target.value;
            if(!value) return;
            console.log(value);
            get('/inputtips', {
                'keywords': value,
            }, (json) => {
                tips = json['tips'];
                updateLocationList();
            });
        }, 300)
    , false);

    //获取随机地点列表
    document.querySelector(".search_btn").addEventListener('click', (e) => {
        console.log("???")
        var longtitude = 113.4 + Math.random()*2;
        var latitude = 29.58 + Math.random()*2;
        get('/around', {
            'location': `${longtitude},${latitude}`
        }, (json) => {
            tips = json['pois'];
            updateLocationList();
        })
    })
})



//-------------------------记录操作-----------------------

document.addEventListener('DOMContentLoaded', function() {
    history.__proto__ = Array.prototype;

    const confirmBtn = document.querySelector(".scale_btn");

    //记录当前比例尺
    map.on('zoom', debounce(e => {
        var zoom = map.getZoom(); 
        confirmBtn.innerText = `缩放：${zoom}`;
    }, 100))

    //缩放事件监听
    map.on('zoomend', function(e) {
        var center = map.getCenter();
        history.push({type: 'zoom', map:[center.lat, center.lng, map.getZoom()] });
    });
    
    //移动事件监听
    map.on('moveend', function(e) {
        var center = map.getCenter();
        history.push({ type: 'move', center: [center.lat, center.lng, map.getZoom()] });
    });

    document.addEventListener('keydown', (event) => {
        if(event.keyCode===13 || KeyboardEvent.key==='Enter') {
            if(currentLocation==='')return;
            var data = JSON.stringify({
                'name': currentLocation,
                'zoom': map.getZoom(),
                'operator': history,
                'user': user
            });
            console.log(data);
            record(data);
            currentLocation = '';
        }
    })
})

//调用服务器api
function record(value) {
    fetch('/submit-data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
          },
        body: value
    }).then (response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    }).then (data => {
        console.log(data);
    }).catch(error => {
        console.log('There has been a problem with your fetch operation:', error);
    })
}