var waTable = function(tagId,varName){
    this.name = varName;
    this.tagId = tagId;
    this.fields = {};
    this.fields_hidden = {};
    this.data = {};
    this.address = "";
    this.options = {};
    // специфические параметры
    this.select = -1;
    this.count = 0;
    this.offset = 0;
    this.rows = -1;
    this.buidOn = false;
    this.pages = '';
    this.params = {};
    
    this.readPkg = function(_pkg){
        this.fields =           _pkg.package['fields'];
        if(_pkg.package['params']['fields_hidden'] == null)
            this.fields_hidden =    {}
        else
            this.fields_hidden =    _pkg.package['params']['fields_hidden'];
        this.data =             _pkg.package['data'];
        this.count =            _pkg.package['count'];
        this.offset =           _pkg.package['offset'];
        this.rows =             _pkg.package['rows'];
        
        //if(_pkg.package['params']!=null)
        if(_pkg.package['params']!='')
            this.params = _pkg.package['params'];
        
        if(this.buidOn==true)
            this.dataDraw()
        else this.build();
    }
    
    this.getPkg = function(){
        
        var pkg_tmp = pkg.instance()
                        .fields(this.fields)
                        //.fields_hidden(this.fields_hidden)
                        .data(this.data)
                        .count(this.count)
                        .limit(this.offset,this.rows);
                        //.offset(this.offset)
                        //.rows(this.rows);
        pkg_tmp.package['params'] = this.params;
        return pkg_tmp;
    }

    this.loadData = function(){
        var Self = this;
        Request(Self.address)
            .send(Self.getPkg().data({}).fields({}).package)
            .ready(function(data){
                Self.readPkg(pkg.instance(data));
            });
    }
    
    this.update = function(){
        this.loadData();
    }
    
    this.pageOut = function(pos){
        this.offset = (pos-1) * this.rows;
        //this.update();
        this.loadData();
    }
    
    // функция для вывода номеров страниц
    this.setPages = function(){
        if((this.count > this.rows)&&(this.rows > 0)){
            s = "Страницы: <div style=\"padding:4px\">";
            s = s + '<a href="javascript: '+this.name+'.pageOut(1)">(1) </a> ... ';
            pCount = Math.ceil(this.count / this.rows);
            pPos = this.offset/this.rows;
            
            s = s + '<a href="javascript: '+this.name+'.pageOut('+(pPos)+')"> [<] </a> | ';
            var i;
            for(var i=1;i<=pCount;i++){
                if((pPos <= i+2) && (pPos >= i-4)){
                    if(pPos+1 == i)
                    s = s + '<a href="javascript: '+this.name+'.pageOut('+i+')"><b style="color: red">['+i+']</b> </a>';
                    else
                    s = s + '<a href="javascript: '+this.name+'.pageOut('+i+')">['+i+'] </a>';
                }
            }
            
            s = s + ' | <a href="javascript: '+this.name+'.pageOut('+(pPos+2)+')"> [>] </a>';
            //s = s + ' ... <a href="javascript: '+this.name+'.pageOut('+pCount+')">('+this.count+') </a>';
            s = s + ' ... <a href="javascript: '+this.name+'.pageOut('+pCount+')">('+pCount+') </a>';
            s += '</div>';
            this.pages = s;
        } else {
            this.offset = 0;
            this.pages = "";
        };
        
        if(this.offset > this.count){
            this.offset = 0;
        }
        
        $("#wat_pg1_"+this.tagId).html(this.pages);
        $("#wat_pg2_"+this.tagId).html(this.pages);
    }
    
    this.addOption = function(methodName,caption){
        this.options[methodName] = caption;
    }
    
    this.cellDraw = function(id,index,cell){
        return this.data[index][cell];
    }
    
    this.dataDraw = function(){        
        var line = ''
        // построение заголовка с полями
        line += '<tr class="wat_fh">';
        for(key in this.fields){ // заголовок
            line += '<td>'+this.fields[key]+'</td>';
        }
        line += "</tr>";
        // строим таблицу данных
        var i_color = 0;
        for(var index in this.data){
            // начинаем линию
            if(i_color % 2 == 0){
                line += '<tr class="wat_tr" bgcolor="white"   id="wat_tr_'+ index + this.tagId +'">';
            } else
                line += '<tr class="wat_tr" bgcolor="#EFEFEF" id="wat_tr_'+ index + this.tagId +'">';
            
            // выводим ячейки
            for(var cell_key in this.fields){
                line += "<td style=\"vertical-align: middle\">" + this.cellDraw(this.data[index]['id'],index,cell_key) + "</td>";
            }
            
            // выводим опции
            for(var method in this.options){
                line += '<td><a href="javascript: void(0)" onclick="'+this.name+'.'+method+'('+this.data[index]["id"]+','+index+')">' + this.options[method] + '</a></td>';
            }
            i_color++;
        }
        // закрытие линии
        line += "</tr>";
        
        $('#'+this.tagId+'_content').html(line);
        
        this.setPages();
    }
    
    this.clear = function(){
        this.offset = 0;
        $('#'+this.tagId+'_content').html(' ');
    }
    
    this.build = function(){
        if(this.buidOn == false){
            var style = '<style> .waTable tr.wat_fh {font-weight: bold; background: url(/images/ft.png); height: 20px; white-space: nowrap} .waTable tr.wat_tr:hover {background: #79BCFF} .waTable tr td {vertical-align: middle; padding: 2px; height: 15px; border-bottom: 1px solid silver; border-right: 1px dashed silver;} </style>';
            $('#'+this.tagId).append('<div id="'+this.tagId+'_frame"></div>');
            $('#'+this.tagId+'_frame').append(style);
            $('#'+this.tagId+'_frame').append('<div id="wat_pg1_'+this.tagId+'"></div>');
            $('#'+this.tagId+'_frame').append('<table id="'+this.tagId+'_content" class="waTable" border="0" cellpadding="0" cellspacing="0" style="width: 100%"></table>');
            $('#'+this.tagId+'_frame').append('<div id="wat_pg2_'+this.tagId+'"></div>');
            this.dataDraw();
            this.buidOn = true;
        }
    }
    
}