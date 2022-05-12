(function(){
"use strict";
	var costForm = [
	  'app.record.create.change.費用', //環境のフィールドコードを記載
	  'app.record.edit.change.費用' //環境のフィールドコードを記載
	];
  kintone.events.on(costForm,function(event){
    var intValue = 0
		intValue = event.record['費用'].value.replace(/[Ａ-Ｚａ-ｚ０-９]/g,function(s){
		return String.fromCharCode(s.charCodeAt(0)-65248);
		});
		event.record['費用'].value = separate(intValue);
		return event;
	});
	
	// 3桁区切り
	function separate(num){
    return String(num).replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
  }
	
})();