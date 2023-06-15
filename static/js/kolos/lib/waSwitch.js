var waSwitch = function(tagId,varName){
    this.name = "";
    this.id = "#"+tagId;
    this.tagId = tagId;
    // ������������� ��������� --->
    this.switchs = new Array();
    this.add = function(caption,funct){
        var i = this.switchs.length;
        this.switchs[i] = {};
        this.switchs[i]['caption'] = caption;
        this.switchs[i]['funct'] = funct;
        this.switchs[i]['id'] = this.tagId+'_'+i+this.tagId;
        this.update();
    }
    this.reset = function(){
        for(var i in this.switchs){
            $('#'+this.switchs[i]['id']).attr('style','');
        }
    }
    this.sw = function(id){
        this.reset();
        $('#'+this.switchs[id]['id']).attr('style','border: 1px solid #FF6600; background: #FFE9DA; padding-top: 7px; padding-bottom: 7px');
    }
    this.getName = function(){
        return varName;
    }
    this.update = function(){
        var s = '';
        for(var i in this.switchs){
            s += '<a href="javascript: void(0)" id="'+this.switchs[i]['id']+'" class="linkBt wa_link_plugBt" onmousedown="'+this.name+'.sw('+i+'); '+this.name+'.switchs['+i+'][\'funct\']();">'+this.switchs[i]['caption']+'</a>'
        }
        $("#wabar"+this.tagId).html(s);
    }
    this.init = function(){
        // ��������� �����
        this.name = this.getName();
        $("#"+this.tagId).html('<div id="wabar'+this.tagId+'" style="padding: 2px;">������ �������������</div>');
    }   
    this.run = function(){
        this.init();
        this.update();        
    }
};
