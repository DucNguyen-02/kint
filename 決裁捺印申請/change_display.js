(function($) {
  'use strict';

  // レコード詳細画面にて動作
  kintone.events.on('app.record.detail.show', function(event) {
		//$('.kintoneplugin-select-outer').css("display", "inline");
		//$('.pcreator-attachment-field-select option[value="決裁捺印依頼フォーマット"]').prop('selected',true);

		// ファイルの添付先フィールドの選択肢から以下を削除
		$('.pcreator-attachment-field-select').children('option[value="添付ファイル_1"]').remove();
		$('.pcreator-attachment-field-select').children('option[value="添付ファイル_2"]').remove();
		$('.pcreator-attachment-field-select').children('option[value="添付ファイル_3"]').remove();
		$('.pcreator-attachment-field-select').children('option[value="添付ファイル_4"]').remove();
		$('.pcreator-attachment-field-select').children('option[value="添付ファイル_5"]').remove();
		$('.pcreator-attachment-field-select').children('option[value="添付ファイル_6"]').remove();
		$('.pcreator-attachment-field-select').children('option[value="添付ファイル_7"]').remove();
		$('.pcreator-attachment-field-select').children('option[value="添付ファイル_8"]').remove();
		$('.pcreator-attachment-field-select').children('option[value="添付ファイル_9"]').remove();
		$('.pcreator-attachment-field-select').children('option[value="捺印済み書類"]').remove();
		$('.pcreator-attachment-field-select').children('option[value="捺印書類"]').remove();
		$('.pcreator-attachment-field-select').children('option[value="添付ファイル_10"]').remove();
		
		// 添付ファイルの保存名フィールドの選択肢から以下を削除
		$('.pcreator-filename-field-select').children('option[value="相手方"]').remove();
		$('.pcreator-filename-field-select').children('option[value="費用"]').remove();
		$('.pcreator-filename-field-select').children('option[value="捺印済み書類の保管先"]').remove();
		$('.pcreator-filename-field-select').children('option[value="捺印済み書類の保管先_エクスプローラー"]').remove();
		$('.pcreator-filename-field-select').children('option[value="BOXファイル保存名"]').remove();
		$('.pcreator-filename-field-select').children('option[value="AdobeSignリンク"]').remove();
		$('.pcreator-filename-field-select').children('option[value="LookUp会社名"]').remove();
    $('.pcreator-filename-field-select').children('option[value="取引先コード"]').remove();
    $('.pcreator-filename-field-select').children('option[value="立案No"]').remove();
    $('.pcreator-filename-field-select').children('option[value="部署ID"]').remove();
    $('.pcreator-filename-field-select').children('option[value="決裁捺印マニュアル"]').remove();
  });

})(jQuery);
