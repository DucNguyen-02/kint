// must add semicolon at end statement
						
const spot = [
    '顧問紹介(スポット)一括払い', '顧問紹介(スポット)分割払い',
    'その他スポット一括払い', 'その他スポット分割払い',
];

const fixed = '永続フィー関連(固定)';

const percent = '永続フィー関連(割合)';

const disable_field_after_create_from_web = [
    'inquiry_route', 'category', 'request_type', 
    'company', 'name', 'email_address',
    'type_of_industry', 'details_of_your_inquiry',
    'specialist', 'inquiry_item'
];

const disable_field_after_create = [
    'inquiry_route', 
    'specialist',
];

const status_to_disable = [
    'マッチング承認依頼',
    'マッチング（請求対象）',
    '契約終了',
]

const status_pre_end = [
    '専門家連携済',
    'マッチング承認依頼',
    'マッチング（請求対象）',
]

function disable_field(record, fields) {
    for (let field of fields){
        record[field].disabled = true;
    }
};

function enabale_field(record, fields){
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

function field_shown(showfields, hidefields) {
    for (let i of hidefields){
        kintone.app.record.setFieldShown(i, false);
    }
    for (let j of showfields){
        kintone.app.record.setFieldShown(j, true);
    }
};

function show_matching_form(record) {
    if (spot.includes(record['Matching_form'].value)) {
        field_shown(['contract_terms_spot'], ['contract_terms_fixed_perpetual_fees', 'contract_terms_percentage_of_perpetual_fee'])
        record['contract_terms_fixed_perpetual_fees'].value = 0;
        record['contract_terms_percentage_of_perpetual_fee'].value = 0;
    }
    else if (record['Matching_form'].value === fixed){
        field_shown(['contract_terms_fixed_perpetual_fees'], ['contract_terms_spot', 'contract_terms_percentage_of_perpetual_fee'])
        record['contract_terms_spot'].value = 0;
        record['contract_terms_percentage_of_perpetual_fee'].value = 0;
    }
    else if (record['Matching_form'].value === percent) {
        field_shown(['contract_terms_percentage_of_perpetual_fee'], ['contract_terms_spot', 'contract_terms_fixed_perpetual_fees'])
        record['contract_terms_spot'].value = 0;
        record['contract_terms_fixed_perpetual_fees'].value = 0;
    }
};

function disable_matching_form(record) {
    if (spot.includes(record['Matching_form'].value)) {
        enabale_field(record, ['contract_terms_spot']);
        disable_field(record, ['contract_terms_fixed_perpetual_fees', 'contract_terms_percentage_of_perpetual_fee']);
    }
    else if (record['Matching_form'].value === fixed){
        enabale_field(record, ['contract_terms_fixed_perpetual_fees']);
        disable_field(record, ['contract_terms_spot', 'contract_terms_percentage_of_perpetual_fee']);
    }
    else if (record['Matching_form'].value === percent) {
        enabale_field(record, ['contract_terms_percentage_of_perpetual_fee']);
        disable_field(record, ['contract_terms_spot', 'contract_terms_fixed_perpetual_fees']);
    }
};

function reset_value(record) {
    if (spot.includes(record['Matching_form'].value)) {
        record['contract_terms_fixed_perpetual_fees'].value = 0;
        record['contract_terms_percentage_of_perpetual_fee'].value = 0;
    }
    else if (record['Matching_form'].value === fixed){
        record['contract_terms_spot'].value = 0;
        record['contract_terms_percentage_of_perpetual_fee'].value = 0;
    }
    else if (record['Matching_form'].value === percent) {
        record['contract_terms_spot'].value = 0;
        record['contract_terms_fixed_perpetual_fees'].value = 0;
    }
};

function check_box(event) {
    var MATCHING = 'matching';
    var CANDIDATE = 'candidate_experts';
    var record = event.record;
    var table = record['candidate_experts_tacle'].value;
    var changedRow = event.changes.row;
    var text = changedRow.value[MATCHING].value;
    if (text.length === 0) {
        var row_candidate = false;
    }
    else {
        record['specialist'].value = changedRow.value[CANDIDATE].value;
        var row_candidate = changedRow.value[CANDIDATE].value;
    }
    for (let i = 0; i < table.length; i++){
        let row = table[i];
        if (row.value[CANDIDATE].value !== row_candidate && row_candidate){
          if (row.value[MATCHING].value[0] === 'マッチング'){
            row.value[MATCHING].value = [];
            return event
          }
        }
    }
    if (record['specialist'].value === changedRow.value[CANDIDATE].value && text.length === 0) {
      record['specialist'].value = '';
    }
    return event
};    