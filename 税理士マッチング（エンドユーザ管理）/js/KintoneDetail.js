(function() {
    'use strict';
    kintone.events.on('app.record.detail.show', function(event) {
        var record = event.record;
        show_matching_form(record);
        if (status_to_disable.includes(record['ステータス'].value)) {
            field_shown([], ['candidate_experts_tacle']);
        }
        return event;
    });
})();