kolos.Controller = function(){
    var Self = this;

    this.ctrlName = ''; //имя контроллера
    this.varName = ''; //полное имя Controllers.[ctrlName]
    this.engine = {};
    this.path = '';
    this.view = {};
    
    
    // Блок отвечающий за загрузку методов с сервера ------------>>>>>>>
    this.ajax = null;
    this._ready = null;
    this.ready = function(fun){
        this._ready = fun;
    };
    this.server = function(methodName, data, hideWaitMsg){

        var Self = this;

        // если выполнялся ранее, то обрываем
        if(this.ajax != null) this.ajax.abort();

        var url = '/js/c/' + Self.ctrlName + '/' + methodName;

        setTimeout(function(){ // таймер чтобы дать время подцепить функцию ready
            Self.ajax = $.ajax({
                type: 'POST',
                //url: '/ajax/scripts/server',
                url: url,
                async: true,
                //data: 'controller=' + Self.varName + '&methodName=' + methodName + '&params='+encodeURIComponent($.toJSON(params)),
                data: 'data=' + encodeURIComponent($.toJSON(data)),
                beforeSend: function(){
                    //if(!hideWaitMsg) messages.loading.show('ctrl_server','Загрузка данных...');
                },
                error: function(xhr) {
                    if (Self._ready !== undefined) {
                        Self._ready(xhr.status + ' ' + xhr.statusText + "<br>\n" + xhr.responseText);
                    }
                },
                success: function(data){
                    if (Self._ready !== undefined) {
                        var dataResult = undefined;
                        try {
                            dataResult = eval('('+data+')');


                            //FIXME: Убрать! Или переделать в нормальную обработку
                            var debugDataAjax = '';
                            if (dataResult['profilers'] !== undefined) {
                                debugDataAjax += '<pre style="background: #fffddb;>' + url + "<br><br>" + dataResult['profilers'] + '</pre>';
                                Kolos.logInfo(dataResult['profilers']);
                            }
                            if (dataResult['errors'] !== undefined) {
                                debugDataAjax += '<pre style="background: #ffe5d2;">' + url + "<br><br>" + dataResult['errors'] + '</pre>';
                                Kolos.logInfo(dataResult['errors']);
                            }
                            $('#debugDataAjax').html(debugDataAjax);




                        } catch (exception_var){
                            dataResult = data;
                        }
                        try {
                            Self._ready(dataResult);
                        } catch (e) {
                            kolos.Utils.error('Error (controller request callback: ' + Self.ctrlName + '.' + methodName + '): , error: ' + e, true);
                        }
                    }

                    //if(Self._ready)
                    //        Self._ready(data);
                    /*
                    var data_arr = null;
                    try {
                        data_arr = eval('('+data+')');
                    } catch (exception_var){
                        if(Self._ready)
                            Self._ready(exception_var);
                    } finally {
                        if(Self._ready)
                            Self._ready(data_arr);
                    }
                    */
                },
                complete: function(){
                    //if(!hideWaitMsg) messages.loading.hide('ctrl_server');
                }
            });
        }, 50);

        return Self;
    };
    // Блок отвечающий за загрузку методов с сервера ------------<<<<<<<<<
    
    
    
    this.view.render = function(vName){
        /*
        if(Self.views[vName]==null){
            var src = Self.path+'views/'+vName+'.js';
            return Self.engine.ajax(src,{async: true}).complete(function(data){
                Self.views[vName] = data;
            });
        } else {
            return Self.views[vName];
        }
        */
    };
    
    this.init = function(ctrlName){
        this.ctrlName = ctrlName;
        this.varName = 'Controllers.' + ctrlName;


        //this.path = this.engine.path_root + 'controllers/';
        //this.engine.controllers[varName] = this;
        //Loader.loaded(varName);
    };
};
