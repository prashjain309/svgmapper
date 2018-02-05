var dom = {};

var initDom = function(){
    dom.prefixWrapper = $('.prefix'),
    dom.prefixInput = $("input[name='prefix']",dom.prefixWrapper)
};
var init = function(){
    //logic for svg file upload and display it as a svg only
        var svgFileContent,
        svgFileName;
        reuploadState = false;
        //logic for svg file upload and display it as a svg only
        $('#svg-uploader').change(function(){
            var input=this;
            var fileName = input.files[0].name;
            if (input.files && input.files[0].type == "image/svg+xml") {
                svgFileName = fileName;
                var reader = new FileReader();
                reader.onload = function (e) {
                    $('.btn').addClass("re-upload").html("<pre>You are Mapping <b>"+ fileName +"<b>\nClick Here to Re-Upload the SVG</pre>");
                    svgFileContent = e.target.result;
                    svgFileContent.id = "target-svg";
                    //remove Old SVG if uploaded
                    $(".svg-container > svg").remove();

                    //Attach the new Svg to the Dom                    
                    $('.svg-container').append(svgFileContent);
                    if(!reuploadState){
                        //Initialize Drag Drop and download functionality for the first time
                        dragDropInit();
                        downloadInit(svgFileName);
                    }
                    
                    //Initialize hover every time the new svg is uploaded
                    hoverInit();
                    zoomInit($(".svg-container > svg"));
                    reuploadState = true;
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
            x = x.split("\(").join('</td><td draggable="true">'+ dom.prefixInput.val());
            x = x.split('\)').join('</td>\n\t</tr>\n\t<tr>\n\t\t<td>');
            x = '<table>\n\t<tr>\n\t\t<td>' + x + '</td>\n\t</tr>\n</table>\n';
            $('#output').text(x).focus().select();
            $('#render').html(x);
        });
    
    };
    
    
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
                if(confirm("This Block is mapped as "+ $(event.target).attr('class') +". Do you want to remap this block?")){
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
        $('svg > *:not(text,g), g > *:not(text)').not('g').not('text').hover(
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

    var zoomInit = function(zoomTarget){
        
        var zoomLevel = 0;
        zoomTarget.parent().parent().css('position','relative');
        zoomTarget.parent().css('max-height',zoomTarget.height());
        $(zoomTarget).parent().panzoom({
            $zoomIn: $("#ZoomInSVG").show(),
            $zoomOut:$("#ZoomOutSVG").show(),
            $reset:$("#ZoomResetSVG").show()
        });
    };
    //Attach Download Button to DOM
    var downloadInit = function( svgFileName){
        $('#download').show().click(function(){
            var svg;
            svg = $(".svg-container > svg");
            convertSVG(svg);
            saveSVG(svgFileName);
        });
    };

    convertSVG = function(svg){
        // Remove all classes which are not requried
        $('*',svg).removeClass("enabled heyo mapped");
    };

    saveSVG = function(svgFileName){
        //output the final svg
        var svg = $(".svg-container > svg");

        //get svg source.
        var serializer = new XMLSerializer();
        var source = serializer.serializeToString(svg[0]);

        //add name spaces.
        if(!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)){
            source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
        }
        if(!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)){
            source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
        }

        //add xml declaration
        source = '<?xml version="1.0" standalone="no"?>\r\n' + source;

        //convert svg source to URI data scheme.
        var url = "data:image/svg+xml;charset=utf-8,"+encodeURIComponent(source);

        //set url value to a element's href attribute and make it downloadable.
        document.getElementById("downloadlink").href = url;
        document.getElementById("downloadlink").download = svgFileName;

        //you can download svg file by right click menu.
        $('#downloadlink').get(0).click();
        console.log(svg[0]);
    };
//Start the script after the page is loaded
$(document).ready(function() {
    initDom();
    init();
});
