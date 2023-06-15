var catalog = {
params: params,
ajax: null,
data: {}, // data,page,rows,count,categories(node)
search: function(){
    if(catalog.ajax != null) catalog.ajax.abort();

    params['str'] = rawurlencode($('#sInput').val());

    catalog.ajax = $.ajax({
        type: 'POST',
        url: '/ajax/catalog/search',
        async: true,
        data: 'params='+$.toJSON(params),
        beforeSend: function(){
            messages.loading.show('catalog_ajax','Загрузка данных...');
        },
        success: function(data){
            //$('#_center').html(data);
            //$('#_center').html('SEND: ' + $.toJSON(params) + '<br><br><br> RESULT: ' + data);

            try {
                catalog.data = eval('('+data+')');
                catalog.outResult();
            } catch (exception_var){
                $('#_center').prepend('catalog_ajax: Ошибка преобразования результата в массив! <br><br><br>');
            } finally {
                //catalog.outResult();
            }
        },
        complete: function(){
            messages.loading.hide('catalog_ajax');
        }
    });
},
setStr: function(){
    params['str'] = rawurlencode($('#sInput').val());
},
setParams: function(){ // сохраняет параметры в сессию
    request('/ajax/catalog/setParams')
        .send(params)
        .ready(function(data){
            //
        });
},
getCity: function(){ // определение города    
    var id_city = getCookie('id_city');
    if(id_city!=null){
        params['id_city'] = getCookie('id_city');
        params['name_city'] = getCookie('name_city');
    } else {
        // здесь надо будет взять определение из PHP
        //params['id_city'] = 3940;
        //params['name_city'] = 'Новокузнецк';

        setCookie('id_city', params['id_city']);
        setCookie('name_city', params['name_city']);

        /* // определение города
        $.getJSON('http://jsonip.appspot.com',
            function(result) {
                var ip = result.ip;
                $.ajax({
                    type: "GET",
                    url: "http://ipgeobase.ru:7020/geo?ip=" + ip,
                    dataType: "xml",
                    success: function(xml) {
                        //var region = $(xml).find('region').text();
                        var city = $(xml).find('city').text();
                        alert(city);
                    }
                });
            }
        );
        */

    }
    // устанавливаем город на панеле
    $('#name_city').html(params['name_city']);
    $('#name_city').attr('id_city', params['id_city']);
    return params['id_city'];
},
setCity: function(id_city,name_city){
    // устанавливаем город
    if(id_city != 'undefined'){
        params['id_city'] = id_city;
        $('#name_city').attr('id_city',params.id_city);
    }
    if(name_city != 'undefined'){
        params['name_city'] = name_city;
        $('#name_city').html(params.name_city);
    }
    
    setCookie('id_city', params['id_city']);
    setCookie('name_city', params['name_city']);
},
outResult: function(){
    /*
    var s = '<div style="border-bottom: 1px solid #79BCFF; padding-bottom: 5px; margin-bottom: 5px" align="left"> \n\
    Результат поиска \n\
    </div>';
    $('#_center').html(s);
     */
    desktop.build('_center');
    desktop_drawProducts(catalog.data['data']);
}
}