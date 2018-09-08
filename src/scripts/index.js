var dom = {};

var session = {
  categoriesDom: {},
  svgFileName: "",
  svgFileContent: "",
  activeSvg: ""
};
var initDom = function() {
  dom.prefixWrapper = $(".prefix");
  dom.prefixInput = $("input[name='prefix']", dom.prefixWrapper);

  // TODO: To be used
  dom.svgUploaderContainer = $("#svg-uploader");
  dom.svgContainer = $(".svg-container");
};
var init = function() {
  //logic for svg file upload and display it as a svg only
  reuploadState = false;
  //logic for svg file upload and display it as a svg only
  $("#svg-uploader").change(function() {
    var input = this;
    var fileName = input.files[0].name;
    if (input.files && input.files[0].type == "image/svg+xml") {
      session.svgFileName = fileName;
      var reader = new FileReader();
      reader.onload = function(e) {
        $(".btn")
          .addClass("re-upload")
          .html(
            "<pre>You are Mapping <b>" +
              fileName +
              "<b>\nClick Here to Re-Upload the SVG</pre>"
          );
        session.svgFileContent = e.target.result;
        session.svgFileContent.id = "target-svg";
        //remove Old SVG if uploaded
        $(".svg-container > svg").remove();

        //Attach the new Svg to the Dom
        dom.svgContainer.append(session.svgFileContent);

        initSVGDom();

        if (!reuploadState) {
          //Initialize Drag Drop and download functionality for the first time
          dragDropInit();
          downloadInit();
        }

        //Initialize hover every time the new svg is uploaded
        hoverInit();
        zoomInit($(".svg-container > svg"));
        reuploadState = true;
      };
      reader.readAsText(input.files[0], "UTF-8");
    } else {
      alert("Please upload a Svg File Only!!");
    }
  });

  //Logic for excel file upload and conversion
  $("#convert").click(function() {
    x = $("#inney").val();
    x = x.split("(").join('</td><td draggable="true">' + dom.prefixInput.val());
    x = x.split(")").join("</td>\n\t</tr>\n\t<tr>\n\t\t<td>");
    x = "<table>\n\t<tr>\n\t\t<td>" + x + "</td>\n\t</tr>\n</table>\n";
    $("#output")
      .text(x)
      .focus()
      .select();
    $("#render").html(x);
  });
};

//Initialize drag and drop function after the SVG is loaded.
var dragDropInit = function() {
  var dragged, currentClass;

  /* events fired on the draggable target */
  document.addEventListener("drag", function(event) {}, false);

  document.addEventListener(
    "dragstart",
    function(event) {
      // store a ref. on the dragged elem
      dragged = event.target;
      // make it half transparent
      event.target.style.opacity = 0.5;
      currentClass = event.target.innerHTML;
    },
    false
  );

  document.addEventListener(
    "dragend",
    function(event) {
      event.preventDefault();
      event.stopPropagation();
      // reset the transparency
      event.target.style.opacity = "";
    },
    false
  );

  /* events fired on the drop targets */
  document.addEventListener(
    "dragenter",
    function(event) {
      // highlight potential drop target when the draggable element enters it
      event.preventDefault();
      event.stopPropagation();

      $dropzone = $(event.target);
      if (!$dropzone.hasClass("svg-mapping-category")) return;

      $dropzone.addClass("droping-zone");
    },
    false
  );

  document.addEventListener(
    "dragover",
    function(event) {
      // prevent default to allow drop
      event.preventDefault();
      event.stopPropagation();

      $dropzone = $(event.target);
      if (!$dropzone.hasClass("svg-mapping-category")) return;

      $dropzone.addClass("droping-zone");
    },
    false
  );

  document.addEventListener(
    "dragleave",
    function(event) {
      // prevent default to allow drop
      event.preventDefault();
      event.stopPropagation();

      $dropzone = $(event.target);
      if (!$dropzone.hasClass("svg-mapping-category")) return;

      $dropzone.removeClass("droping-zone");
    },
    false
  );

  document.addEventListener(
    "drop",
    function(event) {
      // prevent default action (open as link for some elements)
      event.preventDefault();
      event.stopPropagation();

      $dropzone = $(event.target);
      if (!$dropzone.hasClass("svg-mapping-category")) return;

      $dropzone.removeClass("droping-zone");
      // move dragged elem to the selected drop target
      if ($dropzone.attr("data-category")) {
        if (
          confirm(
            "This Block is mapped as " +
              $dropzone.attr("class") +
              ". Do you want to remap this block?"
          )
        ) {
          var oldClass = $dropzone.attr("data-category");
          $dropzone.removeClass(oldClass).attr("data-category", "");
        } else {
          return;
        }
      }

      $(event.target).addClass("mapped");
      $(event.target)
        .addClass(currentClass)
        .attr("data-category", currentClass);
    },
    false
  );
};

