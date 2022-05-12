(function() {
    'use strict';
    const element_other = {
        その他1: 'value-5532274',
        その他2: 'value-5532276',
        その他3: 'value-5532278',
        その他4: 'value-5532280'
    }
    kintone.events.on('app.record.detail.show', function(event) {
        var record = event.record;
        hide_print_fields(record);
        disable_condition_fields(record);
        other.forEach((f) => {
            if(Number(record[f[1]].value) < 0) {
                var element_other_show = document.getElementsByClassName(element_other[f[1]])[0]
                element_other_show.style.color = 'red'
            }
        })
        return event;
    });

})();