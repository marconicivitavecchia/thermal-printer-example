let app = {
    init: function () {
        // $("#connectButton").click(_ => {});
        var img = new Image();   // Create new img element
        img.addEventListener('load', function () {
            let canvas = document.getElementById('canvas');
            canvas.getContext('2d').drawImage(img, 0, 0);
        }, false);
        // img.src = 'logo1.bmp'; // from example

        img.src = 'small-logo.jpeg';
        // img.src = 'big-logo.png';


        $("#printButton").click(__ => {
            var canvas = document.getElementById('canvas');
            var printer = null;
            var ePosDev = new epson.ePOSDevice();
            ePosDev.connect('192.168.192.168', 8008, cbConnect);
            function cbConnect(data) {
                if (data == 'OK') {
                    ePosDev.createDevice('local_printer', ePosDev.DEVICE_TYPE_PRINTER, { 'crypto': true, 'buffer': false }, cbCreateDevice_printer);
                } else {
                    alert(data);
                }
            }
            function cbCreateDevice_printer(devobj, retcode) {
                if (retcode == 'OK') {
                    printer = devobj;
                    executeAddedCode();
                } else {
                    alert(retcode);
                }
            }
            function executeAddedCode() {

                // Add simple text
                printer.addTextAlign(printer.ALIGN_CENTER);
                printer.addText('IIS Marconi Bar\n');

                // Add image
                printer.brightness = 1.0;
                printer.halftone = printer.HALFTONE_DITHER;
                printer.addImage(canvas.getContext('2d'), 0, 0, canvas.width, canvas.height, printer.COLOR_1, printer.MODE_MONO);

                // Feed and cut
                printer.addFeedUnit(50);
                printer.addCut(printer.CUT_FEED);


                printer.send();
            }

        });
    }
}

$(document).ready(app.init);