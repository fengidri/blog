$(document).ready(function(){
    index_init($('#index'), $('#wrap'), $('#index_switch'));
    //网页打开的时候, 如果必要关闭index
    close_index();
    // 当窗口的大小发生变化的时候, 如果必要关闭index
    window.onresize = close_index;

    $('#print').click(function(){
        set_pages_mode($('#wrap'));
        window.print();
    })
});
size = {
    mmperpx : 0,
    mmtopx : function(mm)
    {
        if (self.mmperpx == 0)
        {
            var t = $('<div>').css('width', '1mm').css('display','none');
            $('body').append(t)
            self.mmperpx = float(t.width())
        }
        //return mm * self.mmperpx
    },
    pagehigth: function()
    {
        return 1180;

    }
}

// 用于设置为pages模式
function set_pages_mode(content)
{
    $('#index').hide();
    $('#index_switch').hide();
    $('#print').hide();
    $('#wrap').css('border-width', '0')
    $('div#sub_wrap').css('border-width', '0')
    hs = content.find('h3');
    //var i;
    //for (i=0; i< hs.length - 1; i++)
    //{
    //    ch = hs[i];
    //    nh = hs[i+1];

    //}
}

function close_index(){
    //防止index 挡住了内容
    var left1;
    var left2;
    left1 = $('#index').offset().left + $('#index').width();
    left2 = $('#wrap').offset().left;
    if( left1 > left2) {
        $('#index').hide();
    }
    else{
        $('#index').show();
    }
}

$('.mr_name').hover(function(){
    var img;
    if (this.selfimg == undefined){
        img = this.selfimg = $("<img>");
        img.attr('src', 'images/dxf.jpg');
        img.css('position', 'absolute');
        img.css('border', "5px solid grey");
        $('body').append(img);
        img.css('top', $(this).offset().top + 50);
        img.css('left', $(this).offset().left + 100);
    }
    this.selfimg.show()

}, function(){
    if (this.selfimg != undefined){
        this.selfimg.hide();
    }
}
);
