
/*****************Quagga Js********************/
var scanner_active = false;
function startScanning(){
  /****init()->initializes the script***/
  Quagga.init({
    inputStream : {
      name : "Live",
      type : "LiveStream",
      target: document.querySelector('#scanner-div'),   // Or '#yourElement' (optional)
      constraints: {
        width:"300",
        height:"300",
        facingMode: "environment"
      },
    },
    decoder : {
     readers: [
     "ean_5_reader",
    "ean_2_reader",
    "code_128_reader",
    "ean_reader",
    "ean_8_reader",
    "code_39_reader",
    "code_39_vin_reader",
    "codabar_reader",
    "upc_reader",
    "upc_e_reader",
    "i2of5_reader"
    ],
    debug: {
      showCanvas: true,
      showPatches: true,
      showFoundPatches: true,
      showSkeleton: true,
      showLabels: true,
      showPatchLabels: true,
      showRemainingPatchLabels: true,
      boxFromPatches: {
        showTransformed: true,
        showTransformedBox: true,
        showBB: true
      }
    }
  }
}, function(err) {
  if (err) {
    console.log(err);
    return
  }
  console.log("Initialization finished. Ready to start");
  Quagga.start();
  scanner_active = true;
});
  /**************Processing the barcode******/
  Quagga.onProcessed(function (result) {
    var drawingCtx = Quagga.canvas.ctx.overlay,
    drawingCanvas = Quagga.canvas.dom.overlay;

    if (result) {
      if (result.boxes) {
        drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
        result.boxes.filter(function (box) {
          return box !== result.box;
        }).forEach(function (box) {
          Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, { color: "green", lineWidth: 2 });
        });
      }

      if (result.box) {
        Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, { color: "#00F", lineWidth: 2 });
      }

      if (result.codeResult && result.codeResult.code) {
        Quagga.ImageDebug.drawPath(result.line, { x: 'x', y: 'y' }, drawingCtx, { color: 'red', lineWidth: 3 });
      }
    }
  });
  /************Action when code is scanned******/
  Quagga.onDetected(function (result) {
   alert("Barcode detected and processed : [" + result.codeResult.code + "]", result);
 });
}
  // Start/stop scanner
  $('.camera-btn').click(function(){
    if (scanner_active) {
      Quagga.stop();
      $('.icons').removeClass('scan');
      scanner_active = false;
    } else {
      startScanning();
      $('.icons').addClass('scan');
      scanner_active = true;
    }
  })