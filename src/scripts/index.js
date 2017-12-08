var init = function(){
    //logic for svg file upload and display it as a svg only
        var svgFileContent;
        //logic for svg file upload and display it as a svg only
        $('#svg-uploader').change(function(){
            var input=this;
            var fileName = input.files[0].name;
            if (input.files && input.files[0].type == "image/svg+xml") {
                var reader = new FileReader();
                reader.onload = function (e) {
                    $('.btn').addClass("re-upload").html("<pre>You are Mapping <b>"+ fileName +"<b>\nClick Here to Re-Upload the SVG</pre>");
                    svgFileContent = e.target.result;
                    
                    //remove Old SVG if uploaded
                    $(".upload > svg").remove();

                    //Attach the new Svg to the Dom                    
                    $('.upload').append(svgFileContent);
                    
                    dragDropInit();
                    hoverInit();
                };
                reader.readAsText(input.files[0],"UTF-8");
            }
            else{
                alert("Please upload a Svg File Only!!");
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
            event.target.style.opacity = 0.5;
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
            if ($(event.target).attr('class')) {
                if(confirm("Do you want to remap this block?")){
                    $(event.target).removeClass();
                }
                else{
                    return;
                }
            }
            $(event.target).addClass("mapped");
            $(event.target).addClass(currentClass);
        }, false);
    };
    
    //initalize hover function
    var hoverInit = function(){
        var mappedClass;
        var $hoveredElement;
        $description = $(".description");
        $('svg > *:not(text,g), g > *:not(text)').hover(
            function() {
            //document.getElementById("demo").innerHTML = this.getAttribute("class").split(' ')[0];
                $hoveredElement = $(this);
                // var ClassList = $hoveredElement.className.split(/\s+/);
                mappedClass = $hoveredElement.attr('class');
                if( mappedClass ){
                    $description.html(mappedClass);            
                    $description.addClass('active');    
                }
                $hoveredElement.addClass("enabled heyo");
            },
            function() {
                $hoveredElement.removeClass("enabled heyo");
                $description.removeClass('active');
                $description.html("UnmappedClass");
            }
        );

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
