$(function() {
    // Set up polling to update leaders and question. TODO: socket.io for push
    $leaders = $('#top-players'),
    $question = $('blockquote');
    setInterval(function() {

        // Get leaders
        $.getJSON('/poll', function(data) {
            $question.html(data.question[0].question);

            var $wrapper = $('<div class="leader-list"></div>');
            for (var i = 0, l = data.leaders.length; i<l; i++) {
                var leader = data.leaders[i],
                    $leader = $('<div class="leader place'+i+'"></div>');

                $leader.html(leader.nick+' ('+leader.points+')');
                $wrapper.append($leader);
            }

            $leaders.html($wrapper);
        });
    }, 1000);
});