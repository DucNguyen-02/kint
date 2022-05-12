(function() {
    kintone.events.on('app.record.detail.show', function(event) {
        var record = event.record;
        [temp[0], temp[1]] = control_hide_month_group[record['ラジオボタン_1'].value]
        hide_fields(control_hide[record['ラジオボタン'].value][0]);
        show_fields(control_hide[record['ラジオボタン'].value][1]);
        return event;
    })
})()