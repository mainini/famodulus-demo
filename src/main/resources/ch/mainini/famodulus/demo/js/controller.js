/* global $, FD, verificatum, alert */

$('document').ready(function () {
  'use strict';

  /**
   * Function to be called from developer console, adds additional buttons for
   * local and remote only calculation.
   */
  window.debug = function () {
    $('#btn-calculate-local').show();
    $('#btn-calculate-remote').show();
  };

  /**
   * Resets the whole application (form fields and data).
   */
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

  /**
   * Adds <times> random modexps with <bits> size and given modulus to the input fields.
   *
   * @param {Number} times      Number of modexps to add
   * @param {Number} bits       Size in bits of modexps to add
   * @param {String} modulus    Modulus to be used
   */
  function addRandomModexps (times, bits, modulus) {
    times = times.length > 0 ? times : 1;
    bits = bits.length > 0 ? bits : 2040;

    for (let i = 0; i < times; i++) {
      FD.appendTo('#input-bases', FD.randString(bits));
      FD.appendTo('#input-exponents', FD.randString(bits));
      FD.appendTo('#input-moduli', modulus);
    }
  }

  /**
   * Checks if parameters for calculation are complete, sets algorithm and resets results.
   */
  function prepareCalculation () {
    if ($('#input-bases').val().length === 0 && $('#input-base-default').val().length === 0) alert('No base and no default base specified!');
    else if ($('#input-exponents').val().length === 0 && $('#input-exponent-default').val().length === 0) alert('No exponent and no default exponent specified!');
    else if ($('#input-moduli').val().length === 0 && $('#input-modulus-default').val().length === 0) alert('No modulus and no default modulus specified!');
    else {
      FD.setAlgorithm($('#select-method').val());
      FD.resetResults();
      FD.showResults();
      return FD.parseFields();
    }
  }

  $('#select-method').change(() => {
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

  $('#btn-default-p1024').click(() => {
    $('#input-modulus-default').val(FD.P_1024);
  });

  $('#btn-default-p2048').click(() => {
    $('#input-modulus-default').val(FD.P_2048);
  });

  $('#btn-default-p3072').click(() => {
    $('#input-modulus-default').val(FD.P_3072);
  });

  $('#btn-add-p1024').click(() => {
    addRandomModexps($('#input-rand-times').val(), $('#input-rand-bits').val(), FD.P_1024);
  });

  $('#btn-add-p2048').click(() => {
    addRandomModexps($('#input-rand-times').val(), $('#input-rand-bits').val(), FD.P_2048);
  });

  $('#btn-add-p3072').click(() => {
    addRandomModexps($('#input-rand-times').val(), $('#input-rand-bits').val(), FD.P_3072);
  });

  $('#btn-calculate').click(() => {
    let data = prepareCalculation();
    if (data) {
      FD.modexpLocal(data);
      FD.modexpRemote(data);
    }
  });

  $('#btn-calculate-local').click(() => {
    let data = prepareCalculation();
    if (data) FD.modexpLocal(data);
  });

  $('#btn-calculate-remote').click(() => {
    let data = prepareCalculation();
    if (data) FD.modexpRemote(data);
  });

  $('#btn-reset').click(() => {
    reset();
  });

  $('#btn-verificatum').click(() => {
    FD.loadVerificatum();
  });

  reset();
});
