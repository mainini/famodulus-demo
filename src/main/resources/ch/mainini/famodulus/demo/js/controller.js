$('document').ready(function () {
    'use strict';

    function reset() {
        FD.resetResults();
        $('#form-modexp').trigger('reset');
        $('#input-server-1').attr('placeholder', FD.DEFAULT_SERVER);

        if (typeof (verificatum) !== 'undefined') {
            $('#btn-verificatum').prop('disabled', true);
        } else {
            $('#btn-verificatum').prop('disabled', false);
        }
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
            return;
        } else if (data.modexps.length === 1 && (data.defaultBase !== undefined ||
                data.defaultExponent !== undefined || data.defaultModulus !== undefined)) {
            alert('Default parameters not applicable for single modexp!');
            return;
        }

        FD.setAlgorithm($('#select-method').val());
        FD.resetResults();
        FD.showResults();
        if (data.modexps.length === 1) {
            FD.modexpLocal(data);
            FD.modexpRemote(data);
        } else {
            FD.modexpsLocal(data);
            FD.modexpsRemote(data);
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
        FD.appendTo('#input-bases', window.BigInt.rand(FD.DEFAULT_RAND_LENGTH));
        FD.appendTo('#input-exponents', window.BigInt.rand(FD.DEFAULT_RAND_LENGTH));
        FD.appendTo('#input-moduli', FD.P_3072);
    });

    $('#btn-add-rand').click(function () {
        FD.appendTo('#input-bases', window.BigInt.rand(FD.DEFAULT_RAND_LENGTH));
        FD.appendTo('#input-exponents', window.BigInt.rand(FD.DEFAULT_RAND_LENGTH));
        FD.appendTo('#input-moduli', window.BigInt.rand(FD.DEFAULT_RAND_LENGTH));
    });

    $('#btn-base-rand').click(function () {
        $('#input-base-default').val(window.BigInt.rand(FD.DEFAULT_RAND_LENGTH));
    });

    $('#btn-exponent-rand').click(function () {
        $('#input-exponent-default').val(window.BigInt.rand(FD.DEFAULT_RAND_LENGTH));
    });

    $('#btn-modulus-rand').click(function () {
        $('#input-modulus-default').val(window.BigInt.rand(FD.DEFAULT_RAND_LENGTH));
    });

    $('#btn-modulus-p').click(function () {
        $('#input-modulus-default').val(FD.P_3072);
    });

    reset();
});