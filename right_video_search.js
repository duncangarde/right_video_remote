$(function () {

  function stringifyQuery (result) {
    if (result.prefix === "of") {
      string_shard = "best-" + result.query_name.toLowerCase() + "-videos";
    } else if (result.prefix === "-") {
      string_shard = "best-" + result.query_name.toLowerCase();
    } else if (result.prefix === "video") {
      string_shard = "video-" + result.query_name;
    } else {
      string_shard = "best-videos-" + result.prefix + "-" + result.query_name.toLowerCase();
    }
    return string_shard
  };
  
  var jsonFetcher = function() {
    var href = $('[data-id="rv-ta-i"]').data('href')
    var timeout;
    return function findMatches(q, cb, asyncs) {
      function handleResponse(data) {
        asyncs(data)
      }

      if (timeout) {
        clearTimeout(timeout);
      }

      timeout = setTimeout(function() {
        $.ajax({
          dataType: "json",
          url: href + "/search/autocomplete.json?query=" + q,
          crossOrigin: true,
          success: handleResponse,       
        });
      }, 350);
    };
  };

  $('[data-id="rv-ta-i"]').typeahead(
    {
      hint: false,
      highlight: true,
      minLength: 1
    },
    {
      name: 'states',
      display: 'name',
      limit: 50,
      source: jsonFetcher(),
      templates: {
            pending: '<div class="ta-center">searching..</div>',
            notFound: '<div class="lato ta-center" data-id="autocomplete_no_results">sorry there are no results for that search</div>',
            suggestion: function(result) {
              var href = $('[data-id="rv-ta-i"]').data('href');
              var string_shard = stringifyQuery(result);
              return '<a class="no-link-decoration" data-model="' + result.model + '" href="' + href + '/explore/' + string_shard +'">' + '<span class="pull-right">' + result.category + '</span>' + result.name + '</a>'
            },
          },
    }
  );

  $('[data-id="rv-ta-i"]').on('typeahead:asyncreceive', function(e, suggestions, async, dataset) {
    var tag_results_size;
    var href = $('[data-id="rv-ta-i"]').data('href')
    var query = $('[data-id="rv-ta-i"]').val();
    if ($('.tt-suggestion').length || $('[data-id="autocomplete_no_results"]').length) {
      tag_results_size = $('.tt-suggestion[data-model="tag"]').length
      if (tag_results_size <= 5 && query.length > 1) {
        $('[data-id="autocomplete_no_results"]').addClass('hidden');
        $('.tt-dataset').append('<div data-id="related_results_pending" class="ta-center" style="padding-top:8px;padding-bottom:8px">looking for related results</div>');
        $.getJSON(href + '/tags/search_autocomplete_related.json?query=' + query, function(data) {
          var dataset = $('.tt-dataset');
          var related_results_placeholder = dataset.find('[data-id="related_results_pending"]');
          data.forEach(function(result) {
            var string_shard = stringifyQuery(result)
            related_results_placeholder.before('<a class="tt-suggestion tt-selectable no-link-decoration" href="' + href + '/explore/' + string_shard + '" data-model="' + result.model + '" data-class="typeahead_related_suggestion" data-name="' + result.name +'" data-prefix="' + result.prefix + '" data-query-name="' + result.query_name + '" data-category="' + result.category + '"><span class="pull-right">'+ result.category + '</span>' + result.name + '</a>');
          });
          related_results_placeholder.remove();
          if (dataset.find('.tt-suggestion').length < 1) {
            dataset.find('[data-id="autocomplete_no_results"]').removeClass('hidden');
          };
        });
      };
    }
    if (query !== void 0) {
      $.getJSON(href + '/videos/search_autocomplete.json?query=' + query, function(data) {
        var dataset = $('.tt-dataset');
        data.forEach(function(result) {
          var string_shard = stringifyQuery(result)
          dataset.append('<a class="tt-suggestion tt-selectable no-link-decoration" href="' + href + '/explore/' + string_shard + '" data-model="' + result.model + '" data-class="typeahead_related_suggestion" data-name="' + result.name +'" data-prefix="' + result.prefix + '" data-query-name="' + result.query_name + '" data-category="' + result.category + '"><span class="pull-right">'+ result.category + '</span>' + result.name + '</a>');
        });
        if (dataset.find('.tt-suggestion').length < 1) {
          dataset.find('[data-id="autocomplete_no_results"]').removeClass('hidden');
        };
      });
    }
  });
});
