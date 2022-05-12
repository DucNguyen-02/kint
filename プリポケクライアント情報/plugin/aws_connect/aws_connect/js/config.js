// 設定画面用のJavaScriptファイル
// プラグイン設定画面を開いた際に発火する

(function (pluginId) {
    "use strict";

    window.addEventListener('DOMContentLoaded', function() {
        // 保存された設定値を取得
        let config = kintone.plugin.app.getConfig(pluginId);

        // 取得した値が存在していれば、値を格納
        if (typeof (config['mode']) !== 'undefined') {
            document.getElementById('mode').value = config['mode'];
        }
        if (typeof (config['access_key']) !== 'undefined') {
            document.getElementById('access_key').value = config['access_key'];
        }
        if (typeof (config['secret_access_key']) !== 'undefined') {
            document.getElementById('secret_access_key').value = config['secret_access_key'];
        }

        // 保存ボタンを押した時の挙動
        document.getElementById("button_submit").onclick = function() {
            // 要素を取得
            let elMode = document.getElementById('mode');
            let elAccessKey = document.getElementById('access_key');
            let elSecretAccessKey = document.getElementById('secret_access_key');

            // 配列に格納
            let config = {
                "mode": elMode.value,
                "access_key": elAccessKey.value,
                "secret_access_key": elSecretAccessKey.value
            };

            // 設定情報の配列をプラグインに保存
            kintone.plugin.app.setConfig(config);
            window.alert("保存しました");
        };

    });

})(kintone.$PLUGIN_ID);
