(function() {
    kintone.events.on('app.record.detail.show', function(event) {
        hide_field_export();
        return event;
    })
})()