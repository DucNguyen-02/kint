// must add semicolon at end statement
const send_data_to_appId = 66;

const get_data_from_appId = 152;

const disable_from_api = [
    '取引先コード', '企業コード',
    'スキーム', '振込手数料負担',
    'サービス利用料負担',
    // 'サービス開始日', 'サービス締日',
]
const disable_when_create = [
    '請求書番号', '発行番号',
    '合計', '残高', '入金日',
];

const disable_un_confirm = [
    '請求書番号', '請求先会社名', 
    '発行番号', '合計',
    '入金日', '残高',
];

const disable_wait_confirm = 
    ['請求書番号', '取引先コード','請求先会社名', '請求先備考',
    '企業コード', '発行番号', '請求書発行日', 'スキーム', '振込手数料負担',
    'サービス利用料負担', 'サービス開始日', 'サービス締日', '件数', '固定利用料',
    '立替金', '振込手数料', 'サービス利用料', '合計', '請求書送付日',
    '入金日', '残高', 'その他項目1', 'その他項目2', 'その他項目3', 'その他項目4',
    'その他1', 'その他2', 'その他3', 'その他4'
];

const disable_wait_confirm_vs_payment_approval_vs_complete = 
    ['請求書番号', '取引先コード','請求先会社名', '請求先備考',
    '企業コード', '発行番号', '請求書発行日', '支払期限', 'スキーム', '振込手数料負担',
    'サービス利用料負担', 'サービス開始日', 'サービス締日', '件数', '固定利用料',
    '立替金', '振込手数料', 'サービス利用料', '合計', '請求書送付日',
    '入金日', '残高', 'その他項目1', 'その他項目2', 'その他項目3', 'その他項目4',
    'その他1', 'その他2', 'その他3', 'その他4'
];

const disable_wait_payment = ['請求書番号', '取引先コード', '請求先会社名', '請求先備考',
    '企業コード', '発行番号', '請求書発行日', '支払期限', 'スキーム', '振込手数料負担',
    'サービス利用料負担', 'サービス開始日', 'サービス締日', '件数', '固定利用料',
    '立替金', '振込手数料', 'サービス利用料', '合計', '請求書送付日', '残高',
    'その他項目1', 'その他項目2', 'その他項目3', 'その他項目4',
    'その他1', 'その他2', 'その他3', 'その他4'
];

const required_wait_confirm = 
    ['請求書番号', '取引先コード','請求先会社名', 
    '企業コード', '発行番号', '支払期限', 'スキーム', '振込手数料負担',
    'サービス利用料負担', 'サービス開始日', 'サービス締日', '件数',
    'サービス利用料',
];
const required_then_wait_payment = 
    ['請求書番号', '取引先コード','請求先会社名', 
    '企業コード', '発行番号', '請求書発行日', '支払期限', 'スキーム', '振込手数料負担',
    'サービス利用料負担', 'サービス開始日', 'サービス締日', '件数',
    'サービス利用料', '合計', '請求書送付日',
    '入金日', '残高',
];

const list_statuses = [
    '請求書未承認',
    '請求書承認待',
    '請求書送付済',
    '入金待',
    '入金承認',
    '完了',
];

const disable_status = {
    record: Object,
    請求書未承認: function() {disable_fields(this.record, disable_un_confirm)},
    請求書承認待: function() {disable_fields(this.record, disable_wait_confirm)},
    請求書送付済: function() {disable_fields(this.record, disable_wait_payment)},
    入金待: function() {disable_fields(this.record, disable_wait_payment)},
    入金承認: function() {disable_fields(this.record, disable_wait_confirm_vs_payment_approval_vs_complete)},
    入金修正: function() {disable_fields(this.record, disable_wait_payment)},
    完了: function() {disable_fields(this.record, disable_wait_confirm_vs_payment_approval_vs_complete)},
    破棄: function() {disable_fields(this.record, disable_wait_payment)},

};

const field_number = [
    '件数', '固定利用料', '立替金', '振込手数料',
    'サービス利用料', '入金額'
]

const set_month = {
    当月: 0,
    翌月: 1,
    翌々月: 2,
}

const other = [
    ['その他項目1','その他1'],
    ['その他項目2','その他2'],
    ['その他項目3','その他3'],
    ['その他項目4','その他4']
]

