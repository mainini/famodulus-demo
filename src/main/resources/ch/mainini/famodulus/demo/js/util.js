$('document').ready(function () {
    'use strict';

    var FamodulusDemo = {};

    FamodulusDemo.P_3072 = '8000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006119df';

    FamodulusDemo.randHexString = function (length) {
        var retval = '';
        while (retval.length < length) {
            var value = Math.floor(Math.random() * 256);
            retval += value < 10 ? '0' + value.toString(16) : value.toString(16);
        }
        return retval;
    };

    FamodulusDemo.appendTo = function (field, value) {
        var curval = $(field).val().toString();
        if (curval.length === 0) {
            $(field).val(value);
        } else if (curval.endsWith(',')) {
            $(field).val(curval + '\n' + value);
        } else if (curval.endsWith(',\n')) {
            $(field).val(curval + value);
        } else if (curval.endsWith('\n')) {
            $(field).val(curval + ',' + value);
        } else {
            $(field).val(curval + ',\n' + value);
        }
    };

    FamodulusDemo.injectVerificatum = function () {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'http://www.verificatum.com/files/vjsc-1.1.0.js';
        $("body").append(script);
        alert('Verificatum library injected!');  // @todo errorhandling!
    };

    window.FamodulusDemo = FamodulusDemo;
});