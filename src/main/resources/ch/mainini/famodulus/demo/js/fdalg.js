$('document').ready(function () {
    'use strict';

    var FDAlg = {};
    window.FDAlg = FDAlg;

    FDAlg.algDirect = function (data) {
console.log('guguseli');
        if (data.modexps.length === 0) {
            alert('Nothing to do!');
        } else if (data.modexps.length === 1) {
            if (data.defaultBase !== undefined || data.defaultExponent !== undefined || data.defaultModulus !== undefined) {
                alert('Default values not applicable for single modexp!');
                return;
            }
            FD.showResults();
            FD.modexpLocal(data);
            FD.modexpRemote(data);
        } else {
            FD.showResults();
            FD.modexpsLocal(data);
            FD.modexpsRemote(data);
        }
    };
});
