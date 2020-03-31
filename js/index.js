/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
 var app = {
    // Application Constructor
    initialize: function() {
      document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
      this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
      var parentElement = document.getElementById(id);
      var listeningElement = parentElement.querySelector('.listening');
      var receivedElement = parentElement.querySelector('.received');

      listeningElement.setAttribute('style', 'display:none;');
      receivedElement.setAttribute('style', 'display:block;');

      console.log('Received Event: ' + id);
    }
  };

  app.initialize();
  $(document).ready(function(){
    getLatLong();
    function getLatLong() {
      if (navigator.geolocation) {
        navigator.geolocation.watchPosition(displayLatLong);
      } else {
        $('#latlong').text("Geolocation is not supported by this browser.");
      }
    }
    function displayLatLong(position) {
      lat=position.coords.latitude;
      long=position.coords.longitude;
      $('#latlong').html("<b>Latitude: </b><span id='lat'>" + lat +
        "</span><br><b>Longitude: </b><span id='long'>" + long+"</span>");
    }
    $('#barcode-input').keypress(function (e) {
     var e = event || evt; 
     var charCode = e.which || e.keyCode;
     if (charCode > 31 && (charCode < 48 || charCode > 57)){      
      $('#number-error').removeClass('d-none');
      return false;
    }
    else{
      $('#number-error').addClass('d-none');      
      return true;
    }
  });
    $('#barcode-input-submit').click(function(){
      $('#result-show').removeClass('d-none');
      $('#result-show p span').text($('#barcode-input').val());
    });
    $('#submit-code').click(function(){
      var code=$('#result-show p span').val();
      $.ajax({
        type : 'post',
            url : '#', //Here you will fetch records 
            data :  'code='+code+'&latitude='+lat+'&longitude='+long, //Pass $id
            success : function(data){
              //code
            }
          }); 
    });
    /****calculate the distance***/
    $('#submit').click(function(){
      var lat1=$('#lat').text();
      var long1=$('#long').text();
      var lat2=$('#lat1').val();
      var long2=$('#long1').val();
      var unit=$('#unit').val();
      /*      console.log('lat1='+lat1+'long1='+long1+'lat2='+lat2+'long2='+long2+'unit='+unit);*/
      if ((lat1=='')||(lat2=='')||(long1=='')||(long2=='')||(unit=='')) {
        $('#result-show').addClass('d-none');
        $('#number-error').removeClass('d-none');        
      }
      else{
        $('#number-error').addClass('d-none');
        $('#result-show').removeClass('d-none');
        $('#result-show p span').text(getDistance(lat1,long1,lat2,long2,unit));
      }
    })
  });
  function deg2rad(degrees)
  {
    var pi = Math.PI;
    return degrees * (pi/180);
  }
  function getDistance(latitude1,longitude1,latitude2,longitude2,unit) {
    var earthRadius = 6371; 
    var dLat = deg2rad(latitude2-latitude1);  
    var dLon = deg2rad(longitude2-longitude1); 
    var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(latitude1)) * Math.cos(deg2rad(latitude2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = earthRadius * c; 
    var miles = d / 1.609344; 

    if ( unit == 'km' ) {  
      d=d+' Km';
      return d; 
    } else {
      miles=miles+'Miles';
      return miles; 
    }
  }