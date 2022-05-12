(function() {
    "use strict";
    kintone.events.on('app.record.index.edit.show', function(event) {
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

    var change_date = [
        'app.record.index.edit.change.サービス開始日',
        'app.record.index.edit.change.サービス締日'
    ];

    kintone.events.on(change_date, function(event) {
        var record = event.record;
        validate_date(event, record);

        return event
    });

    kintone.events.on('app.record.index.edit.change.スキーム', function(event) {
        disable_condition_fields(event.record)

        return event
    });

    var calculate_sum = [
        'app.record.index.edit.change.スキーム',
        'app.record.index.edit.change.固定利用料',
        'app.record.index.edit.change.立替金',
        'app.record.index.edit.change.振込手数料',
        'app.record.index.edit.change.サービス利用料',
        'app.record.index.edit.change.その他',
        'app.record.index.edit.change.振込手数料負担',
        'app.record.index.edit.change.サービス利用料負担'
    ]

    kintone.events.on(calculate_sum, sum_fee);

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

    kintone.events.on('app.record.index.edit.submit', function(event) {
        var record = event.record;

        if (record['請求書ファイル名'].value === '') {
            record['請求書ファイル名'].value = record['請求書番号'].value + '-' + record['請求先会社名'].value;
        }

        validate_date(event, record);

        return event;
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

    kintone.events.on('app.record.index.edit.submit', function(event) {
        var record = event.record;
        set_data(record);
        return event
    });

    var calculate_other_amount = [
        'app.record.index.edit.change.その他項目1',
        'app.record.index.edit.change.その他項目2',
        'app.record.index.edit.change.その他項目3',
        'app.record.index.edit.change.その他項目4',
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

    kintone.events.on('app.record.index.show', function(event) {
        var records = event.records;
        var header_index = document.getElementsByClassName('gaia-argoui-app-index-toolbar')[0]
        // Options for the observer (which mutations to observe)
        const config = { attributes: true, childList: true, subtree: true };

        // Callback function to execute when mutations are observed
        const callback = function(mutationsList, observer) {
            // Use traditional 'for loops' for IE 11
            for(const mutation of mutationsList) {
                if (mutation.type === 'attributes') {
                    if (mutation.target === document.querySelectorAll('div.ui.progress.success')[0]) {
                        let record_prints = records.map(e => {
                            return {
                                id: e.$id.value,
                                record: {
                                    請求書発行フラグ: {
                                        value: ['済'],
                                    }
                                }
                            }
                        })
                        let param_print = {
                            app: event.appId,
                            records: record_prints
                        }
                        kintone.api(kintone.api.url('/k/v1/records', true), 'PUT', param_print, function(resp) {
                            let url = mutation.target.baseURI
                            window.location.href = url.replace(url.slice(url.indexOf('?'),), `?view=${view_print}`)
                            // location.reload()
                            console.log(resp);
                        }, function(error) {
                            // error
                            console.log(error);
                        });    
                    }
                }
            }
        };

        // Create an observer instance linked to the callback function
        const observer_print = new MutationObserver(callback);

        // Start observing the target node for configured mutations
        observer_print.observe(header_index, config);


        if (event.viewName === '発行済み') {
            return event
        }

        var update_records = []
        records.forEach(e => {
            if (!e['印刷用＿請求発行日'].value) {
                update_records.push(e)
            }
        })
        var update_data = update_records.map(e => {
            set_data(e)
            return {
                id: e.$id.value,
                record: set_print(e, fields_print)
            }
        })
        var param = {
            app: event.appId,
            records: update_data
        }

        kintone.api(kintone.api.url('/k/v1/records', true), 'PUT', param, function(resp) {
            // success
            console.log(resp);
          }, function(error) {
            // error
            console.log(error);
          });

    })

})();