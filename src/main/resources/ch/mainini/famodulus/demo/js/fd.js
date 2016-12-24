/* global FamodulusClient, performance, $, str2bigInt, bigInt2str, powMod, verificatum */

$('document').ready(function () {
  'use strict';

  var FD = {};
  window.FD = FD;

  function _modexpLeemon (base, exponent, modulus) {
    var b = str2bigInt(base, 16, 0);
    var e = str2bigInt(exponent, 16, 0);
    var m = str2bigInt(modulus, 16, 0);

    return bigInt2str(powMod(b, e, m), 16);
  }

  function _modexpVerificatum (base, exponent, modulus) {
    var b = new verificatum.arithm.LargeInteger(base);
    var e = new verificatum.arithm.LargeInteger(exponent);
    var m = new verificatum.arithm.LargeInteger(modulus);

    return b.modPow(e, m).toHexString(16);
  }

  function _famodulusCallback (results) {
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
      for (var i = 0; i < results.length - 1; i++) {
        FD.resultRemote += results[i].r + ',\n';
      }
      FD.resultRemote += results[results.length - 1].r;
      FD.showRemoteResult(FD.resultRemote, results.length);
    }

    FD.showDifference(FD.timeRemote, FD.timeLocal);
    FD.showEqual(FD.resultRemote, FD.resultLocal);
  }

  FD.P_1024 = '80000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001981bf';
  FD.P_2048 = '800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ad3af';
  FD.P_3072 = '8000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006119df';

  FD.DEFAULT_SERVER = 'http://localhost:8081/api/modexp/';

  FD.algorithm = 'direct';
  FD.resultLocal = '';
  FD.resultRemote = '';
  FD.timeLocal = '';
  FD.timeRemote = '';

  FD.modexp = _modexpLeemon;

  FD.loadVerificatum = function () {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'http://www.verificatum.com/files/vjsc-1.1.0.js'; // @todo errorhandling!
    $('body').append(script);
    FD.modexp = _modexpVerificatum;
    $('#btn-verificatum').prop('disabled', true);
  };

  FD.randString = function (bitLength) {    // @todo CSPRNG?
    var numNibbles = 2 * Math.floor(bitLength / 8) === 0 ? 1 : 2 * Math.floor(bitLength / 8);
    var retval = '';
    while (retval.length < numNibbles) {
      retval += Math.floor(Math.random() * 16).toString(16);
    }
    return retval;
  };

  FD.appendTo = function (field, value) {
    var curval = $(field).val().toString();
    if (curval.length === 0) {
      $(field).val(value);
    } else if (curval.endsWith(',')) {
      $(field).val(curval + '\n' + value);
    } else if (curval.endsWith(',\n')) {
      $(field).val(curval + value);
    } else if (curval.endsWith('\n')) {
      $(field).val(curval + ',' + value);
    } else {
      $(field).val(curval + ',\n' + value);
    }
  };

  FD.stringToList = function (val) {
    if (val.length === 0) {
      return [];
    } else {
      return val.replace(/\s+/gm, '').split(',');
    }
  };

  FD.parseFields = function () {
    var data = {};
    data.defaultBase = $('#input-base-default').val().length > 0 ? $('#input-base-default').val() : undefined;
    data.defaultExponent = $('#input-exponent-default').val().length > 0 ? $('#input-exponent-default').val() : undefined;
    data.defaultModulus = $('#input-modulus-default').val().length > 0 ? $('#input-modulus-default').val() : undefined;

    var bases = FD.stringToList($('#input-bases').val());
    var exponents = FD.stringToList($('#input-exponents').val());
    var moduli = FD.stringToList($('#input-moduli').val());

    var count = Math.max(Math.max(bases.length, exponents.length), moduli.length);
    count = count === 0 ? 1 : count;
    data.modexps = [count];
    for (var i = 0; i < count; i++) {
      data.modexps[i] = [bases[i] === '' ? undefined : bases[i],
        exponents[i] === '' ? undefined : exponents[i],
        moduli[i] === '' ? undefined : moduli[i]];
    }
    return data;
  };

  FD.getServer = function (field) {
    return $(field).val().length > 0 ? $(field).val() : FD.DEFAULT_SERVER;
  };

  FD.setAlgorithm = function (algorithm) {
    FD.algorithm = algorithm;
  };

  FD.createGlyph = function (glyph) {
    var s = document.createElement('span');
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

  FD.showResults = function () {
    $('#div-no-results').hide();
    $('#div-results').show();
  };

  FD.hideResults = function () {
    $('#div-results').hide();
    $('#div-no-results').show();
  };

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

  FD.showRemoteResult = function (result, count) {
    $('#h-results-remote').remove();
    var h = document.createElement('h4');
    h.id = 'h-results-remote';
    h.appendChild(document.createTextNode('Remote Results (' + count + '):'));
    $('#div-results-remote-title').append(h);

    $('#input-results-remote').val(result.toLowerCase());
    $('#div-results-remote').show();
  };

  FD.showLocalResult = function (result, count) {
    $('#h-results-local').remove();
    var h = document.createElement('h4');
    h.id = 'h-results-local';
    h.appendChild(document.createTextNode('Local Results (' + count + '):'));
    $('#div-results-local-title').append(h);

    $('#input-results-local').val(result.toLowerCase());
    $('#div-results-local').show();
  };

  FD.showRemoteTime = function (time, better) {
    $('#p-time-remote').remove();
    var p = document.createElement('p');
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

  FD.showLocalTime = function (time, better) {
    $('#p-time-local').remove();
    var p = document.createElement('p');
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

  FD.showDifference = function (time1, time2) {
    var factor = time1 >= time2 ? Math.ceil(time1 / time2 * 100) / 100 : Math.ceil(time2 / time1 * 100) / 100;

    $('#p-time-difference').remove();
    var p = document.createElement('p');
    p.id = 'p-time-difference';
    p.appendChild(FD.createGlyph('time'));
    p.appendChild(document.createTextNode('\xa0Difference: ' + Math.abs(time1 - time2) + ' ms (' + factor + ' times).'));
    $('#div-time-difference').append(p);
    $('#div-time-difference').show();
  };

  FD.showEqual = function (result1, result2) {
    $('#p-equal').remove();
    var p = document.createElement('p');
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

  FD.modexpLocal = function (data) {
    var modexp = [data.modexps[0][0] || data.defaultBase, data.modexps[0][1] || data.defaultExponent, data.modexps[0][2] || data.defaultModulus];
    // ======= START local performance measurement =======
    FD.timeLocal = performance.now();
    FD.resultLocal = FD.modexp(modexp[0], modexp[1], modexp[2]);
    FD.timeLocal = performance.now() - FD.timeLocal;
    // ======= END local performance measurement =======

    FD.resultLocal = FD.resultLocal !== '0' && FD.resultLocal.startsWith('0') ? FD.resultLocal.substring(1) : FD.resultLocal;
    FD.showLocalTime(FD.timeLocal);
    FD.showLocalResult(FD.resultLocal, 1);
  };

  FD.modexpsLocal = function (data) {
    var modexps = data.modexps.map(function (modexp) {
      return [modexp[0] || data.defaultBase, modexp[1] || data.defaultExponent, modexp[2] || data.defaultModulus];
    });

    // ======= START local performance measurement =======
    FD.timeLocal = performance.now();
    var results = modexps.map(function (modexp) {
      return FD.modexp(modexp[0], modexp[1], modexp[2]);
    });
    FD.timeLocal = performance.now() - FD.timeLocal;
    // ======= END local performance measurement =======

    // some formatting to have local results in the same format as remote ones
    results.forEach(function (result) {
      FD.resultLocal += result !== '0' && result.startsWith('0') ? result.substring(1) + ',\n' : result + ',\n';
    });
    FD.resultLocal = FD.resultLocal.substring(0, FD.resultLocal.length - 2);  // remove trailing ',\n'

    FD.showLocalTime(FD.timeLocal);
    FD.showLocalResult(FD.resultLocal, results.length);
  };

  FD.modexpRemote = function (data) {
    var modexp = [data.modexps[0][0] || data.defaultBase, data.modexps[0][1] || data.defaultExponent, data.modexps[0][2] || data.defaultModulus];

    switch (FD.algorithm) {
      case 'direct':
        var fam = new FamodulusClient([FD.getServer('#input-server-1-1')], $('#input-brief').is(':checked'));
        FD.timeRemote = performance.now();
        fam.direct(modexp[0], modexp[1], modexp[2], _famodulusCallback);
        break;
      case 'dec2':
        var fam = new FamodulusClient([FD.getServer('#input-server-2-1'), FD.getServer('#input-server-2-2')], $('#input-brief').is(':checked'));
        FD.timeRemote = performance.now();
        fam.decExponent(modexp[0], modexp[1], modexp[2], false, _famodulusCallback);
        break;
      case 'dec2-checked':
        var fam = new FamodulusClient([FD.getServer('#input-server-2-1'), FD.getServer('#input-server-2-2')], $('#input-brief').is(':checked'));
        FD.timeRemote = performance.now();
        fam.decExponent(modexp[0], modexp[1], modexp[2], true, _famodulusCallback);
        break;
    }
  };

  FD.modexpsRemote = function (data) {
    switch (FD.algorithm) {
      case 'direct':
        var fam = new FamodulusClient([FD.getServer('#input-server-1-1')], $('#input-brief').is(':checked'));
        FD.timeRemote = performance.now();
        fam.directs(data.modexps, data.defaultBase, data.defaultExponent, data.defaultModulus, _famodulusCallback);
        break;
      case 'dec2':
        var fam = new FamodulusClient([FD.getServer('#input-server-2-1'), FD.getServer('#input-server-2-2')], $('#input-brief').is(':checked'));
        FD.timeRemote = performance.now();
        fam.decExponents(data.modexps, data.defaultBase, data.defaultExponent, data.defaultModulus, false, _famodulusCallback);
        break;
      case 'dec2-checked':
        var fam = new FamodulusClient([FD.getServer('#input-server-2-1'), FD.getServer('#input-server-2-2')], $('#input-brief').is(':checked'));
        FD.timeRemote = performance.now();
        fam.decExponents(data.modexps, data.defaultBase, data.defaultExponent, data.defaultModulus, true, _famodulusCallback);
        break;
    }
  };
});
