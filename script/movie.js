// Student Name: Nitanshu Rehani
// Student ID:   10382675

if ('serviceWorker' in navigator){
  navigator.serviceWorker
    .register('./service-worker.js', {scope: './'})
    .then(function(registration) {
      console.log('Service Worker Registered');
  })
  .catch(function(err){
    console.log("Service Worker Failed to Register", err);
  })
}

var days            = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
var dateObj         = new Date();
var months          = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var htmlString      = '';
var dateListString  = '';

$(function () {
    htmlString  += '<li class = "days-stat today" data-day = '+ days[dateObj.getDay()]
                  +'><a href="javascript:void(0)">Today</a></li>';
    dateObj.setDate(dateObj.getDate() + 1);
    htmlString  += '<li class = "days-stat" data-day = '+ days[dateObj.getDay()] +
                    '><a href="javascript:void(0)">Tommorow</a></li><li class="dropdown">' +
                    '<a class="dropdown-toggle" data-toggle="dropdown" href="#">Select Day'+
                    '<span class="caret"></span></a><ul class="dropdown-menu">'
      
  for(var i = 0; i <=3 ; i++){
      dateObj.setDate(dateObj.getDate() + 1);
      htmlString        += '<li class = "days-stat" data-day = '+ days[dateObj.getDay()] +
                            '><a href="/">' + capitalizeFirstLetter(days[dateObj.getDay()]) + ', ' 
                            + dateObj.getDate() + ' ' + months[dateObj.getMonth()] + '</a></li>';   
  }

  htmlString += '</ul></li>'
  $('.navigation_list').append(htmlString);
  var pathName = window.location.pathname 
  if (pathName == '/'){
    $('.today').addClass('active')
    var day = $('.days-stat .active').attr('data-day');
    ajaxCall(day);
  }
});


function ajaxCall(day) {
  // var url = 'https://college-movies.herokuapp.com';
  var url    = 'movie.json'
  var today       = $('.active').attr('data-day');
  $.ajax({
    dataType: "json",
    url: url,
    type: 'get',
    success: function (result) {
      var tmpResult   = result.slice(1,10);
      var movieList   = $('.movie-list');
      var newArr = [];

      while(tmpResult.length) newArr.push(tmpResult.splice(0,3));
      for(var i = 0; i <= 2; i++){
        var htmlString = '<div class = "row">';
        for(var j = 0; j <= 2; j++){
          var element = newArr[i][j];
          htmlString += '<div class = "col-md-4 text-center">' + 
                        '<img src="/images/movie-icon.jpg" class="movie-icon img-rounded" alt="www.newscrane.com"data-toggle="tooltip" data-placement="top" title='+ element['genre'] +'>' +
                        '<p class = "movie-title">' + element['title'] + '</p>'
          htmlString += "<p class = 'show-timings' dataObj = " + "'" + fetchDataObj(element) + "'" + ">Show Timings</p><p>";              
          for(var k = 0; k < element['runningTimes'][today].length; k++) {
            htmlString += '<button type="button" class="btn btn-default show-time">' + element['runningTimes'][today][k] + "</button>";
          }
          htmlString +='</p></div>'
        }
        htmlString += '</div>';
        movieList.append(htmlString);
      }
    }
  });
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function fetchDataObj(obj){
  var data = {"title": obj.title, "year": obj.year, "director": obj.director, "genre": obj.genre, "cast": obj.cast, "notes": obj.notes}
  return JSON.stringify(data);
}


$(document).on('click', '.days-stat', function(event ){
    event.preventDefault();
    $('.seatList').addClass('hide');
    $('.movie-list').removeClass('hide');
    $('.display-form').addClass('hide');
    $('.active').removeClass('active');
    $(this).addClass('active');
    $('.movie-list').empty();
    $('.movie-data').empty();
    ajaxCall();
})


$(document).on('click','.floating-box',function(){
  var seatCount = $('.seat-rows span')
  var val       =  parseInt(seatCount.text());
  if($(this).hasClass('slctd-seat')){
    seatCount.text(val - 1);
  }else{
    seatCount.text(val + 1);
  }
  $(this).toggleClass('slctd-seat')
})

$(document).on('click','.proceed',function(){
  var seatCount = $('.seat-rows span')
  var val       =  parseInt(seatCount.text());
  if(val == 0){
    $('#myModal').modal('show');
  }else{
    $('.seatList').addClass('hide');
    $('.display-form').removeClass('hide');
  }
})

$(document).on('click', '.enjoy-btn', function(){
  document.location.href="/";
})

$(document).on('click', '.cncl_bookng', function(){
  $('.display-form').addClass('hide');
  $('.seatList').removeClass('hide');
})

$(document).on('click','.show-time', function(){
  $('.movie-list').addClass('hide');
  $('.display-form').addClass('hide');
  $('.seatList').removeClass('hide')
  var movieTime   = $(this).text();
  var date        = $('.active').text();
  var dataObj     = JSON.parse($(this).closest('.col-md-4').find('.show-timings').attr('dataobj'))
  var htmlString  = '<div class = "movie-data"><p class="name-alignment">' + dataObj.title + '  ' +  dataObj.year  + ' ' +  date + ' @ ' + movieTime  + '</p>' +
                    '<p class="details-alignment"><b> Directed By: '     + dataObj.director + '</p>' +
                    '<p class="details-alignment"><b> Cast: ' + dataObj.cast + '</p>' +
                    '<p class="details-alignment"><b> Genre: ' + dataObj.genre + '</p></div>';
  $('.movie-info').append(htmlString);
  $('.seat-lines').empty();
  $('.seat-rows span').text(0);
  displaySeats();
});


function displaySeats(){
  var seatHtml    = ''
  var Rows        = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
  for (i = 0; i < Rows.length ; i++) {
      seatHtml += '<div class = "row"><p class = "row-txt">' + Rows[i] + '</p>'
      for(j = 1; j <= 11; j++){
        if( j  == 5){
          seatHtml += '<div class = "space-btwn-seats"></div>'
        }
        seatHtml += '<a class = "floating-box" href ="javascript:void(0)">'+ j +'</a>'
      }
      seatHtml += '</div>'
  }
  $('.seat-lines').append(seatHtml);
}
