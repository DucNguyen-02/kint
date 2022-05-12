(function() {
    'use strict';

    kintone.events.on('app.record.detail.show', function(event) {
        var record = event.record;
        show_condition_fields(record);
        ['その他1', 'その他2', 'その他3', 'その他4'].forEach((field) => {
            if(Number(record[field].value) < 0) {
                var element_other_show = kintone.app.record.getFieldElement(field)
                element_other_show.style.color = 'red'
            }
        })
        return event;
    });
    kintone.events.on('app.record.detail.process.proceed', async function(event) {
        var record = event.record;
        var index_of_status = list_statuses.indexOf(record.Status.value);
        var required = index_of_status < 2 ? required_wait_confirm:required_then_wait_payment;
        var empty_list = [];
        required.forEach((e) => {
            if (!record[e].value) {
                empty_list.push(e)
            }
        });
        if (empty_list.length > 0) {
            event.error = '次の項目にご入力してください。' + '\n' + empty_list.join(', ');
            return event;
        };

        if (event.action.value === '請求書未承認') {
            // let body = {
            //     app: get_data_from_appId,
            //     query: `company_code = "${record['企業コード'].value}" `
            // }
            // var other_record = await kintone.api(kintone.api.url('/k/v1/records', true), 'GET', body)
            var current_date = moment(new Date()).format('YYYY-MM-DD')
            record['請求書発行日'].value = current_date
            // record['支払期限'].value = await get_paid_day (record, other_record["records"][0])
            record['請求書送付日'].value = current_date
            return event

        }
        
        if ( event.action.value === '請求書送付済') {
            let body = {
                "app": send_data_to_appId,
                "record": data_send_to_66(record)
            }
            return kintone.api(kintone.api.url('/k/v1/record', true), 'POST', body).then(function(resp){
                alert('success');
            }, function(error){
                event.error = error.message;
                return event;
            })
        }
        // if ( record.Status.value === '入金待') {
        //     if (check_negative(record, ['合計', '残高'])) {
        //         if (confirm("")) {
        //             return event;
        //         }
        //         else {
        //             return false;
        //         }
        //     }
        // }

        return event;
    });
})();
