// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

var tags = [];
var suggestions = {};

function getTags() {
	var query = "";

	$.each($('.post-taglist .post-tag'), function(index, value) {
		console.log(value.text);
		tags.push(value.text);
		query += value.text + " ";
	})
	
	return query;
};

function searchTags(query, callback) {
  $.getJSON('http://localhost:8983/solr/posts/tagsuggest', { q: query }, callback);	
};

function exists(arr,obj) {
    return (arr.indexOf(obj) != -1);
};

function onResults(data) {
  var lasttag = "";

  $.each(data['facet_counts']['facet_fields']['QuestionTags'], function(index, value) {
    if (index%2==0) {
	    lasttag = value;
    } else {
	    if (!exists(tags, lasttag)) // new suggestions
			suggestions[lasttag] = value;
	}
  });

  $.each(suggestions, function(key, value) {
    var link = $('<a/>').addClass('post-tag').css('background-color','yellow');
    link.text(key);
	link.attr('href', '/questions/tagged/'+key);
	link.attr('rel', 'tag');
	$('.post-taglist').first().append(link);
	console.log(key + ' (' + value + ')');
  });

};


$(document).ready(function () {
	searchTags(getTags(), onResults);
});




