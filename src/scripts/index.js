var init = function(){
    //logic for svg file upload and display it as a svg only
        var svgFileContent;
        //logic for svg file upload and display it as a svg only
        $('#svg-uploader').change(function(){
            var input=this;
            if (input.files && input.files[0]) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    svgFileContent = e.target.result;
                    $('.upload')
                        .append(svgFileContent)
                        .width("100%")
                        .height("100%");
                        dragDropInit();
                        hoverInit();
                };
                reader.readAsText(input.files[0],"UTF-8");
            }
        });
    
    
        //Logic for excel file upload and conversion
        $('#convert').click(function(){
            x = $('#inney').val();
            x = x.split("\(").join('</td><td draggable="true">');
            x = x.split('\)').join('</td>\n\t</tr>\n\t<tr>\n\t\t<td>');
            x = '<table>\n\t<tr>\n\t\t<td>' + x + '</td>\n\t</tr>\n</table>\n';
            $('#output').text(x).focus().select();
            $('#render').html(x);
        });
    
    }
    
    
    //Initialize drag and drop function after the SVG is loaded. 
    var dragDropInit = function(){
      var dragged,currentClass;
      
        /* events fired on the draggable target */
        document.addEventListener("drag", function( event ) {
      
        }, false);
      
        document.addEventListener("dragstart", function( event ) {
            // store a ref. on the dragged elem
            dragged = event.target;
            // make it half transparent
            event.target.style.opacity = .5;
            currentClass = event.target.innerHTML;
        }, false);
      
        document.addEventListener("dragend", function( event ) {
            // reset the transparency
            event.target.style.opacity = "";
        }, false);
      
        /* events fired on the drop targets */
        document.addEventListener("dragover", function( event ) {
            // prevent default to allow drop
            event.target.style.background = "white";
            event.preventDefault();
        }, false);
      
        document.addEventListener("dragenter", function( event ) {
            // highlight potential drop target when the draggable element enters it
            if ( event.target.className ) {
                event.target.style.background = "red";
            }
      
        }, false);
      
        document.addEventListener("drop", function( event ) {
            // prevent default action (open as link for some elements)
            event.preventDefault();
            // move dragged elem to the selected drop target
            if ( $(event.target) ) {
                debugger;
                event.target.style.fill = "green";

              $(event.target).addClass(currentClass);

            //    dragged.parentNode.removeChild( dragged );
            //    event.target.appendChild( dragged );
            }
        }, false);
    };
    
    //initalize hover function
    var hoverInit = function(){
            $(this).addClass("enabled");
            $description = $(".description");
            $('svg > *:not(text,g), g > *:not(text)').hover(function() {
            //document.getElementById("demo").innerHTML = this.getAttribute("class").split(' ')[0];
            
                $(this).addClass("enabled heyo");
                $description.addClass('active');

            }, function() {
                $description.removeClass('active');
            });
    
            $(document).on('mousemove', function(e){
    
            $description.css({
            left:  e.pageX,
            top:   e.pageY - 70
            });
    
            });
    };

//Start the script after the page is loaded
$(document).ready(function() {
    init();
});
