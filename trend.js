google.load('visualization', '1', {packages: ['corechart', 'line']});
google.setOnLoadCallback(drawLineStyles);

var index = 0;
var remains;
var projs;

function drawLines(data) {
  var options = {
    title: 'Github Stars Over Time',
    height: '400',
    hAxis: {
      title: 'Date'
    },
    vAxis: {
      title: 'Stars'
    }
  };

  var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
  chart.draw(data, options);
}

function updateData(proj, data) {
    $.ajax({
        type: "GET",
        url: "https://raw.githubusercontent.com/npcode/trend/trend/repos/" + proj + "/stars.dat",
        dataType: "text",
        success: function(text) {
          lines = text.split("\n");
          var items = [];
          for(var i = 0; i < lines.length; i++) {
              var fields = lines[i].split(' ');
              var date = fields[0];
              var stars = fields[1];
              data.setValue(index, 0, new Date(date))
              data.setValue(index, projs.indexOf(proj) + 1, stars)
              index += 1;
          }
          if (--remains == 0) {
              drawLines(data)
          }
        }
    });

    $.getJSON( "https://raw.githubusercontent.com/npcode/trend/trend/repos/" + proj + "/stars.dat", function( json ) {
      var items = [];
      $.each( json, function( j, item ) {
          data.setValue(index, 0, new Date(item.date))
          data.setValue(index, projs.indexOf(proj) + 1, item.stars)
          index += 1;
      });
      if (--remains == 0) {
          drawLines(data)
      }
  });
}

function drawLineStyles() {
      var data = new google.visualization.DataTable();
      var i;
      var proj;
      var qs;
      var input;

      qs = $.currentQueryString();
      projs = qs.projs ? qs.projs.split(',') : null;
      projs = projs.map(function(x) { return x.trim(); });
      projs = projs.filter(function(x) { return x.length > 0 });
      if (!(projs && projs.length > 0 && projs[0].length > 0)) {
          projs = ['rancher/rancher', 'shipyard/shipyard'];
      }
      remains = projs.length;

      data.addColumn('date', 'Date');
      for(i = 0; i < projs.length; i++) {
          data.addColumn('number', projs[i]);
      }
      data.addRows(9999)

      for(i = 0; i < projs.length; i++) {
          updateData(projs[i], data)
      }
}

/*! skinny.js v0.1.0 | Copyright 2013 Vistaprint | vistaprint.github.io/SkinnyJS/LICENSE 
 * http://vistaprint.github.io/SkinnyJS/download-builder.html?modules=jquery.delimitedString,jquery.queryString*/

!function(a){a.encodeDelimitedString=function(a,b,c,d,e){if(!a)return"";d=d||function(a){return a},e=e||d;var f=[];for(var g in a)a.hasOwnProperty(g)&&f.push(d(g)+c+e(a[g]));return f.join(b)},a.parseDelimitedString=function(a,b,c,d,e){d=d||function(a){return a},e=e||d;var f={};if(a)for(var g=a.split(b),h=g.length,i=0;h>i;i++){var j=g[i];if(j.length>0){var k,l,m=j.indexOf(c);m>0&&m<=j.length-1?(k=j.substring(0,m),l=j.substring(m+1)):k=j,f[d(k)]=e(l)}}return f}}(jQuery);;!function(a){var b=/\+/gi,c=function(a){return null==a?"":decodeURIComponent(a.replace(b," "))};a.deparam=function(b){if("string"!=typeof b)throw new Error("$.deparam() expects a string for 'queryString' argument.");return b&&"?"==b.charAt(0)&&(b=b.substring(1,b.length)),a.parseDelimitedString(b,"&","=",c)},a.parseQueryString=a.deparam,a.currentQueryString=function(){return a.deparam(window.location.search)},a.appendQueryString=function(b,c){var d=a.param(c);return d.length>0&&(d="?"+d),b+d}}(jQuery);
