(function() {
    'use strict';
    kintone.events.on('app.record.edit.show', function(event) {
        var record = event.record;
        hide_print_fields(record)
        if (record['check_create'].value === 'manual') {
            var fields = ['請求書番号', '発行番号', '請求先会社名',
                '合計', '請求発行日', '企業コード', '取引先コード',
                '請求書ファイル名', '請求書発行フラグ'
            ]
            disable_fields(record, fields);
            disable_condition_fields(record)
        }
        else {
            disable_fields(record, field_disable_autocreate);
        }
        return event;
    });

    kintone.events.on('app.record.edit.change.スキーム', function(event) {
        var record = event.record;
        hide_print_fields(record)
        disable_condition_fields(record)
        return event
    });

    var calculate_sum = [
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

    kintone.events.on(calculate_sum, sum_fee);

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

    kintone.events.on('app.record.edit.change.企業コード', function(event) {
        var record = event.record;
        validate_number(event, record);

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

    kintone.events.on('app.record.edit.submit', function(event) {
        var record = event.record;

        if (record['請求書ファイル名'].value === '') {
            record['請求書ファイル名'].value = record['請求書番号'].value + '-' + record['請求先会社名'].value;
        }

        validate_number(event, record);
        validate_date(event, record);

        return event;
    });

    function validate_date(event, record) {

        if (record['サービス締日'].value !== undefined) {
            var startDate = moment(record['サービス開始日'].value).format('YYYY-MM-DD');
            var endDate = moment(record['サービス締日'].value).format('YYYY-MM-DD');

            if (moment(startDate).isAfter(endDate)) {
                event.error = "サービス締日は「サービス開始日」以降に設定してください";
            }

            if (moment(startDate).isSame(endDate)) {
                event.error = "サービス締日は「サービス開始日」以降に設定してください";
            }
        }
    }

    function validate_number(event, record) {
        if (!/^[0-9A-Za-z]+$/.test(record['企業コード'].value)) {
            event.error = "英数字（小文字含む）で９桁以上を入力してください";
        }
    }

    var on_change_date = [
        'app.record.edit.change.請求発行日',
        'app.record.edit.change.サービス開始日',
        'app.record.edit.change.サービス締日',
        'app.record.edit.change.支払期限'
    ]

    kintone.events.on(on_change_date, function(event) {
        var record = event.record;
        record['印刷用＿請求発行日'].value = moment(record['請求発行日'].value).format('YYYY/MM/DD');
        record['印刷用＿サービス開始日'].value = moment(record['サービス開始日'].value).format('YYYY/MM/DD');
        record['印刷用＿サービス締日'].value = moment(record['サービス締日'].value).format('YYYY/MM/DD');
        record['印刷用＿支払期限'].value =moment(record['支払期限'].value).format('YYYY/MM/DD');
        return event
    });

    kintone.events.on('app.record.edit.submit', function(event) {
        var record = event.record;
        set_data(record);
        return event
    });

})();