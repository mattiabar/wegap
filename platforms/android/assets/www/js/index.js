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
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        $(window).on('resize orientationChange', function(event) {
            var h = $( window ).height();
            $('#top').css('height', h*0.20);
            $('#footer1').css('top',h-43);
        });

        $('#i0').focus();

        $('.digitinput').on('focus', function() {
            $(this).select();
        });

        $('.sendbtn').on('click', function() {
            $('#i0').focus();
            $('#i0').val("");
            $('#i1').val("");
            $('#i2').val("");
            $('#i3').val("");
            $('#i4').val("");
        });

        $('.digitinput').on('keyup', function() {
            var curr_id = $(this).attr('id');
            if (curr_id == 'i4') {
                $('.sendbtn').focus();
            } else {
                var nextid_base = curr_id.substring(0,1);
                var next_id = ""+nextid_base+(parseInt(curr_id.substring(1,2))+1).toString();
                $( "#"+next_id ).focus();
            }
        });
        //$('#resp').html(device.uuid);
        //app.receivedEvent('deviceready');
        var h = $( window ).height();
        $('#top').css('height', h*0.20);
        $('#footer1').css('top',h-43);

        $("#send_accred").on('click', function() {
            var platform_code = $("#platform_code").val();
            var user_id = $("#user_id").val();
            var otp = $("#otp_accred").val();
            alert(platform_code);
            $.post( "http://136.243.70.79:4567/first_accredit", 
                { 
                    platform_code: platform_code,
                    userid: user_id,
                    otp: otp,
                    device_id: device.uuid
                })
                .done(function( data ) {
                    alert( "Data Loaded: " + data );
                    $('#resp').html(data.message);
                })
                .fail(function( data ) {
                    alert("error");
                    $('#resp').html(data.message);
                });
        });
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
