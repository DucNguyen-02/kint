(function () {
    kintone.events.on('app.record.create.show', function(event) {
        hide_field_print();
        return event;
    })
  })(); 