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

    FD.createGlyph = function (glyph) {
        var s = document.createElement('span');
        s.setAttribute('aria-hidden', true);

        switch (glyph) {
            case 'ok':
                s.setAttribute('class', 'glyphicon glyphicon-ok');
                break;
            case 'nok':
                s.setAttribute('class', 'glyphicon glyphicon-remove');
                break;
            case 'time':
                s.setAttribute('class', 'glyphicon glyphicon-time');
                break;
            case 'down':
                s.setAttribute('class', 'glyphicon glyphicon-arrow-down');
                break;
            case 'up':
                s.setAttribute('class', 'glyphicon glyphicon-arrow-up');
                break;

        }
        return s;
    };

    FD.showResults = function () {
        $('#div-no-results').hide();
        $('#div-results').show();
    };

    FD.hideResults = function () {
        $('#div-results').hide();
        $('#div-no-results').show();
    };

    FD.resetResults = function () {
        $('#form-results').trigger('reset');

        $('#div-time-remote').hide();
        $('#p-time-remote').remove();
        $('#div-time-local').hide();
        $('#p-time-local').remove();
        $('#div-time-difference').hide();
        $('#p-time-difference').remove();
        $('#div-equal').hide();
        $('#p-equal').remove();

        $('#div-results-remote').hide();
        $('#input-results-remote').val('');
        $('#div-results-local').hide();
        $('#input-results-local').val('');
    };

    FD.showRemoteTime = function (time, better) {
        $('#p-time-remote').remove();
        var p = document.createElement('p');
        p.id = 'p-time-remote';

        if (better === undefined) {
            p.appendChild(document.createTextNode('Remote calculation took ' + time + ' ms.'));
        } else if (better) {
            p.setAttribute('class', 'text-success');
            p.appendChild(FD.createGlyph('down'));
            p.appendChild(document.createTextNode('\xa0Remote calculation took ' + time + ' ms.'));
        } else {
            p.setAttribute('class', 'text-danger');
            p.appendChild(FD.createGlyph('up'));
            p.appendChild(document.createTextNode('\xa0Remote calculation took ' + time + ' ms.'));
        }
        $('#div-time-remote').append(p);
        $('#div-time-remote').show();
    };

    FD.showLocalTime = function (time, better) {
        $('#p-time-local').remove();
        var p = document.createElement('p');
        p.id = 'p-time-local';

        if (better === undefined) {
            p.appendChild(document.createTextNode('In-browser calculation took ' + time + ' ms.'));
        } else if (better) {
            p.setAttribute('class', 'text-success');
            p.appendChild(FD.createGlyph('down'));
            p.appendChild(document.createTextNode('\xa0In-browser calculation took ' + time + ' ms.'));
        } else {
            p.setAttribute('class', 'text-danger');
            p.appendChild(FD.createGlyph('up'));
            p.appendChild(document.createTextNode('\xa0In-browser calculation took ' + time + ' ms.'));
        }
        $('#div-time-local').append(p);
        $('#div-time-local').show();
    };

    FD.showDifference = function (difference) {
        $('#p-time-difference').remove();

        var p = document.createElement('p');
        p.id = 'p-time-difference';
        p.appendChild(FD.createGlyph('time'));
        p.appendChild(document.createTextNode('\xa0Difference: ' + difference + ' ms.'));

        $('#div-time-difference').append(p);
        $('#div-time-difference').show();
    };

    FD.showEqual = function (result1, result2) {
        $('#p-equal').remove();

        var p = document.createElement('p');
        p.id = 'p-equal';

        if ((result1 === undefined && result2 !== undefined) ||
                (result2 === undefined && result1 !== undefined) ||
                result1.toLowerCase() !== result2.toLowerCase())
        {
            p.setAttribute('class', 'text-danger');
            p.appendChild(FD.createGlyph('nok'));
            p.appendChild(document.createTextNode('\xa0The results differ!'));
        } else {
            p.setAttribute('class', 'text-success');
            p.appendChild(FD.createGlyph('ok'));
            p.appendChild(document.createTextNode('\xa0Both results are equal!'));
        }

        $('#div-equal').append(p);
        $('#div-equal').show();
    };

    FD.showRemoteResult = function (result) {
        $('#input-results-remote').val(result.toLowerCase());
        $('#div-results-remote').show();
    };

    FD.showLocalResult = function (result) {
        $('#input-results-local').val(result.toLowerCase());
        $('#div-results-local').show();
    };

    window.FD = FD;
});