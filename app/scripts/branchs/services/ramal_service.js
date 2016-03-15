(function (angular) {
    "use strict";
    //noinspection JSUnresolvedFunction
    angular.module('ramal.app')
        .service('Ramal', Ramal);

    Ramal.$inject = ['$q', 'wSQL'];

    function Ramal($q, wSQL) {

        var _model = {};

        var _table = 'ramais';

        var _columns = "id, nome, numero, unidade";

        var _db = wSQL;

        _model.save = function (dados) {

            var deffered = $q.defer();

            dados.nome = dados.nome.trim();
            dados.numero = dados.numero.trim();
            dados.unidade = dados.unidade.toUpperCase().trim();

            _db.insert(_table, dados)
                .then(function (data) {
                    if (data.error) {
                        deffered.reject("Ocorreu ao tentar salvar os dados. Entre em contato com edyonil@gmail.com");
                    } else {
                        deffered.resolve(data.id);
                    }
                });

            return deffered.promise;
        };

        _model.update = function (dados, id) {

            var deffered = $q.defer();

            dados.nome = dados.nome.trim();
            dados.unidade = dados.unidade.toUpperCase().trim();

            _db.update(_table, dados)
                .where('id', id)
                .query()
                .then(function (data) {
                    if (data.error) {
                        deffered.reject("Ocorreu ao tentar salvar os dados. Entre em contato com edyonil@gmail.com");
                    } else {
                        deffered.resolve(data.id);
                    }
                });

            return deffered.promise;
        };

        _model.find = function (id) {

            var deffered = $q.defer();

            _db.select(_columns)
                .from(_table)
                .where("id", id, '=')
                .row()
                .then(function (data) {
                    if (data.length > 0) {

                        deffered.resolve(data[0]);

                    } else {

                        deffered.reject("Registro não encontrado");
                    }

                });
        };

        _model.get = function () {

            var deffered = $q.defer();

            _db.select(_columns)
                .from(_table)
                .order_by('id', 'DESC')
                .query()
                .then(function (data) {
                    if (data.length > 0) {

                        deffered.resolve(data);

                    } else {

                        deffered.reject("Registro não encontrado");
                    }

                });

            return deffered.promise;
        };

        _model.delete = function (id) {

            var deffered = $q.defer();

            _db.delete(_table)
                .where("id", id)
                .query()
                .then(function(data){
                    deffered.resolve(data);
                });

            return deffered.promise;

        };

        _model.search = function (value) {

            var deffered = $q.defer();

            _db.select(_columns)
                .from(_table)
                .like("nome", value, "both")
                .or_like("unidade", value, "both")
                .or_like("numero", value, "both")
                .order_by('id', 'DESC')
                .query()
                .then(function(d){
                    if (d.length > 0) {
                        deffered.resolve(d);
                    } else {
                        deffered.reject("Registo não encontrado");
                    }
                });

            return deffered.promise;
        };

        return _model;

    }

})(angular);