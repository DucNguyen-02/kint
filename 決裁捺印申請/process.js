(function() {
  'use strict';
  kintone.events.on('app.record.detail.process.proceed', function(event) {
    let mail = kintone.getLoginUser().email;
    let app = kintone.app.getId();
    let recodeId = event.record.$id.value;

    if (event.action.value == "一次承認差し戻し") {
      var result = prompt("一次承認の差し戻し理由を入力してください。");
      if (result === null || result.length === 0) {
        var body = {
          'app': app,
          'id': recodeId,
          'action': '再申請する',
          'assignee': mail
        };
        showSpinner(); // スピナー表示
        kintone.api(kintone.api.url('/k/v1/record/status', true), 'PUT', body, function(resp) {
          // success
          //console.log(resp);
          location.reload();
        }, function(error) {
          // error
          hideSpinner();
          alert("プロセスのロールバックに失敗しました。リロードして確認してください。");
          console.log(error);
        });
        return;
      }
      var rows = event.record.一次承認差し戻しテーブル.value
      if (rows.length === 1) {
        //デフォルトで存在する空のrowを更新する。
        if (rows[0].value.一次承認差し戻し内容.value.length === 0) {
            event.record.一次承認差し戻しテーブル.value.forEach(function(row) {
              row.value.一次承認差し戻し内容.value = result;
              row.value.一次承認差し戻し日時.value = getNowYMD();
            });
            kintone.app.record.set({record: event.record});
            return event;
          }
      }
        event.record.一次承認差し戻しテーブル.value.push({
          value: {
            "一次承認差し戻し日時": {
              value: getNowYMD(),
               type: "DATETIME"
            },
            "一次承認差し戻し内容": {
              value: result,
              type: "MULTI_LINE_TEXT"
            }
          }
        });
       kintone.app.record.set({record: event.record});
    }
    if (event.action.value == "決裁承認差し戻し") {
      result = prompt("決裁承認の差し戻し理由を入力してください。");
      if (result === null || result.length === 0) {
        body = {
          'app': app,
          'id': recodeId,
          'action': '再申請する',
          'assignee': mail
        };
        showSpinner(); // スピナー表示
        kintone.api(kintone.api.url('/k/v1/record/status', true), 'PUT', body, function(resp) {
          // success
          //console.log(resp);
          location.reload();
        }, function(error) {
          // error
          hideSpinner();
          alert("プロセスのロールバックに失敗しました。リロードして確認してください。");
          console.log(error);
        });
        return;
      }
      rows = event.record.決裁承認差し戻しテーブル.value
      if (rows.length === 1) {
        //デフォルトで存在する空のrowを更新する。
        if (rows[0].value.決裁承認差し戻し内容.value.length === 0) {
            event.record.決裁承認差し戻しテーブル.value.forEach(function(row) {
            row.value.決裁承認差し戻し内容.value = result;
            row.value.決裁承認差し戻し日時.value = getNowYMD();
          });
          kintone.app.record.set({record: event.record});
          return event;
        }
      }
        event.record.決裁承認差し戻しテーブル.value.push({
          value: {
            "決裁承認差し戻し日時": {
              value: getNowYMD(),
               type: "DATETIME"
            },
            "決裁承認差し戻し内容": {
              value: result,
              type: "MULTI_LINE_TEXT"
            }
          }
        });
       kintone.app.record.set({record: event.record});
    }
    return event;
  });

  function getNowYMD() {
    var dt = new Date();
    //kintone側でUTC→JPへ変換するためUTCで取得
    var y = dt.getUTCFullYear();
    var m = ("00" + (
    dt.getUTCMonth() + 1)).slice(-2);
    var d = ("00" + dt.getUTCDate()).slice(-2);
    var h = ("00" + dt.getUTCHours()).slice(-2);
    var mm = ("00" + dt.getUTCMinutes()).slice(-2);

    var result = y + "-" + m + "-" + d + "T" + h + ":" + mm + ":" + "00" + "Z";
    return result;
  }

  // スピナーを動作させる関数
  function showSpinner() {
    // 要素作成等初期化処理
    if ($('.kintone-spinner').length === 0) {
      // スピナー設置用要素と背景要素の作成
      var spin_div = $('<div id ="kintone-spin" class="kintone-spinner"></div>');
      var spin_bg_div = $('<div id ="kintone-spin-bg" class="kintone-spinner"></div>');

      // スピナー用要素をbodyにappend
      $(document.body).append(spin_div, spin_bg_div);

      // スピナー動作に伴うスタイル設定
      $(spin_div).css({
        'position': 'fixed',
        'top': '50%',
        'left': '50%',
        'z-index': '510',
        'background-color': '#fff',
        'padding': '26px',
        '-moz-border-radius': '4px',
        '-webkit-border-radius': '4px',
        'border-radius': '4px'
      });

      $(spin_bg_div).css({
        'position': 'fixed',
        'top': '0px',
        'left': '0px',
        'z-index': '500',
        'width': '100%',
        'height': '200%',
        'background-color': '#000',
        'opacity': '0.5',
        'filter': 'alpha(opacity=50)',
        '-ms-filter': "alpha(opacity=50)"
      });

      // スピナーに対するオプション設定
      var opts = {
        'color': '#000'
      };

      // スピナーを作動
      new Spinner(opts).spin(document.getElementById('kintone-spin'));
    }

    // スピナー始動（表示）
    $('.kintone-spinner').show();
  }

  // スピナーを停止させる関数
  function hideSpinner() {
    // スピナー停止（非表示）
    $('.kintone-spinner').hide();
  }

})(jQuery);
