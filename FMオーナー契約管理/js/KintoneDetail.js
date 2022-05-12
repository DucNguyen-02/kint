(function($) {
    'use strict';

    // レコード詳細画面にて動作
    kintone.events.on('app.record.detail.show', function(event) {
      
      //メールワイズ
      if (event.record['ステータス'].value == '契約書発送済') {
        //「契約書受領メール」をプルダウンから削除
        setTimeout(function(){
         $('#mailwisePlugin-template-dropdown').children('option[value="1"]').remove();
        }, 700); //0.7秒
        
      } else if (event.record['ステータス'].value == '契約完了') {
        //「契約発送メール」をプルダウンから削除
        setTimeout(function(){
          $('#mailwisePlugin-template-dropdown').children('option[value="0"]').remove();
        }, 700); //0.7秒
  
      } else {
        //プルダウンやボタン非表示
        setTimeout(function(){
          $('#mailwisePlugin-template-dropdown').hide();
          $('#mailwisePlugin-creating-mail-button').hide();
        }, 700); //0.7秒
      }
      
      //プリントクリエイター
       setTimeout(function(){
      $('.pcreator-attachment-field-select').children('option[value=""]').text("契約書送付日を入力してから出力してください。");
       }, 650); //0.65秒
  
        return event;
  
      });
  
  })(jQuery);

  (function () {
    kintone.events.on('app.record.detail.show', function(event) {
        var record = event.record;
        var addr = addr1;
        // 上記以外の所在地を契約書送付先として指定する
        // 上記の所在地を契約書送付先として指定する・チェックボックス
        hide_field_print();
        if (record['send_address_check'].value[0] === '上記以外の所在地を契約書送付先として指定する') {
            addr = addr2;
        }
        for (let i = 0; i<addr.length; i++) {
            record[print_field_address[i]].value = record[addr[i]].value
        }
        var a = record['print_postcode'].value
        record['print_postcode'].value = a.slice(0,3) + '-' + a.slice(3);
        record[print_person].value = !record['name'].value ? record['leader_name'].value:record['name'].value;
        return event;
    })

    kintone.events.on('app.record.detail.process.proceed', function(event) {
      var record = event.record;
        if (event.action.value === '契約書不備') {
            return swal("再発行しますか？", {
              buttons: ["キャンセル", "はい"],
            }).then((resp) => {
              if (resp) {
                record['send_date'].value = ''
                return event
              }
              return false
            })
        }

        if (event.action.value === '契約完了') {
            if (!record['url'].value && !record['explorer'].value) {
                // let (field_name1, field_name2) = ('捺印済み契約書類の保管先(URL)', '捺印済み契約書類の保管先(エクスプローラー）');
                alert(`保管先は必ず入力してください。`)
                return false
            }
      }

      return event
    })
  })(); 