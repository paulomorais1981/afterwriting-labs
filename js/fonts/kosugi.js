define(function(require){

    var fontUtils = require('utils/font-utils');

    var fonts = {};


    fonts.bold = fonts.regular;

    fonts.italic = fonts.regular;

    fonts.bolditalic = fonts.regular;

    return {

        regular: fontUtils.convertBase64ToBinary(fonts.regular),

        bold: fontUtils.convertBase64ToBinary(fonts.bold),

        italic: fontUtils.convertBase64ToBinary(fonts.italic),

        bolditalic: fontUtils.convertBase64ToBinary(fonts.bolditalic)

    };

});