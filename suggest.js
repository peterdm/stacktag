// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.


var detailPattern = new RegExp("/[0-9]+");
var detail = detailPattern.exec(document.URL);

function suggestTags(parentElement, childElements) {
  var query = "";
  var tags = [];

  $.each(childElements, function(index, value) {
	console.log(value.text);
	tags.push(value.text);
	query += value.text + " ";
  });

  if (query) {
  	$.getJSON('http://localhost:8983/solr/posts/tagsuggest', { q: query }, createCallback(parentElement, tags));
  }
}


function layoutSuggestions(data, parentElement, tags) {
    var suggestions = {};
	var lasttag = "";
	var numberFound = data['response']['numFound'];

	$.each(data['facet_counts']['facet_fields']['QuestionTags'], function(index, value) {
		if (index%2==0) {
			lasttag = value;
		} else {
			if (!exists(tags, lasttag)) // new suggestions
			suggestions[lasttag] = value;
		}
	});

	var link = '';
	$.each(suggestions, function(key, value) {
		link = $('<a/>').addClass('post-tag');
		link.text(key);
		link.attr('href', '/questions/tagged/'+key);
		link.attr('rel', 'tag');
		var opacity = 1 / Math.log(1/(value/numberFound)); // turn exp dropoff into geo
		link.css({
			'color' : '#7b9fb8',
			'background-color' : 'rgba(224, 234, 241,' + opacity + ')',
			'border-bottom' : '1px solid rgba(62, 109, 142,' + opacity + ')',
			'border-right' : '1px solid rgba(127, 159, 182,' + opacity + ')'
		});
		parentElement.append(link);
		console.log(parentElement.parent().parent().attr('id') + ': ' + key + ' (' + value + ')');
	});

};


function createCallback(parentElement, tags) {
   return function(data) {
      layoutSuggestions(data, parentElement, tags);
   };
};
 


function exists(arr,obj) {
    return (arr.indexOf(obj) != -1);
};




$(window).load(function () {
	// handle question detail page	
	if (detail) {
		suggestTags($('.post-taglist'), $('.post-taglist').find('.post-tag') );
		tagsLoaded = true;
    }
	else if (document.URL.indexOf('?') > -1) {  // delay for ajax load
		setTimeout(function() {		
			$.each($('.tags'), function(index, value) {
			 	parentElement = $(value);
				suggestTags(parentElement, parentElement.find('.post-tag') );	
			});
		}, 500);
	}
	else {
		$.each($('.tags'), function(index, value) {
		 	parentElement = $(value);
			suggestTags(parentElement, parentElement.find('.post-tag') );	
		});		
	}

});




