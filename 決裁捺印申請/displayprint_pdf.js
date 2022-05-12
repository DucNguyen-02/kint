(function() {
  "use strict";

  // _/_/_/_/_/_/_/_/決裁捺印書類_/_/_/_/_/_/_/_/_/_/_/
  kintone.events.on(['app.record.detail.show','app.record.print.show'], function(event){
    // 「添付ファイル」が空だった場合に処理を終了
    
    if(!event.record.決裁捺印依頼書.value[0]) {
        var elVimeo = kintone.app.record.getSpaceElement('space1');
        elVimeo.parentNode.parentNode.style.display = 'none';
        return;
    }
    printSealDocument(event.record.決裁捺印依頼書.value[0], 'space1');
  });


  // _/_/_/_/_/_/_/_/捺印済み書類_/_/_/_/_/_/_/_/_/_/_/
  // 捺印済み書類1
  kintone.events.on(['app.record.detail.show','app.record.print.show'], function(event){
    // 「添付ファイル」が空だった場合に処理を終了
    if(event.record.捺印済み書類.value[0] !== undefined) {
        printSealDocument(event.record.捺印済み書類.value[0], 'space1_sealDocument');
        return;
    } else if (event.record.捺印書類.value[0] !== undefined) {
        printSealDocument(event.record.捺印書類.value[0], 'space1_sealDocument');
        return;
    } else {
        var elVimeo = kintone.app.record.getSpaceElement('space1_sealDocument');
        elVimeo.parentNode.parentNode.style.display = 'none';
        return;
    }
  });

  // 捺印済み書類2
  kintone.events.on(['app.record.detail.show','app.record.print.show'], function(event){
    // 「添付ファイル」が空だった場合に処理を終了
    if(event.record.捺印済み書類.value[1] !== undefined) {
      printSealDocument(event.record.捺印済み書類.value[1], 'space2_sealDocument');
      return;
    } else if (event.record.捺印書類.value[1] !== undefined) {
      printSealDocument(event.record.捺印書類.value[1], 'space2_sealDocument');
      return;
    } else {
      var elVimeo = kintone.app.record.getSpaceElement('space2_sealDocument');
      elVimeo.parentNode.parentNode.style.display = 'none';
      return;
    }
    
  })

  // 捺印済み書類3
  kintone.events.on(['app.record.detail.show','app.record.print.show'], function(event){
    // 「添付ファイル」が空だった場合に処理を終了
    if (event.record.捺印済み書類.value[2] !== undefined) {
      printSealDocument(event.record.捺印済み書類.value[2], 'space3_sealDocument');
      return;
    } else if (event.record.捺印書類.value[2] !== undefined) {
      printSealDocument(event.record.捺印書類.value[2], 'space3_sealDocument');
      return;
    } else {
      var elVimeo = kintone.app.record.getSpaceElement('space3_sealDocument');
      elVimeo.parentNode.parentNode.style.display = 'none';
      return;
    }
  });

  // 捺印済み書類4
  kintone.events.on(['app.record.detail.show','app.record.print.show'], function(event){
    // 「添付ファイル」が空だった場合に処理を終了
    if (event.record.捺印済み書類.value[3] !== undefined) {
      printSealDocument(event.record.捺印済み書類.value[3], 'space4_sealDocument');
      return;
    } else if (event.record.捺印書類.value[3]) {
      printSealDocument(event.record.捺印書類.value[3], 'space4_sealDocument');
      return;
    } else {
      var elVimeo = kintone.app.record.getSpaceElement('space4_sealDocument');
      elVimeo.parentNode.parentNode.style.display = 'none';
      return;
    }
  });

  // 捺印済み書類5
  kintone.events.on(['app.record.detail.show','app.record.print.show'], function(event){
    // 「添付ファイル」が空だった場合に処理を終了
    if (event.record.捺印済み書類.value[4] !== undefined) {
      printSealDocument(event.record.捺印済み書類.value[4], 'space5_sealDocument');
      return;
    } else if (event.record.捺印書類.value[4]) {
      printSealDocument(event.record.捺印書類.value[4], 'space5_sealDocument');
      return;
    } else {
      var elVimeo = kintone.app.record.getSpaceElement('space5_sealDocument');
      elVimeo.parentNode.parentNode.style.display = 'none';
      return;
    }
  });

  // 捺印済み書類6
  kintone.events.on(['app.record.detail.show','app.record.print.show'], function(event){
    // 「添付ファイル」が空だった場合に処理を終了
    if (event.record.捺印済み書類.value[5] !== undefined) {
      printSealDocument(event.record.捺印済み書類.value[5], 'space6_sealDocument');
      return;
    } else if (event.record.捺印書類.value[5] !== undefined) {
      printSealDocument(event.record.捺印書類.value[5], 'space6_sealDocument');
      return;
    } else {
      var elVimeo = kintone.app.record.getSpaceElement('space6_sealDocument');
      elVimeo.parentNode.parentNode.style.display = 'none';
      return;
    }
  });

  // 捺印済み書類7
  kintone.events.on(['app.record.detail.show','app.record.print.show'], function(event){
    // 「添付ファイル」が空だった場合に処理を終了
    if (event.record.捺印済み書類.value[6] !== undefined) {
      printSealDocument(event.record.捺印済み書類.value[6], 'space7_sealDocument');
      return;
    } else if (event.record.捺印書類.value[6] !== undefined) {
      printSealDocument(event.record.捺印書類.value[6], 'space7_sealDocument');
      return;
    } else {
      var elVimeo = kintone.app.record.getSpaceElement('space7_sealDocument');
      elVimeo.parentNode.parentNode.style.display = 'none';
      return;
    }
  });

  // 捺印済み書類8
  kintone.events.on(['app.record.detail.show','app.record.print.show'], function(event){
    // 「添付ファイル」が空だった場合に処理を終了
    if (event.record.捺印済み書類.value[7] !== undefined) {
      printSealDocument(event.record.捺印済み書類.value[7], 'space8_sealDocument');
      return;
    } else if (event.record.捺印書類.value[7] !== undefined) {
      printSealDocument(event.record.捺印書類.value[7], 'space8_sealDocument');
      return;
    } else {
      var elVimeo = kintone.app.record.getSpaceElement('space8_sealDocument');
      elVimeo.parentNode.parentNode.style.display = 'none';
      return;
    }
  });

  // 捺印済み書類9
  kintone.events.on(['app.record.detail.show','app.record.print.show'], function(event){
    // 「添付ファイル」が空だった場合に処理を終了
    if (event.record.捺印済み書類.value[8] !== undefined) {
      printSealDocument(event.record.捺印済み書類.value[8], 'space9_sealDocument');
      return;
    } else if (event.record.捺印書類.value[8]) {
      printSealDocument(event.record.捺印書類.value[8], 'space9_sealDocument');
      return;
    } else {
      var elVimeo = kintone.app.record.getSpaceElement('space9_sealDocument');
      elVimeo.parentNode.parentNode.style.display = 'none';
      return;
    }
  });

  // 捺印済み書類10
  kintone.events.on(['app.record.detail.show','app.record.print.show'], function(event){
    // 「添付ファイル」が空だった場合に処理を終了
    if (event.record.捺印済み書類.value[9] !== undefined) {
      printSealDocument(event.record.捺印済み書類.value[9], 'space10_sealDocument');
      return;
    } else if (event.record.捺印書類.value[9] !== undefined) {
      printSealDocument(event.record.捺印書類.value[9], 'space10_sealDocument');
      return;
    } else {
      var elVimeo = kintone.app.record.getSpaceElement('space10_sealDocument');
      elVimeo.parentNode.parentNode.style.display = 'none';
      return;
    }
  });

  // 捺印済み書類11
  kintone.events.on(['app.record.detail.show','app.record.print.show'], function(event){
    // 「添付ファイル」が空だった場合に処理を終了
    if (event.record.捺印済み書類.value[10] !== undefined) {
      printSealDocument(event.record.捺印済み書類.value[10], 'space11_sealDocument');
      return;
    } else if (event.record.捺印書類.value[10] !== undefined) {
      printSealDocument(event.record.捺印書類.value[10], 'space11_sealDocument');
      return;
    } else {
      var elVimeo = kintone.app.record.getSpaceElement('space11_sealDocument');
      elVimeo.parentNode.parentNode.style.display = 'none';
      return;
    }
  });

  // 捺印済み書類12
  kintone.events.on(['app.record.detail.show','app.record.print.show'], function(event){
    // 「添付ファイル」が空だった場合に処理を終了
    if (event.record.捺印済み書類.value[11] !== undefined) {
      printSealDocument(event.record.捺印済み書類.value[11], 'space12_sealDocument');
      return;
    } else if (event.record.捺印書類.value[11] !== undefined) {
      printSealDocument(event.record.捺印済み書類.value[11], 'space12_sealDocument');
      return;
    } else {
      var elVimeo = kintone.app.record.getSpaceElement('space12_sealDocument');
      elVimeo.parentNode.parentNode.style.display = 'none';
      return;
    }
  });

  // 捺印済み書類13
  kintone.events.on(['app.record.detail.show','app.record.print.show'], function(event){
    // 「添付ファイル」が空だった場合に処理を終了
    if (event.record.捺印済み書類.value[12] !== undefined) {
      printSealDocument(event.record.捺印済み書類.value[12], 'space13_sealDocument');
      return;
    } else if (event.record.捺印書類.value[12] !== undefined) {
      printSealDocument(event.record.捺印書類.value[12], 'space13_sealDocument');
      return;
    } else {
      var elVimeo = kintone.app.record.getSpaceElement('space13_sealDocument');
      elVimeo.parentNode.parentNode.style.display = 'none';
      return;
    }
  });

  // 捺印済み書類14
  kintone.events.on(['app.record.detail.show','app.record.print.show'], function(event){
    // 「添付ファイル」が空だった場合に処理を終了
    if (event.record.捺印済み書類.value[13] !== undefined) {
      printSealDocument(event.record.捺印済み書類.value[13], 'space14_sealDocument');
      return;  
    } else if (event.record.捺印書類.value[13]) {
      printSealDocument(event.record.捺印書類.value[13], 'space14_sealDocument');
      return;  
    } else {
      var elVimeo = kintone.app.record.getSpaceElement('space14_sealDocument');
      elVimeo.parentNode.parentNode.style.display = 'none';
      return;
    }
  });

  // 捺印済み書類15
  kintone.events.on(['app.record.detail.show','app.record.print.show'], function(event){
    // 「添付ファイル」が空だった場合に処理を終了
    if (event.record.捺印済み書類.value[14] !== undefined) {
      printSealDocument(event.record.捺印済み書類.value[14], 'space15_sealDocument');
      return;
    } else if (event.record.捺印済み書類.value[14] !== undefined) {
      printSealDocument(event.record.捺印済み書類.value[14], 'space15_sealDocument');
      return;
    } else {
      var elVimeo = kintone.app.record.getSpaceElement('space15_sealDocument');
      elVimeo.parentNode.parentNode.style.display = 'none';
      return;
    }
  });

  // _/_/_/_/_/_/_/_/添付書類_/_/_/_/_/_/_/_/_/_/_/
  //添付書類1
  kintone.events.on(['app.record.detail.show','app.record.print.show'], function(event){
    // 「添付ファイル」が空だった場合に処理を終了
    if(!event.record.添付ファイル_1.value[0])  {
        var elVimeo = kintone.app.record.getSpaceElement('space1_reference');
        elVimeo.parentNode.parentNode.style.display = 'none';
        return;
    }
    printSealDocument(event.record.添付ファイル_1.value[0], 'space1_reference');
  });

  //添付書類2
  kintone.events.on(['app.record.detail.show','app.record.print.show'], function(event){
    // 「添付ファイル」が空だった場合に処理を終了
    if(!event.record.添付ファイル_2.value[0])  {
        var elVimeo = kintone.app.record.getSpaceElement('space2_reference');
        elVimeo.parentNode.parentNode.style.display = 'none';
        return;
    }
    printSealDocument(event.record.添付ファイル_2.value[0], 'space2_reference');
  });

  //添付書類3
  kintone.events.on(['app.record.detail.show','app.record.print.show'], function(event){
    // 「添付ファイル」が空だった場合に処理を終了
    if(!event.record.添付ファイル_3.value[0])  {
        var elVimeo = kintone.app.record.getSpaceElement('space3_reference');
        elVimeo.parentNode.parentNode.style.display = 'none';
        return;
    }
    printSealDocument(event.record.添付ファイル_3.value[0], 'space3_reference');
  });

  //添付書類4
  kintone.events.on(['app.record.detail.show','app.record.print.show'], function(event){
    // 「添付ファイル」が空だった場合に処理を終了
    if(!event.record.添付ファイル_4.value[0])  {
        var elVimeo = kintone.app.record.getSpaceElement('space4_reference');
        elVimeo.parentNode.parentNode.style.display = 'none';
        return;
    }
    printSealDocument(event.record.添付ファイル_4.value[0], 'space4_reference');
  });

  //添付書類5
  kintone.events.on(['app.record.detail.show','app.record.print.show'], function(event){
    // 「添付ファイル」が空だった場合に処理を終了
    if(!event.record.添付ファイル_5.value[0])  {
        var elVimeo = kintone.app.record.getSpaceElement('space5_reference');
        elVimeo.parentNode.parentNode.style.display = 'none';
        return;
    }
    printSealDocument(event.record.添付ファイル_5.value[0], 'space5_reference');
  });

  //添付書類6
  kintone.events.on(['app.record.detail.show','app.record.print.show'], function(event){
    // 「添付ファイル」が空だった場合に処理を終了
    if(!event.record.添付ファイル_6.value[0])  {
        var elVimeo = kintone.app.record.getSpaceElement('space6_reference');
        elVimeo.parentNode.parentNode.style.display = 'none';
        return;
    }
    printSealDocument(event.record.添付ファイル_6.value[0], 'space6_reference');
  });

  //添付書類7
  kintone.events.on(['app.record.detail.show','app.record.print.show'], function(event){
    // 「添付ファイル」が空だった場合に処理を終了
    if(!event.record.添付ファイル_7.value[0])  {
        var elVimeo = kintone.app.record.getSpaceElement('space7_reference');
        elVimeo.parentNode.parentNode.style.display = 'none';
        return;
    }
    printSealDocument(event.record.添付ファイル_7.value[0], 'space7_reference');
  });

  //添付書類8
  kintone.events.on(['app.record.detail.show','app.record.print.show'], function(event){
    // 「添付ファイル」が空だった場合に処理を終了
    if(!event.record.添付ファイル_8.value[0])  {
        var elVimeo = kintone.app.record.getSpaceElement('space8_reference');
        elVimeo.parentNode.parentNode.style.display = 'none';
        return;
    }
    printSealDocument(event.record.添付ファイル_8.value[0], 'space8_reference');
  });

  //添付書類9
  kintone.events.on(['app.record.detail.show','app.record.print.show'], function(event){
    // 「添付ファイル」が空だった場合に処理を終了
    if(!event.record.添付ファイル_9.value[0])  {
        var elVimeo = kintone.app.record.getSpaceElement('space9_reference');
        elVimeo.parentNode.parentNode.style.display = 'none';
        return;
    }
    printSealDocument(event.record.添付ファイル_9.value[0], 'space9_reference');
  });

  //添付書類10
  kintone.events.on(['app.record.detail.show','app.record.print.show'], function(event){
    // 「添付ファイル」が空だった場合に処理を終了
    if(!event.record.添付ファイル_10.value[0])  {
        var elVimeo = kintone.app.record.getSpaceElement('space10_reference');
        elVimeo.parentNode.parentNode.style.display = 'none';
        return;
    }
    printSealDocument(event.record.添付ファイル_10.value[0], 'space10_reference');
  });

    // 詳細レコード下のプリントロジック
  function printSealDocument(printDocument, spaceItem) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', kintone.api.urlForGet('/k/v1/file', {fileKey: printDocument.fileKey}, true));
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.responseType = 'blob';
    xhr.addEventListener('load', function(){
      pdfjsLib.getDocument(URL.createObjectURL(xhr.response)).promise.then(function(pdf){
        Promise.all(Array.apply(null, {length: pdf.numPages}).map(function(value, index){
          return pdf.getPage(index+1);
        })).then(function(pages){
          // 要素を生成
          var container = document.createElement('div');
          var wrapper = document.createElement('div');
          // スライドの表示サイズ
          container.style.width = '1000px';
          pages.forEach(function(page){
            // 要素を生成
            var slide = document.createElement('div');
            var canvas = document.createElement('canvas');
            var viewport = page.getViewport({scale: 1});
            // canvasの設定
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            canvas.style.width = '100%';
            canvas.style.height = '100%';
            page.render({
              canvasContext: canvas.getContext('2d'),
              viewport: viewport
            });
            // slideの設定
            slide.appendChild(canvas);
            // wrapperの設定
            wrapper.appendChild(slide);
          });
          // containerの設定
          container.appendChild(wrapper);
          // スペースフィールドを取得し、添付ファイルを展開
          kintone.app.record.getSpaceElement(spaceItem).appendChild(container);
        });
      });
    });
    xhr.send();
  }
})();
