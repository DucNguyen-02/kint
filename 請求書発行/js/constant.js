// must add semicolon at end statement
const appId = 113;

const view_pre_print = 5532402
const view_print = 5532400

const field_disable_autocreate = ['請求書番号', '発行番号',
    '取引先コード', '請求先会社名', '企業コード', 'スキーム',
    '振込手数料負担', 'サービス利用料負担', 'サービス開始日',
    'サービス締日', '支払期限', '固定利用料', '立替金',
    '振込手数料', 'サービス利用料', 'その他項目1','その他1',
    'その他項目2','その他2','その他項目3','その他3',
    'その他項目4','その他4', '合計',
    '請求書ファイル名', '請求先備考', '請求書発行フラグ'
];

const other = [
    ['その他項目1','その他1'],
    ['その他項目2','その他2'],
    ['その他項目3','その他3'],
    ['その他項目4','その他4']
]


const fields_print = [
    'printer_body_line_title_1', 'printer_body_line_title_2', 'printer_body_line_title_3',
    'printer_body_line_title_4', 'printer_body_line_value_1', 'printer_body_line_value_2',
    'printer_body_line_value_3', 'printer_body_line_value_4', '印刷用＿請求発行日', '印刷用＿サービス開始日',
    '印刷用＿サービス締日', '印刷用＿支払期限', '請求書', 'check_create', 'print_請求先備考',
    'print_other_positive_1', 'print_other_positive_2', 'print_other_positive_3', 'print_other_positive_4',
    'print_other_negative_1', 'print_other_negative_2', 'print_other_negative_3', 'print_other_negative_4',
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

function disable_condition_fields(record) {
    if (record['スキーム'].value === '直接') {
        disable_fields(record, ['立替金', '振込手数料']);
        enable_fields(record, ['固定利用料']);
        record['立替金'].value = 0;
        record['振込手数料'].value = 0;
        kintone.app.record.setFieldShown('立替金', false);
        kintone.app.record.setFieldShown('振込手数料', false);
        kintone.app.record.setFieldShown('固定利用料', true);
    } else {
        disable_fields(record, ['固定利用料']);
        enable_fields(record, ['立替金', '振込手数料']);
        record['固定利用料'].value = 0;
        kintone.app.record.setFieldShown('立替金', true);
        kintone.app.record.setFieldShown('振込手数料', true);
        kintone.app.record.setFieldShown('固定利用料', false);
    }
    other.forEach ((e) => {
        record[e[1]].disabled = !record[e[0]].value
    })
};

function hide_print_fields(record) {
    fields_print.forEach(f => {
        record[f].disabled = true
        kintone.app.record.setFieldShown(f, false);
    })
}

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
    record['合計'].value = Number(base_fee) + Number(transfer_fee) + Number(service_usage_fee) + Number(other_fee)
    record['残高'].value = record['合計'].value + Number(record['入金額'].value)
    return event
};

