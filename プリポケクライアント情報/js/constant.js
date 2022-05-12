const hide_field = [
    'exported'
]

function hide_field_export() {
    hide_field.forEach(e => kintone.app.record.setFieldShown(e, false));
};

function set_record(record) {
    return {
        請求書番号: 'function',
        取引先コード: record['取引先コード'].value,
        請求先会社名: record['企業名'].value,
        企業コード: record['company_code'].value,
        発行番号: 'function',
        請求書発行日: 'function',
        支払期限: 'function',
        区分: record['スキーム'].value,
        振込手数料負担: record['振込手数料負担'].value,
        サービス利用料負担: record['サービス手数料'].value,
        請求書送付日: 'function'
    }
}

function disable_end_month(record) {
    record['paid_day'].disabled = record['paid_day_checkbox'].value[0] === '末日'
    record['open_day'].disabled = record['open_day_checkbox'].value[0] === '末日'
    record['limit_day'].disabled = record['limit_day_checkbox'].value[0] === '末日'
}