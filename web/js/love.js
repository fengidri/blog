function rand_heart(X)
{
    var x = Math.random() * X;
    var Y = (X / 4) * (Math.PI + 1);
    var min, max;
    var y;

    min = Math.sqrt(X*X/16 - Math.pow((Math.abs(x - X/2) - X/4), 2)) * -1 + X/4;
    max = Math.tan( X/4  - (Math.abs(x - X/2))) * -1 + X/4 + Math.PI;
    alert(min + ',' + max);
    while(1)
    {
        y = Math.random() * Y;
        if (y > min && y < max)
            return [x,y];
    }
}
function draw_point()
{
    var point = rand_heart(500);
    var dp = $("<div class=point>");

    dp.css('left', point[0]);
    dp.css('top', point[1]);
    $('html').append(dp);

}
var i=0;
while (i< 50)
{
    i++;
    draw_point();

}
