var searchBox = document.querySelector('.searchbox');
var btnUnfold = document.querySelector('.btn_unfold');
var tipsFold = document.querySelector('.tips_fold');
var inputBox = document.querySelector('.input_box');
var btnPOIType = document.querySelector('.btn_poi_type');
var keywordsInput = document.querySelector('.keywords_input');
var keywordsWrapper = document.querySelector('.keywords_wrapper');
var resultWrapper = document.querySelector('.result_wrapper');
var poiTypeWrapper = document.querySelector('.poi_type_wrapper');
var keywordsList = document.querySelectorAll('.keywords');
var keywordConfirmBtn = document.querySelector('.keywords_comfirm');
var btnRefreshKeywords = document.querySelector('.refresh_keywords')

const poiPoints = [
    "菜鸟驿站","海底捞","图书馆","蜜雪冰城","中学","汽车维修","星巴克","肯德基","麦当劳","沃尔玛","美甲","体育中心","万科","保利",
    "家乐福","宜家家居","电影院","健身房","游泳馆","公园","生鲜超市","银行","医院","药店","实验小学","高级职业中学","幼儿园","布艺","有限公司",
    "火车站","地铁站","公交站","机场","长途客运站","中国石化","充电站","青年旅舍","民宿","快餐店","面包店","咖啡馆","酒吧","湿地公园",
    "KTV","网吧","洗衣店","美容院","理发店","按摩店","牙科诊所","眼镜店","书店","博物馆","美术馆","科技馆","生鲜","立交桥","万达广场",
    "水族馆","动物园","植物园","儿童游乐场","高尔夫球会","卷烟厂","篮球场","家具广场","便利店","水产海鲜市场","建材五金市场","周黑鸭",
    "百果园","服装店","鞋店","黄金珠宝","手机店","电脑店","家居装饰","花鸟鱼虫市场","宠物医院","旅行社","职业技术学校","药房","南国大家装",
    "教堂","清真寺","墓园","殡仪馆","消防站","警察局","中级人民法院","律师事务所","公证处","邮局","区政府","童装","研究所","公交停车场",
    "快递公司","物流中心","停车场","汽车服务","汽车销售","汽车配件店","汽车俱乐部","精益眼镜","广场","皇冠幸福里","联想售后","工业园",
    "奥特莱斯","商务宾馆","烟酒商行","奢侈品回收","紫燕百味鸡","猪肚鸡","雅迪电动车","副食","城市书房","地下停车场","建材城"
  ];

// -----------------state1 to state2---------------------
btnUnfold.addEventListener('click', () => {
    searchBox.classList.remove('fold_up');
    btnUnfold.style.display = 'none';
    tipsFold.style.display = 'none';
    inputBox.style.display = 'flex';
    if(resultWrapper.innerHTML!=''){
        console.log(resultWrapper.innerHTML);
        resultWrapper.style.display = 'flex';
        keywordsWrapper.style.display = 'none';
        poiTypeWrapper.style.display = 'none';
    } else {
        resultWrapper.style.display = 'none';
        keywordsWrapper.style.display = 'flex';
        poiTypeWrapper.style.display = 'none';
        update_keywords();
    }
})

//-------------------kewords列表-------------------------
function update_keywords() {
    for(var i=0; i<30; i++) {
        keywordsList[i].innerHTML = poiPoints[Math.floor(Math.random()*4) + i*4];
    }
}

btnRefreshKeywords.addEventListener('click', update_keywords);

keywordsList.forEach((keyword) => {
    keyword.addEventListener('click', (event) => {
        keywordsInput.value = event.target.innerHTML;
        get('/inputtips', {
            'keywords': event.target.innerHTML,
        }, (json) => {
            tips = json['tips'];
            updateLocationList();
        });
    })
})


//--------------------poi_type------------------------

// 初始化
var type_first = Object.keys(poi_type)[0];
var type_second = Object.keys(poi_type[type_first])[0];
var type_third = poi_type[type_first][type_second][0]['name']
var type_code = '';

var typeSelector = document.querySelectorAll('.type_selector');

Object.keys(poi_type).forEach((key) => {
    var listItem = document.createElement('li');
    listItem.innerHTML = `<input type="checkbox" class="tpye_checkbox ">
          <p class="type_lable">${key}</p>
          <span class="iconfont icon-youjiantou"></span>`;
    listItem.classList.add('first');
    listItem.children[0].addEventListener('change', (e)=>{
        if(e.target.checked) {
            document.querySelectorAll('.first').forEach( (li) => {
                if(li.children[0] != e.target) {
                    li.children[0].checked = false;
                    li.classList.remove('selected');
                }
            });
            listItem.classList.add('selected');
            type_first = listItem.children[1].innerHTML;
            updateTypeSelctor(true);
        }
    });
    typeSelector[0].appendChild(listItem);
})
typeSelector[0].children[0].children[0].checked = true;

