/* global $, FD, verificatum, alert */

$('document').ready(function () {
  'use strict';

  window.debug = function () {
    $('#btn-calculate-local').show();
    $('#btn-calculate-remote').show();
  };

  function reset () {
    FD.resetResults();
    $('#form-modexp').trigger('reset');
    $('#input-server-1-1').attr('placeholder', FD.DEFAULT_SERVER);
    $('#input-server-2-1').attr('placeholder', FD.DEFAULT_SERVER);
    $('#input-server-2-2').attr('placeholder', FD.DEFAULT_SERVER);
    $('#div-two-servers').hide();
    $('#div-one-server').show();

    if (typeof (verificatum) !== 'undefined') $('#btn-verificatum').prop('disabled', true);
    else $('#btn-verificatum').prop('disabled', false);
  }

  function addRandomModexps (times, bits, modulus) {
    times = times.length > 0 ? times : 1;
    bits = bits.length > 0 ? bits : 2040;

    for (var i = 0; i < times; i++) {
      FD.appendTo('#input-bases', FD.randString(bits));
      FD.appendTo('#input-exponents', FD.randString(bits));
      FD.appendTo('#input-moduli', modulus);
    }
  }

  function prepareCalculation () {
    if ($('#input-bases').val().length === 0 && $('#input-base-default').val().length === 0) {
      alert('No base and no default base specified!');
      return;
    }
    if ($('#input-exponents').val().length === 0 && $('#input-exponent-default').val().length === 0) {
      alert('No exponent and no default exponent specified!');
      return;
    }
    if ($('#input-moduli').val().length === 0 && $('#input-modulus-default').val().length === 0) {
      alert('No modulus and no default modulus specified!');
      return;
    }

    FD.setAlgorithm($('#select-method').val());
    FD.resetResults();
    FD.showResults();

    return FD.parseFields();
  }

  $('#select-method').change(function () {
    switch ($('#select-method').val()) {
      case 'direct':
        $('#div-two-servers').hide();
        $('#div-one-server').show();
        break;
      case 'dec2':
        $('#div-one-server').hide();
        $('#div-two-servers').show();
        break;
      case 'dec2-checked':
        $('#div-one-server').hide();
        $('#div-two-servers').show();
        break;
    }
  });

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
    var data = prepareCalculation();
    if (data) {
      if (data.modexps.length === 1) {
        FD.modexpLocal(data);
        FD.modexpRemote(data);
      } else {
        FD.modexpsLocal(data);
        FD.modexpsRemote(data);
      }
    }
  });

  $('#btn-calculate-local').click(function () {
    var data = prepareCalculation();
    if (data.modexps.length === 1) FD.modexpLocal(data);
    else FD.modexpsLocal(data);
  });

  $('#btn-calculate-remote').click(function () {
    var data = prepareCalculation();
    if (data.modexps.length === 1) FD.modexpRemote(data);
    else FD.modexpsRemote(data);
  });

  $('#btn-reset').click(function () {
    reset();
  });

  $('#btn-verificatum').click(function () {
    FD.loadVerificatum();
  });

  reset();
});
