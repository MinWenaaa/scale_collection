var user = {
    'age': '',
    'profession': '',
    'purpose': '',
    'device': '',
    'size': '',
}

var info_check = [false, false, false, false, false];

var infoBox = document.querySelector('.infobox_wrapper');
var dropBtn = document.querySelectorAll('.dropbtn');
var dropContent = document.querySelectorAll('.drop_content');
var InfoConfirm = document.querySelector('.info_confirm');


// -----------------点击弹出下拉框------------------ 
dropBtn.forEach((btn) => {
    btn.addEventListener('click', () => {
        var query = `.drop_content.${btn.classList[1]}`;
        document.querySelectorAll('.drop_content').forEach((cont) => {
            cont.style.display = 'none';
        })
        document.querySelector(query).style.display = 'block';
    })
})

// ---------------点击选项收集单项信息---------------

var size = {
    '手机': '<li>4.7英寸</li><li>5.5</li><li>6.1</li><li>6.5</li>',
    '平板': '<li>7</li> <li>8</li> <li>9.7</li> <li>10.1</li>',
    '笔记本': '<li>13</li> <li>14</li> <li>15.6</li> <li>17</li>',
    '台式机': '<li>21.5</li> <li>24</li> <li>27</li> <li>32</li>'
};

function is_collected() {
    //console.log(user['age']=='', user['profession']=='', user['purpose']=='', user['device']=='', user['size']=='')
    return !(user['age']==''||user['profession']==''||
        user['device']==''||user['size']==''||user['purpose']=='');
}

dropContent.forEach((cont) => {
    cont.addEventListener('click', (event) => {
        if (event.target.tagName === 'LI') {
            var value = event.target.textContent || event.target.innerText
            user[cont.classList[1]] = value;
            cont.style.display = 'none';
            var query = `.dropbtn.${cont.classList[1]}`;
            document.querySelector(query).innerHTML = `${value} <span class="iconfont icon-xialajiantou"></span>`;

           
            if(is_collected()) {
                console.log(is_collected())
                var btn = document.querySelector('.info_confirm');
                btn.style.backgroundColor ="#635282";
                btn.style.color = "#e9f0f6";
            }
        }
    });
})

// --------------不同设备屏幕尺寸不同------------------
var device_content = document.querySelector('.drop_content.device');
var size_content = document.querySelector('.drop_content.size');

device_content.addEventListener('click', (event) => {
    if (event.target.tagName === 'LI') {
        var value = event.target.textContent || event.target.innerText;
        size_content.innerHTML = size[value];
    }
})

// -------------点击确定完成信息收集-----------------

InfoConfirm.addEventListener('click', () => {
    var InfoWrapper = document.querySelector('.infobox_wrapper');
    var searchWrapper = document.querySelector('#searchbox');
    var scaleBtn = document.querySelector('.scale_btn');

    scaleBtn.style.display='block';
    searchWrapper.style.display='block'
    InfoWrapper.style.display='none';

})


