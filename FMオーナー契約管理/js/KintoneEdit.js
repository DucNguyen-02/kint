(function () {
    kintone.events.on('app.record.edit.show', function(event) {
        hide_field_print();
        return event;
    })
  })(); 