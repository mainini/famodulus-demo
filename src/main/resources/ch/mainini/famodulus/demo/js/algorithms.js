$('document').ready(function () {
    'use strict';

    FD.algDirect = function (data) {
        if (data.modexps.length === 0) {
            alert('Nothing to do!');
        } else if (data.modexps.length === 1) {
            if (data.defaultBase !== undefined || data.defaultExponent !== undefined || data.defaultModulus !== undefined) {
                alert('Default values not applicable for single modexp!');
                return;
            }
            FD.showResults();

            //////////////// START local performance measurement ///////////////
            var timeLocal = performance.now();
            var resultLocal = BigInt.modexp(data.modexps[0][0], data.modexps[0][1], data.modexps[0][2]);
            timeLocal = performance.now() - timeLocal;
            //////////////// END local performance measurement  ////////////////

            resultLocal = resultLocal !== '0' && resultLocal.startsWith('0') ? resultLocal.substring(1) : resultLocal;
            FD.showLocalTime(timeLocal);
            FD.showLocalResult(resultLocal, 1);

            var famodulus = new Famodulus([FD.getServer('#input-server-1')], $('#input-brief').is(':checked'));

            //////////////// START remote performance measurement //////////////
            var timeRemote = performance.now();
            famodulus.modexp(data.modexps[0][0], data.modexps[0][1], data.modexps[0][2], function (result) {
                timeRemote = performance.now() - timeRemote;
                //////////////// END remote performance measurement  ///////////////

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

            var results = [];
            var i = 0;

            //////////////// START local performance measurement ///////////////
            var timeLocal = performance.now();
            for (; i < data.modexps.length; i++) {
                results.push(BigInt.modexp(data.modexps[i][0], data.modexps[i][1], data.modexps[i][2]));
            }
            timeLocal = performance.now() - timeLocal;
            //////////////// END local performance measurement  ////////////////

            var resultLocal = '';
            for (var i = 0; i < results.length - 1; i++) {
                resultLocal += results[i] !== '0' && results[i].startsWith('0') ? results[i].substring(1) + ',\n' : results[i] + ',\n';
            }
            resultLocal += results[i] !== '0' && results[results.length - 1].startsWith('0') ? results[results.length - 1].substring(1) : results[results.length - 1];
            FD.showLocalTime(timeLocal);
            FD.showLocalResult(resultLocal, results.length);

            var famodulus = new Famodulus([FD.getServer('#input-server-1')], $('#input-brief').is(':checked'));

            //////////////// START remote performance measurement //////////////
            var timeRemote = performance.now();
            famodulus.modexps(data.modexps, function (results) {
                timeRemote = performance.now() - timeRemote;
                //////////////// END remote performance measurement  ///////////////

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
    };
});
