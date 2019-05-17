function setupRightVideoSearch() {
	var srcs = [
	  'https://cdnjs.cloudflare.com/ajax/libs/typeahead.js/0.11.1/typeahead.jquery.min.js',
	  'https://cdn.jsdelivr.net/gh/duncangarde/right_video_remote@0.3/right_video_search.js',
	];
	if (window.jQuery) {} 
	else {
	    srcs.unshift('https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js');
	};
	srcs.forEach(function(src) {
	  if (document.querySelectorAll('[src="' + src + '"]').length > 0) {}
	  else {
		  var script = document.createElement('script');
		  script.type = "application/javascript"
		  script.src = src;
		  script.async = false;
		  document.head.appendChild(script);
	  };
	});
	[
	  'https://cdn.jsdelivr.net/gh/duncangarde/right_video_remote@0.3/right_video_search.css'
	].forEach(function(href) {
	  if (document.querySelectorAll('[href="' + href +'"]').length > 0) {}
	  else {
		  var link = document.createElement('link');
		  link.href = href;
		  link.rel = "stylesheet"
		  link.async = false;
		  document.head.appendChild(link);
	  };
	});
}