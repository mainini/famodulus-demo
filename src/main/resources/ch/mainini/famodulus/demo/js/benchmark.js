/* global $, FD, verificatum, Promise, FamodulusClient, performance */

$('document').ready(function () {
  'use strict';
  const modexpCounts = [10, 100];
  const modexpsTotal = modexpCounts[modexpCounts.length - 1];
  const iterations = 2;

  /**
   * A promise taking a FamodulusClient protocol promise as argument and measures
   * the time it takes to complete.
   *
   * @param {FamodulusClient} instance    Initialized instance of FamodulusClient
   * @param {Promise} promise             The promise to execute
   * @param {Object[]} modexps            Modexps to pass to the promise
   * @param {Arguments} args              Remaining arguments for the promise
   * @returns {Promise}
   */
  function timingPromise (instance, promise, modexps, ...args) {
    let start = performance.now();
    return promise.apply(instance, [modexps, ...args]).then(results => {
      return Promise.resolve({
        time: performance.now() - start,
        results: results
      });
    });
  }

  /**
   * Resets the whole application (form fields and data).
   */
  function reset () {
    $('#input-server-1').attr('placeholder', FD.DEFAULT_SERVER);
    $('#input-server-2').attr('placeholder', FD.DEFAULT_SERVER);
    $('#input-results-csv').val('Algorithm,Bits,Count,Iteration,Duration');

    if (typeof (verificatum) !== 'undefined') $('#btn-verificatum').prop('disabled', true);
    else $('#btn-verificatum').prop('disabled', false);
  }

  $('#btn-start').click(() => {
    reset();

    let servers = [FD.getServer('#input-server-1'), FD.getServer('#input-server-2')];
    let fam = new FamodulusClient(servers);

    let modexps = new Array(3);
    modexps[0] = new Array(modexpsTotal);
    modexps[1] = new Array(modexpsTotal);
    modexps[2] = new Array(modexpsTotal);

    for (let i = 0; i < modexpsTotal; i++) {
      modexps[0][i] = {
        b: FD.randString(1016),
        e: FD.randString(1016),
        m: FD.P_1024
      };
      modexps[1][i] = {
        b: FD.randString(2040),
        e: FD.randString(2040),
        m: FD.P_2048
      };
      modexps[2][i] = {
        b: FD.randString(3064),
        e: FD.randString(3064),
        m: FD.P_3072
      };
    }

    for (let m = 0; m < modexps.length; m++) {
      for (let count of modexpCounts) {
        for (let i = 0; i < iterations; i++) {
          let results = [];
          let batch = modexps[m].slice(0, count);

          let start = performance.now();
          let resultsLocal = batch.map(modexp => FD.modexp(modexp));
          results.push([0, m, count, i, (performance.now() - start)]);

          timingPromise(fam, fam.direct, batch).then(data1 => {
            results.push([1, m, count, i, data1.time]);

            timingPromise(fam, fam.decExponent, batch, {}, false).then(data2 => {
              results.push([2, m, count, i, data2.time]);

              timingPromise(fam, fam.decExponent, batch, {}, true).then(data3 => {
                results.push([3, m, count, i, data3.time]);

                let resultStr = $('#input-results-csv').val();
                results.forEach(result => {
                  resultStr += '\n' + result[0] + ',' + result[1] + ',' + result[2] + ',' + result[3] + ',' + result[4];
                });
                $('#input-results-csv').val(resultStr);
              });
            });
          });
        }
      }
    }
  });

  $('#btn-reset').click(() => {
    reset();
  });

  $('#btn-verificatum').click(() => {
    FD.loadVerificatum();
  });

  reset();
});