function set_print_number(record, condition_field, positive_field, negative_field, result) {
    if (Number(record[condition_field].value < 0)) {
        record[positive_field].value = ''
        record[negative_field].value = result
    }
    else {
        record[positive_field].value = result
        record[negative_field].value = ''
    }
}
function set_data(record) {
    var str_other = record['その他項目1'].value + record['その他項目2'].value + record['その他項目3'].value + record['その他項目4'].value
    var row1_other = !record['その他項目1'].value ? '':`・${record['その他項目1'].value}`;
    var row2_other = !record['その他項目2'].value ? '':`・${record['その他項目2'].value}`
    var row3_other = !record['その他項目3'].value ? '':`・${record['その他項目3'].value}`
    var row4_other = !record['その他項目4'].value ? '':`・${record['その他項目4'].value}`
    var row1_other_value = !record['その他項目1'].value  ? '':`${new Intl.NumberFormat('en').format(Number(record['その他1'].value))} 円`;
    var row2_other_value = !record['その他項目2'].value  ? '':`${new Intl.NumberFormat('en').format(Number(record['その他2'].value))} 円`
    var row3_other_value = !record['その他項目3'].value  ? '':`${new Intl.NumberFormat('en').format(Number(record['その他3'].value))} 円`
    var row4_other_value = !record['その他項目4'].value  ? '':`${new Intl.NumberFormat('en').format(Number(record['その他4'].value))} 円`
    record['printer_body_line_title_3'].value = [row1_other, row2_other, row3_other, row4_other].join('\n')
    set_print_number(record, 'その他1', 'print_other_positive_1', 'print_other_negative_1', row1_other_value)
    set_print_number(record, 'その他2', 'print_other_positive_2', 'print_other_negative_2', row2_other_value)
    set_print_number(record, 'その他3', 'print_other_positive_3', 'print_other_negative_3', row3_other_value)
    set_print_number(record, 'その他4', 'print_other_positive_4', 'print_other_negative_4', row4_other_value)
    var sum = Number(record['その他1'].value) + Number(record['その他2'].value) + Number(record['その他3'].value) + Number(record['その他4'].value)
    if (record['スキーム'].value === '直接') {
        var row1_title = `①　固定利用料 `;
        var row2_title = `②　給与前払サービス利用料`;
        var row1_value = `¥${new Intl.NumberFormat('en').format(Number(record['固定利用料'].value))}`;
        var row2_value = `¥${new Intl.NumberFormat('en').format(Number(record['サービス利用料'].value))}`;
        record['printer_body_line_title_1'].value = [row1_title,row2_title].join('\n');
        record['printer_body_line_value_1'].value = [row1_value, row2_value].join('\n');
        record['printer_body_line_title_2'].value = !str_other ? '':`③　その他`
        if (sum<0) {
            record['printer_body_line_value_4'].value = record['その他項目1'].value !== '' ? `¥${new Intl.NumberFormat('en').format(Number(sum))}` : '';
            record['printer_body_line_value_2'].value = '';
        }
        else{
            record['printer_body_line_value_2'].value = record['その他項目1'].value !== '' ? `¥${new Intl.NumberFormat('en').format(Number(sum))}` : '';
            record['printer_body_line_value_4'].value = '';
        }

        record['請求書'].value = '';
    }

    if (record['スキーム'].value === '立替') {
        var row1_title = `①　前払金振込金額（不課税）`;
        var row2_title = `②　振込手数料　（` + record['振込手数料負担'].value + `）`;
        var row3_title = `③　サービス利用料 （` + record['サービス利用料負担'].value + `）`
        var row1_value = `¥${new Intl.NumberFormat('en').format(Number(record['立替金'].value))}`;
        var row2_value = `¥${new Intl.NumberFormat('en').format(Number(record['振込手数料'].value))}`;
        var row3_value = `¥${new Intl.NumberFormat('en').format(Number(record['サービス利用料'].value))}`
        record['printer_body_line_title_1'].value = [row1_title,row2_title,row3_title].join('\n');
        record['printer_body_line_value_1'].value = [row1_value, row2_value, row3_value].join('\n')
        record['printer_body_line_title_2'].value = !str_other ? '':`④　その他`
        record['printer_body_line_value_2'].value = `¥${[
            record['その他1'].value, record['その他2'].value, record['その他3'].value, record['その他4'].value,
        ].reduce((a,b) => a+b, 0)}`
        if (sum<0) {
            record['printer_body_line_value_4'].value = record['その他項目1'].value !== '' ? `¥${new Intl.NumberFormat('en').format(Number(sum))}` : '';
            record['printer_body_line_value_2'].value = '';
        }
        else{
            record['printer_body_line_value_2'].value = record['その他項目1'].value !== '' ? `¥${new Intl.NumberFormat('en').format(Number(sum))}` : '';
            record['printer_body_line_value_4'].value = '';
        }

        record['請求書'].value = '※上記②振込手数料および③サービス利用料が個人負担（内）の場合、給与前払時にこれらを控除して前払金をお支払いしているため、貴社へのご請求金額には含みません。';
    }

    record['印刷用＿請求発行日'].value = moment(record['請求発行日'].value).format('YYYY/MM/DD');
    record['印刷用＿サービス開始日'].value = moment(record['サービス開始日'].value).format('YYYY/MM/DD');
    record['印刷用＿サービス締日'].value = moment(record['サービス締日'].value).format('YYYY/MM/DD');
    record['印刷用＿支払期限'].value =moment(record['支払期限'].value).format('YYYY/MM/DD');
    if (!record['請求先備考'].value) {  
        record['print_請求先備考'].value = '';  
    }
    else {
        record['print_請求先備考'].value = `（${record['請求先備考'].value}）`
        
    };
}

function set_print(record, fields) {
    let print = {}
    fields.forEach (e => {
        print[e] = {
            value: record[e].value
        }
    })
    return print
}