function disable_fields(record, fields) {
    for (let field of fields){
        record[field].disabled = true;
    }
};

function enable_fields(record, fields) {
    for (let field of fields){
        record[field].disabled = false;
    }
};

function check_required(record, fields) {
    for (let field of fields) {
        if (!record[field].value) {
            return field;
        }
    }
    return false;
};

function disable_condition_fields_index(record) {
    record['入金額'].disabled = true
    if (record['スキーム'].value === '直接') {
        disable_fields(record, ['立替金', '振込手数料']);
        enable_fields(record, ['固定利用料']);
        record['立替金'].value = 0;
        record['振込手数料'].value = 0;
    } else {
        disable_fields(record, ['固定利用料']);
        enable_fields(record, ['立替金', '振込手数料']);
        record['固定利用料'].value = 0;
    }
};

function disable_condition_fields(record) {
    disable_condition_fields_index(record);
    other.forEach ((e) => {
        record[e[1]].disabled = !record[e[0]].value
    })
};

function show_condition_fields(record) {
    kintone.app.record.setFieldShown('api', false);
    kintone.app.record.setFieldShown('その他', false);
    
    if (record['スキーム'].value === '直接') {
        kintone.app.record.setFieldShown('立替金', false);
        kintone.app.record.setFieldShown('振込手数料', false);
        kintone.app.record.setFieldShown('固定利用料', true);
    } else {
        kintone.app.record.setFieldShown('立替金', true);
        kintone.app.record.setFieldShown('振込手数料', true);
        kintone.app.record.setFieldShown('固定利用料', false);
    }
};

function data_send_to_66(i) {
    return {
        請求書番号: {
            value: i['請求書番号'].value
        },
        請求発行日: {
            value: i['請求書発行日'].value
        },
        発行番号: {
            value: i['発行番号'].value
        },
        取引先コード: {
            value: i['取引先コード'].value
        },
        請求先会社名: {
            value: i['請求先会社名'].value
        },
        企業コード: {
            value: i['企業コード'].value
        },
        スキーム: {
            value: i['スキーム'].value
        },
        振込手数料負担: {
            value: i['振込手数料負担'].value === '個人負担(外/外)' ? '個人負担(外)' : i['振込手数料負担'].value
        },
        サービス利用料負担: {
            value: i['サービス利用料負担'].value === '個人負担(外/外)' ? '個人負担(外)' : i['サービス利用料負担'].value
        },
        サービス開始日: {
            value: i['サービス開始日'].value
        },
        サービス締日: {
            value: i['サービス締日'].value
        },
        支払期限: {
            value: i['支払期限'].value
        },
        固定利用料: {
            value: i['固定利用料'].value
        },
        立替金: {
            value: i['立替金'].value
        },
        振込手数料: {
            value: i['振込手数料'].value
        },
        サービス利用料: {
            value: i['サービス利用料'].value
        },
        合計: {
            value: i['合計'].value
        },
        請求書ファイル名: {
            value: `${i['請求書番号'].value}-${i['請求先会社名'].value}`
        },
        請求先備考: {
            value: i['請求先備考'].value
        },
        その他項目1: {
            value: i['その他項目1'].value
        },
        その他1: {
            value: i['その他1'].value
        },
        その他項目2: {
            value: i['その他項目2'].value
        },
        その他2: {
            value: i['その他2'].value
        },
        その他項目3: {
            value: i['その他項目3'].value
        },
        その他3: {
            value: i['その他3'].value
        },
        その他項目4: {
            value: i['その他項目4'].value
        },
        その他4: {
            value: i['その他4'].value
        },
        check_create:{
            value: "api"
        }
    }
};

function set_issue_No(No1, No2){
    var No
    if (No1 === 0 && No2 === 0){
        return '01';
    }
    if (No1 >= No2){
        No = No1 + 1;
    }
    else {
        No = No2 + 1;
    }
    return No < 10 ? '0' + No: String(No)
};

