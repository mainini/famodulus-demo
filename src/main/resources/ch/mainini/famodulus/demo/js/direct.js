$('document').ready(function () {
    'use strict';

    function reset() {
        FD.resetResults();
        $('#form-modexp').trigger('reset');
    }

    $('#btn-calculate').click(function () {
        var defaultBase = $('#input-base-default').val().length > 0 ? $('#input-base-default').val() : undefined;
        var defaultExponent = $('#input-exponent-default').val().length > 0 ? $('#input-exponent-default').val() : undefined;
        var defaultModulus = $('#input-modulus-default').val().length > 0 ? $('#input-modulus-default').val() : undefined;

        var bases = FD.stringToList($('#input-bases').val());
        var exponents = FD.stringToList($('#input-exponents').val());
        var moduli = FD.stringToList($('#input-moduli').val());

        if (bases.length !== exponents.length || bases.length !== moduli.length) {
            alert('Inequal amount of bases, exponents and moduli entered!');
            return;
        }

        var modexps = [];
        for (var i = 0; i < bases.length; i++) {
            modexps.push([bases[i], exponents[i], moduli[i]]);
        }

        if (modexps.length === 0) {
            alert('Nothing to do!');
        } else if (modexps.length === 1) {
            if (defaultBase !== undefined || defaultExponent !== undefined || defaultModulus !== undefined) {
                alert('Default values not applicable for single modexp!');
                return;
            }

            FD.showResults();
            var famodulus = new Famodulus([FD.getServer('#input-server-1')]);

            var tLocal;
            var tRemote = performance.now();
            famodulus.modexp(modexps[0][0], modexps[0][1], modexps[0][2], function (result) {
                tRemote = performance.now() - tRemote;

                window.FD.resultRemote = result;
                if (tLocal === undefined) {
                    FD.showRemoteTime(tRemote);
                } else {
                    if (tRemote < tLocal) {
                        FD.showRemoteTime(tRemote, true);
                    } else if (tRemote > tLocal) {
                        FD.showRemoteTime(tRemote, false);
                    } else {
                        FD.showRemoteTime(tRemote);
                    }
                }
                FD.showDifference(Math.abs(tRemote - tLocal));
                FD.showEqual(window.FD.resultRemote, window.FD.resultLocal);
                FD.showRemoteResult(result);
            });

            tLocal = performance.now();
            window.FD.resultLocal = BigInt.modexp(modexps[0][0], modexps[0][1], modexps[0][2]);
            tLocal = performance.now() - tLocal;

            if (tRemote < tLocal) {
                FD.showRemoteTime(tRemote, true);
                FD.showLocalTime(tLocal, false);
            } else if (tRemote > tLocal) {
                FD.showRemoteTime(tRemote, false);
                FD.showLocalTime(tLocal, true);
            } else {
                FD.showLocalTime(tLocal);
            }

            FD.showDifference(Math.abs(tRemote - tLocal));
            FD.showEqual(window.FD.resultRemote, window.FD.resultLocal);
            FD.showLocalResult(window.FD.resultLocal);
        } else {
            alert('Not implemented yet!');
        }
    });

    $('#btn-reset').click(function () {
        reset();
    });

    $('#btn-verificatum').click(function () {
        FD.injectVerificatum();
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
});