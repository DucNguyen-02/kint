(function() {
    'use strict';
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }
    const field_企業コード = 'field-5532317'
    const auto_fill = [
        '取引先コード', 'スキーム',
        '振込手数料負担', 'サービス利用料負担'
    ]
    const field_code = {
        取引先コード: ['field-5532310','text'],
        請求先会社名: ['field-5531431', 'text'],
        スキーム: ['field-5531471','radio'],
        振込手数料負担: ['field-5531451','dropbox'],
        サービス利用料負担: ['field-5531452', 'dropbox'],
        サービス開始日: ['field-5531453', 'text'],
        サービス締日: ['field-5531454', 'text'],
        請求書発行日: ['field-5531448', 'text'],
        支払期限: ['field-5531449', 'text'],
        請求書送付日: ['field-5531462', 'text']
    }
    class input_element{
        constructor (field) {
            this.div = document.getElementsByClassName(field[0])[0]
            this.field = field
            switch (this.field[1]) {
                case 'radio':
                    this.input = this.div.getElementsByTagName('input')
                    break;
                case 'dropbox':
                    this.input = this.div.getElementsByTagName('span')[1]
                    break;
                default:
                    this.input = this.div.getElementsByTagName('input')[0]
            }
             
        }
        set value(newvalue) {
            if (this.field[1] === 'radio'){
                for (let i=0; i<this.input.length; i++) {
                    if (this.input[i].value === newvalue) {
                        this.input[i].checked = true
                    }
                }
            }
            else if (this.field[1] === 'dropbox'){
            this.input.innerHTML = newvalue;
            }
            else{
                this.input.value = newvalue
            }
        }
    }
    class record_element {
        constructor () {
            this.record_element = () => {
                let record = {}
                for (let element in field_code) {
                    record[element] = new input_element(field_code[element])
                }
                return record
            }
        }
    }

    async function fill_data(e) {
        // await sleep(50)
        var input_company_code = document.querySelectorAll(`.${field_企業コード} input`)[0].value
        var query = 'company_code = "' + input_company_code + '"';
        var params = {
            app: get_data_from_appId,
            query: query
        }
        await kintone.api('/k/v1/records', 'GET', params, function(resp){
                if (resp['records'].length === 0) {
                    return 
                }
                let current = new Date()
                let first_day_of_month = new Date(current.getFullYear(), current.getMonth() + 1, 1)
                let end_day_of_month = new Date(current.getFullYear(), current.getMonth() + 2, 0)
                let first_day_of_nextmonth = new Date(current.getFullYear(), current.getMonth() + 1, 1)
                let this_record = new record_element().record_element();
                let get_record = resp['records'][0];
                this_record['取引先コード'].value = get_record['取引先コード'].value
                this_record['請求先会社名'].value = get_record['企業名'].value
                this_record['スキーム'].value = get_record['スキーム'].value
                this_record['振込手数料負担'].value = get_record['振込手数料負担'].value
                this_record['サービス利用料負担'].value = get_record['サービス手数料'].value
                this_record['請求書発行日'].value = moment(first_day_of_month).format('YYYY-MM-DD')
                this_record['支払期限'].value = moment(end_day_of_month).format('YYYY-MM-DD')
                this_record['請求書送付日'].value = moment(first_day_of_nextmonth).format('YYYY-MM-DD')
            }, function(error) {
                console.log(error)
            })
    }

    async function look_up_run(e) {
        await sleep(1000)
        var button = document.getElementsByClassName('button-simple-cybozu')
        for (let i=2; i<button.length; i++) {
            button[i].onclick = fill_data
        }
    }

    kintone.events.on('app.record.create.show', function(event) {
        var record = event.record;
        disable_fields(record, disable_when_create);
        disable_condition_fields(record);
        show_condition_fields(record);
        return event;
    });

    kintone.events.on('app.record.create.change.数値', function(event) {
        var record = event.record;
        var table = record['入金履歴'].value
        var sum = 0
        for (let i=0; i<table.length; i++) {
            sum += Number(table[i].value['数値'].value) || 0
        }
        record['入金額'].value = sum
        record['残高'].value = record['合計'].value - sum
        return event
    });

    kintone.events.on('app.record.create.change.請求先会社名', function(event) {
        var record = event.record;
        auto_fill.forEach(e => record[e].disabled = false)
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
    kintone.events.on('app.record.create.change.スキーム', function(event) {
        var record = event.record;
        disable_condition_fields(record);
        show_condition_fields(record);
        return event
    });
    var calculate_total = [
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
        'app.record.create.change.サービス利用料負担',
        'app.record.create.change.件数'
    ]

    kintone.events.on(calculate_total, sum_fee);

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


    kintone.events.on('app.record.create.submit', function(event) {
        var record = event.record;
        var code_id

        if (!record['請求書番号'].value) {
            var issue_date = !record['請求書発行日'].value ? moment(record['請求書発行日'].value): moment(new Date());
            var date = issue_date.format('YYYY') + issue_date.format('MM');
            var company_code = record['企業コード'].value;
            code_id = date + '-' + company_code.slice(2, 9)
        }
        else {
            code_id = record['請求書番号'].value.slice(0, 14)
        }

        var this_body = {
            'app': event.appId,
            'query': `企業コード = "${record['企業コード'].value}" order by $id desc limit 100`,
            'fields': ["$id","請求書番号"]
        };
        var that_body = {
            'app': send_data_to_appId,
            'query': `請求書番号 = "${record['企業コード'].value}" order by $id desc limit 100`,
            'fields': ["$id","請求書番号"]
        };
        validate_business_code(event, record);
        validate_date(event, record);

        return kintone.api('/k/v1/records', 'GET', this_body).then(function(resp1) {
            var first_resp = 0
            resp1.records.forEach(thisrecord => {
                if (thisrecord['請求書番号'].value.indexOf(code_id) >= 0) {
                    let num = Number(thisrecord['請求書番号'].value.slice(-2,))
                    if (first_resp < Number(thisrecord['請求書番号'].value.slice(-2,))) {
                        first_resp = num
                    }
                }
            })
            
            return kintone.api(kintone.api.url('/k/v1/records', true), 'GET', that_body).then(function(resp2){
                var second_resp = 0
                    resp2.records.forEach(thisrecord => {
                        if (thisrecord['請求書番号'].value.indexOf(code_id) >= 0) {
                            let num = Number(thisrecord['請求書番号'].value.slice(-2,))
                            if (second_resp < Number(thisrecord['請求書番号'].value.slice(-2,))) {
                                second_resp = num
                            }
                        }
                    })
                record["発行番号"].value = set_issue_No(first_resp, Number(second_resp));
                record["請求書番号"].value = code_id + '-' + record["発行番号"].value;
                if (Number(record["発行番号"].value) > 1){
                    return Swal.fire({
                        title: '<p>すでに請求書データは存在します </br> 再発行しますか？</p>',
                        icon: 'question',
                        showCancelButton: true,
                        focusConfirm: false,
                        confirmButtonText: '再発行',
                        confirmButtonColor: '#3498db',
                        cancelButtonText:'キャンセル',
                    }).then(function(result) {
                        if (!result.value) {
                            return false;
                        }
                        return event;
                    }
                )}
                return event;
            }, function(error) {
                return false;
            })
        }, function(error) {
            return false;
        });
    });

    function validate_business_code(event, record) {
        if (!/^[0-9A-Za-z]+$/.test(record['企業コード'].value)) {
            event.error = "英数字（小文字含む）で９桁以上を入力してください";
        }
    }

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