$('document').ready(function () {
    'use strict';

    var FDAlg = {};
    window.FDAlg = FDAlg;

    FDAlg.algDirect = function (data) {
        if (data.modexps.length === 0) {
            alert('Nothing to do!');
        } else if (data.modexps.length === 1) {
            if (data.defaultBase !== undefined || data.defaultExponent !== undefined || data.defaultModulus !== undefined) {
                alert('Default values not applicable for single modexp!');
                return;
            }

            FD.showResults();

            FD.modexpLocal(data.modexps[0][0], data.modexps[0][1], data.modexps[0][2]);

            var famodulus = new Famodulus([FD.getServer('#input-server-1')], $('#input-brief').is(':checked'));
            //////////////// START remote performance measurement //////////////
            FD.timeRemote = performance.now();
            famodulus.modexp(data.modexps[0][0], data.modexps[0][1], data.modexps[0][2], FD.famodulusCallback);
        } else {
            FD.showResults();

            FD.modexpsLocal(data);

            var famodulus = new Famodulus([FD.getServer('#input-server-1')], $('#input-brief').is(':checked'));
            //////////////// START remote performance measurement //////////////
            FD.timeRemote = performance.now();
            famodulus.modexps(data.modexps, FD.famodulusCallback);
        }
    };
});
