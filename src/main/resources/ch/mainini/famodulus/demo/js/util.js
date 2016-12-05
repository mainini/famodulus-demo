$('document').ready(function () {
    'use strict';

    var FamodulusDemo = {};

    FamodulusDemo.P_3072 = '8000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006119df';

    FamodulusDemo.DEFAULT_RAND_LENGTH = 768;
    FamodulusDemo.DEFAULT_SERVER = 'http://localhost:8081/api/modexp/';

    FamodulusDemo.randHexString = function (length) {
        length = length === undefined ? FamodulusDemo.DEFAULT_RAND_LENGTH : length;
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
        window.BigInt.modexp = window.BigInt.modexpVerificatum;
        alert('Verificatum library injected!');  // @todo errorhandling!
    };

    FamodulusDemo.stringToList = function (val) {
        if (val.length === 0) {
            return [];
        } else {
            return val.replace(/\s+/gm, '').split(',');
        }
    };

    FamodulusDemo.getServer = function (field) {
        return $(field).val().length > 0 ? $(field).val() : FamodulusDemo.DEFAULT_SERVER;
    };

    window.FamodulusDemo = FamodulusDemo;
});