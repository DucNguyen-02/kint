jQuery.noConflict();
(function($) {
  "use strict";

  // レコード印刷画面から非表示
  kintone.events.on('app.record.print.show', function(event){
    var record = event.record;
    set_down_field(record);
    return event;
  });
  
  kintone.events.on('app.record.edit.show', function(event){
    var record = event.record;
    if (record.ステータス.value === '押印確認済み'){
      set_down_field(record);
      set_up_field(record);
    }
    return event;
  });
  

  // レコード追加/編集画面で無効化
  kintone.events.on(['app.record.create.show','app.record.edit.show'], function(event) {
    var record = event.record;
    var user = kintone.getLoginUser();
    if (user.code !== "mci-kintone-developper@mc-fin.com") {
    record.立案実行日.disabled = true;
    record.立案実行者.disabled = true;
    record.一次承認実行者.disabled = true;
    record.一次承認実行日.disabled = true;
    record.決裁承認実行者.disabled = true;
    record.決裁承認実行日.disabled = true;
    record.押印確認実行者.disabled = true;
    record.押印確認実行日.disabled = true;
    record.捺印済み書類の保管先.disabled = true;
    record.捺印済み書類の保管先_エクスプローラー.disabled = true;
    record.BOXファイル保存名.disabled = true;
    record.AdobeSignリンク.disabled = true;
    record.決裁捺印マニュアル.disabled = true;
    }

    return event;
  });

  kintone.events.on(['app.record.edit.submit', 'app.record.index.edit.submit'], function(event) {
    var record = event.record;
    var user = kintone.getLoginUser();
    var writelessStatus = [
      '承認済み',
      '実印押印確認依頼中',
      '押印確認依頼中',
      '書類保管確認依頼中',
      '完了'
    ]
    if (writelessStatus.indexOf(record['ステータス']['value']) !== -1　&& user.code !== 'mci-kintone-developper@mc-fin.com') {
      event.error = '承認済みの稟議の変更はできません。';
    } 
    return event;
  });
  
  function set_down_field(record) {
    kintone.app.record.setFieldShown('立案日', false);
    kintone.app.record.setFieldShown('件名', false);
    kintone.app.record.setFieldShown('相手方', false);
    kintone.app.record.setFieldShown('決裁事項決裁事由', false);
    kintone.app.record.setFieldShown('費用', false);
    kintone.app.record.setFieldShown('資産計上', false);
    kintone.app.record.setFieldShown('予算区分', false);
    kintone.app.record.setFieldShown('予算外の場合', false);
    kintone.app.record.setFieldShown('捺印詳細', false);
    kintone.app.record.setFieldShown('押印確認者', false);
    kintone.app.record.setFieldShown('決裁捺印依頼書', false);
    kintone.app.record.setFieldShown('捺印書類', false);
    kintone.app.record.setFieldShown('捺印済み書類', false);
    kintone.app.record.setFieldShown('添付書類', false);
    kintone.app.record.setFieldShown('添付ファイル_1', false);
    kintone.app.record.setFieldShown('添付ファイル_2', false);
    kintone.app.record.setFieldShown('添付ファイル_3', false);
    kintone.app.record.setFieldShown('添付ファイル_4', false);
    kintone.app.record.setFieldShown('添付ファイル_5', false);
    kintone.app.record.setFieldShown('添付ファイル_6', false);
    kintone.app.record.setFieldShown('添付ファイル_7', false);
    kintone.app.record.setFieldShown('添付ファイル_8', false);
    kintone.app.record.setFieldShown('添付ファイル_9', false);
    kintone.app.record.setFieldShown('添付ファイル_10', false);
    kintone.app.record.setFieldShown('捺印後の書類郵送先など', false);
    kintone.app.record.setFieldShown('一次承認差し戻しテーブル', false);
    kintone.app.record.setFieldShown('決裁承認差し戻しテーブル', false);
    kintone.app.record.setFieldShown('立案実行者', false);
    kintone.app.record.setFieldShown('立案実行日', false);
    kintone.app.record.setFieldShown('一次承認実行者', false);
    kintone.app.record.setFieldShown('一次承認実行日', false);
    kintone.app.record.setFieldShown('決裁承認実行者', false);
    kintone.app.record.setFieldShown('決裁承認実行日', false);
    kintone.app.record.setFieldShown('押印確認実行者', false);
    kintone.app.record.setFieldShown('押印確認実行日', false);
    kintone.app.record.setFieldShown('捺印済み書類の保管先', false);
    kintone.app.record.setFieldShown('捺印済み書類の保管先_エクスプローラー', false);
    kintone.app.record.setFieldShown('BOX', false);
    kintone.app.record.setFieldShown('BOXファイル保存名', false);
    kintone.app.record.setFieldShown('リーガルチェック', false);
    kintone.app.record.setFieldShown('作成者', false);
    kintone.app.record.setFieldShown('作成日時', false);
    kintone.app.record.setFieldShown('更新者', false);
    kintone.app.record.setFieldShown('更新日時', false);
    kintone.app.record.setFieldShown('レコード番号', false);
    kintone.app.record.setFieldShown('取引先コード', false);
    kintone.app.record.setFieldShown('LookUp会社名', false);
    kintone.app.record.setFieldShown('AdobeSignリンク', false);
    kintone.app.record.setFieldShown('立案No', false);    
    kintone.app.record.setFieldShown('部署ID', false);
    kintone.app.record.setFieldShown('立案部署', false);
    kintone.app.record.setFieldShown('決裁捺印マニュアル', false);
  }

  function set_up_field(record) {
    kintone.app.record.setFieldShown('添付書類', true);
    kintone.app.record.setFieldShown('添付ファイル_1', true);
    kintone.app.record.setFieldShown('添付ファイル_2', true);
    kintone.app.record.setFieldShown('添付ファイル_3', true);
    kintone.app.record.setFieldShown('添付ファイル_4', true);
    kintone.app.record.setFieldShown('添付ファイル_5', true);
    kintone.app.record.setFieldShown('添付ファイル_6', true);
    kintone.app.record.setFieldShown('添付ファイル_7', true);
    kintone.app.record.setFieldShown('添付ファイル_8', true);
    kintone.app.record.setFieldShown('添付ファイル_9', true);
    kintone.app.record.setFieldShown('添付ファイル_10', true);
  }

 })(jQuery);
