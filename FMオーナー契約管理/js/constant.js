const email_print = [
    "bap-kintone-developer@bap.jp-----",
]

const user_login = kintone.getLoginUser()

const print_field_address = [
    'print_postcode', 'print_prefectures',
    'print_district', 'print_ward'
]
const print_person = 'print_pr_person'
const addr1 = [
    'location_postal_code', 'location_prefectures',
    'location_district', 'location_ward'
]

const addr2 = [
    'send_postal_code', 'send_prefectures',
    'send_district', 'send_ward'
]

function hide_field_print() {
    print_field_address.forEach(e => kintone.app.record.setFieldShown(e, false));
    kintone.app.record.setFieldShown(print_person, false);
}