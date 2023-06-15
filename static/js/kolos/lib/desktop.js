var desktop = {
    tagId: '',
    name: '',
    build: function(tagId){
        this.tagId = tagId;

        var s = '';

        s += '<div id="div_navig" style="border-bottom: 1px solid #79BCFF; padding-bottom: 5px; margin-bottom: 5px" align="left"> \n\
                 Результат поиска \n\
                 </div>';
        s += '<div id="div_out" style=" padding-bottom: 5px; margin-bottom: 5px" align="left"></div>';

        $('#_center').html(s);

    },
    drawProducts: function(data){
        desktop_drawProducts(data);
    },//drawProducts
    drawCats: function(data){
        //
    }//drawCats
}

var desktop_drawProducts = function(data){
    var str = '';
        for(var i in data){
            var p = data[i];
            p['unit'] = 'руб.';
            str += desktop_drawProducts_item(p);
        }
        $('#div_out').html(str);
}
var desktop_drawProducts_item = function(product){
    var s = '';
    s += '<div class="product_item radius">';
    s += '        <a href="#/catalog/" onclick="hs.link(this);">';
    s += '            <div style="height: 145px">';
    s += '               <img width="145" src="/images/goods/sre/'+product['imageDefault']+'">';
    s += '            </div>';
    s += '            <div class="gtLineName">'+product['name']+'</div>';
    s += '            <div class="gtLinePrice"><b style="font-size: 17px">'+product['price_final']+' '+product['unit']+'</b></div>';
    s += '            <div>Count Volume</div>';
    s += '            <div><br></div>';
    s += '        </a>';
    s += '        <div><a href="#">shopName</a></div>';
    s += '        <br><div>Cat: <a href="#/catalog/">Category</a></div>';
    s += '</div>';
    return s;
}

//desktop.;