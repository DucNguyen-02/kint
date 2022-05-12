(function() {
    "use strict";
    // result is list of id's record which is checked
    var input = create_element('input', {
        type: "month",
        class: "css-button",
        id: "get_date",
        value: moment(Date()).format('YYYY-MM')
    })
    var button_get_data = create_element('button', {
        class: "css-button"
    }, 'データを取得する')


    var calculate_total = [
        'app.record.index.edit.change.区分',
        'app.record.index.edit.change.固定利用料',
        'app.record.index.edit.change.立替金',
        'app.record.index.edit.change.振込手数料',
        'app.record.index.edit.change.サービス利用料',
        'app.record.index.edit.change.その他1',
        'app.record.index.edit.change.その他2',
        'app.record.index.edit.change.その他3',
        'app.record.index.edit.change.その他4',
        'app.record.index.edit.change.振込手数料負担',
        'app.record.index.edit.change.サービス利用料負担'
    ]
    function fetch_fast(opt_last_record_id, opt_records) {
        var records = opt_records || [];
        var query = 'export_company in ("有")';
        query += opt_last_record_id ? ' and $id > ' + opt_last_record_id : '';
        query += ' order by $id asc limit 500';
        var params = {
            app: get_data_from_appId,
            query: query
        };
        return kintone.api('/k/v1/records', 'GET', params).then(function(resp) {
            var temp_records = resp.records;
            records = records.concat(temp_records);
            if (resp.records.length === 500) {
                return fetch_fast(resp.records[resp.records.length - 1].$id.value, records);
            }

            return records;
        });
    }

    function list_id_check(checkbox_name){
        var ids = [];
        var check_tags = document.getElementsByName(checkbox_name);
        for (let element of check_tags) {
            element.checked ? ids.push(Number(element.value)):''
        }
        return ids
    }

    function sweetalert_notification(icon, title, show_confirm, confirm_text, show_cancel, cancel_text, reload) {
        Swal.fire({
            icon: icon,
            title: title,
            showConfirmButton: show_confirm,
            confirmButtonText: confirm_text,
            showCancelButton: show_cancel,
            cancelButtonText: cancel_text,
            confirmButtonColor: '#3498db',
        }).then(() => {
            if (reload) {
                location.reload();
            }
        });
    }

    function notification_error_warning(icon ,error) {
        Swal.fire({
            icon: icon,
            text: error
        })
    }
    kintone.events.on('app.record.index.edit.change.区分', function(event) {
        var record = event.record;
        disable_condition_fields(record)
        return event
    });
    
    kintone.events.on(calculate_total, sum_fee)

    kintone.events.on('app.record.index.edit.show', function(event) {
        var record = event.record;
        disable_status.record = record;
        disable_status[record.Status.value]();
        if (list_statuses.indexOf(record.Status.value) < 1){
            disable_condition_fields(record)
            if (record['api'].value === 'true') {
                disable_fields(record, disable_from_api)
            }
        }
        return event;
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
        if (event.viewName === list_statuses[0]) {
            function load_page() {
                let get_record = fetch_fast(0, []);
                let company
                get_record.then((resp) => {
                    let query_date
                    if (!input.value) {
                        query_date = ''
                    }
                    else {
                        let current_date = moment(input.value).format('YYYYMM')
                        company = resp.map(e =>`${current_date}-${e['company_code'].value.slice(2,9)}-01`)
                        query_date = ` and (請求書番号 in (\"${company.join('","')}\") or 請求書番号 like ${current_date})`
                    }
                    let param = {
                        query: `Status = "${list_statuses[0]}"${query_date}`,
                    }
                    let link = kintone.api.urlForGet('/k/' + event.appId + '/', param)
                    link = link.slice(0, link.indexOf('.json')) + link.slice(link.indexOf('.json')+5, link.length)
                    window.location.href = link
                })
                
            }

            if (!location.href.includes('query')) {
                for (let i=0; i < records.length; i++) {
                    if (records[i]['api'].value === 'true') {
                        input.value = records[i]['請求書番号'].value.slice(0,4) + '-' + records[i]['請求書番号'].value.slice(4,6)
                        break
                    }
                }
                load_page()
            }
            else {
                let temp = location.href.slice(location.href.length-7,location.href.length-1)
                input.value = temp.slice(0,4) + '-' + temp.slice(4,6)
            }

            if (!document.getElementById('get_date')) {
                kintone.app.getHeaderMenuSpaceElement().appendChild(input);
                kintone.app.getHeaderMenuSpaceElement().appendChild(button_get_data);
            }

            
            // input.onchange = load_page
            button_get_data.onclick = function(e) {
                let current_date = moment(input.value).format('YYYYMM')
                let get_record = fetch_fast(0, []);
                get_record.then( async function(resp) {
                    let date = new Date(input.value);
                    let exist_records
                    let get_mining_record = []

                    // because query like in kintone delay about 3 minutes, so have this code
                    let temp_query = []
                    resp.forEach(resp_record => {
                        temp_query.push(`${current_date}-${resp_record['company_code'].value.slice(2,9)}-01`)
                    })
                    let get_company = {
                        app: event.appId,
                        query: `請求書番号 in (\"${temp_query.join('","')}\") order by $id desc limit 100`,
                        field: ['$id', '企業コード']
                    }
                    exist_records = await kintone.api('/k/v1/records', 'GET', get_company).then(resp => {
                        return resp.records
                    }, error => {
                        throw error.message
                    })
                    
                    resp.forEach(resp_record => {
                        let count = 0
                        exist_records.forEach(exist_record => {
                            if (resp_record['company_code'].value == exist_record['企業コード'].value) {
                                count++
                            }
                        })
                        if (count === 0) {
                            get_mining_record.push(resp_record)
                        }
                    })
                    let data = await set_data_records(get_mining_record, date);
                    let body = {
                        app: event.appId,
                        records: data
                    }
                    kintone.api(kintone.api.url('/k/v1/records', true), 'POST', body).then(function(resp) {
                        alert(`${data.length} のレコードを取得しました。`)
                        load_page();
                    }, function(error) {
                        console.log(error)
                        alert(error.message);
                    })
                }, function (error) {
                    console.log(error)
                    alert(error.message);
                })
            }
        }
        if (records.length === 0 || event.viewName === '完了') {
            var th = document.querySelectorAll('th');
            th[1].style.width = '180px';
            return event;
        }
        var view_list = document.getElementById('view-list-data-gaia')
        var tr = view_list.querySelectorAll('tr')
        var thead = view_list.querySelector('thead')
        var th_kintone = view_list.querySelectorAll('th')
        th_kintone[0].style.width = '47px;'
        var th = create_element('th', {
            'id': 'th1', 
            'class':'recordlist-header-cell-gaia label-5531428 recordlist-header-sortable-gaia format-th',
            'style':'width: 47px;'    
        },'')    
        var check_all = create_element('button', {
            'id':'check-all', 'type':'button', 'class': 'css-button'}, 'すべてチェック')

        check_all.onclick = function (e)
        {
            var num = 0;
            var checkboxes = document.getElementsByName('foo');
            checkboxes.forEach(e => num = e.checked ? num+=1: num)
            records.forEach((element, index) => {
                if (num === records.length){  
                    checkboxes[index].checked = false;
                }
                else {
                    checkboxes[index].checked = true;
                }
            });
        };
        records.forEach((element, index) => {
            var row = tr[index];
            var td = create_element('td', {
                'class': 'recordlist-cell-gaia detail-action-6 recordlist-action-gaia format-th'
            },'');
            var ip = create_element('input',{
                'id': `check_box_${element.$id.value}`,
                'type': 'checkbox',
                'value': element.$id.value,
                'class': 'format-input',
                'name': 'foo'
            })
            td.append(ip)
            row.prepend(td)        
        });
        var index_of_status = list_statuses.indexOf(event.viewName);
        var next_status = list_statuses[index_of_status+1]
        var update_status_request_pending = create_element ('button', {
            'class': 'css-button',
            'id': 'update_status_request_pending',
        },next_status
        )

        function update_status(e){
            var ids = list_id_check('foo');
            if (ids.length === 0) {
                // please choose records to update status -> レコードを選択してください。複数のレコードを選択可能です。
                alert('レコードを選択してください。複数のレコードを選択可能です。')
                return event;
            }
            var required = index_of_status < 2 ? required_wait_confirm:required_then_wait_payment;
            var fail_record_id=[];
            var fail_record_code = [];
            var update_records_data = [];
            var update_record_ids = [];
            var records_fail_list = [];
            var get_this_body = {
                app: event.appId,
                query: `$id in (${ids})`
            }
            return kintone.api(kintone.api.url('/k/v1/records', true), 'GET', get_this_body).then(function(resp) {
                var get_this_records = resp.records;
                get_this_records.forEach((element) =>{
                    let check = new check_record(element, required);
                    if (check.required_field.length === 0) {
                        update_records_data.push(element)
                        update_record_ids.push(Number(element.$id.value))
                    }
                    else {
                        fail_record_id.push(Number(element.$id.value))
                        fail_record_code.push(element['請求書番号'].value)
                        records_fail_list.push(check);
                    }
                })
                if (update_record_ids.length === 0) {
                    // these records are not enough information -> 必要な項目に入力してください。
                    alert('以下の必要な項目にご入力してください。' +'\n'+ message_record(records_fail_list))
                    return event
                }
                var update_statuses = update_records_data.map((e) => {
                    return {
                        'id': e.$id.value,
                        'action': next_status
                    }
                })
                // records updated status success -> レコードのステータスを更新しました。
                // records update fail -> レコードのステータスの更新は失敗しました。
                var success1 = `${update_record_ids.length} レコードのステータスを更新しました。`;
                var success2 = success1 + '\n' + `${fail_record_code.length} レコードのステータスの更新は失敗しました。` 
                var message = fail_record_id.length === 0 ? success1: success2
                var body_update_status = {
                    'app': event.appId,
                    'records': update_statuses
                }
                Swal.fire({
                    // Do you want to update the status -> ステータスを更新します。よろしいですか？
                    title: 'ステータスを更新します。よろしいですか？',
                    showCancelButton: true,
                    confirmButtonText: 'Update',
                    confirmButtonColor: '#3498db',
                }).then(async (result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                        if (event.viewName === '請求書承認待') {
                            var send_records = update_records_data.map(data_send_to_66)
                            var body_another_app = {
                                'app': send_data_to_appId,
                                'records': send_records,
                            }
                            return kintone.api(kintone.api.url('/k/v1/records', true), 'POST', body_another_app).then(function(resp){
                                return kintone.api(kintone.api.url('/k/v1/records/status', true), 'PUT', body_update_status).then(function(resp){
                                    sweetalert_notification('success', message, true, 'OK', false, '', true)
                                },function(error){
                                    notification_error_warning('error', error.message);
                                })
                            }, function(error){
                                console.log(error)
                                notification_error_warning('error', error.message);
                            })
                        }
    
                        else if (event.viewName === '請求書未承認'){
                            var data_update =[]
                            var now = moment(new Date()).format('YYYY-MM-DD')
                            for (let i=0; i<update_records_data.length; i++) {
                                // let body = {
                                //     app: get_data_from_appId,
                                //     query: `company_code = "${update_records_data[i]['企業コード'].value}" `
                                // }
                                // let other_record = await kintone.api(kintone.api.url('/k/v1/records', true), 'GET', body)
                                // let paid_day = await get_paid_day (update_records_data[i], other_record["records"][0])
                                data_update.push ({
                                    'id': update_records_data[i].$id.value,
                                    'record': {
                                        請求書発行日: {
                                            value: now
                                        },
                                        // 支払期限: {
                                        //     value: paid_day,
                                        // },
                                        請求書送付日: {
                                            value: now
                                        }
                                    }
                                })
                            }
                            var body_data_update = {
                                'app': event.appId,
                                'records': data_update 
                            }
                            return kintone.api(kintone.api.url('/k/v1/records/status', true), 'PUT', body_update_status).then(function(resp){
                                return kintone.api(kintone.api.url('/k/v1/records', true), 'PUT', body_data_update).then(function(resp) {
                                    sweetalert_notification('success', message, true, 'OK', false, '', true);
                                }, function (error) {
                                    notification_error_warning('error', error.message);
                                    console.log(error)
                                })
                            }, function(error){
                                notification_error_warning('error', error.message);
                                console.log(error)
                            })
                        }
    
                        return kintone.api(kintone.api.url('/k/v1/records/status', true), 'PUT', body_update_status).then(function(resp){
                            sweetalert_notification('success', message, true, 'OK', false, '', true);
                        }, function(error){
                            notification_error_warning('error', error.message);
                        })
                    }
                })
                console.log(resp)
            }, function(error) {
                console.log(error)
            })

            
        }
        let return_name = '入金待'
        if ([1,2].includes(list_statuses.indexOf(event.viewName))) {
            return_name = '破棄'
        }
        function return_status(e){
            var ids = list_id_check('foo');
            if (ids.length === 0) {
                return event;
            }
            var data_update = ids.map((e) => {
                return {
                    'id': e,
                    'action': return_name,
                }
            })
            var body ={
                'app': event.appId,
                'records': data_update,
            }
            // return status success -> 以前のステータスへ戻りしました。
            var message = `${ids.length} レコードのステータスを更新しました。`;
            Swal.fire({
                // Do you want to update the status -> ステータスを更新します。よろしいですか？
                title: 'ステータスを更新します。よろしいですか？',
                showCancelButton: true,
                confirmButtonText: 'Update',
                confirmButtonColor: '#3498db',
            }).then(resp => kintone.api(kintone.api.url('/k/v1/records/status', true), 'PUT', body).then(function(resp){
                    sweetalert_notification('success', message, true, 'OK', false, '', true);
                }, function(error){
                    notification_error_warning('error', error.message);
                }), 
                error => notification_error_warning('error', error.message)
                )
            
        }

        update_status_request_pending.onclick = update_status;
        var button_return_status = create_element('button', {
            'class': 'css-button',
            'id': 'return_status_request',
        },return_name
        );
        button_return_status.onclick = return_status;
        if (!document.getElementById('th1')){
            kintone.app.getHeaderMenuSpaceElement().appendChild(check_all);
            thead.prepend(th)
            if ((event.viewName === '入金承認') || ([1,2].includes(list_statuses.indexOf(event.viewName)))) {
                kintone.app.getHeaderMenuSpaceElement().appendChild(button_return_status);
            }
            kintone.app.getHeaderMenuSpaceElement().appendChild(update_status_request_pending);
        }
        return event;
    });
    kintone.events.on('app.record.index.delete.submit', function(event) {
        var record = event.record;
        if (record['発行番号'].value !== '01') {
            return event
        }
        let compare = record['請求書番号'].value.slice(0,14)
        let get_delete_record = {
            app: event.appId,
            query: `企業コード = "${record['企業コード'].value}" order by $id asc limit 100`,
            field: ['$id', '請求書番号', '発行番号']
        }
        return kintone.api('/k/v1/records', 'GET', get_delete_record).then(resp => {
            let get_sub_records = []
            resp.records.forEach (re =>{
                if (re['請求書番号'].value.includes(compare)) {
                    get_sub_records.push(re)
                } 
            })
            if (get_sub_records.length <= 1) {
                return event
            }
            let id = get_sub_records.map(e => Number(e['$id'].value))
            let delete_body = {
                app: event.appId,
                ids: id.slice(1,)
            }
            return kintone.api(kintone.api.url('/k/v1/records', true), 'DELETE', delete_body).then(resp => {
                location.reload();
            }, error => {
                console.log(error.message)
            })
        }, error => {
            console.log(error.message)
        })

    });

})();