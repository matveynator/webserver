var Autocomplete = function(tagId,address, fieldView){
    var Self = this;
    this.minLen = 3;
    //--
    this._id = GlobalObjects.add(this); //добавляем в глобальную систему объектов
    this._tagId = GlobalObjects.getTagId(Self._id);
    this._tag = undefined; //задаётся при создании
    this._inputTagId = tagId;
    this._inputTag = $(tagId);
    this._address = address;
    this._fieldView = fieldView;
    this._lastAjax = undefined;
    this._mouseIn = false;
    this._str = '';
    this._selIndex = -1;
    this._lastStr = '';
    this._count = 0;
    this._data = {};
    this._indexesKeys = {}; //ключи сложенные по порядку
    this._selKey = undefined; //выбранный ключ
    this._selItem = undefined; //выбранные данные
    this.visible = false;
    //this.active = false;
    this._timer;

    this._style = '<style> \n\
                    /*.divRootAuc {background: white; border: 1px solid gray; padding: 2px; cursor: pointer;}*/ \n\
                    .divRootAuc {background: white; box-shadow: 0px 1px 2px 0px rgba(100,100,100,0.5); padding: 2px; cursor: pointer;} \n\
                    .divRootAuc .aucItem .aucIt {padding: 2px; border: 1px solid white} \n\
                    .divRootAuc .aucItem .aucIt:hover {border: 1px solid #bae5fd; } \n\
                    .divRootAuc .aucItem.sel .aucIt {padding: 2px; border: 1px solid #bae5fd; background: #def3ff;} \n\
                    .divRootAuc .aucItem .aucIt a {color: black;}\n\
                    .divRootAuc .aucItem .aucIt a span {color: gray;}\n\
                  </style>';


    this._timeOutGet = undefined; //таймаут для получения данных
    this._timeOutUpdate = undefined; //таймаут для обновления данных во время ввода (пока вводе ещё не закончен)
    this._needGetData = false; //флаг, что необходимо получить данные

    this._timerCycle = function() {
        if (this._needGetData) {
            if (this._timeOutGet === undefined) {
                this._timeOutGet = DateTool.setTimeout(1000);
            }
            if (this._timeOutUpdate === undefined) {
                this._timeOutUpdate = DateTool.setTimeout(1000);
            }

            if (this._str.length < this.minLen) {
                //если недостаточное кол-во символов, то скрываем
                this._needGetData = false;
                this.hide();
            } else if (DateTool.checkTimeout(this._timeOutGet)) {
                //если закончили ввод и вышел таймаут на получение, выводим данные
                this._needGetData = false;
                this._getData();
            } else if (DateTool.checkTimeout(this._timeOutUpdate)) {
                //если пришло время обновить, обновляем данные не смотря на незаконченный ввод
                this._timeOutUpdate = DateTool.setTimeout(1000);
                this._needGetData = false;
                this._getData();
            }
        }
    };

    this._update = function(){
        this._str = this._inputTag.val();
        if (this._str.length >= this.minLen){
            //при каждом обновление сбрасываем таймаут на выборку данных
            this._timeOutGet = DateTool.setTimeout(500);
            //выставляем флаг, что нужно получить данные
            this._needGetData = true;
        } else {
            this.hide();
        }
    };



    this._getData = function(){
        var Self = this;
        if(Self._lastAjax !== undefined) Self._lastAjax.abort();

        //показываем загрузчик
        this._showLoader();

        Self._lastAjax = $.ajax({
            type: "POST",
            url: Self._address,
            async: true,
            data: 'str=' + Self._str + '&' + objToParams(this._params),
            success: function(data){
                var dataResult = undefined;
                try {
                    dataResult = eval('('+data+')');
                    Self._setData(dataResult);
                    Self._showData(dataResult);
                } catch (exception_var){
                    //
                }
            },
            error: function(xhr, status){
                //Self.hide();
                //$('#'+Self.id).html("Ошибка!");
            }
        });
    };

    this._setData = function(data) {
        this._data = data;
        this._indexesKeys = [];
        var index = 0;
        //индексируем ключи (кладём по порядку)
        for (var key in this._data) {
            this._indexesKeys[index] = key;
            index++;
        }
    };

    //получить ключ по индексу в списке
    this.getKeyByIndex = function (index) {
        return this._indexesKeys[index];
    };

    //получить ключ по индексу в списке
    this.getDataByIndex = function (index) {
        var key = this.getKeyByIndex(index);
        if (key !== undefined) {
            return this._data[key];
        }
    };

    this._clickSelect = function (index) {
        this.select(index);
        this.hide();
    };

    this.select =function(index) {
        if (index <= -1) {
            //сбрасываем выделенные данные
            this._selKey = undefined;
            this._selItem = undefined;
            //сбрасываем строку на изначальную
            if (this._lastStr !== '') {
                this._inputTag.val(this._lastStr);
            }
        } else {
            //запоминаем выделенные данные
            this._selKey = this.getKeyByIndex(index);
            this._selItem = this.getDataByIndex(index);
            //извлекаем нужное значение для отображения в input
            var value = this._extractValue(this._selItem);
            //отображаем в input
            this._inputTag.val(value);
        }

        if (this._onSelect !== undefined) {
            this._onSelect(this._selKey, this._selItem);
        }
    };

    //вызывается при выборе элемента из списка
    this._onSelect = undefined;
    //задаёт обратный вызов при выборе элемента из списка
    this.onSelect = function (callback) {
        this._onSelect = callback;
        return this;
    };

    //вызывается при скрытие списка
    this._onHide = undefined;
    //задаёт обратный вызов при скрытие списка
    this.onHide = function (callback) {
        this._onHide = callback;
        return this;
    };

    //отрисовка одной позиции
    this.drawItem = function(index, key, item) {
        return '<div class="aucIt">' + this._extractValue(item) + '</div>';
    };

    this._buildData = function() {

        this._count = 0; //сбрасываем кол-во, чтобы попутно посчитать
        var str = '';
        var item;
        var index = 0;
        for(var key in this._data){
            this._count++;
            item = this._data[key];
            str += '<div id="' + this._tagId + '_item' + index + '" class="aucItem ' + (index === this._selIndex ? 'sel' : '') + '" onmousedown="global.get(' + this._id + ')._clickSelect(\'' + index + '\')" onclick="global.get(' + this._id + ')._clickSelect(\'' + index + '\')">'
                + this.drawItem(index, key, item)
                + '</div>';
            index++;
        }
        Self._tag.html(str);

    };

    this._buildLoader = function() {
        var str = '';
        str += '<div id="' + this._tagId + '_loader" class="aucItem" >'
            + '<img class="icon" src="/static/img/load/load1.svg?v=v1.1" height="16">'
            + '</div>';
        Self._tag.html(str);
    };
    this._showLoader = function() {
        this._buildLoader();
        this._show();
    };

    this._show = function() {
        var offset = this._inputTag.offset();
        var x = offset.left;
        var y = offset.top + this._inputTag.outerHeight();

        Self._tag.width(this._inputTag.width() + 2);
        /*
        Self._tag.offset({
            top: y,
            left: x
        });
        */
        Self._tag.show();
        Self._tag.offset({
            top: y,
            left: x
        });
        this._visible = true;
    };

    this._showData = function (data) {
        this._data = data;
        this._buildData();
        this._show();
    };

    this._keyUp = function(){
        if(this._visible)
        {
            if(this._selIndex >= 0) {
                $('#' + this._tagId + '_item' + this._selIndex).attr('class','aucItem');
                this._selIndex--;
                $('#' + this._tagId + '_item' + this._selIndex).attr('class','aucItem sel');
            } else {
                $('#' + this._tagId + '_item' + this._selIndex).attr('class','aucItem');
                this._selIndex = -1;
                //$('#' + this._tagId + '_item' + this._selIndex).attr('class','aucItem');
            }

            //выбираем данные
            this.select(this._selIndex);
        }
    };

    this._keyDown = function(){
        if(this._visible && this._selIndex < this._count - 1){

            //запоминаем строку ввода
            if (this._selIndex <= -1) {
                this._lastStr = this._inputTag.val();
            }

            $('#' + this._tagId + '_item' + this._selIndex).attr('class','aucItem');
            this._selIndex++;
            $('#' + this._tagId + '_item' + this._selIndex).attr('class','aucItem sel');

            //выбираем данные
            this.select(this._selIndex);
        }
    };

    //по умолчанию берутся полностью данные, т.к. массив по умолчанию key: value
    this._extractValue = function(item) {
        if (
            item !== undefined
            && this._fieldView !== undefined
        ) {
            return item[this._fieldView]
        }
        return item;
    };


    this.hide = function() {
        this._tag.hide();
        this._selIndex = -1;
        this._visible = false;
        //отменяем необходимость получения данных
        this._needGetData = false;
        //отменяем ajax запрос
        if(this._lastAjax !== undefined) this._lastAjax.abort();
        if (this._onHide !== undefined) {
            this._onHide(this._selKey, this._selItem);
        }
    };

    // //--
    //
    // this._onBlur = [];
    // this._callOnBlur = function() {
    //     for (var i in this._onBlur) {
    //         this._onBlur[i]();
    //     }
    // };
    // this.onBlur = function(callback) {
    //     this._onBlur.push(callback);
    // };
    //
    // //--
    //
    // this._onKeyUp = [];
    // this._callOnKeyUp = function() {
    //     for (var i in this._onKeyUp) {
    //         this._onKeyUp[i]();
    //     }
    // };
    // this.onKeyUp = function(callback) {
    //     this._onKeyUp.push(callback);
    // };
    //
    // //--


    this.__construct = function() {
        $(function(){
            var body = $('body');
            body.prepend(Self._style);
            body.prepend('<div id="' + Self._tagId + '" class="divRootAuc" style="display: none; position: absolute; z-index: 9998"></div>');

            Self._tag = $('#' + Self._tagId);

            Self._tag.bind('mouseover', function(){
                Self._mouseIn = true;
            });

            Self._tag.bind('mouseout', function(){
                Self._mouseIn = false;
            });

            Self._inputTag.bind('blur', function(){
                if(!Self._mouseIn) {
                    Self.hide();
                }
            });

            //отключаем автозаполнение
            Self._inputTag.attr("autocomplete","off");

            Self._inputTag.keydown(function(e){
                switch(e.which){
                    case 40: //down
                        Self._keyDown();
                        break;
                    case 38: //up
                        Self._keyUp();
                        break;
                    case 27: //escape
                        Self.select(-1);
                        Self.hide();
                        break;
                    case 13: //enter
                        Self.hide();
                        break;
                    case 39: // стрелка ->
                        break;
                    default:
                        break;
                }

            });

            Self._inputTag.keyup(function(e){
                // если ненажаты эти клавиши
                if((e.which in {13:13,16:16,17:17,18:18,27:27,37:37,38:38,39:39,40:40}) === false) {
                    if(Self._str !== Self._inputTag.val()) { // если есть изменения в строке
                        Self._str = Self._inputTag.val();
                        Self._update();
                    }
                }
            });

            Self._timer = setInterval(function() {
                Self._timerCycle();
            }, 500);

        });
    };

    this.setParams = function(params) {
        this._params = params;
    };

    this.init = function() {
        this.__construct();
    };


};


// //заменяем отрисовку
// acInpCity.drawItem = function(index, key, item) {
//     return '<div class="aucIt">' + this._extractValue(item) + ' <br><span class="c-gray" style="font-size: 10px; padding-top: -6px;">(' + item['region'] + ')</span></div>';
// };