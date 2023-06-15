
Class_pkg = function(obj){
    if(obj == null || typeof(obj) != 'object')
        return obj;
    var cls = new obj.constructor();
    cls.prototype = obj.prototype;
    for(var key in obj)
        cls[key] = Class_pkg(obj[key]);
    return cls;
}


var pkg = new function(){
    this.package = {
        'pkg_name':'pkg_name',
        'id':'',
        'id_parent':'',
        'fields':{},
        'data':{},
        'params':{},
        'offset':0,
        'rows':0,
        'count':0
    };
    
    this.instance = function(pkg_val){
        //var new_pkg = $.extend({}, pkg);
        var new_pkg = Class_pkg(pkg);
    
        if((typeof(pkg_val)=='object')||(typeof(pkg_val)=='Array')){
            if(pkg_val['pkg_name']=='pkg_name'){
                new_pkg.package = pkg_val;
            } else
                new_pkg.package['data'] = pkg_val;
        } else {
            tmp_val = eval('('+pkg_val+')');
            if(tmp_val != null)
                if(tmp_val['pkg_name']=='pkg_name'){
                    new_pkg.package = tmp_val;
                } else
                    new_pkg.package['data'] = tmp_val;
        }
        return new_pkg;
        //return $.extend({}, pkg);
        //return $.extend({}, new_pkg);
    }
    this.reset = function(){
        this.package = {
            'pkg_name':'pkg_name',
            'id':'id',
            'id_parent':'id_parent',
            'fields':{},
            'data':{},
            'params':{},
            'offset':0,
            'rows':0,
            'count':0
        };
        return this;
    }
    this.parse = function(json){ // парсим json
        var tmp = eval('('+json+')');
        for(var i in tmp){
            this.package[i] = tmp[i];
        }
        return this;
    }
    this.id = function(id){
        this.package['id'] = id;
        return this;
    }
    this.id_parent = function(id_parent){
        this.package['id_parent'] = id_parent;
        return this;
    }
    this.fields = function(fields){
        this.package['fields'] = fields;
        return this;
    }
    this.data = function(data){
        this.package['data'] = data;
        return this;
    }
    this.limit = function(offset,rows){
        this.package['offset'] = offset;
        this.package['rows'] = rows;
        return this;
    }    
    this.count = function(count){
        this.package['count'] = count;
        return this;
    }    
    this.params = function(key,value){
        this.package['params'][key] = value;
        return this;
    }
    this.asArray = function(){
        return this.package;
    }
    this.asJSON = function(){
        return $.toJSON(this.package);
    }
}

// функции для работы с пакетами
var pkg_tools = new function(){
    this.pasteToForm = function(idForm,data){        
        for(var i in data){
            var val = data[i];
            $("#"+idForm+" [name='"+ i +"']").val(val);
        }
    }
    this.getForm = function(idForm,fields){
        var data = {};
        for(var i in fields){
            data[i] = $("#"+idForm+" [name='"+ i +"']").val();
        }
        return data;
    }
}

