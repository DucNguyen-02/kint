(function() {
    'use strict';
    var events = ['app.record.edit.change.Matching_form', 'app.record.edit.show']
    kintone.events.on(events, function(event) {
        var record = event.record;
        if (record['inquiry_route'].value === 'その他'){
            disable_field(record, disable_field_after_create);
        }
        else {
            disable_field(record, disable_field_after_create_from_web);
        }
        show_matching_form(record);
        if (status_to_disable.includes(record['ステータス'].value)) {
            field_shown([], ['candidate_experts_tacle'])
        }
        return event;
    });
    kintone.events.on('app.record.edit.change.matching', check_box);
    kintone.events.on('app.record.edit.submit', function(event) {
        var record = event.record;
        reset_value(record);
        return event;
    });  
})();