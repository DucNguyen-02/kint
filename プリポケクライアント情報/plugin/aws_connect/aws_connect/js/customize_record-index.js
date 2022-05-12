// PC版のレコード一覧画面用のJavaScriptファイル
// 設定画面で設定した情報を使い、実装したい処理を記述する
// add URL to customize
// https://js.cybozu.com/momentjs/2.10.3/moment-with-locales.min.js
// https://js.cybozu.com/spinjs/2.3.2/spin.min.js
// https://js.cybozu.com/jquery/2.2.4/jquery.min.js

(function(pluginId){
    "use strict";

    // ロケールを初期化
    moment.locale('ja');

    // プラグインに保存された設定情報を取得
    let config = kintone.plugin.app.getConfig(pluginId)

    // 開発STG環境のAPI実行用
    const DEV_STG_API_KEY = "";
    const DEV_STG_API_URL = "https://stg.prepoke.com/api/v1/admin-operation/";
    // 本番STG環境のAPI実行用
    const PRO_STG_API_KEY = "";
    const PRO_STG_API_URL = "https://stg-prod.prepoke.com/api/v1/admin-operation/";
    // 本番環境のAPI実行用
    const PRO_API_KEY = "";
    const PRO_API_URL = "https://prepoke.com/api/v1/admin-operation/";

    // プラグインの設定画面の環境による使用API情報の分岐
    let API_KEY = "";
    let API_URL = "";
    if (config["mode"] == "開発STG") {
        API_KEY = DEV_STG_API_KEY;
        API_URL = DEV_STG_API_URL;
    } if (config["mode"] == "本番STG") {
        API_KEY = PRO_STG_API_KEY;
        API_URL = PRO_STG_API_URL;
    } if (config["mode"] == "本番") {
        API_KEY = PRO_API_KEY;
        API_URL = PRO_API_URL;
    }

    // 集計値の受け取りAPIのURL
    const API_URL_DESCRIBE_EXECUTION = API_URL + "describe_execution?executionArn=";

    // 顧客社数(契約社数)の集計APIのURL
    const API_URL_CONTRACT_COMP_DATA = API_URL + "get_contract_comp_data_start";
    // 対象従業員数の集計APIのURL
    const API_URL_EMPLOYEE_DATA_START = API_URL + "get_employee_data_start";
    // 会員登録者数の集計APIのURL
    const API_URL_APP_MEMBER_START = API_URL + "get_app_member_start";
    // 月間利用者数
    const API_URL_MONTHLY_USER_START = API_URL + "get_monthly_user_start";
    // 月間利用率
    const API_URL_USAGE_RATE_START = API_URL + "get_usage_rate_start";
    // 月間利用回数
    const API_URL_MONTHLY_USAGE_DATA_START = API_URL + "get_monthly_usage_data_start";
    // 月間利用単価平均
    const API_URL_MONTHLY_UNIT_COST_PER_USE_START = API_URL + "get_monthly_unit_cost_per_use_start";
    // 月間前払利用総額
    const API_URL_MONTHLY_PREPAID_USAGE_START = API_URL + "get_monthly_prepaid_usage_start";
    // 一人当たり月間利用平均回数
    const API_URL_MONTHLY_USAGE_PER_PERSON_START = API_URL + "get_monthly_usage_per_person_start";

    // 立替情報の取得APIのURL
    const API_URL_GET_PAY_IN_ADVANCE_INFO_START = API_URL + "get_pay_in_advance_info_start";
    // 入金情報の登録APIのURL
    const API_URL_UPDATE_DEPOSIT_INFO_START = API_URL + "update_deposit_info_start";

    // 各APIの集計待ち時間
    const waitTime = 30000; //30秒
    // 各API間の実行ラグ時間
    const exeLag = 10000; //10秒
    // 出力用メッセージ
    const MSG_SYSTEM_001 = "更新を開始します。\nまた、表示は集計が完了した順に表示されます。\n\n※更新には数分かかる場合があります。";
    const MSG_SYSTEM_002 = "全社情報の集計を実施してもよろしいですか？";
    const MSG_SYSTEM_003 = "集計の実施をキャンセルしました。\n集計を実施したい場合は画面を更新してください。"
    const MSG_SYSTEM_004 = "立替利用企業の立替情報更新を開始します。\n処理完了後は手動で画面を更新をしてください。\n\n※立替情報取得には数分かかる場合があります。";
    const MSG_NORMAL_001 = "更新が完了しました。";
    const MSG_ERROR_001 = "更新に失敗しました。時間をあけて再実行をお願いします。";
    // 表示用ラベルの高さの初期値
    const initialHeight = 48; //48px
    const addHeight = 24; //24px
    let height = initialHeight;
    //kintone表示用の文言
    let buttonInnerText = '全社情報の更新';
    let buttonInnerText2 = '立替企業の一括更新';
    let innerText = '　全社情報の取得には「' + buttonInnerText + '」ボタンを押してください。\n　※こちらの更新ボタンは特定の組織のユーザのみが押すことができます。';

    // レコード一覧画面の表示時に発火
    kintone.events.on('app.record.index.show', function(event){
        // 現在のモードの確認
        if (config["mode"] == "開発STG" || config["mode"] == "本番STG") {
            window.alert("[INFO] 現在は、" + config["mode"] + "環境の設定がされています。");
        }
        // 一覧画面にラベルフィールドを用意
        var myHeaderSpace = kintone.app.getHeaderSpaceElement();
        // 文字列要素を定義
        var myListHeaderDiv = document.createElement('div');
        myListHeaderDiv.style.width = '100%';
        myListHeaderDiv.style.height = height + 'px';
        myListHeaderDiv.style.textAlign = 'left';
        myListHeaderDiv.style.fontSize = '16px';
        myListHeaderDiv.style.color = '#333333';
        myListHeaderDiv.style.backgroundColor = '#F5F5F5';
        myListHeaderDiv.innerText = innerText;
        // メニューの下側の空白部分に文字列を表示（増殖を防ぐため一旦明示的に空文字をセット）
        myHeaderSpace.innerText = '';
        myHeaderSpace.appendChild(myListHeaderDiv);

        // すでにボタンが存在する場合に処理をスキップ
        if (document.getElementById('my_index_button') !== null) {
            return;
        }
        // 一覧画面に「全社情報の更新」ボタンを設置
        var myIndexButton = document.createElement('button');
        myIndexButton.id = 'my_index_button';
        myIndexButton.innerText = buttonInnerText;
        myIndexButton.style.marginRight = '10px';
        myIndexButton.onclick = function() {
            window.alert(MSG_SYSTEM_001);
            showSpinner(); // スピナー表示
            // 連続してボタンを押された場合のために、一度ラベルの高さを初期化
            height = initialHeight;
            // 現在の年月を取得
            var nowYearMonth = moment().format('YYYY年M月');

            // 顧客社数(契約社数)の集計APIを実行
            setTimeout(function(){
                kintone.proxy(API_URL_CONTRACT_COMP_DATA, 'GET', {'x-api-key':API_KEY}, {}).then(function(resp){
                    // 一定時間経過後に受け取り用APIを実行
                    setTimeout(function(){
                        // 集計値の受け取り用APIのURLを生成
                        var url = API_URL_DESCRIBE_EXECUTION + JSON.parse(resp[0]).executionArn;
                        // 集計値の受け取り用APIを実行
                        kintone.proxy(url, 'GET', {'x-api-key':API_KEY}, {}).then(function(resp){
                            console.log(JSON.parse(JSON.parse(resp[0]).output).body);
                            // 数値に3桁区切りを追加
                            var contractCompData = (JSON.parse(JSON.parse(resp[0]).output).body).toLocaleString();
                            // ラベルの表示設定を変更
                            myListHeaderDiv.innerText = '※集計方法についてはレコード詳細をご確認ください。\n　　顧客社数(契約社数)：「' + contractCompData + '」社\n';

                            return event;
                        }).catch(function(error){
                            console.log(error);
                            hideSpinner(); // スピナー非表示
                            window.alert(MSG_ERROR_001);
                            location.reload();
                            return event;
                        });
                        return event;
                    }, waitTime);
                }).catch(function(error){
                    console.log(error);
                    hideSpinner(); // スピナー非表示
                    window.alert(MSG_ERROR_001);
                    location.reload();
                    return event;
                });
            }, exeLag*0);

            // 対象従業員数の集計APIを実行
            setTimeout(function(){
                kintone.proxy(API_URL_EMPLOYEE_DATA_START, 'GET', {'x-api-key':API_KEY}, {}).then(function(resp){
                    // 一定時間経過後に受け取り用APIを実行
                    setTimeout(function(){
                        // 集計値の受け取り用APIのURLを生成
                        var url = API_URL_DESCRIBE_EXECUTION + JSON.parse(resp[0]).executionArn;
                        // 集計値の受け取り用APIを実行
                        kintone.proxy(url, 'GET', {'x-api-key':API_KEY}, {}).then(function(resp){
                            console.log(JSON.parse(JSON.parse(resp[0]).output).body);
                            // 数値に3桁区切りを追加
                            var employeeData = (JSON.parse(JSON.parse(resp[0]).output).body).toLocaleString();
                            // ラベルの表示設定を変更
                            height += addHeight;
                            myListHeaderDiv.style.height = height + 'px';
                            myListHeaderDiv.innerText += '　　対象従業員数(全社合計)：「' + employeeData + '」人\n';

                            return event;
                        }).catch(function(error){
                            console.log(error);
                            hideSpinner(); // スピナー非表示
                            window.alert(MSG_ERROR_001);
                            location.reload();
                            return event;
                        });
                        return event;
                    }, waitTime);
                }).catch(function(error){
                    console.log(error);
                    hideSpinner(); // スピナー非表示
                    window.alert(MSG_ERROR_001);
                    location.reload();
                    return event;
                });
            }, exeLag*1);

            // 会員登録者数の集計APIを実行
            setTimeout(function(){
                kintone.proxy(API_URL_APP_MEMBER_START, 'GET', {'x-api-key':API_KEY}, {}).then(function(resp){
                    // 一定時間経過後に受け取り用APIを実行
                    setTimeout(function(){
                        // 集計値の受け取り用APIのURLを生成
                        var url = API_URL_DESCRIBE_EXECUTION + JSON.parse(resp[0]).executionArn;
                        // 集計値の受け取り用APIを実行
                        kintone.proxy(url, 'GET', {'x-api-key':API_KEY}, {}).then(function(resp){
                            console.log(JSON.parse(JSON.parse(resp[0]).output).body);
                            // 数値に3桁区切りを追加
                            var appMember = (JSON.parse(JSON.parse(resp[0]).output).body).toLocaleString();
                            // ラベルの表示設定を変更
                            height += addHeight;
                            myListHeaderDiv.style.height = height + 'px';
                            myListHeaderDiv.innerText += '　　会員登録者数(全社合計)：「' + appMember + '」人\n';

                            return event;
                        }).catch(function(error){
                            console.log(error);
                            hideSpinner(); // スピナー非表示
                            window.alert(MSG_ERROR_001);
                            location.reload();
                            return event;
                        });
                        return event;
                    }, waitTime);
                }).catch(function(error){
                    console.log(error);
                    hideSpinner(); // スピナー非表示
                    window.alert(MSG_ERROR_001);
                    location.reload();
                    return event;
                });
            }, exeLag*2);

            // 月間利用者数の集計APIを実行
            setTimeout(function(){
                kintone.proxy(API_URL_MONTHLY_USER_START, 'GET', {'x-api-key':API_KEY}, {}).then(function(resp){
                    // 一定時間経過後に受け取り用APIを実行
                    setTimeout(function(){
                        // 集計値の受け取り用APIのURLを生成
                        var url = API_URL_DESCRIBE_EXECUTION + JSON.parse(resp[0]).executionArn;
                        // 集計値の受け取り用APIを実行
                        kintone.proxy(url, 'GET', {'x-api-key':API_KEY}, {}).then(function(resp){
                            console.log(JSON.parse(JSON.parse(resp[0]).output).body);
                            // 数値に3桁区切りを追加
                            var monthlyUser = (JSON.parse(JSON.parse(resp[0]).output).body).toLocaleString();
                            // ラベルの表示設定を変更
                            height += addHeight;
                            myListHeaderDiv.style.height = height + 'px';
                            myListHeaderDiv.innerText += '　　月間利用者数(' + nowYearMonth + '度,全社合計)：「' + monthlyUser + '」人\n';

                            return event;
                        }).catch(function(error){
                            console.log(error);
                            hideSpinner(); // スピナー非表示
                            window.alert(MSG_ERROR_001);
                            location.reload();
                            return event;
                        });
                        return event;
                    }, waitTime);
                }).catch(function(error){
                    console.log(error);
                    hideSpinner(); // スピナー非表示
                    window.alert(MSG_ERROR_001);
                    location.reload();
                    return event;
                });
            }, exeLag*3);

            // 月間利用率の集計APIを実行
            setTimeout(function(){
                kintone.proxy(API_URL_USAGE_RATE_START, 'GET', {'x-api-key':API_KEY}, {}).then(function(resp){
                    // 一定時間経過後に受け取り用APIを実行
                    setTimeout(function(){
                        // 集計値の受け取り用APIのURLを生成
                        var url = API_URL_DESCRIBE_EXECUTION + JSON.parse(resp[0]).executionArn;
                        // 集計値の受け取り用APIを実行
                        kintone.proxy(url, 'GET', {'x-api-key':API_KEY}, {}).then(function(resp){
                            console.log(JSON.parse(JSON.parse(resp[0]).output).body);
                            var usageRate = JSON.parse(JSON.parse(resp[0]).output).body;
                            // 小数点第5位の判定
                            var usageRateCheck = (usageRate*100000);
                            console.log("RateCheck" + usageRateCheck);
                            if ((0 < usageRateCheck) && (usageRateCheck < 5)) {
                                console.log("割合が「0.000% < RATE < 0.005%」となるため、表示を「0.01%」とします。");
                                var usageRateRound = 0.01;
                            }
                            else if ((99995 <= usageRateCheck) && (usageRateCheck < 100000)) {
                                console.log("割合が「99.995% <= RATE < 100.000%」となるため、表示を「99.99%」とします。");
                                var usageRateRound = 99.99;
                            }
                            else {
                                console.log("割合が「0.005% <= RATE < 99.995%」、または「RATE = 0% or 100%」のため、小数点第3位で四捨五入します。");
                                var usageRateRound = (usageRate*100).toFixed(2);
                                console.log("rate：" + usageRateRound);
                            }
                            // ラベルの表示設定を変更
                            height += addHeight;
                            myListHeaderDiv.style.height = height + 'px';
                            myListHeaderDiv.innerText += '　　月間利用率(' + nowYearMonth + '度,全社合計)：「' + usageRateRound + '」％\n';

                            return event;
                        }).catch(function(error){
                            console.log(error);
                            hideSpinner(); // スピナー非表示
                            window.alert(MSG_ERROR_001);
                            location.reload();
                            return event;
                        });
                        return event;
                    }, waitTime);
                }).catch(function(error){
                    console.log(error);
                    hideSpinner(); // スピナー非表示
                    window.alert(MSG_ERROR_001);
                    location.reload();
                    return event;
                });
            }, exeLag*4);

            // 月間利用回数の集計APIを実行
            setTimeout(function(){
                kintone.proxy(API_URL_MONTHLY_USAGE_DATA_START, 'GET', {'x-api-key':API_KEY}, {}).then(function(resp){
                    // 一定時間経過後に受け取り用APIを実行
                    setTimeout(function(){
                        // 集計値の受け取り用APIのURLを生成
                        var url = API_URL_DESCRIBE_EXECUTION + JSON.parse(resp[0]).executionArn;
                        // 集計値の受け取り用APIを実行
                        kintone.proxy(url, 'GET', {'x-api-key':API_KEY}, {}).then(function(resp){
                            console.log(JSON.parse(JSON.parse(resp[0]).output).body);
                            // 数値に3桁区切りを追加
                            var monthlyUsageData = (JSON.parse(JSON.parse(resp[0]).output).body).toLocaleString();
                            // ラベルの表示設定を変更
                            height += addHeight;
                            myListHeaderDiv.style.height = height + 'px';
                            myListHeaderDiv.innerText += '　　月間利用回数(' + nowYearMonth + '度,全社合計)：「' + monthlyUsageData + '」回\n';

                            return event;
                        }).catch(function(error){
                            console.log(error);
                            hideSpinner(); // スピナー非表示
                            window.alert(MSG_ERROR_001);
                            location.reload();
                            return event;
                        });
                        return event;
                    }, waitTime);
                }).catch(function(error){
                    console.log(error);
                    hideSpinner(); // スピナー非表示
                    window.alert(MSG_ERROR_001);
                    location.reload();
                    return event;
                });
            }, exeLag*5);

            // 一人当たりの月間利用平均回数の集計APIを実行
            setTimeout(function(){
                kintone.proxy(API_URL_MONTHLY_USAGE_PER_PERSON_START, 'GET', {'x-api-key':API_KEY}, {}).then(function(resp){
                    // 一定時間経過後に受け取り用APIを実行
                    setTimeout(function(){
                        // 集計値の受け取り用APIのURLを生成
                        var url = API_URL_DESCRIBE_EXECUTION + JSON.parse(resp[0]).executionArn;
                        // 集計値の受け取り用APIを実行
                        kintone.proxy(url, 'GET', {'x-api-key':API_KEY}, {}).then(function(resp){
                            console.log(JSON.parse(JSON.parse(resp[0]).output).body);
                            // 数値に3桁区切りを追加
                            var average_monthly_usage_per_person = (JSON.parse(JSON.parse(resp[0]).output).body).toLocaleString();
                            // ラベルの表示設定を変更
                            height += addHeight;
                            myListHeaderDiv.style.height = height + 'px';
                            myListHeaderDiv.innerText += '　　一人当たりの月間利用平均回数(' + nowYearMonth + '度,全社合計)：「' + average_monthly_usage_per_person + '」回\n';

                            return event;
                        }).catch(function(error){
                            console.log(error);
                            hideSpinner(); // スピナー非表示
                            window.alert(MSG_ERROR_001);
                            location.reload();
                            return event;
                        });
                        return event;
                    }, waitTime);
                }).catch(function(error){
                    console.log(error);
                    hideSpinner(); // スピナー非表示
                    window.alert(MSG_ERROR_001);
                    location.reload();
                    return event;
                });
            }, exeLag*6);

            // 月間前払利用総額の集計APIを実行
            setTimeout(function(){
                kintone.proxy(API_URL_MONTHLY_PREPAID_USAGE_START, 'GET', {'x-api-key':API_KEY}, {}).then(function(resp){
                    // 一定時間経過後に受け取り用APIを実行
                    setTimeout(function(){
                        // 集計値の受け取り用APIのURLを生成
                        var url = API_URL_DESCRIBE_EXECUTION + JSON.parse(resp[0]).executionArn;
                        // 集計値の受け取り用APIを実行
                        kintone.proxy(url, 'GET', {'x-api-key':API_KEY}, {}).then(function(resp){
                            console.log(JSON.parse(JSON.parse(resp[0]).output).body);
                            // 数値に3桁区切りを追加
                            var total_monthly_usage = (JSON.parse(JSON.parse(resp[0]).output).body).toLocaleString();
                            // ラベルの表示設定を変更
                            height += addHeight;
                            myListHeaderDiv.style.height = height + 'px';
                            myListHeaderDiv.innerText += '　　月間前払利用総額(' + nowYearMonth + '度,全社合計)：「' + total_monthly_usage + '」円\n';

                            return event;
                        }).catch(function(error){
                            console.log(error);
                            hideSpinner(); // スピナー非表示
                            window.alert(MSG_ERROR_001);
                            location.reload();
                            return event;
                        });
                        return event;
                    }, waitTime);
                }).catch(function(error){
                    console.log(error);
                    hideSpinner(); // スピナー非表示
                    window.alert(MSG_ERROR_001);
                    location.reload();
                    return event;
                });
            }, exeLag*7);

            // 月間利用単価平均の集計APIを実行
            setTimeout(function(){
                kintone.proxy(API_URL_MONTHLY_UNIT_COST_PER_USE_START, 'GET', {'x-api-key':API_KEY}, {}).then(function(resp){
                    // 一定時間経過後に受け取り用APIを実行
                    setTimeout(function(){
                        // 集計値の受け取り用APIのURLを生成
                        var url = API_URL_DESCRIBE_EXECUTION + JSON.parse(resp[0]).executionArn;
                        // 集計値の受け取り用APIを実行
                        kintone.proxy(url, 'GET', {'x-api-key':API_KEY}, {}).then(function(resp){
                            console.log(JSON.parse(JSON.parse(resp[0]).output).body);
                            // 数値に3桁区切りを追加
                            var monthly_usage_price_average = (JSON.parse(JSON.parse(resp[0]).output).body).toLocaleString();
                            // ラベルの表示設定を変更
                            height += addHeight;
                            myListHeaderDiv.style.height = height + 'px';
                            myListHeaderDiv.innerText += '　　月間利用単価平均(' + nowYearMonth + '度,全社合計)：「' + monthly_usage_price_average + '」円\n';

                            hideSpinner(); // スピナー非表示
                            window.alert(MSG_NORMAL_001);

                            return event;
                        }).catch(function(error){
                            console.log(error);
                            hideSpinner(); // スピナー非表示
                            window.alert(MSG_ERROR_001);
                            location.reload();
                            return event;
                        });
                        return event;
                    }, waitTime);
                }).catch(function(error){
                    console.log(error);
                    hideSpinner(); // スピナー非表示
                    window.alert(MSG_ERROR_001);
                    location.reload();
                    return event;
                });
            }, exeLag*8);

        };
        kintone.app.getHeaderMenuSpaceElement().appendChild(myIndexButton);

        // すでにボタンが存在する場合に処理をスキップ
        if (document.getElementById('my_index_button2') !== null) {
            return;
        }
        // 一覧画面に「立替企業の一括更新」ボタンを設置
        var myIndexButton2 = document.createElement('button');
        myIndexButton2.id = 'my_index_button2';
        myIndexButton2.innerText = buttonInnerText2;
        myIndexButton2.style.marginRight = '10px';
        myIndexButton2.onclick = function() {
            window.alert(MSG_SYSTEM_004);
            // 処理を行うアプリIDを取得
            var appId = kintone.app.getId();
            console.log("appId：" + appId);
            // スキームが立替となっている企業コードのみを取得
            var body = {
                'app': appId,
                'query': 'スキーム in ("立替")',
                'fields': ['company_code', 'スキーム']
            };
            kintone.api(kintone.api.url('/k/v1/records', true), 'GET', body, function(resp) {
                // 取得した立替企業の企業コードをループさせ、立替情報を最新化
                console.log(resp);
                for (var i in resp.records) {
                    // 立替情報を最新化する関数を企業コード毎に並列（非同期）で呼び出す
                    // 非同期での外部API呼び出しとなるので処理の終了時の検知ができないため、スピナーの起動停止は関数内で行う
                    updatePayInAdvanceInformation(appId, API_KEY, API_URL_DESCRIBE_EXECUTION, API_URL_GET_PAY_IN_ADVANCE_INFO_START, resp.records[i].company_code.value);
                }
            }, function(error) {
                console.log(error);
            });
        }
        kintone.app.getHeaderMenuSpaceElement().appendChild(myIndexButton2);

        // ログイン中のユーザの組織を取得
        kintone.api('/v1/user/organizations', 'GET', {code:kintone.getLoginUser()['code']}, function(resp) {
            var organization = resp.organizationTitles[0].organization.name;
            // ログイン中のユーザの組織が「情報システム部」でない場合、「全社情報の更新」ボタンを非活性化
            if (organization != '情報システム部') {
                document.getElementById("my_index_button").disabled = true;
            }
        });

    });
})(kintone.$PLUGIN_ID);


