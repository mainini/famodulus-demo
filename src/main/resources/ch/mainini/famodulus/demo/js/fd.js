/* global alert, FamodulusClient, performance, $, str2bigInt, bigInt2str, powMod, verificatum */

$('document').ready(function () {
  'use strict';

  const VERIFICATUM_URI = 'http://www.verificatum.com/files/vjsc-1.1.0.js';

  // Namespace for all functionality
  const FD = {};
  window.FD = FD;

  FD.DEFAULT_SERVER = 'http://localhost:8081/api/modexp/';

  // Some safe primes
  FD.P_1024 = '80000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001981bf';
  FD.P_2048 = '800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ad3af';
  FD.P_3072 = '8000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006119df';

  // Variables used for calculations
  FD.algorithm = 'direct';
  FD.resultLocal = '';
  FD.resultRemote = '';
  FD.timeLocal = '';
  FD.timeRemote = '';

  // Which function to use for the locally calculated modexps
  FD.modexp = _modexpLeemon;

  // ===================== Helper methods =====================

  /**
   * Injects the Verificatum library into DOM by loading it from its homepage.
   */
  FD.loadVerificatum = function () {
    $.getScript(VERIFICATUM_URI).done(() => {
      FD.modexp = _modexpVerificatum;
      $('#btn-verificatum').prop('disabled', true);
    }).fail(() => {
      alert('Failed to inject Verificatum, could not load: ' + VERIFICATUM_URI);
    });
  };

  /**
   * Generates a random number string of given bitlength in hex using crypto.getRandomValues().
   *
   * @param {type} bitLength    Length of the string to generate
   * @returns {String}          The generated string
   */
  FD.randString = function (bitLength) {
    var randbytes = new Uint8Array(Math.floor(bitLength / 8) === 0 ? 1 : Math.floor(bitLength / 8));
    window.crypto.getRandomValues(randbytes);

    let randhex = new Array(randbytes.length);

    for (let i = 0; i < randbytes.length; i++) {
      let bhex = randbytes[i].toString(16);
      randhex[i] = randbytes[i] < 0x10 ? '0' + bhex : bhex;
    }

    return randhex.join('');
  };

  /**
   * Tries to safely append a value to a given field, delimiting it with ",\n".
   *
   * @param {type} field        The field to append to
   * @param {type} value        The value to append
   */
  FD.appendTo = function (field, value) {
    let curval = $(field).val().toString();
    if (curval.length === 0) $(field).val(value);
    else if (curval.endsWith(',')) $(field).val(curval + '\n' + value);
    else if (curval.endsWith(',\n')) $(field).val(curval + value);
    else if (curval.endsWith('\n')) $(field).val(curval + ',' + value);
    else $(field).val(curval + ',\n' + value);
  };

  /**
   * Splits a comma-separated String into a String[], removing whitespace.
   *
   * @param {String} value      The String to split
   * @returns {String[]}        The generated String[]
   */
  FD.stringToList = function (value) {
    if (value.length === 0) return [];
    else return value.replace(/\s+/gm, '').split(',');
  };

  /**
   * Gets the server URI from the given field or returns DEFAULT_SERVER if empty
   *
   * @param {String} field      Field containing the server URI
   * @returns {String}          The URI of the server or DEFAULT_SERVER
   */
  FD.getServer = function (field) {
    return $(field).val().length > 0 ? $(field).val() : FD.DEFAULT_SERVER;
  };

  /**
   * Setter for the algorithm.
   *
   * @param {String} algorithm    The algorithm to set
   */
  FD.setAlgorithm = function (algorithm) {
    FD.algorithm = algorithm;
  };

  /**
   * Creates a <span> element with a specified glyph icon.
   *
   * @param {String} glyph        Icon to use
   * @returns {Element}         The created <span> element
   */
  FD.createGlyph = function (glyph) {
    let s = document.createElement('span');
    s.setAttribute('aria-hidden', true);

    switch (glyph) {
      case 'ok':
        s.setAttribute('class', 'glyphicon glyphicon-ok');
        break;
      case 'nok':
        s.setAttribute('class', 'glyphicon glyphicon-remove');
        break;
      case 'time':
        s.setAttribute('class', 'glyphicon glyphicon-time');
        break;
      case 'down':
        s.setAttribute('class', 'glyphicon glyphicon-arrow-down');
        break;
      case 'up':
        s.setAttribute('class', 'glyphicon glyphicon-arrow-up');
        break;

    }

    return s;
  };

  // ===================== Handling and displaying results =====================

  /**
   * Shows the <div> with the results.
   */
  FD.showResults = function () {
    $('#div-no-results').hide();
    $('#div-results').show();
  };

  /**
   * Hides the <div> with the results.
   */
  FD.hideResults = function () {
    $('#div-results').hide();
    $('#div-no-results').show();
  };

  /**
   * Resets the result variables and the display.
   */
  FD.resetResults = function () {
    FD.resultLocal = '';
    FD.resultRemote = '';
    FD.timeLocal = '';
    FD.timeRemote = '';

    $('#form-results').trigger('reset');
    $('#div-results').hide();
    $('#div-no-results').show();

    $('#div-time-remote').hide();
    $('#p-time-remote').remove();
    $('#div-time-local').hide();
    $('#p-time-local').remove();
    $('#div-time-difference').hide();
    $('#p-time-difference').remove();
    $('#div-equal').hide();
    $('#p-equal').remove();

    $('#div-results-remote').hide();
    $('#h-results-remote').remove();
    $('#input-results-remote').val('');
    $('#div-results-local').hide();
    $('#h-results-local').remove();
    $('#input-results-local').val('');
  };

  /**
   * Displays the number and the values of the remote results.
   *
   * @param {String} result     The results to display
   * @param {Number} count      The number of obtained results
   */
  FD.showRemoteResult = function (result, count) {
    $('#h-results-remote').remove();
    let h = document.createElement('h4');
    h.id = 'h-results-remote';
    h.appendChild(document.createTextNode('Remote Results (' + count + '):'));
    $('#div-results-remote-title').append(h);

    $('#input-results-remote').val(result.toLowerCase());
    $('#div-results-remote').show();
  };

  /**
   * Displays the number and the values of the local results.
   *
   * @param {String} result     The results to display
   * @param {Number} count      The number of obtained results
   */
  FD.showLocalResult = function (result, count) {
    $('#h-results-local').remove();
    let h = document.createElement('h4');
    h.id = 'h-results-local';
    h.appendChild(document.createTextNode('Local Results (' + count + '):'));
    $('#div-results-local-title').append(h);

    $('#input-results-local').val(result.toLowerCase());
    $('#div-results-local').show();
  };

  /**
   * Displays the amount of time required for the remote calculations.
   *
   * @param {Number} time       The time used for calculations
   * @param {boolean} better    Change color of display: true: green, false: red - black otherwise
   */
  FD.showRemoteTime = function (time, better) {
    $('#p-time-remote').remove();
    let p = document.createElement('p');
    p.id = 'p-time-remote';

    if (better === undefined) {
      p.appendChild(document.createTextNode('Remote calculation took ' + time + ' ms.'));
    } else if (better) {
      p.setAttribute('class', 'text-success');
      p.appendChild(FD.createGlyph('down'));
      p.appendChild(document.createTextNode('\xa0Remote calculation took ' + time + ' ms.'));
    } else {
      p.setAttribute('class', 'text-danger');
      p.appendChild(FD.createGlyph('up'));
      p.appendChild(document.createTextNode('\xa0Remote calculation took ' + time + ' ms.'));
    }
    $('#div-time-remote').append(p);
    $('#div-time-remote').show();
  };

  /**
   * Displays the amount of time required for the local calculations.
   *
   * @param {Number} time       The time used for calculations
   * @param {boolean} better    Change color of display: true: green, false: red - black otherwise
   */
  FD.showLocalTime = function (time, better) {
    $('#p-time-local').remove();
    let p = document.createElement('p');
    p.id = 'p-time-local';

    if (better === undefined) {
      p.appendChild(document.createTextNode('In-browser calculation took ' + time + ' ms.'));
    } else if (better) {
      p.setAttribute('class', 'text-success');
      p.appendChild(FD.createGlyph('down'));
      p.appendChild(document.createTextNode('\xa0In-browser calculation took ' + time + ' ms.'));
    } else {
      p.setAttribute('class', 'text-danger');
      p.appendChild(FD.createGlyph('up'));
      p.appendChild(document.createTextNode('\xa0In-browser calculation took ' + time + ' ms.'));
    }
    $('#div-time-local').append(p);
    $('#div-time-local').show();
  };

  /**
   * Display the difference between two given times
   *
   * @param {Number} time1      First time for comparison
   * @param {Number} time2      Second time for comparison
   */
  FD.showDifference = function (time1, time2) {
    let factor = time1 >= time2 ? Math.ceil(time1 / time2 * 100) / 100 : Math.ceil(time2 / time1 * 100) / 100;

    $('#p-time-difference').remove();
    let p = document.createElement('p');
    p.id = 'p-time-difference';
    p.appendChild(FD.createGlyph('time'));
    p.appendChild(document.createTextNode('\xa0Difference: ' + Math.abs(time1 - time2) + ' ms (' + factor + ' times).'));
    $('#div-time-difference').append(p);
    $('#div-time-difference').show();
  };

  /**
   * Show if both, the local and the remote results, are equal. Comparison is simply
   * done at the level of the result Strings, not the actual values.
   *
   * @param {String} result1    First result for comparison
   * @param {String} result2    Second result for comparison
   */
  FD.showEqual = function (result1, result2) {
    $('#p-equal').remove();
    let p = document.createElement('p');
    p.id = 'p-equal';

    if ((result1 === undefined && result2 !== undefined) ||
        (result2 === undefined && result1 !== undefined) ||
        result1.toLowerCase() !== result2.toLowerCase()) {
      p.setAttribute('class', 'text-danger');
      p.appendChild(FD.createGlyph('nok'));
      p.appendChild(document.createTextNode('\xa0The results differ!'));
    } else {
      p.setAttribute('class', 'text-success');
      p.appendChild(FD.createGlyph('ok'));
      p.appendChild(document.createTextNode('\xa0Both results are equal!'));
    }

    $('#div-equal').append(p);
    $('#div-equal').show();
  };

  // ===================== Local and remote calculation =====================

  /**
   * Parses all fields of the form into a data object, setting defaults where required.
   *
   * @returns {Object}          An object containing all data from the form
   */
  FD.parseFields = function () {
    let data = {};

    if (FD.algorithm === 'direct') data.servers = [FD.getServer('#input-server-1-1')];
    else if (FD.algorithm === 'dec2') data.servers = [FD.getServer('#input-server-2-1'), FD.getServer('#input-server-2-2')];
    else if (FD.algorithm === 'dec2-checked') data.servers = [FD.getServer('#input-server-2-1'), FD.getServer('#input-server-2-2')];

    data.brief = $('#input-brief').is(':checked');

    data.defaults = {};
    data.defaults.b = $('#input-base-default').val().length > 0 ? $('#input-base-default').val() : undefined;
    data.defaults.e = $('#input-exponent-default').val().length > 0 ? $('#input-exponent-default').val() : undefined;
    data.defaults.m = $('#input-modulus-default').val().length > 0 ? $('#input-modulus-default').val() : undefined;

    let bases = FD.stringToList($('#input-bases').val());
    let exponents = FD.stringToList($('#input-exponents').val());
    let moduli = FD.stringToList($('#input-moduli').val());

    let count = Math.max(Math.max(bases.length, exponents.length), moduli.length);
    count = count === 0 ? 1 : count;
    data.modexps = [count];
    for (let i = 0; i < count; i++) {
      data.modexps[i] = {
        b: bases[i] === '' ? undefined : bases[i],
        e: exponents[i] === '' ? undefined : exponents[i],
        m: moduli[i] === '' ? undefined : moduli[i]
      };
    }
    return data;
  };

  /**
   * Calculates a single modexp {b:"base", e:"exponent", m:"modulus"} using
   * Leemon's library.
   *
   * @param {Object} modexp     The modexp to calculate
   * @returns {String}          A String with the result in hex
   */
  function _modexpLeemon (modexp) {
    let b = str2bigInt(modexp.b, 16, 0);
    let e = str2bigInt(modexp.e, 16, 0);
    let m = str2bigInt(modexp.m, 16, 0);

    return bigInt2str(powMod(b, e, m), 16);
  }

  /**
   * Calculates a single modexp {b:"base", e:"exponent", m:"modulus"} using
   * the Verificatum library.
   *
   * @param {Object} modexp     The modexp to calculate
   * @returns {String}          A String with the result in hex
   */
  function _modexpVerificatum (modexp) {
    let b = new verificatum.arithm.LargeInteger(modexp.b);
    let e = new verificatum.arithm.LargeInteger(modexp.e);
    let m = new verificatum.arithm.LargeInteger(modexp.m);

    return b.modPow(e, m).toHexString(16);
  }

  /**
   * Calculates one or multiple modexps locally using the data obtained from parseFields().
   * Modexps are calculated using FD.modexp (defaults to Leemon's library, may be set to Verificatum).
   *
   * @param {Object} data       Form data, including defaults, used for calculation
   */
  FD.modexpLocal = function (data) {
    let results;
    FD.timeLocal = performance.now();
    if (data.defaults.b || data.defaults.e || data.defaults.m) {
      results = (data.modexps.map(modexp =>
        ({b: modexp.b || data.defaults.b,
          e: modexp.e || data.defaults.e,
          m: modexp.m || data.defaults.m
        })
      )).map(modexp =>
        FD.modexp(modexp)
      );
    } else {
      results = data.modexps.map(modexp =>
        FD.modexp(modexp)
      );
    }
    FD.timeLocal = performance.now() - FD.timeLocal;

    // some formatting to have local results in the same format as remote ones
    results.forEach(result => {
      FD.resultLocal += result !== '0' && result.startsWith('0') ? result.substring(1) + ',\n' : result + ',\n';
    });
    FD.resultLocal = FD.resultLocal.substring(0, FD.resultLocal.length - 2);  // remove trailing ',\n'

    FD.showLocalTime(FD.timeLocal);
    FD.showLocalResult(FD.resultLocal, results.length);
  };

  /**
   * Calculates one or multiple modexps remotely using the data obtained from parseFields().
   * For the modexp calculation, FamodulusClient is used for outsourcing to one or more servers
   * depending on the algorithm chosen.
   *
   * @param {Object} data       Form data, including defaults, used for calculation
   */
  FD.modexpRemote = function (data) {
    if (typeof FamodulusClient === 'undefined') {
      alert('FamodulusClient library not found!');
      return;
    }

    let fam = new FamodulusClient(data.servers, false, data.brief);
    (function () {
      if (FD.algorithm === 'direct') {
        FD.timeRemote = performance.now();
        return fam.direct(data.modexps, data.defaults);
      } else if (FD.algorithm === 'dec2') {
        FD.timeRemote = performance.now();
        return fam.decExponent(data.modexps, data.defaults, false);
      } else if (FD.algorithm === 'dec2-checked') {
        FD.timeRemote = performance.now();
        return fam.decExponent(data.modexps, data.defaults, true);
      }
    })().then(results => {
      FD.timeRemote = performance.now() - FD.timeRemote;

      if (FD.timeRemote < FD.timeLocal) {
        FD.showRemoteTime(FD.timeRemote, true);
        FD.showLocalTime(FD.timeLocal, false);
      } else if (FD.timeRemote > FD.timeLocal) {
        FD.showRemoteTime(FD.timeRemote, false);
        FD.showLocalTime(FD.timeLocal, true);
      } else {
        FD.showRemoteTime(FD.timeRemote);
      }

      if (results.r) {
        FD.resultRemote = results.r;
        FD.showRemoteResult(FD.resultRemote, 1);
      } else {
        for (let i = 0; i < results.length - 1; i++) {
          FD.resultRemote += results[i].r + ',\n';
        }
        FD.resultRemote += results[results.length - 1].r;
        FD.showRemoteResult(FD.resultRemote, results.length);
      }

      FD.showDifference(FD.timeRemote, FD.timeLocal);
      FD.showEqual(FD.resultRemote, FD.resultLocal);
    }).catch(ex => {
      alert('An error occured: ' + ex);
      console.log(ex);
    });
  };
});
