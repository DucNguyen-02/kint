(function() {
  'use strict';
  var setApprovalUser = ["app.record.create.submit", "app.record.edit.submit", "app.record.index.edit.submit"];
  kintone.events.on(setApprovalUser, function(event) {
    //ユーザー情報を取得する
    var record = event.record;
    
    var primaryUsers = record['一次承認実行者']['value'];
    var settlementUsers = record['決裁承認実行者']['value'];
    var verificationUsers = record['押印確認実行者']['value'];
    var tableRecords = event.record.捺印詳細.value;
    
    if (primaryUsers.length > 1 || settlementUsers.length > 1 || verificationUsers.length > 1) {
    //一人以上の指定の場合は、errorプロパティにメッセージを代入する
      event.error = "一次承認者、決裁者、押印確認者は各1人ずつしか選択できません";
    } else {
      for (var i = 0; i < tableRecords.length; i++) {
        if (tableRecords[i].value['印章'].value != 'なし' && verificationUsers.length === 0) {
            event.error = "押印確認者を選択してください。";
            break;
        } 
      }
    }
    return event;
  });
})();
