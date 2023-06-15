var MapAddr = function(tagId, lat, lon, scale) {
    var Self = this;
    this.tagId = tagId;
    this.map = undefined;
    this.marker = undefined;

    this._onClickObs = new Observer(); //обсервер клика на карту
    this._onMoveEndObs = new Observer(); //обсервер клика на карту

    //args: lat, lon
    this.onClick = function(callback) {
        this._onClickObs.add(callback);
    };

    //args: lat, lon, scale
    this.onMoveEnd = function(callback) {
        this._onMoveEndObs.add(callback);
    };

    this.createMarker = function() {
        return new MapAddrMarker(Self.map);
    };

    this.setPos = function(lat, lon, scale) {
        if (scale === undefined) {
            scale = 15;
        }
        if (this.map !== undefined) {
            this.map.setView([lat, lon], scale);
        }
    };

    this._create = function(lat, lon, scale) {
        if (scale === undefined) {
            scale = 15;
        }

        if (this.map !== undefined) {
            return;
        }

        //$(Self.tagId).html('<div id="mapAddr" style="width: ' + width + 'px; height: ' + height + 'px; border: 1px solid #83869c;"></div>');
        $(Self.tagId).html('<div id="mapAddr" style="width: ' + $(Self.tagId).width() + 'px; height: ' + $(Self.tagId).height() + 'px; border: 1px solid #83869c;"></div>');

        this.map = L.map('mapAddr').setView([lat, lon], scale);


        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(this.map);

        this.map.on('moveend',function(e){
            // here i get southwest & northeast data how to get lat & lng & zoom level
            //var map = e.target;
            //var bounds = map.getBounds();
            //console.log(Self.map.getBounds());
            var center = Self.map.getCenter();
            //выполняем обсервер
            Self._onMoveEndObs.exec(center.lat, center.lng, Self.map.getZoom());
        });


        /*
        L.marker([55.030199, 82.920430]).addTo(this.map)
            .bindPopup('Город')
            .openPopup();
        */






        this.map.on('click', function(event){
            //выполняем обсервер
            Self._onClickObs.exec(event.latlng.lat, event.latlng.lng);

            /*
            if (Self.isManualSetMarker) {
                if (Self.marker === undefined) {
                    Self.marker = L.marker(event.latlng).addTo(Self.map);
                }
                Self.marker.setLatLng(event.latlng);
                if (Self.callbackSetMarker !== undefined) {
                    Self.callbackSetMarker(event.latlng.lat, event.latlng.lng);
                }
            }
            */

            /*
            var coord = event.latlng;


            var lat = coord.lat;
            var lng = coord.lng;

            console.log("You clicked the map at latitude: " + lat + " and longitude: " + lng);

            if (markerClick !== undefined) {
                markerClick.remove();
            }

            markerClick = L.marker(event.latlng).addTo(Self.map);
            */
        });
    };

    this._create(lat,lon,scale);

};

var MapAddrMarker = function(map) {
    var Self = this;
    this._map = map;
    this._marker = map;
    this._onClickObs = new Observer(); //обсервер клика на маркер
    this._lat = 0;
    this._lon = 0;
    this._text = undefined;

    this.setPos = function(lat, lon) {
        this._lat = lat;
        this._lon = lon;
        var pos = {
            lat: this._lat,
            lng: this._lon
        };
        Self._marker.setLatLng(pos);
        Self._marker.on("click", function (event) {
            //выполняем обсервер
            Self._onClickObs.exec();
        });
    };

    this.setText = function(text, isOpen) {
        this._text = text;
        if (isOpen === undefined) {
            isOpen = false;
        }
        this._marker.bindPopup(this._text);
        if (isOpen) {
            this._marker.openPopup();
        }
    };

    this.openText = function() {
        if (this._marker !== undefined) {
            this._marker.openPopup();
        }
    };

    this.onClick = function (callback) {
        this._onClickObs.add(callback);
    };

    this._constructor = function () {
        var pos = {
            lat: this._lat,
            lng: this._lon
        };
        Self._marker = L.marker(pos).addTo(Self._map);
    };
    this._constructor();
};