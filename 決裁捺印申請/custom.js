/*
 * 回答の条件によって別フィールドの表示/非表示を切り替えるサンプルプログラム
 * Copyright (c) 2014 Cybozu
 *
 * Licensed under the MIT License
 */
(function() {
    "use strict";
    
    //レコード作成時初期化
    kintone.events.on('app.record.create.show', function(event) {
      var record = event.record;
      record.立案日.value = '';
      record.立案No.value = '';
      record.捺印済み書類の保管先.value = '';
      record.捺印済み書類の保管先_エクスプローラー.value = '';
      record.BOXファイル保存名.value = '';
      record.部署ID.value = '';
      record.立案実行日.value = '';
      record.一次承認実行日.value = '';
      record.決裁承認実行日.value = '';
      record.押印確認実行日.value = '';
      return event;
    });
  
    //レコードの追加、編集、詳細画面で適用する
    var events = ['app.record.detail.show',
                  'app.record.create.show',
                  'app.record.create.change.印章',
                  'app.record.edit.show',
                  'app.record.edit.change.印章'];
  
    kintone.events.on(events, function(event) {
  
        var record = event.record;
        var tableRecords = event.record.捺印詳細.value;
        kintone.app.record.setFieldShown('LookUp会社名', false);
        kintone.app.record.setFieldShown('部署ID', false);
        kintone.app.record.setFieldShown('押印確認実行者', false);
        kintone.app.record.setFieldShown('押印確認実行日', false);
        record['立案No']['disabled'] = true;
  
        // テーブル内の各レコードをカテゴリごとに集計する
        for (var i = 0; i < tableRecords.length; i++) {
          if (tableRecords[i].value['印章'].value != 'なし') {
              kintone.app.record.setFieldShown('押印確認実行者', true);
              kintone.app.record.setFieldShown('押印確認実行日', true);
              break;
          }
        }
  
    });
    
    var lookUp = ['app.record.create.change.LookUp会社名',
                  'app.record.edit.change.LookUp会社名'];
    kintone.events.on(lookUp, function(event) {
  
        var record = event.record;
        record.相手方.value = record.LookUp会社名.value;
        return event;
    });
    
    // 担当部署は変更不可
    var eventseditShow = ['app.record.edit.show', 'app.record.index.edit.show'];
    kintone.events.on(eventseditShow, function(event) {
        var record = event.record;
        var user = kintone.getLoginUser();
        if ('takeo-s@mc-fin.com' !== user.code) {
          record['立案部署']['disabled'] = true;
        }
        return event;
    });
    
    //担当部署ID変換
    var changeDepartmentID = function (department) {
        var departmentID  = ""
        switch (department) {
            case "管理部":
              departmentID = "A";
              break;
            case "営業部":
              departmentID = "B";
              break;
            case "情報システム部":
              departmentID = "C";
              break;
            case "セキュリティ委員会":
              departmentID = "D";
              break;
            default:
              break;
        }
        return departmentID;
    }
  
    //担当部署のフォルダ
    var changeDepartmentDir = function (department) {
        var departmentDir  = "Box\\全社共有\\決裁捺印依頼書\\PDF_捺印済‐決裁・捺印依頼書（2021年度）\\";
        switch (department) {
            case "管理部":
              departmentDir = departmentDir + "管理部";
              break;
            case "営業部":
              departmentDir = departmentDir + "営業部";
              break;
            case "情報システム部":
              departmentDir = departmentDir + "情報システム部";
              break;
            case "セキュリティ委員会":
              departmentDir = departmentDir + "セキュリティ委員会";
              break;
            default:
              break;
        }
        return departmentDir;
    }
  
    //担当部署のBOXリンク
    var changeDepartmentLink = function (department) {
        var departmentLink  = "https://mc-fin.app.box.com/folder";
        switch (department) {
            case "管理部":
              departmentLink = departmentLink + "/140164901488";
              break;
            case "営業部":
              departmentLink = departmentLink + "/140164824839";
              break;
            case "情報システム部":
              departmentLink = departmentLink + "/140164689956";
              break;
            case "セキュリティ委員会":
              departmentLink = departmentLink + "/140165561829";
              break;
            default:
              break;
        }
        return departmentLink;
    }
  
    //担当部署により立案者を変更
    var changeDrafter = function (department) {
      var departDrafter
      switch (department) {
          case "管理部":
            departDrafter = [{code: 'mci-kintone-dev-admin@mc-fin.com', name: 'test1'}];
            break;
          case "営業部":
            departDrafter = [{code: 'mci-kintone-dev-admin@mc-fin.com', name: 'test2'}];
            break;
          case "情報システム部":
            departDrafter = [{code: 'mci-kintone-dev-admin@mc-fin.com', name: 'test3'}];
            break;
          case "セキュリティ委員会":
            departDrafter = [{code: 'mci-kintone-dev-admin@mc-fin.com', name: 'test4'}];
            break;
          default:
            break;
      }
      return departDrafter;
    }
  
    var changefirstApproval = function (department) {
      var firstApproval
      switch (department) {
          case "管理部":
            firstApproval = [{code: 'mci-kintone-dev-admin@mc-fin.com', name: 'test1'}];
            break;
          case "営業部":
            firstApproval = [{code: 'mci-kintone-dev-admin@mc-fin.com', name: 'test2'}];
            break;
          case "情報システム部":
            firstApproval = [{code: 'mci-kintone-dev-admin@mc-fin.com', name: 'test3'}];
            break;
          case "セキュリティ委員会":
            firstApproval = [{code: 'mci-kintone-dev-admin@mc-fin.com', name: 'test4'}];
            break;
          default:
            break;
      }
      return firstApproval;
    }
  
    var eventsID = ['app.record.create.change.立案部署','app.record.edit.change.立案部署'];
    kintone.events.on(eventsID, function(event) {
      var record = event.record;
      record['部署ID']['value'] = changeDepartmentID(record.立案部署.value[0].name);
      record['捺印済み書類の保管先_エクスプローラー']['value'] = changeDepartmentDir(record.立案部署.value[0].name);
      record['捺印済み書類の保管先']['value'] = changeDepartmentLink(record.立案部署.value[0].name);
      record['立案実行者']['value'] = changeDrafter(record.立案部署.value[0].name);
      record['一次承認実行者']['value'] = changefirstApproval(record.立案部署.value[0].name);
      return event;
    });    
  
    var documentStamped = [
        'app.record.detail.show',
        'app.record.edit.show'
      ];
      kintone.events.on(documentStamped, function(event) {
      var record = event.record;
      var user = kintone.getLoginUser();
      // 初期値は見せない
      kintone.app.record.setFieldShown('捺印済み書類', false);
      if (record.捺印詳細.value[0].value.印章.value !== 'なし') {
        if (
            (user.code === record.決裁承認実行者.value[0].code && record.ステータス.value === '決裁申請中') ||
            (user.code === record.押印確認実行者.value[0].code && (record.ステータス.value === '押印確認依頼中' || record.ステータス.value === '実印押印確認依頼中')) ||
            (record.ステータス.value === '捺印済書類添付') ||
            (record.ステータス.value === '承認済み') ||
            (record.ステータス.value === '押印確認済み') ||
            (record.ステータス.value === '書類保管確認依頼中') ||
            (record.ステータス.value === '完了')
            ) {
            kintone.app.record.setFieldShown('捺印済み書類', true);
        }
      } else {
        kintone.app.record.setFieldShown('捺印書類', false);
      }
      return event;
    });
  })();
  