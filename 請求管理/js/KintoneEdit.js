(function() {
    'use strict';
    kintone.events.on('app.record.edit.show', function(event) {
        var record = event.record;
        var status = list_statuses.indexOf(record.Status.value);
        disable_status.record = record;  
        disable_condition_fields(record);
        enable_fields(record, disable_from_api)
        if (record['api'].value === 'true') {
            let disable_fields_notundefine = []
            disable_from_api.forEach ((e) => {
                record[e].value ? disable_fields_notundefine.push(e):''
            })
            disable_fields(record, disable_fields_notundefine)
        } 
        show_condition_fields(record);
        disable_status[record.Status.value]();
        return event;
    });
    kintone.events.on('app.record.edit.submit', function(event) {
        var record = event.record;
        var index_of_status = list_statuses.indexOf(record.Status.value);
        var required = index_of_status < 2 ? required_wait_confirm:required_then_wait_payment;
        var check_field = false;
        required.forEach((e) => {
            if (!record[e].value) {
                record[e].error = 'please fill ' + e + ' field'
                check_field = true
            }
        })
        if (check_field) {
            event.error = 'please check infomation of record';
        }
        return event;
    });
    kintone.events.on('app.record.edit.change.スキーム', function(event) {
        var record = event.record;
        disable_condition_fields(record);
        show_condition_fields(record);
        return event
    });

    var change_date = [
        'app.record.edit.change.サービス開始日',
        'app.record.edit.change.サービス締日'
    ]

    kintone.events.on(change_date, function(event) {
        var record = event.record;
        validate_date(event, record);
        return event
    });

    var calculate_total = [
        'app.record.edit.change.スキーム',
        'app.record.edit.change.固定利用料',
        'app.record.edit.change.立替金',
        'app.record.edit.change.振込手数料',
        'app.record.edit.change.サービス利用料',
        'app.record.edit.change.その他1',
        'app.record.edit.change.その他2',
        'app.record.edit.change.その他3',
        'app.record.edit.change.その他4',
        'app.record.edit.change.振込手数料負担',
        'app.record.edit.change.サービス利用料負担'
    ]

    kintone.events.on(calculate_total, sum_fee)

    var calculate_other_amount = [
        'app.record.edit.change.その他項目1',
        'app.record.edit.change.その他項目2',
        'app.record.edit.change.その他項目3',
        'app.record.edit.change.その他項目4',
    ]

    kintone.events.on(calculate_other_amount, function(event) {
        let record = event.record;
        let varible = event.type.slice(-1)
        let value = 'その他' + varible
        if (!record['その他項目' + varible].value) {
            record[value].value = 0
            record[value].disabled = true
        } 
        else {
            record[value].disabled = false
        }
        return event
    });


    kintone.events.on('app.record.edit.change.合計', function(event) {
        var record = event.record;
        var balance = record['合計'].value - Number(record['入金額'].value)
        record['残高'].value = balance < 0 ? 0: balance;
        return event
    });

    kintone.events.on('app.record.edit.change.数値', function(event) {
        var record = event.record;
        var table = record['入金履歴'].value
        var sum = 0
        for (let i=0; i<table.length; i++) {
            sum += Number(table[i].value['数値'].value) || 0
        }
        record['入金額'].value = sum
        var balance = record['合計'].value - sum
        record['残高'].value = balance < 0 ? 0: balance;
        return event
    });

    kintone.events.on('app.record.edit.submit', function(event) {
        var record = event.record;
        var field_required = ['入金日', '入金額'];
        check_required(record, field_required);
        validate_date(event, record);
        return event;
    });

    function validate_date(event, record) {
        if (record['サービス締日'].value !== undefined) {
            var start_date = moment(record['サービス開始日'].value).format('YYYY-MM-DD');
            var end_date = moment(record['サービス締日'].value).format('YYYY-MM-DD');

            if (moment(start_date).isAfter(end_date)) {
                event.error = "サービス締日は「サービス開始日」以降に設定してください";
            }

            if (moment(start_date).isSame(end_date)) {
                event.error = "サービス締日は「サービス開始日」以降に設定してください";
            }
        }
    }
})();