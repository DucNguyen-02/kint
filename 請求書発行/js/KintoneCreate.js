(function() {
    'use strict';
    kintone.events.on('app.record.create.show', function(event) {
        var record = event.record;
        record.check_create.value = 'manual';
        record['発行番号'].value = '';
        record['請求書番号'].value = '';
        record['請求書ファイル名'].value = '';
        record['請求書番号'].disabled = true;
        record['発行番号'].disabled = true;
        record['請求先会社名'].disabled = true;
        record['合計'].disabled = true;
        record['請求書ファイル名'].disabled = true;
        record['請求書発行フラグ'].disabled = true;
        hide_print_fields(record)
        disable_condition_fields(record)
        return event;
    });

    kintone.events.on('app.record.create.change.スキーム', function(event) {
        var record = event.record;
        disable_condition_fields(record)
        return event
    });

    var calculate_sum = [
        'app.record.create.change.スキーム',
        'app.record.create.change.固定利用料',
        'app.record.create.change.立替金',
        'app.record.create.change.振込手数料',
        'app.record.create.change.サービス利用料',
        'app.record.create.change.その他1',
        'app.record.create.change.その他2',
        'app.record.create.change.その他3',
        'app.record.create.change.その他4',
        'app.record.create.change.振込手数料負担',
        'app.record.create.change.サービス利用料負担'
    ]

    kintone.events.on(calculate_sum, sum_fee);

    var calculate_other_amount = [
        'app.record.create.change.その他項目1',
        'app.record.create.change.その他項目2',
        'app.record.create.change.その他項目3',
        'app.record.create.change.その他項目4',
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

    kintone.events.on('app.record.create.change.企業コード', function(event) {
        var record = event.record;
        validate_number(event, record);

        return event
    });

    var change_date = [
        'app.record.create.change.サービス開始日',
        'app.record.create.change.サービス締日'
    ]

    kintone.events.on(change_date, function(event) {
        var record = event.record;
        validate_date(event, record);

        return event
    });

    var on_change_date = [
        'app.record.create.change.請求発行日',
        'app.record.create.change.サービス開始日',
        'app.record.create.change.サービス締日',
        'app.record.create.change.支払期限'
    ]

    kintone.events.on(on_change_date, function(event) {
        var record = event.record;

        record['印刷用＿請求発行日'].value = moment(record['請求発行日'].value).format('YYYY/MM/DD');
        record['印刷用＿サービス開始日'].value = moment(record['サービス開始日'].value).format('YYYY/MM/DD');
        record['印刷用＿サービス締日'].value = moment(record['サービス締日'].value).format('YYYY/MM/DD');
        record['印刷用＿支払期限'].value =moment(record['支払期限'].value).format('YYYY/MM/DD');

        return event
    });

    kintone.events.on('app.record.create.submit', function(event) {
        var record = event.record;
        var issue_date = moment(record['請求発行日'].value);
        var company_code = record['企業コード'].value;
        var date = issue_date.format('YYYY') + issue_date.format('MM');
        var issue_no = record['発行番号'].value;
        var query_like = date + '-' + company_code.slice(2, 9)
        var this_body = {
            'app': event.appId,
            'query': `請求書番号 like "${query_like}" order by $id desc limit 100`,
            'fields': ["$id","請求書番号", "発行番号"]
        };
        var that_body = {
            'app': appId,
            'query': `請求書番号 like "${query_like}" order by $id desc limit 100`,
            'fields': ["$id","請求書番号", "発行番号"]
        };
        validate_number(event, record);
        validate_date(event, record);
        record['check_create'].value = 'manual';
        set_data(record);
        return kintone.api('/k/v1/records', 'GET', this_body).then(function(resp1) {
            var first_resp = resp1.records.length === 0 ? 0: resp1.records[0]["請求書番号"].value.slice(-2,);
            return kintone.api(kintone.api.url('/k/v1/records', true), 'GET', that_body).then(function(resp2){
                var second_resp = resp2.records.length === 0 ? 0: resp2.records[0]["請求書番号"].value.slice(-2,);
                record["発行番号"].value = set_issue_No(Number(first_resp), Number(second_resp));
                record["請求書番号"].value = query_like + '-' +record["発行番号"].value;
                record['請求書ファイル名'].value = record['請求書番号'].value + '-' + record['請求先会社名'].value;
                if (Number(record["発行番号"].value) > 1){
                    return Swal.fire({
                        title: '<p>すでに請求書データは存在します </br> 再発行しますか？</p>',
                        icon: 'question',
                        showCancelButton: true,
                        focusConfirm: false,
                        confirmButtonText: '再発行',
                        cancelButtonText:'キャンセル',
                        confirmButtonColor: '#3498db',
                    }).then(function(result) {
                        if (!result.value) {
                            return false;
                        }
                        return event;
                    }
                )}
                return event;
            })
        });
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

    function validate_number(event, record) {
        if (!/^[0-9A-Za-z]+$/.test(record['企業コード'].value)) {
            event.error = "英数字（小文字含む）で９桁以上を入力してください";
        }
    }
})();