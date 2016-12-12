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

    function addRandomModexps(times, bits, modulus) {
        times = times.length > 0 ? times : 1;
        bits = bits.length > 0 ? bits : 2040;
        if (bits % 8 !== 0) {
            alert('Bits not a multiple of 8, reduced to ' + Math.floor(bits / 8) * 8 + '!');
        }

        for (var i = 0; i < times; i++) {
            FD.appendTo('#input-bases', window.BigInt.rand(Math.floor(bits / 8)));
            FD.appendTo('#input-exponents', window.BigInt.rand(Math.floor(bits / 8)));
            FD.appendTo('#input-moduli', modulus);
        }
    }

    $('#btn-default-p1024').click(function () {
        $('#input-modulus-default').val(FD.P_1024);
    });

    $('#btn-default-p2048').click(function () {
        $('#input-modulus-default').val(FD.P_2048);
    });

    $('#btn-default-p3072').click(function () {
        $('#input-modulus-default').val(FD.P_3072);
    });

    $('#btn-add-p1024').click(function () {
        addRandomModexps($('#input-rand-times').val(), $('#input-rand-bits').val(), FD.P_1024);
    });

    $('#btn-add-p2048').click(function () {
        addRandomModexps($('#input-rand-times').val(), $('#input-rand-bits').val(), FD.P_2048);
    });

    $('#btn-add-p3072').click(function () {
        addRandomModexps($('#input-rand-times').val(), $('#input-rand-bits').val(), FD.P_3072);
    });

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
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'http://www.verificatum.com/files/vjsc-1.1.0.js'; // @todo errorhandling!
        $('body').append(script);
        window.BigInt.modexp = window.BigInt.modexpVerificatum;
        $('#btn-verificatum').prop('disabled', true);
    });

    reset();
});