var initSVGDom = function() {
  session.categoriesDom = $("svg > *:not(text,g), g > *:not(text)")
    .not("g")
    .not("text");

  session.categoriesDom.each(function(index) {
    var element = $(session.categoriesDom[index]);
    if (element.attr("class")) {
      element.attr("data-category", element.attr("class"));
      element.addClass("pre-mapped");
    }
  });

  session.categoriesDom.addClass("svg-mapping-category");
};
//initalize hover function
var hoverInit = function() {
  var mappedClass;
  var $hoveredElement;
  $description = $(".description");
  session.categoriesDom.hover(
    function() {
      //document.getElementById("demo").innerHTML = this.getAttribute("class").split(' ')[0];
      $hoveredElement = $(this);
      // var ClassList = $hoveredElement.className.split(/\s+/);
      mappedClass = $hoveredElement.attr("data-category");
      if (mappedClass) {
        $description.html(mappedClass);
        $description.addClass("active");
      }
      $hoveredElement.addClass("enabled heyo");
    },
    function() {
      $hoveredElement.removeClass("enabled heyo");
      $description.removeClass("active");
      $description.html("UnmappedClass");
    }
  );

  $(document).on("mousemove", function(e) {
    $description.css({
      left: e.pageX,
      top: e.pageY - 70
    });
  });
};

var zoomInit = function(zoomTarget) {
  var zoomLevel = 0;
  zoomTarget
    .parent()
    .parent()
    .css("position", "relative");
  zoomTarget.parent().css("max-height", zoomTarget.height());
  $(zoomTarget)
    .parent()
    .panzoom({
      $zoomIn: $("#ZoomInSVG").show(),
      $zoomOut: $("#ZoomOutSVG").show(),
      $reset: $("#ZoomResetSVG").show(),
      panOnlyWhenZoomed: true,
      transition: true,
      linearZoom: true,
      minScale: 1,
      maxScale: 5
    });

  zoomTarget
    .parent()
    .parent()
    .on("mousewheel.focal", function(e) {
      e.preventDefault();
      var delta = e.delta || e.originalEvent.wheelDelta;
      var zoomOut = delta ? delta < 0 : e.originalEvent.deltaY > 0;
      zoomTarget.parent().panzoom("zoom", zoomOut, {
        increment: 0.1,
        animate: true,
        focal: e/100.0
      });
    });
};
//Attach Download Button to DOM
var downloadInit = function() {
  $("#download")
    .show()
    .off()
    .on("click", function() {
      var svg;
      svg = $(".svg-container > svg");
      convertSVG(svg);
      saveSVG();
    });
};

convertSVG = function(svg) {
  // Remove all classes which are not requried
  $("*", svg).removeClass(
    "enabled heyo mapped pre-mapped svg-mapping-category"
  );
};

saveSVG = function() {
  //output the final svg
  var source = dom.svgContainer.html();
  //get svg source.

  // dont serialize it
  // var serializer = new XMLSerializer();
  // var source = serializer.serializeToString(svg[0]);

  //add name spaces.
  if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
    source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
  }
  if (!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)) {
    source = source.replace(
      /^<svg/,
      '<svg xmlns:xlink="http://www.w3.org/1999/xlink"'
    );
  }

  //add xml declaration
  source = '<?xml version="1.0" standalone="no"?>\r\n' + source;

  //convert svg source to URI data scheme.
  var url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);

  //set url value to a element's href attribute and make it downloadable.
  document.getElementById("downloadlink").href = url;
  document.getElementById("downloadlink").download = session.svgFileName;

  //you can download svg file by right click menu.
  $("#downloadlink")
    .get(0)
    .click();
  console.log(source);
};
//Start the script after the page is loaded
$(document).ready(function() {
  initDom();
  init();
});