function sum_fee(event){
    var record = event.record;
    var base_fee = 0;
    var transfer_fee = 0;
    var service_usage_fee = 0;
    var other_fee = 0;
    record['立替金'].value = isNaN(record['立替金'].value) ? 0 : record['立替金'].value
    record['振込手数料'].value = isNaN(record['振込手数料'].value) ? 0 : record['振込手数料'].value
    record['サービス利用料'].value = isNaN(record['サービス利用料'].value) ? 0 : record['サービス利用料'].value
    record['その他1'].value = isNaN(record['その他1'].value) ? 0 : record['その他1'].value
    record['その他2'].value = isNaN(record['その他2'].value) ? 0 : record['その他2'].value
    record['その他3'].value = isNaN(record['その他3'].value) ? 0 : record['その他3'].value
    record['その他4'].value = isNaN(record['その他4'].value) ? 0 : record['その他4'].value
    record['固定利用料'].value = isNaN(record['固定利用料'].value) ? 0 : record['固定利用料'].value
    if (record['スキーム'].value === '直接') {
        base_fee = record['固定利用料'].value;
        service_usage_fee = record['サービス利用料'].value
    }

    if (record['スキーム'].value === '立替') {
        base_fee = record['立替金'].value;
        transfer_fee = record['振込手数料負担'].value === '個人負担(内)' ? 0 : record['振込手数料'].value
        service_usage_fee = record['サービス利用料負担'].value === '個人負担(内)' ? 0 : record['サービス利用料'].value
    }
    other_fee = Number(record['その他1'].value) + Number(record['その他2'].value) + Number(record['その他3'].value) + Number(record['その他4'].value) ;
    record['その他'].value = other_fee;
    record['合計'].value = Number(base_fee) + Number(transfer_fee) + Number(service_usage_fee) + Number(other_fee)
    record['残高'].value = record['合計'].value - Number(record['入金額'].value)
    return event
};

class check_record {
    constructor(record, required){
        this.record = record;
        var required_list = [];
        required.forEach((e) => {
            if (!record[e].value) {
                required_list.push(e)
            }
        });
        this.required_field = required_list;
    }
    get index(){
        let a = document.getElementsByTagName('tr');
        for (let i=0; i< a.length; i++){
            if (a[i].children[2].children[0].children[0].innerText === this.record['請求書番号'].value) {
                return i
            }
        }
    }
};

function message_record (recordlist) {
    var message = [];
    recordlist.forEach (e => message.push(`行目${e.index+1}：${e.required_field.join(', ')} ${e.record['請求書番号'].value}`)) 
    if (message.length > 2) {
        message= message.slice(0,2).concat(['その他'])
    }
    return message.join('\n')
};

function check_negative(record, fields) {
    for (let i=0; i < fields.length; i++) {
        if (record[fields[i]].value < 0) {
            return false
        }
    }
    return true
};

class get_time{
    constructor(timeobject) {
        this.timeobject = timeobject
        this.start_month = new Date(timeobject.getFullYear(), timeobject.getMonth() + 1, 1)
        this.end_month = new Date(timeobject.getFullYear(), timeobject.getMonth() + 2, 0)
        this.next_month = new Date(timeobject.getFullYear(), timeobject.getMonth() + 1, 1)
    }
};

function set_bill_code (record, timeobject) {
    let company_code = record['company_code'].value;
    let date = moment(timeobject).format('YYYYMM')
    return date + '-' + company_code.slice(2, 9)
};

