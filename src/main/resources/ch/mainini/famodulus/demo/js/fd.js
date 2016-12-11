$('document').ready(function () {
    'use strict';

    var FD = {};
    window.FD = FD;

    FD.P_3072 = '8000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006119df';
    FD.DEFAULT_RAND_LENGTH = 768;
    FD.DEFAULT_SERVER = 'http://localhost:8081/api/modexp/';

    FD.resultLocal = '';
    FD.resultRemote = '';
    FD.timeLocal = '';
    FD.timeRemote = '';

    FD.injectVerificatum = function () {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'http://www.verificatum.com/files/vjsc-1.1.0.js'; // @todo errorhandling!
        $('body').append(script);
        window.BigInt.modexp = window.BigInt.modexpVerificatum;
        $('#btn-verificatum').prop('disabled', true);
    };

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

    FD.stringToList = function (val) {
        if (val.length === 0) {
            return [];
        } else {
            return val.replace(/\s+/gm, '').split(',');
        }
    };

    FD.parseFields = function () {
        var data = {};
        data.defaultBase = $('#input-base-default').val().length > 0 ? $('#input-base-default').val() : undefined;
        data.defaultExponent = $('#input-exponent-default').val().length > 0 ? $('#input-exponent-default').val() : undefined;
        data.defaultModulus = $('#input-modulus-default').val().length > 0 ? $('#input-modulus-default').val() : undefined;

        var bases = FD.stringToList($('#input-bases').val());
        var exponents = FD.stringToList($('#input-exponents').val());
        var moduli = FD.stringToList($('#input-moduli').val());

        if (bases.length !== exponents.length || bases.length !== moduli.length) {
            throw 'Inequal amount of bases, exponents and moduli entered!';
        }

        data.modexps = [];
        for (var i = 0; i < bases.length; i++) {
            data.modexps.push([bases[i] === '' ? undefined : bases[i],
                exponents[i] === '' ? undefined : exponents[i],
                moduli[i] === '' ? undefined : moduli[i]]);
        }
        return data;
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
        FD.resultLocal = '';
        FD.resultRemote = '';
        FD.timeLocal = '';
        FD.timeRemote = '';

        $('#form-results').trigger('reset');
        $('#div-results').hide();
        $('#div-no-results').show();

        $('#div-time-remote').hide();
        $('#p-time-remote').remove();
        $('#div-time-local').hide();
        $('#p-time-local').remove();
        $('#div-time-difference').hide();
        $('#p-time-difference').remove();
        $('#div-equal').hide();
        $('#p-equal').remove();

        $('#div-results-remote').hide();
        $('#h-results-remote').remove();
        $('#input-results-remote').val('');
        $('#div-results-local').hide();
        $('#h-results-local').remove();
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

    FD.showDifference = function (time1, time2) {
        var factor = time1 >= time2 ? Math.ceil(time1 / time2 * 100) / 100 : Math.ceil(time2 / time1 * 100) / 100;

        $('#p-time-difference').remove();
        var p = document.createElement('p');
        p.id = 'p-time-difference';
        p.appendChild(FD.createGlyph('time'));
        p.appendChild(document.createTextNode('\xa0Difference: ' + Math.abs(time1 - time2) + ' ms (' + factor + ' times).'));
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

    FD.showRemoteResult = function (result, count) {
        $('#h-results-remote').remove();
        var h = document.createElement('h4');
        h.id = 'h-results-remote';
        h.appendChild(document.createTextNode('Remote Results (' + count + '):'));
        $('#div-results-remote-title').append(h);

        $('#input-results-remote').val(result.toLowerCase());
        $('#div-results-remote').show();
    };

    FD.showLocalResult = function (result, count) {
        $('#h-results-local').remove();
        var h = document.createElement('h4');
        h.id = 'h-results-local';
        h.appendChild(document.createTextNode('Local Results (' + count + '):'));
        $('#div-results-local-title').append(h);

        $('#input-results-local').val(result.toLowerCase());
        $('#div-results-local').show();
    };

    FD.modexpLocal = function (base, exponent, modulus) {
        //////////////// START local performance measurement ///////////////
        FD.timeLocal = performance.now();
        FD.resultLocal = BigInt.modexp(base, exponent, modulus);
        FD.timeLocal = performance.now() - FD.timeLocal;
        //////////////// END local performance measurement  ////////////////

        FD.resultLocal = FD.resultLocal !== '0' && FD.resultLocal.startsWith('0') ? FD.resultLocal.substring(1) : FD.resultLocal;
        FD.showLocalTime(FD.timeLocal);
        FD.showLocalResult(FD.resultLocal, 1);
    };

    FD.modexpsLocal = function (data) {
        var results = [];
        var modexps = [];

        for (var i = 0; i < data.modexps.length; i++) {
            modexps.push([typeof data.modexps[i][0] === 'undefined' ? data.defaultBase : data.modexps[i][0],
                typeof data.modexps[i][1] === 'undefined' ? data.defaultExponent : data.modexps[i][1],
                typeof data.modexps[i][2] === 'undefined' ? data.defaultModulus : data.modexps[i][2]]);
        }

        var i = 0;
        //////////////// START local performance measurement ///////////////
        FD.timeLocal = performance.now();
        for (; i < modexps.length; i++) {
            results.push(BigInt.modexp(modexps[i][0], modexps[i][1], modexps[i][2]));
        }
        FD.timeLocal = performance.now() - FD.timeLocal;
        //////////////// END local performance measurement  ////////////////

        for (var i = 0; i < results.length - 1; i++) {
            FD.resultLocal += results[i] !== '0' && results[i].startsWith('0') ? results[i].substring(1) + ',\n' : results[i] + ',\n';
        }
        FD.resultLocal += results[i] !== '0' && results[results.length - 1].startsWith('0') ? results[results.length - 1].substring(1) : results[results.length - 1];
        FD.showLocalTime(FD.timeLocal);
        FD.showLocalResult(FD.resultLocal, results.length);
    };

    FD.famodulusCallback = function (results) {
        FD.timeRemote = performance.now() - FD.timeRemote;
        //////////////// END remote performance measurement  ///////////////

        if (FD.timeRemote < FD.timeLocal) {
            FD.showRemoteTime(FD.timeRemote, true);
            FD.showLocalTime(FD.timeLocal, false);
        } else if (FD.timeRemote > FD.timeLocal) {
            FD.showRemoteTime(FD.timeRemote, false);
            FD.showLocalTime(FD.timeLocal, true);
        } else {
            FD.showRemoteTime(FD.timeRemote);
        }

        if (typeof results.r !== 'undefined') {
            FD.resultRemote = results.r;
            FD.showRemoteResult(FD.resultRemote, 1);
        } else {
            for (var i = 0; i < results.length - 1; i++) {
                FD.resultRemote += results[i].r + ',\n';
            }
            FD.resultRemote += results[results.length - 1].r;
            FD.showRemoteResult(FD.resultRemote, results.length);
        }

        FD.showDifference(FD.timeRemote, FD.timeLocal);
        FD.showEqual(FD.resultRemote, FD.resultLocal);
    };
});