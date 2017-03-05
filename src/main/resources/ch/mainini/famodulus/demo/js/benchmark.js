/* global $, FD, verificatum */

$('document').ready(function () {
  'use strict';
  const modexpCounts = [10, 100, 500, 1000];
  const modexpsTotal = modexpCounts[modexpCounts.length - 1];
  const iterations = 3;

  /**
   * Resets the whole application (form fields and data).
   */
  function reset () {
    $('#form-modexp').trigger('reset');
    $('#input-server-1').attr('placeholder', FD.DEFAULT_SERVER);
    $('#input-server-2').attr('placeholder', FD.DEFAULT_SERVER);

    if (typeof (verificatum) !== 'undefined') $('#btn-verificatum').prop('disabled', true);
    else $('#btn-verificatum').prop('disabled', false);
  }

  $('#btn-start').click(() => {
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

    let servers = [FD.getServer('#input-server-1'), FD.getServer('#input-server-2')];
    for (let m = 0; m < modexps.length; m++) {
      for (let count of modexpCounts) {
        for (let i = 0; i < iterations; i++) {
          console.log('modexps: ' + m + ', count ' + count + ', iteration ' + i);

          let data = {
            servers: servers,
            brief: true,
            defaults: {},
            modexps: modexps[m].slice(0, count)
          };

          console.log(data);
//        FD.modexpLocal(data);
//        FD.modexpRemote(data);
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
