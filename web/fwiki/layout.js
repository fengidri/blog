var INDEX;
var ALLIDS;

var URL_INDEX    = '../store/index.json';
var URL_CLASS    = '../store/class.json';
var URL_PREFIX   = '../store/';
var CHAPTER_URL;

var DIV_LISTPOST;
var DIV_HEADER;
var DIV_CLASS;
var DIV_CHAPTER;
var DIV_INDEX;
var DIV_EDIT;
var DIV_DUOSHUO;

var BUTTON_GVIM;   // 打开GVIM 进行编辑
var BUTTON_OPTION; // 用户打开弹出层进行信息修改

var CHAPTER_ID;

var INFOS;
var TexIds = [];
var CLASS  = [];
var FILTER = {}
var YEARS = [];

//function DataInit()//从服务器得到数据信息
//{
//    function sortNumber(a,b)
//    {
//        return b - a;
//    }
//
//    $.ajax({
//          url : URL_INDEX,
//          async : false,
//          dataType:'json',
//          success : function(index){
//              INFOS = index;
//              for (i in INFOS)
//              {
//                  var info = INFOS[i];
//                  if (info.post == '0')
//                      continue;
//
//                  if (info.class == '' || info.class == undefined)
//                  {
//                      info.class = '未分类';
//                  }
//                  if (CLASS[info.class])
//                  {
//                      CLASS[info.class].push(i);
//                  }
//                  else{
//                      CLASS[info.class] = [i];
//                  }
//
//		  info.date = PaserDate(info.ctime);
//                  if (-1 == YEARS.indexOf(info.date.year))
//                      YEARS.push(info.date.year)
//
//                  TexIds.push(i);
//              }
//
//              TexIds.sort(sortNumber);
////              ListClass(CLASS);
//
////              YEARS.reverse();
////              FILTER.year = YEARS[0];
////
////	      for (var i in YEARS){
////		      var y = $("<span>").text(YEARS[i]);
////		      y[0]._data = YEARS[i];
////
////		      y.click(function(){ FILTER.year = this._data; ShowListPost(); })
////
////		      $("div#yearselect").append(y);
////	      }
//	  },
//    });
//}

function ListClass(CLASS)
{
    function add(name, id, num)
    {
        var t = $('<div>').text(name);
        var n = $('<span>').text(num);
        t[0].class = id;
        t.append(n);
        DIV_CLASS.append(t);
    }
    add('全部', "__all__", TexIds.length);
    var cls = [];

    for (var c in CLASS)
    {
        cls.push(c);
    }
    cls.sort();
    for (var i in cls)
    {
        var c = cls[i];
        var n = CLASS[c].length;
        add(c, c, n);

    }
}

function GetClassHref(ID)
{
    var c = encodeURIComponent(GetClass(ID));
    var n = '/index.html?c=' + c;
    return window.location.href.replace(/\/[^/]*$/, n)

}

function ShowTasks()// 显示list post
{
    var taskid = [];
    for (var i in INDEX)
    {
        var info = INDEX[i];
        if (!info.post) taskid.push(info.id);
        ShowListPost(taskid);
    }
}

function ShowListPost()// 显示list post
{
    if (arguments.length > 0){
        var filter_class = arguments[0];
        if (filter_class == "__all__") filter_class = undefined;
        DIV_CLASS.find('div').css('background', 'white');
        DIV_CLASS.find('div').each(function(){
            if(this.class == filter_class)
            {
                $(this).css('background', 'grey');
            }
        })
    }else
        var filter_class = undefined;

    FILTER.class = filter_class;

//    $("div#yearselect span").each(function(){
//            if ($(this).text() == FILTER.year) $(this).css("background", "grey");
//            else
//               $(this).css("background", "white")
//		    });

    var month;
    var year;

    DIV_LISTPOST.html('');
    for (var i in TexIds)
    {
        var ID = TexIds[i];
        var info = INFOS[ID];
        var date = info.date;

//        if (FILTER.class && FILTER.class != info.class) continue;
//        if (FILTER.year && FILTER.year != date.year) continue;

        if (date.month != month)
        {
            var t = $('<div>').text(date.year + '-' + date.month);
            t.css('text-align', 'center');
            t.css('border-bottom', '1px solid black');

            DIV_LISTPOST.append(t);
            month = date.month;
        }

        var t = $('<a href=chapter.html?id=' + ID + ' >').text(info.title);
        DIV_LISTPOST.append(t);
    }
    $(document).scrollTop( 0 /*DIV_LISTPOST.offset( ).top*/ );
    close_attach_auto();
}

function ClassShowListPost()// 通过类显示list post
{
    // 得到指定的类的id 的list
    var cname = $(this)[0].class;
    if ("__all__" == cname)
    {
        window.location.href = '/';
    }
    else
    {
        var c = encodeURIComponent(cname);
        var n = '/index.html?c=' + c;
        window.location.href =
        window.location.href.replace(/\/[^/]*$/, n)
    }
}

//function EShowChapter()// 用于事件回调
//{
//    if (this.chapterid == undefined) return;
//    var n = '/chapter.html?id=' + this.chapterid;
//    window.location.href =
//        window.location.href.replace(/\/[^/]*$/, n)
//}





function PaserDate(D)
{
    var month_map = [];
    month_map["Jan"] =  "01";
    month_map["Feb"] =  "02";
    month_map["Mar"] =  "03";
    month_map["Apr"] =  "04";
    month_map["May"] =  "05";
    month_map["Jun"] =  "06";
    month_map["Jul"] =  "07";
    month_map["Aug"] =  "08";
    month_map["Sep"] =  "09";
    month_map["Oct"] =  "10";
    month_map["Nov"] =  "11";
    month_map["Dec"] =  "12";

    var tt = D.split(/\s+/);
    var dd = [];
    dd['year']  = tt[4];
    dd['month'] = month_map[tt[1]];
    dd['date']  = tt[2];
    dd['time']  = tt[3];

    return dd;
}




function getUrlParams() {
    var result = {};
    var params = (window.location.search.split('?')[1] || '').split('&');
    for(var param in params) {
        if (params.hasOwnProperty(param)) {
            paramParts = params[param].split('=');
            result[paramParts[0]] = decodeURIComponent(paramParts[1] || "");
        }
    }
    return result;
}
function close_attach_auto()
{
    //必要的时候自动关闭, 附加的窗口
    var c_l, c_r;
    if($("#listpost").is(":visible"))
    {
        c_l = $("#listpost").offset().left;
        c_r = c_l + $("#listpost").width();
    }else{
        if($("#chapter").is(":visible"))
        {
            c_l = $("#chapter").offset().left;
            c_r = c_l + $("#chapter").width();
            if($("#index").offset().left + $("#index").width() > c_l)
                $("#index").hide();
            else
                $("#index").show();
        }else return;
    }

}
