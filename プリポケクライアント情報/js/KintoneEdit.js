(function() {
    kintone.events.on('app.record.edit.show', function(event) {
        var record = event.record
        hide_field_export();
        disable_end_month(record)
        return event;
    })

    var end_month =[
        'app.record.edit.change.paid_day_checkbox',
        'app.record.edit.change.open_day_checkbox',
        'app.record.edit.change.limit_day_checkbox',
    ]

    kintone.events.on(end_month, function(event) {
        var record = event.record
        disable_end_month(record)
        return event;
    })

})()