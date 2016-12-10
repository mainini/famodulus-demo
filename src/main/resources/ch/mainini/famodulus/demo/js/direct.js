$('document').ready(function () {
    'use strict';

    function reset() {
        FD.resetResults();
        $('#form-modexp').trigger('reset');
    }

    $('#btn-calculate').click(function () {
        var data;
        try {
            data = FD.parseFields();
        } catch (e) {
            alert('Error: ' + e);
            return;
        }

        if (data.modexps.length === 0) {
            alert('Nothing to do!');
        } else if (data.modexps.length === 1) {
            if (data.defaultBase !== undefined || data.defaultExponent !== undefined || data.defaultModulus !== undefined) {
                alert('Default values not applicable for single modexp!');
                return;
            }

            FD.showResults();

            // local performance measurement
            var timeLocal = performance.now();
            var resultLocal = BigInt.modexp(data.modexps[0][0], data.modexps[0][1], data.modexps[0][2]);
            resultLocal = resultLocal.startsWith('0') ? resultLocal.substring(1) : resultLocal;
            timeLocal = performance.now() - timeLocal;
            FD.showLocalTime(timeLocal);
            FD.showLocalResult(resultLocal, 1);

            // remote performance measurement
            var famodulus = new Famodulus([FD.getServer('#input-server-1')], $('#input-brief').is(':checked'));
            var timeRemote = performance.now();
            famodulus.modexp(data.modexps[0][0], data.modexps[0][1], data.modexps[0][2], function (result) {
                timeRemote = performance.now() - timeRemote;

                if (timeRemote < timeLocal) {
                    FD.showRemoteTime(timeRemote, true);
                    FD.showLocalTime(timeLocal, false);
                } else if (timeRemote > timeLocal) {
                    FD.showRemoteTime(timeRemote, false);
                    FD.showLocalTime(timeLocal, true);
                } else {
                    FD.showRemoteTime(timeRemote);
                }
                FD.showRemoteResult(result.r, 1);
                FD.showDifference(timeRemote, timeLocal);
                FD.showEqual(result.r, resultLocal);
            });
        } else {
            FD.showResults();

            // local performance measurement
            var results = [];
            var timeLocal = performance.now();
            for (var i = 0; i < data.modexps.length; i++) {
                results.push(BigInt.modexp(data.modexps[i][0], data.modexps[i][1], data.modexps[i][2]));
            }
            timeLocal = performance.now() - timeLocal;

            var resultLocal = '';
            for (var i = 0; i < results.length - 1; i++) {
                resultLocal += results[i].startsWith('0') ? results[i].substring(1) + ',\n' : results[i] + ',\n';
            }
            resultLocal += results[results.length - 1].startsWith('0') ? results[results.length - 1].substring(1) : results[results.length - 1];
            FD.showLocalTime(timeLocal);
            FD.showLocalResult(resultLocal, results.length);

            // remote performance measurement
            var famodulus = new Famodulus([FD.getServer('#input-server-1')], $('#input-brief').is(':checked'));
            var timeRemote = performance.now();
            famodulus.modexps(data.modexps, function (results) {
                timeRemote = performance.now() - timeRemote;

                if (timeRemote < timeLocal) {
                    FD.showRemoteTime(timeRemote, true);
                    FD.showLocalTime(timeLocal, false);
                } else if (timeRemote > timeLocal) {
                    FD.showRemoteTime(timeRemote, false);
                    FD.showLocalTime(timeLocal, true);
                } else {
                    FD.showRemoteTime(timeRemote);
                }

                var resultRemote = '';
                for (var i = 0; i < results.length - 1; i++) {
                    resultRemote += results[i].r + ',\n';
                }
                resultRemote += results[results.length - 1].r;
                FD.showRemoteResult(resultRemote, results.length);
                FD.showDifference(timeRemote, timeLocal);
                FD.showEqual(resultRemote, resultLocal);
            });
        }
    });

    $('#btn-reset').click(function () {
        reset();
    });

    $('#btn-verificatum').click(function () {
        FD.injectVerificatum();
        alert('Verificatum library injected!');
    });

    $('#btn-add-p').click(function () {
        FD.appendTo('#input-bases', FD.randHexString());
        FD.appendTo('#input-exponents', FD.randHexString());
        FD.appendTo('#input-moduli', FD.P_3072);
    });

    $('#btn-add-rand').click(function () {
        FD.appendTo('#input-bases', FD.randHexString());
        FD.appendTo('#input-exponents', FD.randHexString());
        FD.appendTo('#input-moduli', FD.randHexString());
    });

    $('#btn-base-rand').click(function () {
        $('#input-base-default').val(FD.randHexString());
    });

    $('#btn-exponent-rand').click(function () {
        $('#input-exponent-default').val(FD.randHexString());
    });

    $('#btn-modulus-rand').click(function () {
        $('#input-modulus-default').val(FD.randHexString());
    });

    $('#btn-modulus-p').click(function () {
        $('#input-modulus-default').val(FD.P_3072);
    });

    reset();
    $('#input-server-1').attr('placeholder', FD.DEFAULT_SERVER);

    if (typeof (verificatum) !== 'undefined') {
        $('#btn-verificatum').prop('disabled', true);
    } else {
        $('#btn-verificatum').prop('disabled', false);
    }
});