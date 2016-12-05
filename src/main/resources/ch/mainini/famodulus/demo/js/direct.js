$('document').ready(function () {
    'use strict';

    var randLength = 768;

    $('#btn-calculate').click(function () {

    });

    $('#btn-reset').click(function () {
        $('#form-modexp').trigger('reset');
    });

    $('#btn-add-p').click(function () {
        FamodulusDemo.appendTo('#input-bases', FamodulusDemo.randHexString(randLength));
        FamodulusDemo.appendTo('#input-exponents', FamodulusDemo.randHexString(randLength));
        FamodulusDemo.appendTo('#input-moduli', FamodulusDemo.P_3072);
    });

    $('#btn-add-rand').click(function () {
        FamodulusDemo.appendTo('#input-bases', FamodulusDemo.randHexString(randLength));
        FamodulusDemo.appendTo('#input-exponents', FamodulusDemo.randHexString(randLength));
        FamodulusDemo.appendTo('#input-moduli', FamodulusDemo.randHexString(randLength));
    });

    $('#btn-base-rand').click(function () {
        $('#input-base-default').val(FamodulusDemo.randHexString(randLength));
    });

    $('#btn-exponent-rand').click(function () {
        $('#input-exponent-default').val(FamodulusDemo.randHexString(randLength));
    });

    $('#btn-modulus-rand').click(function () {
        $('#input-modulus-default').val(FamodulusDemo.randHexString(randLength));
    });

    $('#btn-modulus-p').click(function () {
        $('#input-modulus-default').val(FamodulusDemo.P_3072);
    });
});

/*
 document.addEventListener('DOMContentLoaded', function(){
 var base     = '33dd8054fa3774443d2a1c66eb3bb6a382b20bd785f9ab6cccdfa7c01361a35669695a5b4403e65553996c0a9b7f6b96ce1584d82b16429eb9e54e8d8200fd49f56c96d5a1d237038bafe20d41eaeee1d1fcad26d80ab2833ec50c195076a2a0dde029a55d309d38e0ff640ca30d13876e3f7a1e6807fb73269bfa373515709e92c8a1c7d3e6b3ebdb37d4c59c969368ab73b97cb66f312c7a59e3600e60c172099ba3283e8faa0575d57219557b9bde405d7bffc91dbbfa2d51866d7f77956dd09ffca6d3b1b835de78b97a8db8c4bef0b542ccd6a111be1e3cf7377aba0017d3c24db56443f6d3c4202a5c194a5ffaccfae962c70a2488700fbfaafd7c99086a94f4eab636777a8ef51e8f0dcad1dfe220d8ad4a1d63d083a265dcd8d241bacaa0affa591666f54a4a9a003397a7ce3ee8ffdc902c41148ec1dfcedbea87bef1a151b3773ec1770c324e7cf3c78b384f96fb23c4bf4212f553da287c72e3a9195cc34278e986591717292d47f45884cec3fc79da74dfaf396bda185a87cc9d';
 var exponent = 'b9081c52cd158e7c942de9e18af87ecbf21a2205b8b547904768ee4e2223749a33391d59fdf4fe3bbbbe78a082592188c43ccfbb8a04cad1dc4935794ec4d351a4de90202ddaa750ce684b984c4e0873b051e9dab0033c8dcdbf41744f900d2a938510540df915428020d030c41304fc614eeb770a32da6ef216e2ce2610cfe6cae222d57204129341f0b5613e9805ace3fdf8645cab66c0b2a556d9b98f69c1ec3e85dde4abe4d1228a015a29b65f6523c154a10b56d3152b9d0b729209080a727e842a9a168fd4d0be6e6463f29d49ca491395b754799794e10a4f5b288349dda860ab253181e6fb53c7eeb117be50915f388800412638ff932299f0ed400680aba94df0029a93be7c9be491ce424a97ec80a37a3d519fa08793602ad3e49e77e039939da0ed90a6dad7d9a59b4cbf61564fba850f0c552bc70df73b48b66a3c0c3d595525c44b8bcf561de56c6695f6e7d2d7c605e963ebb20905ff2a9468dca8b2e8913442f96f5a50830f68262cd07ae0331d813f2ae023a5d314b4707a';

 var famodulus = new Famodulus(['http://localhost:8081/api/modexp/']);

 var t0 = performance.now();
 famodulus.modexp(base, exponent, P_3072, function(result) { console.log("Remote result: " + result) });
 var t1 = performance.now();
 console.log("Remote calculation took " + (t1 - t0) + " milliseconds.");

 var t2 = performance.now();
 var result = BigInt.modexp(base, exponent, P_3072);
 var t3 = performance.now();
 console.log("Local calculation took " + (t3 - t2) + " milliseconds");
 console.log("Result: " + result);
 });
 */