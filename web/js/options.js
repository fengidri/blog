var OPTIONS_URL_PRE='/fwiki/chapters/';
function OptionLayer()
{
    var info = GetInfo(CHAPTER_ID);
    if (!info)
    {
        alert("ID error:" + CHAPTER_ID);
        return;
    }

    //得到所有的类
    var cls = GetClass(CHAPTER_ID);

    $('#layer_option #class').empty();
    $('#layer_option #class').append($('<option>').text('请选择'));
    for (var c in CLASS)
    {
        $('#layer_option #class').append($('<option>').val(c).text(c));
    }


    $('#layer_option #title').val(info.title);
    $('#layer_option #tags').val(info.tags);
    $('#layer_option #class').find("option[value='" + cls + "']").attr("selected",true);
    $.layer({
        type : 1,
        title : '文章信息修改',
        fix : true,
        offset:['50px' , ''],
        area : ['515px','615px'],
        page : {dom : '#layer_option'}
    });

}

function AddClassOptions()
{
    var cls = prompt('新分类');
    if (!cls) return;

    $('#layer_option #class').append($('<option>').val(cls).text(cls));
    $('#layer_option #class').find(
        "option[value='" + cls + "']").attr("selected",true);
}

function layersubmit()
{
    var title = $('#layer_option #title').val();
    var cls = $('#layer_option #class').val();
    var tags = $('#layer_option #tags').val();
    if (!cls)
    {
        alert('请选择分类!');
        return;
    }
    $.ajax({
        url: OPTIONS_URL_PRE + CHAPTER_ID,
        method:"PUT",
        data:{'title':title, 'class': cls, 'tags': tags},
        success:function(){
            location.href = location.href;
        },
        error:function(data, stat){
            alert('error: ' + stat);
        }
    });

}


function OptionInit()
{
    BUTTON_OPTION = $('#option');
    BUTTON_ADD=$('#layer_option #add');


    BUTTON_OPTION.click(OptionLayer);
    BUTTON_ADD.click(AddClassOptions);
    $('#layer_option #submit').click(layersubmit);


    BUTTON_GVIM = $("#edit #gvim");
    BUTTON_GVIM.click(EditWithGvim);
}

