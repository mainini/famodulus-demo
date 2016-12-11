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

        switch ($('#select-method').val()) {
            case 'direct':
                FDAlg.algDirect(data);
                break;
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
});