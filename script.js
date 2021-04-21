let app = {
    productList: [
        {
            name: "CAFFEEEEEEEEEEEEEEEEEEEEEEE",
            quantity: 6,
            priceUnit: 0.6
        },
        {
            name: "CAPPUCCINO",
            quantity: 3,
            priceUnit: 1
        },
    ],
    populateHtml: function () {
        for (p of app.productList) {
            const nameText = p.name.padEnd(20, " ").substring(0, 20);
            const quantityText = p.quantity.toString().padEnd(8, " ").substring(0, 8);
            const priceTotText = (p.priceUnit * p.quantity).toFixed(2).toString().concat("€").padEnd(8, " ").substring(0, 8)
            const name = $("<div>").addClass("productCell").text(nameText);
            const quantity = $("<div>").addClass("productCell").text(quantityText);
            const priceTot = $("<div>").addClass("productCell").text(priceTotText);
            const row = $("<div>").addClass("productRow")
                .append(name)
                .append(quantity)
                .append(priceTot);
            console.log(row);
            $("#productTable").append(row);
        }
    },
    init: function () {

        app.populateHtml();

        var img = new Image();   // Create new img element
        img.addEventListener('load', function () {
            let canvas = document.getElementById('canvas');
            canvas.getContext('2d').drawImage(img, 0, 0);
        }, false);
        img.src = 'small-logo.jpeg';

        $("#printButton").click(__ => {
            var canvas = document.getElementById('canvas');
            var printer = null;
            var ePosDev = new epson.ePOSDevice();
            ePosDev.connect('192.168.220.37', 8008, cbConnect);
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

                // Add image
                printer.addTextAlign(printer.ALIGN_CENTER);
                printer.brightness = 1.0;
                printer.halftone = printer.HALFTONE_DITHER;
                printer.addImage(canvas.getContext('2d'), 0, 0, canvas.width, canvas.height, printer.COLOR_1, printer.MODE_MONO);
                printer.addFeedUnit(30);

                // Add title
                printer.addTextAlign(printer.ALIGN_CENTER);
                printer.addText('IIS Marconi Bar\n');
                printer.addFeedUnit(30);

                // Add tab header

                const nameLength = 30;
                const quantityLength = 6;
                const pricetTotLength = 10;
                const nameText = "Prodotto".padEnd(nameLength, " ").substring(0, nameLength);
                const quantityText = "Quant.".padStart(quantityLength, " ").substring(0, quantityLength);
                const priceTotText = "Totale".padStart(pricetTotLength, " ").substring(0, pricetTotLength);
                printer.addTextAlign(printer.ALIGN_LEFT);
                printer.addText(`${nameText}`);
                printer.addTextAlign(printer.ALIGN_RIGHT);
                printer.addText(`${quantityText}`);
                printer.addText(`${priceTotText}\n`);

                for (p of app.productList) {
                    const nameText = p.name.padEnd(nameLength, " ").substring(0, nameLength);
                    const quantityText = p.quantity.toString().padStart(quantityLength, " ").substring(0, quantityLength);
                    const priceTotText = (p.priceUnit * p.quantity).toFixed(2).toString().concat("€").padStart(pricetTotLength, " ").substring(0, pricetTotLength);

                    const text = `${nameText}\t${quantityText}\t${priceTotText}\n`;
                    printer.addTextAlign(printer.ALIGN_LEFT);
                    printer.addText(`${nameText}`);
                    printer.addTextAlign(printer.ALIGN_RIGHT);
                    printer.addText(`${quantityText}`);
                    printer.addText(`${priceTotText}\n`);
                }

                // Feed and cut
                printer.addFeedUnit(30);
                printer.addCut(printer.CUT_FEED);


                printer.send();
            }

        });
    }
}

$(document).ready(app.init);