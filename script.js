let app = {
    init: function () {
        // $("#connectButton").click(_ => {});

        $("#printButton").click(__ => {
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
                printer.addTextAlign(printer.ALIGN_CENTER);
                printer.addText('IIS Marconi Bar\n');
                printer.addFeedUnit(30);
                printer.addCut(printer.CUT_FEED);

                printer.send();
            }

        });
    }
}

$(document).ready(app.init);