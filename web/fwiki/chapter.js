function ShowChapter(ID)
{
    //var info = INFOS[ID];
    //var cls     = DIV_CHAPTER.find('#class');
    //var time    = DIV_CHAPTER.find('#time');
    //var title   = DIV_CHAPTER.find('#ctitle');


    //time.text(info.ctime);
    //cls.text(info.class);

    //if (!info.post)
    //{
    //    var t = $('<div>');
    //    t.css('background', 'red').css('border', '1px solid');
    //    t.css('padding', '1em').css('text-align', 'center');
    //    t.text('本文还没有正式发布');
    //    content.before(t);
    //    return;
    //}


    //var p = 'http://blog.fengidri.me/?id=' + ID;
    //title.html($('<a>').text(info.title).attr('href', p));

    //DIV_CHAPTER.show();

    CHAPTER_ID = ID;

    CHAPTER_URL = URL_PREFIX + ID;

    var url = CHAPTER_URL + '/index.html';
    var content = $('#content');

    $.ajax({
        url:url,
        async: false,
        success: function(data){
    console.log(url)
            content.html(data);
        }
    });
    index_init(DIV_INDEX, content, $('#index_switch'));
    content.find("pre").addClass("prettyprint");
    prettyPrint();
    // TODO 此时得到的index 的宽度总是1? 但是在resume里可以得正常的值
    close_attach_auto();
    //ResizeImg(content.find('img'));
    SplitPages(content);
}
function DuoshuoShow(ID, Title, Url)
{
    DIV_DUOSHUO.attr('data-thread-id', ID);
    DIV_DUOSHUO.attr('data-thread-key', ID);
    DIV_DUOSHUO.attr('data-title', Title);
    DIV_DUOSHUO.attr('data-url', Url);
    duoshuoQuery['thread_key'] = ID;
    duoshuoQuery['thread_title'] = Title;
    DUOSHUO.EmbedThread(DIV_DUOSHUO[0]);
}

function SplitPages(content)
{
    var hs = 1176;
    var h = content.height();
    var p = $('div#page');
    var offset_l = content.offset().left + content.outerWidth();
    var offset_t = content.offset().top;
    var i;
    for(i=1; i< h/hs; i++)
    {
        var _p = p.clone();
        _p.show();
        $('body').append(_p);
        _p.offset({top: i * hs + offset_t, left: offset_l});
        _p.text(i + '.');
    }

}
function ResizeImg(Imgs) // 调整图片的宽度
{
    function resize()
    {
        var w = DIV_CHAPTER.width() * 0.8;
        var img_w = $(this).width();//图片宽度
        var img_h = $(this).height();//图片高度
        if(img_w>w){//如果图片宽度超出容器宽度--要撑破了
            var height = (w*img_h)/img_w; //高度等比缩放
            $(this).css({"width":w,"height":height});//设置缩放后的宽度和高度
        }
    }
    Imgs.each(function(){
        $(this).load(resize);
    });

}

$(document).ready(function(){
    //在窗口大小发生变化的时候调用些函数
    window.onresize = close_attach_auto;
    DIV_LISTPOST = $('div#listpost');
    DIV_HEADER   = $('div#header');
    DIV_CLASS    = $('div#class_div');
    DIV_CHAPTER  = $('div#chapter');
    DIV_INDEX    = $('div#index');
    DIV_DUOSHUO  = $('div.ds-thread');



//    DIV_LISTPOST.on('click', 'div', EShowChapter);
    DIV_CLASS.on('click', 'div', ClassShowListPost);
    $('div#class_container h3').click(function(){
        $('div#class_div' ).toggle();
    });


    var path = window.location.pathname;
    if (path[path.length - 1] != '/')
    {
        var t = path.split('/');
        t = t.slice(0, t.length - 1);
        path = t.join('/') + '/';
    }

    URL_PREFIX = path + URL_PREFIX;
    URL_INDEX  = path + URL_INDEX;
    URL_CLASS  = path + URL_CLASS;

    if (getUrlParams().local){
        LOCALHOST = 1;
    }


    var ID=getUrlParams().id;
    if (ID){
        ShowChapter(ID);
        //$('div#title #class').text(INFOS[ID].class).attr('href', GetClassHref(ID));

    }
});


