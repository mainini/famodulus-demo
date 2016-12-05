$('document').ready(function () {
    'use strict';

    $('#btn-calculate').click(function () {
        var defaultBase = $('#input-base-default').val().length > 0 ? $('#input-base-default').val() : undefined;
        var defaultExponent = $('#input-exponent-default').val().length > 0 ? $('#input-exponent-default').val() : undefined;
        var defaultModulus = $('#input-modulus-default').val().length > 0 ? $('#input-modulus-default').val() : undefined;

        var bases = FamodulusDemo.stringToList($('#input-bases').val());
        var exponents = FamodulusDemo.stringToList($('#input-exponents').val());
        var moduli = FamodulusDemo.stringToList($('#input-moduli').val());

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

            var famodulus = new Famodulus([FamodulusDemo.getServer('#input-server-1')]);

            var t0 = performance.now();
            famodulus.modexp(modexps[0][0], modexps[0][1], modexps[0][2], function (result) {
                console.log("Remote result: " + result);
            });
            var t1 = performance.now();
            console.log("Remote calculation took " + (t1 - t0) + " milliseconds.");

            var t2 = performance.now();
            var result = BigInt.modexp(modexps[0][0], modexps[0][1], modexps[0][2]);
            var t3 = performance.now();
            console.log("Local calculation took " + (t3 - t2) + " milliseconds");
            console.log("Result: " + result);

        } else {
            alert('Not implemented yet!');
        }
    });

    $('#btn-reset').click(function () {
        $('#form-modexp').trigger('reset');
    });

    $('#btn-verificatum').click(function () {
        FamodulusDemo.injectVerificatum();
    });

    $('#btn-add-p').click(function () {
        FamodulusDemo.appendTo('#input-bases', FamodulusDemo.randHexString());
        FamodulusDemo.appendTo('#input-exponents', FamodulusDemo.randHexString());
        FamodulusDemo.appendTo('#input-moduli', FamodulusDemo.P_3072);
    });

    $('#btn-add-rand').click(function () {
        FamodulusDemo.appendTo('#input-bases', FamodulusDemo.randHexString());
        FamodulusDemo.appendTo('#input-exponents', FamodulusDemo.randHexString());
        FamodulusDemo.appendTo('#input-moduli', FamodulusDemo.randHexString());
    });

    $('#btn-base-rand').click(function () {
        $('#input-base-default').val(FamodulusDemo.randHexString());
    });

    $('#btn-exponent-rand').click(function () {
        $('#input-exponent-default').val(FamodulusDemo.randHexString());
    });

    $('#btn-modulus-rand').click(function () {
        $('#input-modulus-default').val(FamodulusDemo.randHexString());
    });

    $('#btn-modulus-p').click(function () {
        $('#input-modulus-default').val(FamodulusDemo.P_3072);
    });

    $('#input-server-1').attr("placeholder", FamodulusDemo.DEFAULT_SERVER);
});