function set_data_records(records, timeobject) {
    var time = new get_time(timeobject);
    var data_records = [];
    var year = timeobject.getFullYear()
    var holidays;
    return get_holiday_date(`https://holidays-jp.github.io/api/v1/${year}/date.json`).then((resp) => {
        holidays=resp
        records.forEach(record => {
            let month = 0
            let number_open_day = Number(get_number_of_month(record['open_day_checkbox'].value, record['open_day'].value))
            let number_limit_day = Number(get_number_of_month(record['limit_day_checkbox'].value, record['limit_day'].value))
            if (number_open_day >= number_limit_day) {
                month = -1 
            }
            let number_paid_day, number_paid_month, fixvalue, paid_date_condition
            if (record['スキーム'].value === '直接') {
                number_paid_day = 31
                number_paid_month = 1
                fixvalue = 11000
                paid_date_condition = 0
            }
            else {
                number_paid_day = Number(get_number_of_month(record['paid_day_checkbox'].value, record['paid_day'].value))
                number_paid_month = set_month[record['paid_month'].value]
                fixvalue = 0
                paid_date_condition = condition_holiday(record['paid_holiday_setting'].value)
            }
            let last_month = new Date(timeobject.getFullYear(), timeobject.getMonth() + month, 1)
            let open_day = get_input_date(number_open_day, last_month)
            let paid_date = new Date(timeobject.getFullYear(), timeobject.getMonth() + number_paid_month, 1)
            let limit_date = new Date(timeobject)
            data_records.push({
                請求書番号: {
                    value: set_bill_code(record, timeobject) + '-01'
                },
                取引先コード: {
                    value: record['取引先コード'].value
                },
                請求先会社名: {
                    value: record['企業名'].value
                },
                企業コード: {
                    value: record['company_code'].value
                },
                発行番号: {
                    value:'01'
                },
                支払期限: {
                    value: moment(cal_date(get_input_date(number_paid_day, paid_date), holidays, paid_date_condition)).format('YYYY-MM-DD')
                },
                スキーム: {
                    value: record['スキーム'].value
                },
                振込手数料負担: {
                    value: record['振込手数料負担'].value
                },
                サービス利用料負担: {
                    value: record['サービス手数料'].value
                },
                サービス開始日: {
                    value: moment(cal_date(open_day, holidays, condition_holiday(record['open_holiday_setting'].value))).format('YYYY-MM-DD')
                },
                サービス締日: {
                    value: moment(cal_date(get_input_date(number_limit_day, limit_date), holidays, condition_holiday(record['limit_holiday_setting_0'].value))).format('YYYY-MM-DD')
                },
                固定利用料: {
                    value: fixvalue
                },
                api: {
                    value: 'true'
                },
                合計: {
                    value: fixvalue
                },
                残高: {
                    value: fixvalue
                }
            })
        })
        return data_records
    }, function (error) {
        console.log(error)
    })
};

function create_element(tagname, attrs={}, name=''){
    var element = document.createElement(tagname);
    if (Object.keys(attrs).length !== 0) {
        for (let property in attrs){
        element.setAttribute(property, attrs[property])
        }
    }
    !name ? '':element.innerHTML = name;
    return element;
};

function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return JSON.parse(xmlHttp.responseText);
}

async function get_holiday_date(url) {
    const response = await fetch(url);
    if (!response.ok) {
        return {}
    }
    const myJson = await response.json()
    return myJson
}

function cal_date(input_date, holiday, number_condition) {
    if (number_condition === 0) {
        return input_date
    }
    let day = input_date.getDay()
    if (holiday[moment(input_date).format('YYYY-MM-DD')] || day===0 || day===6) {
        input_date.setDate(input_date.getDate() + number_condition)       
        return cal_date(input_date, holiday, number_condition)
    }
    else {
        return input_date
    }
}

function condition_holiday(condition) {
    if (condition === '指定しない') {
        return 0
    }
    if (condition === '休業日後移動') {
        return 1
    }
    return -1
}

function get_input_date(number, timeobject) {
    let dates_of_month = new Date(timeobject.getFullYear(),timeobject.getMonth()+1,0);
    if (number > Number(dates_of_month.getDate())) {
        return dates_of_month
    }
    timeobject.setDate(number)
    return timeobject
}

function get_number_of_month(end_month, number_day) {
    let get_number = end_month.length > 0 ? 31:number_day
    return get_number
}

async function get_paid_day (record, other_record) {
    let output_date;
    let local_now = new Date()
    if (record['スキーム'].value === '直接') {
        local_now.setMonth(local_now.getMonth()+1)
        local_now.setDate(0)
        output_date = moment(local_now).format('YYYY-MM-DD')
    }
    else {
        let holiday = await get_holiday_date(`https://holidays-jp.github.io/api/v1/${local_now.getFullYear()}/date.json`)
        let number_of_month = Number(get_number_of_month(other_record['paid_day_checkbox'].value, other_record['paid_day'].value))
        let paid_month = new Date(record['サービス締日'].value)
        paid_month.setDate(1)
        paid_month.setMonth(paid_month.getMonth() + set_month[other_record['paid_month'].value])
        let condition = condition_holiday(other_record['paid_holiday_setting'].value)
        let date = cal_date(get_input_date(number_of_month, paid_month), holiday, condition)
        output_date = moment(date).format('YYYY-MM-DD')
    }
    return output_date
};

