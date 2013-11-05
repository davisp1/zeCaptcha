(function($) {
  
    $.zeCaptcha = function(element,options) {

        defaults = {};
        var plugin = this;
        plugin.options = {};
        var $form = $(element)
        var value1, value2, $field, action, canvas;

        plugin.init = function() {
            plugin.options = $.extend({}, defaults, options);
            action = $form.attr('data-action-url');
            value1 = Math.floor(Math.random()*11) + Math.floor(Math.random()*11);
            value2 = Math.floor(Math.random()*11) + Math.floor(Math.random()*11);

            $form.removeAttr('action');          
            computeInputs();
            bindEvents();
        }

        var bindEvents = function(){
            $field.on("keyup",function(event){
                if ( checkValues() ) {
                    computeThumb("green");              
                    $form.attr("action",action);
                }
                else {
                    computeThumb("red");
                    $form.removeAttr("action");
                }
            });

            $form.find("[type=submit]").on("click",function(event){
                if( ! checkValues() ){
                    event.preventDefault();
                    alert("captcha incorrect!");
                }
            });
        }

        var checkValues = function(){
            return ( parseInt( $field.find("input").val() ) === ( value1 + value2 ) );
        }

        var computeThumb = function(color){
            var context = canvas.getContext("2d");
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.font = "italic bold 10pt Verdana";
            context.fillStyle = color;
            var text = value1 + " + " + value2
            text += (color=="green") ? " \u221a" : ""; 
            context.fillText(text,5,10);
        }

        var computeInputs = function(){
            $field = $("<p><label for='sum_code'>Write the sum : <canvas id='sum_value' width='100' height='10'></canvas><br/><input id='sum_code'></input></p>");
            $form.find("[type=submit]").before($field);
            canvas = $field.find("canvas").get(0);
            computeThumb("red");
        }
        plugin.init();
    }

    // Add plugin on jQuery Object $.fn
    $.fn.zeCaptcha = function(options) {

        // For each element from DOM that we assign the plugin
        return this.each(function() {

            // If element hasn't still assigned to the plugin
            if (undefined === $(this).data('zeCaptcha')) {

                // We create instance of customSliders plugin with options in parameter
                var plugin = new $.zeCaptcha(this, options);
                // we stock reference from the plugin
                // in order to get its public functions
                $(this).data('zeCaptcha', plugin);

            }

        });
    };
    
    $( document ).ready(function() {
        $.each($("form[data-action-url]"),function(i,el){
            $(el).zeCaptcha();
        });
    });
    
})(jQuery);
