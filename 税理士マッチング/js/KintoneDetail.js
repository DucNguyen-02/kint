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
    // kintone.events.on('app.record.detail.process.proceed', function(event) {
    //     var record = event.record;
    //     var table = record['candidate_experts_tacle'].value;
    //     if (status_pre_end.includes(record['ステータス'].value)) {
    //         for (let i = 0; i < table.length; i++) {
    //             let row = table[i];
    //             if (row.value['matching'].value[0] === 'マッチング') {
    //                 record['specialist'].value = row.value['candidate_experts'].value;
    //             }
    //         }
    //     }
    //     return event;
    // });
})();