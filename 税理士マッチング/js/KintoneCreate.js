(function() {
    'use strict';
    var events = ['app.record.create.change.Matching_form', 'app.record.create.show']
    kintone.events.on(events, function(event) {
        var record = event.record;
        disable_field(record, ['inquiry_route', 'specialist']);
        show_matching_form(record);
        return event
    });
    kintone.events.on('app.record.create.submit', function(event) {
        var record = event.record;
        record['inquiry_route'].value = 'その他';
        return event
    });
    kintone.events.on('app.record.create.change.matching', check_box);  
})();