var temp = [[], []];
const weekofmonth_group = ['複数選択', 'チェックボックス'];
const dateofmonth_table = ['テーブル_0'];
const month_group = ['ラジオボタン_1'].concat(dateofmonth_table).concat(weekofmonth_group);

const week_group = ['チェックボックス_1'];

const date_group = ['日付_0', '日付_1', 'テーブル_2'];

function hide_fields(fields) {
    fields.forEach(field => kintone.app.record.setFieldShown(field, false))
};

function show_fields(fields) {
    fields.forEach(field => kintone.app.record.setFieldShown(field, true))
};

const control_hide = {
    指定しない: [month_group.concat(week_group).concat(date_group),[]],
    日別: [week_group.concat(month_group), date_group],
    毎週: [date_group.concat(month_group), week_group],
    毎月: temp,
};

const control_hide_month_group = {
    曜日指定: [date_group.concat(week_group).concat(dateofmonth_table), weekofmonth_group.concat(['ラジオボタン_1'])],
    日付指定: [date_group.concat(week_group).concat(weekofmonth_group), dateofmonth_table.concat(['ラジオボタン_1'])],
}

class get_date{
    constructor(date, holiday) {
        this.date = date
        this.holiday = holiday
    }
    
}