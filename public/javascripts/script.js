//jquery graph 
window.onload = function () {
    $(function () {
        var socket = io.connect(window.location.hostname);
        socket.on('data', function (data) {
            var total = data.total;
            var str = "";
            for (var key in data.symbols) {
                //varibles represent accumilated totals per key
                var nameT = data.symbols['#trump'];
                var nameC = data.symbols['#apple'];
                var name3 = data.symbols['#tgif'];

                var totts = nameT + nameC + name3;
                //declaring percentage values
                var cake = Math.round((data.symbols['#trump'] / totts) * 100);
                var hefe = Math.round((data.symbols['#apple'] / totts) * 100);
                var whiskey = Math.round((data.symbols['#tgif'] / totts) * 100);

                if (isNaN(cake || hefe || whiskey)) {
                    cake = 0;
                    hefe = 0;
                    whiskey = 0;
                }

                //Displays each key's percentage of their combined totals.
                str = "Cake NightClub: " + cake + "%,\n" + "El Hefe: " + hefe + "%\n" + "Whiskey Row: " + whiskey + "%,\n"; //str += "{key: " + keyformat(key) + ", val:" + val + "},\n";

                //data points for graph
                var dps = [{ y: cake, label: 'Cake total: ' + nameT },
                           { y: hefe, label: 'El Hefe total: ' + nameC },
                            { y: whiskey, label: 'Whiskey Row total: ' + name3 }];

                var chart = new CanvasJS.Chart("chartContainer", {
                    backgroundColor: "transparent",
                    theme: "theme3",
                    title: {
                        text: "HashTag Comparison"

                    },
                    animationEnabled: true,
                    dataPointWidth: 20,
                    width: 700,
                    data: [
                    {
                        type: "column",
                        dataPoints: dps
                    }],

                    axisX: {
                        tickColor: "White",
                        tickLength: 0,
                        tickThickness: 0,
                        gridThickness: 0,
                    },
                    axisY: {
                        tickLength: 0,
                        tickColor: "White",
                        tickThickness: 1,
                        gridThickness: 0
                    },
                });

                chart.render();

                var yVal = 100;
                var updateInterval = 5000;

                chart.render();

                // update chart after specified time. 

            };
            setInterval(function () { updateInterval });
            $('#last-update').text(str);

        })

    });
}
/*
Old code that implements heat graph. The more mentions a given key 
has the truer the bg color is to red (rgb(255,0,0). Used as a guide
to implement chart script above.
*/

/*$(function() {
    var socket = io.connect(window.location.hostname);
    socket.on('data', function(data) {
        var total = data.total;
        var str = "dataPoints:[";
        for (var key in data.symbols) {
            var val = data.symbols[key] / total;
            if (isNaN(val)) {
                val = 0;
            }
            str += "{key: " + key + ", val:" + val + "},\n"; //str += "{key: " + keyformat(key) + ", val:" + val + "},\n";
            $('li[data-symbol="' + key + '"]').each(function () {
                $(this).css('background-color', 'rgb(' + Math.round(val * 255) + ',0,0)');
            });
        }
        //alert(str);
        //$('#last-update').text(new Date().toTimeString());
        $('#last-update').text(str);
        //last-update feed to jquery bar chart
    });
})

*/
