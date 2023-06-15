var waTree = function(tagId,varName){
    this.name = varName;
    this.id = "#"+tagId;
    this.tagId = tagId;
    this.data = {};    // данные в виде иерархического дерева
    this.dataArray = new Array(); // сдесь будут храниться ссылки на объекты дерева
    this.address = ""; // адрес получения данных
    this.params = "";  // необходимые параметры
    this.statusMessage = ""; // статус сообщение
    this.select = -1;  // id выделенной  записи
    this.selNode = null;  // ссылка на объект выделенного узла
    this.count = 0;    // общее количество узлов
    this.open = true; // выводить в открытом или закарытом состоянии
    this.openArray = {}; // список открытых и закрытых узлов дерева
    this.buidOn = false;
    this.params = {};
    this.path = '/images/';
    
    this.readPkg = function(_pkg){
        //this.fields =           _pkg.package['id'];
        //this.fields =           _pkg.package['id_parent'];
        this.fields =           _pkg.package['fields'];
        //this.data =             _pkg.package['data'];
        this.parseArray(_pkg.package['data']);
        this.count =            _pkg.package['count'];
        //this.params =           _pkg.package['params'];
        
        if(this.buidOn==true)
            this.dataDraw()
        else this.build();
    }
    
    this.getPkg = function(){
        var _pkg = pkg.instance(this.dataArray)
                    .fields(this.fields)
                    //.data(this.dataArray)
                    .count(this.count);
        _pkg.package['params'] = this.params;
        return _pkg;
    }
    
    this.loadData = function(){
        var Self = this;
        // запрос к серверу через движок waEngine
        tc.ajax(Self.address,{async:true,data:'pkg='+Self.getPkg().asJSON()}).success(function(data){
            Self.readPkg(pkg.instance().parse(data));
        });
    }
        
    this.parseArray = function(dataArr){
        this.data = dataArr;
        var tempData = {};
        for(var i in this.data){
            tempData[this.data[i]["id"]] = this.data[i];
            this.dataArray[this.data[i]["id"]] = this.data[i];
            // прверяем есть ИД элемента в массиве для открытия, если нет, то используем переменную поумолчанию
            if(this.openArray[this.data[i]["id"]]!=null){
                tempData[this.data[i]["id"]]["open"] = this.openArray[this.data[i]["id"]];
            } else
                tempData[this.data[i]["id"]]["open"] = this.open;
        }
        // заполняем дочерние массивы каждого элимента
        for(var id in tempData){
            // если еть родительский элемент, то добавляем текущий к нему в дочерние
            if(tempData[tempData[id]["id_parent"]]!=null){
                // если дочерний элемент не создан, то создаём его
                if(tempData[tempData[id]["id_parent"]]["child"]==null)
                    tempData[tempData[id]["id_parent"]]["child"] = {};
                tempData[tempData[id]["id_parent"]]["child"][id] = tempData[id];
            }
        }
                
        this.data = null;
        this.data = {};
        
        // оставляем только элементы у которых нет родительских
        for(var i in tempData){            
            if(tempData[tempData[i]["id_parent"]]==null){
                this.data[i] = tempData[i];
            }
        }
        
        tempData = null; // очищаем временную переменную
    }
    
    this.getData = function(){
        var Self = this;
        // запрос к серверу через движок waEngine
        tc.params = this.params;
        tc.ajax(Self.address,{async:true}).success(function(data){
            Self.buildTree(data);
        });
    }
    
    this.getNodeById = function(idNode){
        return this.dataArray[idNode];
    }
    
    this.openChild = function(idData,_open){
        if (!_open) _open = false;
        var node = this.getNodeById(idData);
        if(node['open'] == true && _open == false){
            $('#'+this.name+'_'+idData+'_child').slideUp();
            node['open']= false;
            this.openArray[idData]= false; // сохраняем в массив
            $('#'+this.name+'_'+idData+'_openBt').css('backgroundImage','url('+this.path+'node_close.png)');
        } else {
            $('#'+this.name+'_'+idData+'_child').slideDown();
            node['open']= true;
            this.openArray[idData]= true; // cохраняем в массив
            $('#'+this.name+'_'+idData+'_openBt').css('backgroundImage','url('+this.path+'node_open.png)');
        }
    }

    // функция для перехвата, по выделению элимента
    this.onChange = function(node){
    }
    
    this.nodeSelect = function(idData,_open){
        var Self = this;
        
        function recurOpen(idNode){ //???????????????
            var nodeForOpen = Self.getNodeById(idNode);
            if(nodeForOpen!=null){
                $('#'+Self.name+'_'+idNode+'_child').show();
                nodeForOpen['open'] = true;
                if(parseInt(nodeForOpen['id_parent'])>0){
                    recurOpen(nodeForOpen['id_parent']);
                }
            }        
        }
        
        var node = this.getNodeById(idData);
        if(node!=null){        
            if(this.selNode!=null){
                $('#'+this.name+'_'+this.selNode['id']+'_nodeLink').attr('class','nodeLink');
            }
            this.select = idData;
            this.selNode = node;
            $('#'+this.name+'_'+this.selNode['id']+'_nodeLink').attr('class','nodeLink nodeLinkSelected');
            if(node['child']!=null)
                this.openChild(idData,_open);
            this.onChange(node);
            
            //recurOpen(idData); //???????????????
        } else {
            if(this.selNode!=null){
                $('#'+this.name+'_'+this.selNode['id']+'_nodeLink').attr('class','nodeLink');
            }
            this.select = -1;
            this.selNode = null;
        }
    }
    
    // функция для отрисовки нода, можно подменять и рисовать самому
    this.nodeDraw = function(node){
        return '<a href="javascript: void(0)" id="'+this.name+'_'+node['id']+'_nodeLink" onclick="'+this.name+'.nodeSelect(\''+node['id']+'\')" class="nodeLink">'+
            //'<img class="waTree_icon" src="/images/ico_cat/32/'+node["icon"]+'">&nbsp;'+
            node["name"]+'</a>';
    }
    
    this.dataDraw = function(){
        var Self = this;
        var content = '';
        function beginNode(Node){
            var display = '';
            var imgBg = '';
            if(Node['open']==false){
                display = 'none';
            }
            
            if(Node["child"]!=null){
                imgBg = 'url('+Self.path+'node_open.png)';
                if(Node["open"]==false){
                    imgBg = 'url('+Self.path+'node_close.png)';
                }
            } else imgBg = 'none';

            return  '<div id="'+Self.name+'_'+Node['id']+'_node" class="waTree_node"> \
                        <div class="waTree_openBt" id="'+Self.name+'_'+Node['id']+'_openBt" onclick="'+Self.name+'.openChild(\''+Node['id']+'\')" style="background: '+imgBg+'"></div> \
                        <div class="waTree_caption">'+Self.nodeDraw(Node)+'</div> \
                        <div class="waTree_nodes_child" id="'+Self.name+'_'+Node['id']+'_child" style="display: '+display+'">';
        }   
        function endNode(){
            return  '</div></div>';  
        }
        function recur(data){
            for(var i in data){
                content += beginNode(data[i]);
                recur(data[i]["child"]);
                content += endNode();
            }
        }
        // перебираем корневые элементы дерева
        var i;
        for(var i in this.data){
            content += beginNode(this.data[i]);
            recur(this.data[i]["child"]);
            content += endNode();
        }
        
        $('#'+this.tagId+'_content').html(content);
    }
    
    this.build = function(){
        if(this.buidOn == false){
            var style = '<style> \
                            .waTree_node {} \
                            .waTree_openBt {width: 18px; height: 18px; float: left; cursor: pointer}\
                            .waTree_caption {margin-left: 20px; min-height: 22px;} \
                            .waTree_icon {vertical-align: middle; width: 18px} \
                            .nodeLink {color: black; background: none; min-height: 22px; display: block; margin-bottom: 2px} \
                            .nodeLink_ {color: black; background: #EEEEEE; min-height: 22px; display: block; margin-bottom: 2px} \
                            .nodeLink:hover {background: #5454FF; color: white} \
                            .nodeLinkSelected {background: blue; color: white} \
                            .waTree_nodes_child{padding-left: 30px} \
                        </style>';
            $(this.id).append(style);
            $(this.id).append('<div id="'+this.tagId+'_content"></div>');
            this.dataDraw();
            this.buidOn = true;
        }
    }
    
    this.run = function(){
        this.build();
    }

};
