var tcHistory = new Object({
    tempAjax: null,
    onAction: false,
    actions: {'add': function(actionName,func){
        if(tcHistory.actions[actionName]==null){
            tcHistory.actions[actionName] = {};
            tcHistory.actions[actionName]['func'] = func;
            tcHistory.actions[actionName]['params'] = '';
            tcHistory.actions[actionName]['result'] = '';
        }
    }},
    results: {},
    hash: '',
    event: 'update', // update [default], link, action, checkHash
    work: false,
    ajax: function(URL){
        if(this.tempAjax!=null){
            this.tempAjax.abort();
        }
        this.tempAjax = tc.ajax(URL,{async:true}).success(function(data){
            $('#_center').html(data);
        });
        return this.tempAjax;
    },
    parseToURL: function(href){
        //return document.location.toString().substr(0, document.location.toString().indexOf('#')) + 'ajax' + href.substr(1);
        var URL = document.location.protocol+'//';
        URL += document.location.host;
        URL += '/ajax' + href.substr(1);
        return URL;
    },
    link: function(obj) {
        var href = $(obj).attr('href');
        tcHistory.hash = href;
        tcHistory.event = 'link';
        var URL = tcHistory.parseToURL(href);
        tcHistory.ajax(URL).success(function(data){
            tcHistory.results[URL] = data;
        });
    },
    action: function(obj,func) {
        var href = $(obj).attr('href');
        tcHistory.hash = href;
        tcHistory.event = 'action';
        var actionStr = href.substr(href.indexOf('/')+1);

        tcHistory.actions.add(actionStr,func);
        
        tcHistory.actions[actionStr]['func']();
    },
    setHash: function(addrAction){
        tcHistory.onAction = true;
        document.location.hash='#action/'+addrAction;
    },
    checkHash: function(){
        if (document.location.hash != tcHistory.hash){
            tcHistory.event = 'checkHash';                
            tcHistory.hash = document.location.hash;
            var comm = tcHistory.hash.substr(0,tcHistory.hash.indexOf('/')+1);
            switch(comm){
               case '#/':
                  URL = tcHistory.parseToURL(tcHistory.hash);
                  if(tcHistory.results[URL]==null){
                      tcHistory.ajax(URL).success(function(data){
                          tcHistory.results[URL] = data;
                      });
                  } else {
                      $('#_center').html(tcHistory.results[URL]);
                  }
                  break
               case '#action/':
                  if(tcHistory.onAction==false){
                    actionStr = tcHistory.hash.substr(tcHistory.hash.indexOf('/')+1);
                    if(tcHistory.actions[actionStr]!=null){
                        tcHistory.actions[actionStr]['func']();
                    }  
                  } else {
                    tcHistory.onAction = false;
                  }
                  break
               case '':
                  document.location.reload(false);
                  break
               default:
                  //
                  break
            }                
        }
    },
    run: function(){
        setInterval(tcHistory.checkHash, 500); 
    }
});

var hs = tcHistory;

$(document).ready(function() {
    hs.run();
});