function updateTypeSelctor(isUpdateSecond) {

    if(isUpdateSecond) {
        typeSelector[1].innerHTML = '';
        Object.keys(poi_type[type_first]).forEach((key) => {
            var listItem = document.createElement('li');
            listItem.innerHTML = `<input type="checkbox" class="tpye_checkbox">
                <p class="type_lable">${key}</p>
                <span class="iconfont icon-youjiantou"></span>`;
            listItem.classList.add('second');
            listItem.children[0].addEventListener('change', (e)=>{
                if(e.target.checked) {
                    document.querySelectorAll('.second').forEach( (li) => {
                        if(li.children[0] != e.target) {
                            li.children[0].checked = false;
                            li.classList.remove('selected');
                        }
                    });
                    listItem.classList.add('selected');
                    type_second = listItem.children[1].innerHTML;
                    updateTypeSelctor(false);
                }
            });
            typeSelector[1].appendChild(listItem);
        });
        typeSelector[1].children[0].children[0].checked = true;
        typeSelector[1].children[0].classList.add('selected');
        type_second = typeSelector[1].children[0].children[1].innerHTML;
    }

    typeSelector[2].innerHTML = '';
    poi_type[type_first][type_second].forEach( (type) => {
        var listItem = document.createElement('li');
        listItem.innerHTML = `<input type="checkbox" class="tpye_checkbox">
            <p class="type_lable">${type['name']}</p>`;
        listItem.classList.add('third');
        listItem.children[0].addEventListener('change', (e)=>{
            if(e.target.checked) {
                document.querySelectorAll('.third').forEach( (li) => {
                    if(li.children[0] != e.target) {
                        li.children[0].checked = false;
                        li.classList.remove('selected');
                    }
                });
                listItem.classList.add('selected');
                type_third = type['name'];
                type_code = type['code'];
                keywordsInput.value = `${type_first}:${type_second}:${type_third}`;
            }
        });
        typeSelector[2].appendChild(listItem);
    })
    typeSelector[2].children[0].classList.add('selected');
    typeSelector[2].children[0].children[0].checked = true;
    type_third = poi_type[type_first][type_second][0]['name'];
    type_code = poi_type[type_first][type_second][0]['code'];
    console.log(type_code);
    keywordsInput.value = `${type_first}:${type_second}:${type_third}`;
}

btnPOIType.addEventListener('click', () => {
    keywordsInput.disabled = true;
    keywordsInput.value = '';
    resultWrapper.style.display = 'none';
    keywordsWrapper.style.display = 'none';
    poiTypeWrapper.style.display = 'flex';
    updateTypeSelctor(true);
})

//--------------------输入框响应------------------------
keywordsInput.addEventListener('input', 
    debounce(e => {
        let value = e.target.value;
        if(!value) {
            resultWrapper.style.display = 'none';
            keywordsWrapper.style.display = 'flex';
            poiTypeWrapper.style.display = 'none';
        } else {
            console.log(value);
            get('/inputtips', {
                'keywords': value,
            }, (json) => {
                tips = json['tips'];
                updateLocationList();
            });
        }
    }, 500)
, false);

keywordConfirmBtn.addEventListener('click', () => {
    if(poiTypeWrapper.style.display=='flex') {
        console.log(`send request: code${type_code}`);
        var longtitude = 113.4 + Math.random()*2;
        var latitude = 29.58 + Math.random()*2;
        get('/around', {
            'location': `${longtitude},${latitude}`,
            'code': type_code
        }, (json) => {
            tips = json['pois'];
            updateLocationList();
        });
    }
})

function updateLocationList() {

    keywordsWrapper.style.display = 'none';
    poiTypeWrapper.style.display = 'none';
    resultWrapper.style.display = 'flex';
    resultWrapper.innerHTML = '';


    //点击地点
    tips.forEach( (tip) => {
        var listItem = document.createElement('li');
        listItem.innerHTML = `<span class="iconfont icon-tuding"></span>
        <div><h2>${tip['name']}</h2><p>${tip['address']}</p></div>`;
        listItem.onclick = () => {
            transition(tip);

            var center = map.getCenter();
            var scale = map.getZoom();
            operatorHistory = [];
            console.log(operatorHistory);
            operatorHistory.push({'type': 'init','map': [center.lat, center.lng, scale]});
            currentLocation = tip['name'];
            currentAddress = `${tip['pname']}${tip['cityname']}${tip['adname']}${tip['address']}`;
            currenType = tip['type']

            searchBox.classList.add('fold_up');
            btnUnfold.style.display = 'block';
            tipsFold.style.display = 'block';
            inputBox.style.display = 'none';
            resultWrapper.style.display = 'none';
            keywordsWrapper.style.display = 'none';
            poiTypeWrapper.style.display = 'none';
            tipsFold.innerHTML = tip['name'];
        };
        resultWrapper.appendChild(listItem);
    })
}

//----------------------刷新搜索结果列表-------------------------


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