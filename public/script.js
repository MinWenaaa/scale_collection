var key = '';

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

/*
var map = new AMap.Map('map', {
    resizeEnable: true, 
    zoom:13, 
    center: [114.32, 30.55]
});
*/

//-------------------地点搜索----------------------

var tips = [];

var currentLocation = '';

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

    tips.forEach( (tip) => {
        console.log(tip)
        var listItem = document.createElement('li');
        listItem.textContent = tip['name'];
        listItem.onclick = () => {
            transition(tip);
            currentLocation = tip['name'];
        };
        list.appendChild(listItem)
    })
}

document.addEventListener('DOMContentLoaded', function() {
    document.querySelector(".searchbox_input").addEventListener('input', 
        debounce(e => {
            let value = e.target.value;
            if(!value) return;

            get('https://restapi.amap.com/v3/assistant/inputtips', {
                'key': key,
                'keywords': value,
            }, (json) => {
                tips = json['tips'];
                updateLocationList();
            });
        }, 300)
    , false);

    document.querySelector(".search_btn").addEventListener('click', (e) => {
        var longtitude = 113.4 + Math.random()*2;
        var latitude = 29.58 + Math.random()*2;
        get('https://restapi.amap.com/v5/place/around', {
            'key': key,
            'location': `${longtitude},${latitude}`
        }, (json) => {
            tips = json['pois'];
            updateLocationList();
        })
    })
})



//-------------------------记录缩放比例-----------------------

document.addEventListener('DOMContentLoaded', function() {
    const confirmBtn = document.querySelector(".confirm_btn");

    map.on('zoom', debounce(e => {
        var zoom = map.getZoom(); 
        confirmBtn.innerText = `缩放：${zoom}`;
    }, 100))

    document.addEventListener('keydown', (event) => {
        console.log('回车触发')
        if(event.keyCode===13 || KeyboardEvent.key==='Enter') {
            if(currentLocation==='')return;
            var data = `\n${currentLocation}, ${map.getZoom()}`;
            console.log(data);
            record(data);
            currentLocation = '';
        }
    })
})

function record(value) {
    fetch('/submit-data', {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain'
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