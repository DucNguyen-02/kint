(function() {
    function convert_str_to_boolean(str) {
        if (str === 'true') {
            return true
        }
        return false
    }


    function create_element(tagname, attrs={}, name=''){
        var element = document.createElement(tagname);
        if (Object.keys(attrs).length !== 0) {
            for (let property in attrs){
            element.setAttribute(property, attrs[property])
            }
        }
        !name ? '':element.innerHTML = name;
        return element;
    }
    function create_thead() {
        var thead = document.getElementsByTagName('thead')[0];
        var th = create_element('th', {
            'style':'width: 47px;',
            'id': 'th1',
            'class': 'recordlist-header-cell-gaia format-th'
        });
        thead.insertAdjacentElement('afterbegin', th);
    }

    function get_check(records) {
        let check = {};
        records.forEach(element => check[element['company_code'].value]=element['export_company'].value==='有');
        return check
    }

    function record_update(value_unique_field, chose) {
        return {
                'updateKey': {
                  'field': 'company_code',
                  'value': value_unique_field
                },
                'record': {
                  'export_company': {
                    'value': chose ? '有': '無'
                  }
                }
              }
        }

    function update_record_check() {
        let rows = document.getElementsByTagName('tr');
        let check_record_list = []
        for (let i=0; i<rows.length; i++) {
            let company_code = rows[i].children[2].getElementsByTagName('span')[0].innerText;
            let check = rows[i].getElementsByTagName('input')[0];
            check_record_list.push(record_update(company_code, check.checked))
        }
        return check_record_list
    }

    // kintone.events.on('app.record.index.show', function(event) {
    //     var records = event.records;
    //     function handle_click(e) {
    //         let body = {
    //             app: event.appId,
    //             records: update_record_check()
    //         }

    //         return kintone.api(kintone.api.url('/k/v1/records', true), 'PUT', body).then(function(resp) {
    //                 return event;
    //             }, function(error){
    //                 alert('データ取得が失敗しました。')
    //             })
    //     }

    //     function create_checkbox(records) {
    //         let check = get_check(records);
    //         var rows = document.getElementsByTagName('tr');
    //         for (let i=0; i<rows.length; i++){
    //             let td = create_element('td', {
    //                 'class': 'recordlist-cell-gaia format-th'
    //             });
    //             let checkbox = create_element('input', {
    //                 'type': 'checkbox',
    //                 'class': 'format-input'
    //             });
    //             checkbox.checked = check[rows[i].children[1].getElementsByTagName('span')[0].innerText];
    //             checkbox.onclick = handle_click;
    //             td.appendChild(checkbox);
    //             rows[i].insertAdjacentElement('afterbegin', td);
    //         }
    //     };

    //     if (!document.getElementById('th1')) {
    //         create_thead();
    //     }
    //     var th1 = document.getElementsByTagName('th')[1]
    //     th1.width = '47px';
    //     create_checkbox(records);
    //     return event;
    // })
})()