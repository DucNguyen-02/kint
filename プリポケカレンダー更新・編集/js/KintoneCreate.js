(function() {
    kintone.events.on('app.record.create.show', function(event) {
        var record = event.record;
        [temp[0], temp[1]] = control_hide_month_group[record['ラジオボタン_1'].value]
        hide_fields(control_hide[record['ラジオボタン'].value][0]);
        show_fields(control_hide[record['ラジオボタン'].value][1]);
        return event;
    })

    kintone.events.on('app.record.create.change.ラジオボタン', function(event) {
        var record = event.record;
        [temp[0], temp[1]] = control_hide_month_group[record['ラジオボタン_1'].value]
        hide_fields(control_hide[record['ラジオボタン'].value][0]);
        show_fields(control_hide[record['ラジオボタン'].value][1]);
        return event;
    })

    kintone.events.on('app.record.create.change.ラジオボタン_1', function(event) {
        var record = event.record;
        hide_fields(control_hide_month_group[record['ラジオボタン_1'].value][0]);
        show_fields(control_hide_month_group[record['ラジオボタン_1'].value][1]);
        return event;
    })
})();