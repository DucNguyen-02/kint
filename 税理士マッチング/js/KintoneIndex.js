(function() {
    'use strict';
    var events = ['app.record.index.edit.show', 'app.record.index.edit.change.Matching_form']
    kintone.events.on(events, function(event) {
        var record = event.record;
        if (record['inquiry_route'].value === 'その他'){
            disable_field(record, disable_field_after_create);
        }
        else {
            disable_field(record, disable_field_after_create_from_web);
        }
        disable_matching_form(record);
        return event;
    });
    kintone.events.on('app.record.index.edit.change.matching', check_box);  
    kintone.events.on('app.record.index.edit.submit', function(event) {
        var record = event.record;
        reset_value(record);
        return event;
    });
})();