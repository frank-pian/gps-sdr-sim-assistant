var gpsTool = new GpsTool();
var modeValue = 1;
var map = new AMap.Map('container', {
    zoom:3,//级别
    center: [116.397428, 39.90923],//中心点坐标
    viewMode:'3D'//使用3D视图
});


var marker = new AMap.Marker({
    // icon: 'https://webapi.amap.com/theme/v1.3/markers/b/mark_bs.png',
    icon: new AMap.Icon({
        image: 'https://webapi.amap.com/theme/v1.3/markers/b/mark_bs.png',
        size: new AMap.Size(19, 31),
        imageSize: new AMap.Size(19, 31)
    }),
    anchor: 'bottom-center',

});

function select(obj){ 
    return document.getElementById(obj); 
}

AMapUI.loadUI(['misc/PoiPicker'], function(PoiPicker) {

    var poiPicker = new PoiPicker({
        //city:'北京',
        input: 'pickerInput'
    });

    //初始化poiPicker
    poiPickerReady(poiPicker);
});


map.on('click', function(ev) {
    var position = ev.lnglat;
    var lat = position.getLat()
    var lng = position.getLng()
    select("lat").value = gpsTool.WGSLat(lat, lng);
    select("lng").value = gpsTool.WGSLng(lat, lng);
    marker.setPosition(position);
    marker.setMap(map);
});

function poiPickerReady(poiPicker) {

    window.poiPicker = poiPicker;

    var infoWindow = new AMap.InfoWindow({
        offset: new AMap.Pixel(0, -20)
    });

    //选取了某个POI
    poiPicker.on('poiPicked', function(poiResult) {

        var source = poiResult.source,
            poi = poiResult.item,
            info = {
                name: poi.name,
                location: poi.location.toString(),
                address: poi.address
            };

        marker.setMap(map);
        infoWindow.setMap(map);

        marker.setPosition(poi.location);
        var lat = poi.location.getLat()
        var lng = poi.location.getLng()
        select("lat").value = gpsTool.WGSLat(lat, lng);
        select("lng").value = gpsTool.WGSLng(lat, lng);
        infoWindow.setPosition(poi.location);

        infoWindow.setContent('POI信息: <pre>' + JSON.stringify(info, null, 2) + '</pre>');
        infoWindow.open(map, marker.getPosition());

        map.setCenter(marker.getPosition());
    });

    // poiPicker.onCityReady(function() {
    //     poiPicker.suggest('美食');
    // }); 
}

document.getElementsByClassName("cardBox")[0].onchange = function() {
    var mode = document.getElementsByName("mode");
    for (var i=0; i<mode.length; i++){
        if (mode[i].checked) {
            modeValue = parseInt(mode[i].value);
        }
    }
    if (modeValue === 1) {
        select("staic").style.display = "block";
        select("dynamic").style.display = "none";
    }else {
        select("staic").style.display = "none";
        select("dynamic").style.display = "block";
    }
}


document.getElementById("start").onclick = function() {
    if (modeValue === 1) {
        var lat = select("lat").value;
        var lng =  select("lng").value;
        var height =  select("height").value;
        if (lat != "" && lng != ""){
            runExec(lat, lng, height);
        }
    }else {
        var filePath = select("file").files[0].path;
        console.log(filePath);
        if (filePath) {
            runExecDynamic(filePath);
        }
    }
}
document.getElementById("send").onclick = function() {
    sendData();
}

function processUpdate(per){ 
    select("bar").style.width = parseInt(per) + 1 + "%"; 
    select("bar").innerHTML = parseInt(per) + "%"; 
}