// スピナーを動作させる関数
function showSpinner() {
    // 要素作成等初期化処理
    if ($('.kintone-spinner').length == 0) {
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

// 立替利用率を計算する関数
function mathPayInUtilizationRatio(advanceAmount, payInAdvanceAmount) {
    var utilizationRatio = advanceAmount / payInAdvanceAmount * 100;
    //小数点第3位まで切り捨て
    utilizationRatio = Math.floor(utilizationRatio * 1000) / 1000;
    // 基本は小数点第2で四捨五入とし、0.001~0.004までは0.01と表示させ99.995~99.999は99.99%と表示させる。
    if ((0 < utilizationRatio) && (utilizationRatio < 0.005)) {
        console.log("割合が「0.000% < RATE < 0.005%」となるため、表示を「0.01%」とします。");
        utilizationRatio = 0.01;
    }
    else if ((99.995 <= utilizationRatio) && (utilizationRatio < 100)) {
        console.log("割合が「99.995% <= RATE < 100.000%」となるため、表示を「99.99%」とします。");
        utilizationRatio = 99.99;
    }
    else {
        console.log("割合が「0.005% <= RATE < 99.995%」、または「RATE = 0% or 100%」のため、小数点第3位で四捨五入します。");
        utilizationRatio = Math.round(utilizationRatio * 100) / 100
        console.log("rate：" + utilizationRatio);
    }
    return utilizationRatio;
}

// 立替情報を最新に更新する関数
function updatePayInAdvanceInformation(appId, API_KEY, API_URL_DESCRIBE_EXECUTION, API_URL_GET_PAY_IN_ADVANCE_INFO_START, repaymentCompanyCode) {
    // 処理中にスピナーを展開しているように擬似的に見せるため、関数内でスピナーの起動と停止を行う
    showSpinner(); // スピナー表示
    console.log("企業コード：" + repaymentCompanyCode + " の更新処理を開始します。");

    // 引数の企業コードをキーにして立替情報の取得APIを実行
    kintone.proxy((API_URL_GET_PAY_IN_ADVANCE_INFO_START + "?companyCode=" + repaymentCompanyCode), 'GET', {'x-api-key':API_KEY}, {}).then(function(resp){
        console.log("API実行中：" + API_URL_GET_PAY_IN_ADVANCE_INFO_START + "?companyCode=" + repaymentCompanyCode);
        // 一定時間経過後に結果受け取り用APIを実行
        setTimeout(function(){
            // 結果受け取り用APIのURLを生成
            const url = API_URL_DESCRIBE_EXECUTION + JSON.parse(resp[0]).executionArn;
            // 結果受け取り用APIを実行
            kintone.proxy(url, 'GET', {'x-api-key':API_KEY}, {}).then(function(resp){
                console.log(JSON.parse(JSON.parse(resp[0]).output).body);
                // 値を取得
                const payInAdvanceAmount = JSON.parse(JSON.parse(JSON.parse(resp[0]).output).body).Items[0].payInAdvanceAmount;
                const limitedPayInAdvanceAmount = JSON.parse(JSON.parse(JSON.parse(resp[0]).output).body).Items[0].limitedPayInAdvanceAmount;
                const availablePayInAdvanceAmount = JSON.parse(JSON.parse(JSON.parse(resp[0]).output).body).Items[0].availablePayInAdvanceAmount;
                // 立替利用率の計算をここで実行する
                const payInAdvanceUtilizationRatio = mathPayInUtilizationRatio(payInAdvanceAmount, limitedPayInAdvanceAmount);
                // 取得した値を元にレコードを更新
                const params={
                    "app": appId,
                    "updateKey": {
                        "field": "company_code", //重複禁止のフィールドコード
                        "value": repaymentCompanyCode
                    },
                    "record":{
                        "limited_pay_in_advance_amount":{"value":limitedPayInAdvanceAmount},
                        "pay_in_advance_amount":{"value":payInAdvanceAmount},
                        "available_pay_in_advance_amount":{"value":availablePayInAdvanceAmount},
                        "pay_in_advance_utilization_ratio":{"value":payInAdvanceUtilizationRatio}
                    }
                };
                console.log("params：" + JSON.stringify(params, null, 2));
                kintone.api(kintone.api.url('/k/v1/record', true), 'PUT', params, function(resp){});
                console.log("企業コード：" + repaymentCompanyCode + " の更新処理を終了します。");

                hideSpinner(); // スピナー非表示
                return event;
            }).catch(function(error){
                console.log(error);
                hideSpinner(); // スピナー非表示
                window.alert(MSG_ERROR_001);
                location.reload();
                return event;
            });
            return event;
        }, 15000); //15秒
    }).catch(function(error){
        console.log(error);
        hideSpinner(); // スピナー非表示
        window.alert(MSG_ERROR_001);
        location.reload();
        return event;
    });
}
