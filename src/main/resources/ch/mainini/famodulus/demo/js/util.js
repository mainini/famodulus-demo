$('document').ready(function () {
    'use strict';

    var FD = {};

    FD.P_3072 = '8000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006119df';

    FD.DEFAULT_RAND_LENGTH = 768;
    FD.DEFAULT_SERVER = 'http://localhost:8081/api/modexp/';

    FD.randHexString = function (length) {
        length = length === undefined ? FD.DEFAULT_RAND_LENGTH : length;
        var retval = '';
        while (retval.length < length) {
            var value = Math.floor(Math.random() * 256);
            retval += value < 10 ? '0' + value.toString(16) : value.toString(16);
        }
        return retval;
    };

    FD.appendTo = function (field, value) {
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

    FD.injectVerificatum = function () {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'http://www.verificatum.com/files/vjsc-1.1.0.js';
        $('body').append(script);
        window.BigInt.modexp = window.BigInt.modexpVerificatum;
        alert('Verificatum library injected!');  // @todo errorhandling!
    };

    FD.stringToList = function (val) {
        if (val.length === 0) {
            return [];
        } else {
            return val.replace(/\s+/gm, '').split(',');
        }
    };

    FD.getServer = function (field) {
        return $(field).val().length > 0 ? $(field).val() : FD.DEFAULT_SERVER;
    };

    window.FD = FD;
});