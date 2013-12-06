/* 
 CREATED: 4/30/13
 BY: Chace L. Prochazka
 */

(function($){
   
   $("div#weather",$("body")).hide();
   $("div#browserCheck",$("body")).hide();
   $("div#geoLoc",$("body")).hide();
   
   var Zip = Backbone.Model.extend({
       defaults: {
           id:'80015'
       },
       url: function(){
           if (this.isNew()){
               return "./php/getZip.php";
           } else {
               return "./php/getZip.php?id=" + this.id;
           }
       }
   });

   var Location = Backbone.View.extend({
       el: $('body'), 
       events: {
         'click button#zip': 'getZip'
       },
       initialize: function(){
         _.bindAll(this, 'render', 'getZip'); 
         this.render();
       },
       render: function(){

       },
       getZip: function(){
           var zip = new Zip({id:$('input#entry', this.el).val()});
           $('div#myLoc', this.el).text('Searching for ' + zip.id + '...');
           zip.fetch({
               success: function(){
                   var length = 19;
                   $('div#myLoc', this.el).html('');
                   for (var i = 0; i <= length; i++) {
                       var myTemp = $('div#myLoc', this.el).html();
                       $('div#myLoc', this.el).html(myTemp + '</br>' + zip.attributes[i]);
                   }
               }
           })
       }
   });

   var browserTest = Backbone.View.extend({
      el: $('body'),
      initialize: function(){
        if (jQuery.browser.mobile) {
           $('div#browserCheck', this.el).html('Mobile Browser Detected...');
           //$("div#browserCheck", this.el).slideToggle();
        } else {
           $.getJSON('getIP.php', function(data){
              $('div#browserCheck', this.el).html('Normal Browser Detected... IP: ' + data.ip);
              //$("div#browserCheck", this.el).slideToggle();
           });
        }
      }
   });

   var gMap = Backbone.View.extend({
      el: $('body'),
      initialize: function(){
        if (jQuery.browser.mobile) {
           google.maps.event.addDomListener(window, 'load', initMap());
           //var Wthr = new weather();
        } else {
           google.maps.event.addDomListener(window, 'load', initMap());
           //var Wthr = new weather();
        }
      }
   });

   var Loc = new Location();
   var Browse = new browserTest();
   var Map = new gMap();

})(jQuery);