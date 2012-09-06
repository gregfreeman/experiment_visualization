<script type="application/ecmascript"> <![CDATA[
   
   var stroke = '';
   var frame_num = 1;
   var max_data_frames =2;
    function marker_mouseover(evt) {
      var obj = evt.target;
      stroke = obj.getAttribute("stroke");
      if(stroke == "#ff0000")
      {
        obj.setAttribute("stroke", "#000000");
      } else {
        obj.setAttribute("stroke", "#ff0000");
      }
    }
    function marker_mouseout(evt) {
      var obj = evt.target;
      obj.setAttribute("stroke", stroke);
    }
    function marker_click(evt,link) {
		open_data(link);
	}
	function open_data(link) {
		var iframe="data"+frame_num;
		window.open(link, iframe);
		frame_num=frame_num+1;
		if(frame_num>max_data_frames)
		{
			frame_num=1;
		}
	}
  ]]> </script>