var searchBox = document.querySelector('.searchbox');
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
var operatorHistory = [];

var currentLocation = '';
var currentAddress = '';
var currenType = '';

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
    marker.setLatLng(location['location'].split(',').reverse())
}

searchBox.addEventListener('wheel', function(e) {
    e.stopPropagation(); 
});
searchBox.addEventListener('mousedown', function(e) {
    e.stopPropagation(); 
    searchBox.addEventListener('mousemove', mouseMoveHandler);
    searchBox.addEventListener('mouseup', mouseUpHandler);
});

function mouseMoveHandler(e) {
    e.stopPropagation();
}

function mouseUpHandler(e) {
    e.stopPropagation();
    searchBox.removeEventListener('mousemove', mouseMoveHandler);
    searchBox.removeEventListener('mouseup', mouseUpHandler);
}
//-------------------------记录操作-----------------------


//缩放事件监听
map.on('zoomend', () => {
    var center = map.getCenter();
    operatorHistory.push({type: 'zoom', map:[center.lat, center.lng, map.getZoom()] });
});
    
    //移动事件监听
map.on('moveend', () => {
    var center = map.getCenter();
    operatorHistory.push({ type: 'move', center: [center.lat, center.lng, map.getZoom()] });
});

document.addEventListener('keydown', (event) => {
        if(event.keyCode===13 || KeyboardEvent.key==='Enter') {
            if(currentLocation==='')return;
            var data = JSON.stringify({
                'name': currentLocation,
                'zoom': map.getZoom(),
                'operator': operatorHistory,
                'user': user,
                'address': currentAddress,
                'type': currenType,
            });
            console.log(operatorHistory);
            record(data);
            currentLocation = '';
        }
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

//--------------------添加图钉---------------------

var marker = L.marker([0,0]).addTo(map);