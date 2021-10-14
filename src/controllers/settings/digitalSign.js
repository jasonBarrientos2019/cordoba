const fs = require("fs");
const signer = require("node-signpdf").default;
const plainAddPlaceholder = require("node-signpdf/dist/helpers/plainAddPlaceholder")
  .default;

class DigitalSign {
  constructor() {
    this.certificate = fs.readFileSync(__dirname + "/../../certificate/client-identity.p12");
  }

  async sign(pdfBuffer) {
    var pdfWithPlaceHolder = plainAddPlaceholder({
      pdfBuffer,
      reason: "Firmado por AYI GROUP",
      signatureLength: 13250,
    });

    console.log('PDF Firmado Digitalmente por AYI GROUP');

    return signer.sign(pdfWithPlaceHolder, this.certificate);
  }
}

module.exports = DigitalSign;
