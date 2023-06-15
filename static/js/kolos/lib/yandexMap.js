var yandexMaps = new function(){
    var  Self = this;
    var coords=[];
    this.params={};

    this.getCoords = function(){
        return coords;
    }

    this.showMap = function(paramJson){
        // var paramJson = $.evalJSON(paramJson);
        //var paramJson = jQuery.secureEvalJSON(paramJson);
        //console.log(paramJson);
        var coordsMap  = paramJson.cordsCity.split(',');
        var coordsShop = paramJson.coordsShop.split(',');
        $('#infoMap').show();
        $('#map').empty();

        var myMap;
        //если заданы координаты магазина. устанавливаем центр на них

        if (coordsShop[0] !== ''){
            coordsMap = coordsShop;
            //если
        }
        // елси не заданы координаты магазина устанавливаем центр на город
        myMap = new ymaps.Map("map", {
            center: coordsMap, // Новокузнецк
            zoom: 15
        }, {
            balloonMaxWidth: 700
        });
        // показываем уже записанный маркер
        myCollection = new ymaps.GeoObjectCollection({}, {
            preset: 'twirl#redIcon', //все метки красные
            draggable: true // и их можно перемещать
        });
        // добавляем уже сохраненные магазы
        myCollection.add(new ymaps.Placemark(coordsShop));
        myMap.geoObjects.add(myCollection);


        myMap.controls
            // Кнопка изменения масштаба.
            .add('zoomControl', { left: 5, top: 5 })
            // Список типов карты
            .add('typeSelector')
            // Стандартный набор кнопок
            .add('mapTools', { left: 35, top: 5 });

        myMap.events.add('click', function (e) {
            var points = e.get('coordPosition');
            coords =  [points[0].toPrecision(6), points[1].toPrecision(6)];

            if (typeof(myCollection) != "undefined") {
                myCollection.removeAll();
            }
            myCollection = new ymaps.GeoObjectCollection({}, {
                preset: 'twirl#redIcon', //все метки красные
                draggable: true // и их можно перемещать
            });

            //for (var i = 0; i < coords.length; i++) {

            myCollection.add(new ymaps.Placemark(coords));
            // }

            myMap.geoObjects.add(myCollection);
        });



    }

}