// PC版のレコード詳細画面用のJavaScriptファイル
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

    // 対象従業員数(個社)の集計APIのURL
    const API_URL_EMPLOYEE_DATA_START = API_URL + "get_employee_data_start";
    // 会員登録者数(個社)の集計APIのURL
    const API_URL_APP_MEMBER_START = API_URL + "get_app_member_start";
    // 会員登録率(個社)の集計APIのURL
    const API_URL_REGISTRATION_RATE_START = API_URL + "get_registration_rate_start";
    // 月間利用者数(個社)の集計APIのURL
    const API_URL_MONTHLY_USER_START = API_URL + "get_monthly_user_start";
    // 月間利用率(個社)の集計APIのURL
    const API_URL_USAGE_RATE_START = API_URL + "get_usage_rate_start";
    // 月間利用回数(個社)の集計APIのURL
    const API_URL_MONTHLY_USAGE_DATA_START = API_URL + "get_monthly_usage_data_start";
    // 月間利用単価平均の集計APIのURL
    const API_URL_MONTHLY_UNIT_COST_PER_USE_START = API_URL + "get_monthly_unit_cost_per_use_start";
    // 月間前払利用総額の集計APIのURL
    const API_URL_MONTHLY_PREPAID_USAGE_START = API_URL + "get_monthly_prepaid_usage_start";
    // 一人当たり月間利用平均回数の集計APIのURL
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
    const MSG_SYSTEM_001 = "更新を開始します。\nまた、表示は集計が完了した順に表示されます。\n※更新には数分かかる場合があります。";
    const MSG_NORMAL_001 = "更新が完了しました。";
    const MSG_ERROR_001 = "更新に失敗しました。時間をあけて再実行をお願いします。";

    let buttonInnerText = '企業情報の更新';

    // レコード詳細画面の表示時に発火
    kintone.events.on('app.record.detail.show', function(event){
        if (config["mode"] == "開発STG" || config["mode"] == "本番STG") {
            window.alert("[INFO] 現在は、" + config["mode"] + "環境の設定がされています。");
        }
        // 詳細画面のスペースフィールドにボタンを用意
        var linkButton = document.createElement('button');
        linkButton.id = 'link_button';
        linkButton.innerText = buttonInnerText;
        // ボタン押下時の挙動
        linkButton.onclick = function (){
            window.alert(MSG_SYSTEM_001);
            showSpinner(); // スピナー表示
            // 現在の年月を取得
            var nowYearMonth = moment().format('YYYY年M月');

            // 表示しているレコードの企業コードを取得
            var record = event.record;
            var company_code = record['company_code']['value'];
            // 集計条件を設定
            var condition = "?companyCode=" + company_code;

            // 対象従業員数の集計APIを実行
            setTimeout(function(){
                kintone.proxy((API_URL_EMPLOYEE_DATA_START + condition), 'GET', {'x-api-key':API_KEY}, {}).then(function(resp){
                    // 一定時間経過後に受け取り用APIを実行
                    setTimeout(function(){
                        // 集計値の受け取り用APIのURLを生成
                        var url = API_URL_DESCRIBE_EXECUTION + JSON.parse(resp[0]).executionArn;
                        // 集計値の受け取り用APIを実行
                        kintone.proxy(url, 'GET', {'x-api-key':API_KEY}, {}).then(function(resp){
                            console.log(JSON.parse(JSON.parse(resp[0]).output).body);
                            // 値を取得
                            var employees = JSON.parse(JSON.parse(resp[0]).output).body;
                            // レコードに取得した値を設定
                            var params={
                                "app":kintone.app.getId(),
                                "id":kintone.app.record.getId(),
                                "record":{
                                    "employees":{"value":employees}
                                }
                            };
                            kintone.api(kintone.api.url('/k/v1/record', true), 'PUT', params, function(resp){});

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

            // 会員登録者数の集計APIを実行
            setTimeout(function(){
                kintone.proxy((API_URL_APP_MEMBER_START + condition), 'GET', {'x-api-key':API_KEY}, {}).then(function(resp){
                    // 一定時間経過後に受け取り用APIを実行
                    setTimeout(function(){
                        // 集計値の受け取り用APIのURLを生成
                        var url = API_URL_DESCRIBE_EXECUTION + JSON.parse(resp[0]).executionArn;
                        // 集計値の受け取り用APIを実行
                        kintone.proxy(url, 'GET', {'x-api-key':API_KEY}, {}).then(function(resp){
                            console.log(JSON.parse(JSON.parse(resp[0]).output).body);
                            // 値を取得
                            var registered_members = JSON.parse(JSON.parse(resp[0]).output).body;
                            // レコードに取得した値を設定
                            var params={
                                "app":kintone.app.getId(),
                                "id":kintone.app.record.getId(),
                                "record":{
                                    "registered_members":{"value":registered_members}
                                }
                            };
                            kintone.api(kintone.api.url('/k/v1/record', true), 'PUT', params, function(resp){});

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

            // 会員登録率の集計APIを実行
            setTimeout(function(){
                kintone.proxy((API_URL_REGISTRATION_RATE_START + condition), 'GET', {'x-api-key':API_KEY}, {}).then(function(resp){
                    // 一定時間経過後に受け取り用APIを実行
                    setTimeout(function(){
                        // 集計値の受け取り用APIのURLを生成
                        var url = API_URL_DESCRIBE_EXECUTION + JSON.parse(resp[0]).executionArn;
                        // 集計値の受け取り用APIを実行
                        kintone.proxy(url, 'GET', {'x-api-key':API_KEY}, {}).then(function(resp){
                            console.log(JSON.parse(JSON.parse(resp[0]).output).body);
                            var registration_rate = JSON.parse(JSON.parse(resp[0]).output).body;
                            // 小数点第5位の判定
                            var registration_rate_check = (registration_rate*100000);
                            console.log("rate_check：" + registration_rate_check);
                            if ((0 < registration_rate_check) && (registration_rate_check < 5)) {
                                console.log("割合が「0.000% < RATE < 0.005%」となるため、表示を「0.01%」とします。");
                                var registration_rate_round = 0.01;
                            }
                            else if ((99995 <= registration_rate_check) && (registration_rate_check < 100000)) {
                                console.log("割合が「99.995% <= RATE < 100.000%」となるため、表示を「99.99%」とします。");
                                var registration_rate_round = 99.99;
                            }
                            else {
                                console.log("割合が「0.005% <= RATE < 99.995%」、または「RATE = 0% or 100%」のため、小数点第3位で四捨五入します。");
                                var registration_rate_round = (registration_rate*100).toFixed(2);
                                console.log("rate：" + registration_rate_round);
                            }
                            // レコードに取得した値を設定
                            var params={
                                "app":kintone.app.getId(),
                                "id":kintone.app.record.getId(),
                                "record":{
                                    "registration_rate":{"value":registration_rate_round}
                                }
                            };
                            kintone.api(kintone.api.url('/k/v1/record', true), 'PUT', params, function(resp){});

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
                kintone.proxy((API_URL_MONTHLY_USER_START + condition), 'GET', {'x-api-key':API_KEY}, {}).then(function(resp){
                    // 一定時間経過後に受け取り用APIを実行
                    setTimeout(function(){
                        // 集計値の受け取り用APIのURLを生成
                        var url = API_URL_DESCRIBE_EXECUTION + JSON.parse(resp[0]).executionArn;
                        // 集計値の受け取り用APIを実行
                        kintone.proxy(url, 'GET', {'x-api-key':API_KEY}, {}).then(function(resp){
                            console.log(JSON.parse(JSON.parse(resp[0]).output).body);
                            // 値を取得
                            var monthly_user = JSON.parse(JSON.parse(resp[0]).output).body;
                            // レコードに取得した値を設定
                            var params={
                                "app":kintone.app.getId(),
                                "id":kintone.app.record.getId(),
                                "record":{
                                    "monthly_user":{"value":monthly_user}
                                }
                            };
                            kintone.api(kintone.api.url('/k/v1/record', true), 'PUT', params, function(resp){});

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
                kintone.proxy((API_URL_USAGE_RATE_START + condition), 'GET', {'x-api-key':API_KEY}, {}).then(function(resp){
                    // 一定時間経過後に受け取り用APIを実行
                    setTimeout(function(){
                        // 集計値の受け取り用APIのURLを生成
                        var url = API_URL_DESCRIBE_EXECUTION + JSON.parse(resp[0]).executionArn;
                        // 集計値の受け取り用APIを実行
                        kintone.proxy(url, 'GET', {'x-api-key':API_KEY}, {}).then(function(resp){
                            console.log(JSON.parse(JSON.parse(resp[0]).output).body);
                            // 小数点以下の有効桁数を10桁として％に変換
                            var monthly_usage_rate = JSON.parse(JSON.parse(resp[0]).output).body;
                            // 小数点第5位の判定
                            var monthly_usage_rate_check = (monthly_usage_rate*100000);
                            console.log("rate_check：" + monthly_usage_rate_check);
                            if ((0 < monthly_usage_rate_check) && (monthly_usage_rate_check < 5)) {
                                console.log("割合が「0.000% < RATE < 0.005%」となるため、表示を「0.01%」とします。");
                                var monthly_usage_rate_round = 0.01;
                            }
                            else if ((99995 <= monthly_usage_rate_check) && (monthly_usage_rate_check < 100000)) {
                                console.log("割合が「99.995% <= RATE < 100.000%」となるため、表示を「99.99%」とします。");
                                var monthly_usage_rate_round = 99.99;
                            }
                            else {
                                console.log("割合が「0.005% <= RATE < 99.995%」、または「RATE = 0% or 100%」のため、小数点第3位で四捨五入します。");
                                var monthly_usage_rate_round = (monthly_usage_rate*100).toFixed(2);
                                console.log("rate：" + monthly_usage_rate_round);
                            }
                            // レコードに取得した値を設定
                            var params={
                                "app":kintone.app.getId(),
                                "id":kintone.app.record.getId(),
                                "record":{
                                    "monthly_usage_rate":{"value":monthly_usage_rate_round}
                                }
                            };
                            kintone.api(kintone.api.url('/k/v1/record', true), 'PUT', params, function(resp){});

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
                kintone.proxy((API_URL_MONTHLY_USAGE_DATA_START + condition), 'GET', {'x-api-key':API_KEY}, {}).then(function(resp){
                    // 一定時間経過後に受け取り用APIを実行
                    setTimeout(function(){
                        // 集計値の受け取り用APIのURLを生成
                        var url = API_URL_DESCRIBE_EXECUTION + JSON.parse(resp[0]).executionArn;
                        // 集計値の受け取り用APIを実行
                        kintone.proxy(url, 'GET', {'x-api-key':API_KEY}, {}).then(function(resp){
                            console.log(JSON.parse(JSON.parse(resp[0]).output).body);
                            // 値を取得
                            var monthly_usage_count = JSON.parse(JSON.parse(resp[0]).output).body;
                            // レコードに取得した値を設定
                            var params={
                                "app":kintone.app.getId(),
                                "id":kintone.app.record.getId(),
                                "record":{
                                    "monthly_usage_count":{"value":monthly_usage_count}
                                }
                            };
                            kintone.api(kintone.api.url('/k/v1/record', true), 'PUT', params, function(resp){});

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

            // 月間利用単価平均の集計APIを実行
            setTimeout(function(){
                kintone.proxy((API_URL_MONTHLY_UNIT_COST_PER_USE_START + condition), 'GET', {'x-api-key':API_KEY}, {}).then(function(resp){
                    // 一定時間経過後に受け取り用APIを実行
                    setTimeout(function(){
                        // 集計値の受け取り用APIのURLを生成
                        var url = API_URL_DESCRIBE_EXECUTION + JSON.parse(resp[0]).executionArn;
                        // 集計値の受け取り用APIを実行
                        kintone.proxy(url, 'GET', {'x-api-key':API_KEY}, {}).then(function(resp){
                            console.log(JSON.parse(JSON.parse(resp[0]).output).body);
                            // 値を取得
                            var monthly_usage_price_average = JSON.parse(JSON.parse(resp[0]).output).body;
                            // レコードに取得した値を設定
                            var params={
                                "app":kintone.app.getId(),
                                "id":kintone.app.record.getId(),
                                "record":{
                                    "monthly_usage_price_average":{"value":monthly_usage_price_average}
                                }
                            };
                            kintone.api(kintone.api.url('/k/v1/record', true), 'PUT', params, function(resp){});

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
                kintone.proxy((API_URL_MONTHLY_PREPAID_USAGE_START + condition), 'GET', {'x-api-key':API_KEY}, {}).then(function(resp){
                    // 一定時間経過後に受け取り用APIを実行
                    setTimeout(function(){
                        // 集計値の受け取り用APIのURLを生成
                        var url = API_URL_DESCRIBE_EXECUTION + JSON.parse(resp[0]).executionArn;
                        // 集計値の受け取り用APIを実行
                        kintone.proxy(url, 'GET', {'x-api-key':API_KEY}, {}).then(function(resp){
                            console.log(JSON.parse(JSON.parse(resp[0]).output).body);
                            // 値を取得
                            var total_monthly_usage = JSON.parse(JSON.parse(resp[0]).output).body;
                            // レコードに取得した値を設定
                            var params={
                                "app":kintone.app.getId(),
                                "id":kintone.app.record.getId(),
                                "record":{
                                    "total_monthly_usage":{"value":total_monthly_usage}
                                }
                            };
                            kintone.api(kintone.api.url('/k/v1/record', true), 'PUT', params, function(resp){});

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

            // 一人当たり月間利用平均回数の集計APIを実行
            setTimeout(function(){
                kintone.proxy((API_URL_MONTHLY_USAGE_PER_PERSON_START + condition), 'GET', {'x-api-key':API_KEY}, {}).then(function(resp){
                    // 一定時間経過後に受け取り用APIを実行
                    setTimeout(function(){
                        // 集計値の受け取り用APIのURLを生成
                        var url = API_URL_DESCRIBE_EXECUTION + JSON.parse(resp[0]).executionArn;
                        // 集計値の受け取り用APIを実行
                        kintone.proxy(url, 'GET', {'x-api-key':API_KEY}, {}).then(function(resp){
                            console.log(JSON.parse(JSON.parse(resp[0]).output).body);
                            // 現在時刻を取得
                            var datetime = moment().format('YYYY-MM-DD HH:mm:ss');
                            // 値を取得
                            var average_monthly_usage_per_person = JSON.parse(JSON.parse(resp[0]).output).body;
                            // レコードに取得した値を設定
                            var params={
                                "app":kintone.app.getId(),
                                "id":kintone.app.record.getId(),
                                "record":{
                                    "last_modified":{"value":datetime},
                                    "average_monthly_usage_per_person":{"value":average_monthly_usage_per_person}
                                }
                            };
                            kintone.api(kintone.api.url('/k/v1/record', true), 'PUT', params, function(resp){});

                            hideSpinner(); // スピナー非表示
                            window.alert(MSG_NORMAL_001);
                            location.reload();

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

        }
        kintone.app.record.getSpaceElement('button_space').appendChild(linkButton);

        // 詳細画面のスペースフィールドに与信管理情報の更新ボタンを用意
        var linkButton2 = document.createElement('button');
        linkButton2.id = 'link_button2';
        linkButton2.innerText = '立替情報の取得';
        // ボタン押下時の挙動
        linkButton2.onclick = function (){
            window.alert(MSG_SYSTEM_001);
            showSpinner(); // スピナー表示

            // 表示しているレコードの企業コードを取得
            var record = event.record;
            var company_code = record['company_code']['value'];
            // 集計条件を設定
            var condition = "?companyCode=" + company_code;

            // 立替情報の取得APIを実行
            setTimeout(function(){
                kintone.proxy((API_URL_GET_PAY_IN_ADVANCE_INFO_START + condition), 'GET', {'x-api-key':API_KEY}, {}).then(function(resp){
                    // 一定時間経過後に受け取り用APIを実行
                    setTimeout(function(){
                        // 集計値の受け取り用APIのURLを生成
                        var url = API_URL_DESCRIBE_EXECUTION + JSON.parse(resp[0]).executionArn;
                        // 集計値の受け取り用APIを実行
                        kintone.proxy(url, 'GET', {'x-api-key':API_KEY}, {}).then(function(resp){
                            console.log(JSON.parse(JSON.parse(resp[0]).output).body);
                            // 値を取得
                            var payInAdvanceAmount = JSON.parse(JSON.parse(JSON.parse(resp[0]).output).body).Items[0].payInAdvanceAmount;
                            var limitedPayInAdvanceAmount = JSON.parse(JSON.parse(JSON.parse(resp[0]).output).body).Items[0].limitedPayInAdvanceAmount;
                            var availablePayInAdvanceAmount = JSON.parse(JSON.parse(JSON.parse(resp[0]).output).body).Items[0].availablePayInAdvanceAmount;
                            //立替利用率の計算をここで実行する
                            var payInAdvanceUtilizationRatio = mathPayInUtilizationRatio(payInAdvanceAmount, limitedPayInAdvanceAmount);
                            // レコードに取得した値を設定
                            var params={
                                "app":kintone.app.getId(),
                                "id":kintone.app.record.getId(),
                                "record":{
                                    "limited_pay_in_advance_amount":{"value":limitedPayInAdvanceAmount},
                                    "pay_in_advance_amount":{"value":payInAdvanceAmount},
                                    "available_pay_in_advance_amount":{"value":availablePayInAdvanceAmount},
                                    "pay_in_advance_utilization_ratio":{"value":payInAdvanceUtilizationRatio}
                                }
                            };
                            kintone.api(kintone.api.url('/k/v1/record', true), 'PUT', params, function(resp){});

                            hideSpinner(); // スピナー非表示
                            window.alert(MSG_NORMAL_001);
                            location.reload();

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
        }
        kintone.app.record.getSpaceElement('button_space_2').appendChild(linkButton2);

        // 詳細画面のスペースフィールドに入金情報の登録ボタンを用意
        var linkButton3 = document.createElement('button');
        linkButton3.id = 'link_button3';
        linkButton3.innerText = '入金情報の登録';
        // ボタン押下時の挙動
        linkButton3.onclick = function (){
            // 表示しているレコードの企業コードを取得
            var record = event.record;
            var company_code = record['company_code']['value'];
            var deposit_date = Number(record['deposit_date']['value']);
            var deposit_amount = Number(record['deposit_amount']['value']);
            // 入力値のチェック
            if (Number.isInteger(deposit_date) == false) {
                window.alert("入金日が整数値ではありません。\nYYYYMMDDの形式で入力してください。\n\ndeposit_date：" + deposit_date);
                return event;
            }
            if (String(deposit_date).length != 8) {
                window.alert("入金日が8桁ではありません。\nYYYYMMDDの形式で入力してください。\n\ndeposit_date：" + deposit_date);
                return event;
            }
            if (Number.isInteger(deposit_amount) == false) {
                window.alert("入金額が整数値ではありません。\n\ndeposit_amount：" + deposit_amount);
                return event;
            }
            // 入金情報の確認ダイアログの表示
            var deposit_confirm = window.confirm("以下の入力値に間違いがないか確認してください。\n\n企業コード：" + company_code + "\n入金日：" + deposit_date + "\n入金額：¥" + deposit_amount);
            if (deposit_confirm == false) {
                return event;
            }
            // 集計条件を設定
            var condition = "?companyCode=" + company_code + "\&depositDate=" + deposit_date + "\&depositAmount=" + deposit_amount;

            window.alert(MSG_SYSTEM_001);
            showSpinner(); // スピナー表示

            // 入金情報の登録APIを実行
            setTimeout(function(){
                kintone.proxy((API_URL_UPDATE_DEPOSIT_INFO_START + condition), 'GET', {'x-api-key':API_KEY}, {}).then(function(resp){
                    // 一定時間経過後に受け取り用APIを実行
                    setTimeout(function(){
                        // 集計値の受け取り用APIのURLを生成
                        var url = API_URL_DESCRIBE_EXECUTION + JSON.parse(resp[0]).executionArn;
                        // 集計値の受け取り用APIを実行
                        kintone.proxy(url, 'GET', {'x-api-key':API_KEY}, {}).then(function(resp){
                            console.log(JSON.parse(JSON.parse(resp[0]).output).body);
                            // 値を取得
                            var payInAdvanceAmount = JSON.parse(JSON.parse(JSON.parse(resp[0]).output).body).Items.payInAdvanceAmount;
                            var limitedPayInAdvanceAmount = JSON.parse(JSON.parse(JSON.parse(resp[0]).output).body).Items.limitedPayInAdvanceAmount;
                            var availablePayInAdvanceAmount = JSON.parse(JSON.parse(JSON.parse(resp[0]).output).body).Items.availablePayInAdvanceAmount;
                            //立替利用率の計算をここで実行する
                            var payInAdvanceUtilizationRatio = mathPayInUtilizationRatio(payInAdvanceAmount, limitedPayInAdvanceAmount);
                            window.alert("入金処理が実行されました。\n最新の立替情報は以下となります。\n\n立替限度額：¥" + limitedPayInAdvanceAmount + "\n立替額：¥" + payInAdvanceAmount + "\n立替可能額：¥" + availablePayInAdvanceAmount);
                            // 現在時刻を取得
                            var deposit_datetime = moment().format('YYYY-MM-DD HH:mm:ss');
                            // レコードに取得した値を設定、入金額/入金日をクリア、前回の入金額/入金日を設定
                            var params={
                                "app":kintone.app.getId(),
                                "id":kintone.app.record.getId(),
                                "record":{
                                    "limited_pay_in_advance_amount":{"value":limitedPayInAdvanceAmount},
                                    "pay_in_advance_amount":{"value":payInAdvanceAmount},
                                    "available_pay_in_advance_amount":{"value":availablePayInAdvanceAmount},
                                    "pay_in_advance_utilization_ratio":{"value":payInAdvanceUtilizationRatio},
                                    "deposit_amount":{"value":""},
                                    "deposit_date":{"value":""},
                                    "last_deposit_amount":{"value":deposit_amount},
                                    "last_deposit_date":{"value":deposit_date},
                                    "last_deposit_modified":{"value":deposit_datetime}
                                }
                            };
                            kintone.api(kintone.api.url('/k/v1/record', true), 'PUT', params, function(resp){});

                            hideSpinner(); // スピナー非表示
                            window.alert(MSG_NORMAL_001);
                            location.reload();

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
        }
        kintone.app.record.getSpaceElement('button_space_3').appendChild(linkButton3);
        // ログイン中のユーザの組織を取得
        kintone.api('/v1/user/organizations', 'GET', {code:kintone.getLoginUser()['code']}, function(resp) {
            var user = kintone.getLoginUser().code;
            // ログイン中のユーザの組織が「情報システム部」でない場合、DBに接続を行うボタンを非活性化
            document.getElementById("link_button").disabled = true;
            document.getElementById("link_button3").disabled = true;
            // すぐに確認できる
            var adminUser = 'mci-kintone-developper@mc-fin.com';
            // 入金関連で業務可能なユーザをここで設定
            var linkButton3User = [
                'asai@mc-fin.com',
                'miyahara-k@mc-fin.com',
                'nemoto-m@mc-fin.com',
                'watanabe-k@mc-fin.com',
              ]
            // KPI情報取得
            var linkButton_2User = [
                'takahashi@mc-fin.com',
                'karita-s@mc-fin.com',
              ]
            console.log(user);
            if (linkButton3User.indexOf(user) !== -1) {
                document.getElementById("link_button3").disabled = false;
            }
            if (linkButton_2User.indexOf(user) !== -1) {
                document.getElementById("link_button").disabled = false;
            }
            if (user == adminUser) {
                document.getElementById("link_button").disabled = false;
                document.getElementById("link_button3").disabled = false;
            }
            
        });
    });

    // レコード追加/編集画面の表示時に発火
    kintone.events.on(['app.record.create.show','app.record.edit.show'], function(event) {
        var record = event.record;
        var user = kintone.getLoginUser().code;
        // 以下のフィールドを非活性化
        record.last_modified.disabled = true;
        record.limited_pay_in_advance_amount.disabled = true;
        record.pay_in_advance_utilization_ratio.disabled = true;
        record.pay_in_advance_amount.disabled = true;
        record.available_pay_in_advance_amount.disabled = true;
        //基本的に入金情報は修正不可
        record.deposit_amount.disabled = true;
        record.deposit_date.disabled = true;
        
        record.last_deposit_amount.disabled = true;
        record.last_deposit_date.disabled = true;
        record.last_deposit_modified.disabled = true;

        //情報システム部、鬼丸さん、渡辺さん、宮原さん、浅井さん、根本さんは入金情報の登録が可能
        var writeUser = [
            'watanabe-k@mc-fin.com',
            'miyahara-k@mc-fin.com',
            'asai@mc-fin.com',
            'nemoto-m@mc-fin.com',
            'mci-kintone-developper@mc-fin.com'
        ]
        if (writeUser.indexOf(user) !== -1) {
            record.deposit_amount.disabled = false;
            record.deposit_date.disabled = false;
        }
        return event;
    });

  })(kintone.$PLUGIN_ID);



  /**
   * スピナー設置用の関数
   **/
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