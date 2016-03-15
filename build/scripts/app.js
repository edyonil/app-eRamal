(function () {
    'use strict';

    var _templateBase = './scripts';

    angular.module('app', [
            'ui.router',
            'ngMaterial',
            'ngAnimate',
            'wSQL',
            'ramal.app'
        ]);
})();
/**
 * db_params = {
 *      name: "my_db_name",
 *      version: "my_db_version",
 *      sub_name: "my_db_sub_name",
 *      size: "my_db_size"
 * }
 *
 * tables_sql = {
 *
 *      "table1"    :   [
 *          "id INTEGER PRIMARY KEY AUTOINCREMENT NULL",
 *          "category_id INTEGER NULL"
 *      ],
 *      "table2"    :   [
 *          "id INTEGER PRIMARY KEY AUTOINCREMENT NULL",
 *          "category_id INTEGER NULL"
 *      ],
 *
 * }
 */
angular.module('wSQL.config', [])
.constant("W_SQL_CONFIG", {
    PARAMS: {
        name: "amo_ramal_db",
        version: "1.0",
        sub_name: "sub_amo_ramal_db",
        size: 1000000
    },
    TABLES_SQL: {
        "ramais"    :   [
            "id INTEGER PRIMARY KEY AUTOINCREMENT NULL",
            "nome TEXT NOT NULL",
            'numero TEX NOT NULL',
            "unidade TEXT NOT NULL"
        ]
    },
    /**
     * DEBUG_LEVELs
     *    0 - nothing
     *    1 - console.error
     *    2 - console.warn &
     *    3 - console.info &
     *    4 - console.log, debug
     */
    DEBUG_LEVEL: 0,
    CLEAR: false
});




var _templateBase = './scripts';

(function () {
    'use strict';

    angular.module('ramal.app', [])
        .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

            $stateProvider
                .state('home', {
                    url: "/home",
                    abstract: true,
                    templateUrl: _templateBase + '/branchs/views/template.html'
                })
                .state('home.list', {
                    url: "/list",
                    views : {
                        'form': {
                            templateUrl: _templateBase + '/branchs/views/form.html'
                        }
                    }
                });

            $urlRouterProvider.otherwise('/home/list');

        }]);

})();
(function (angular) {
    "use strict";
    //noinspection JSUnresolvedFunction
    angular.module('ramal.app')
        .controller('BranchController', BranchController);

    BranchController.$inject = ['Ramal', '$mdDialog', '$mdMedia'];

    function BranchController(Ramal, $mdDialog, $mdMedia) {

        var _branchCtrl = this;

        _branchCtrl.listaRamais = [];

        _branchCtrl.save = function (dados) {

            if(!__validate(dados)){
                return false;
            }

            var data = {
                nome:  dados.nome,
                numero: dados.numero,
                unidade: dados.unidade
            };

            if (dados.id) {
                Ramal.update(data, dados.id).then(
                    __success,
                    __error);
            } else {
                Ramal.save(data).then(
                    __success,
                    __error);
            }

        };

        _branchCtrl.all = function () {

            Ramal.get().then(function (data) {

                _branchCtrl.listaRamais = data;
                __removeElementLoading();
            }, function () {
                __removeElementLoading();
            })
        };

        _branchCtrl.search = function (value) {

            Ramal.search(value).then(function (data) {
                _branchCtrl.listaRamais = data;
            }, function(){
                _branchCtrl.listaRamais = [];
            });

        };

        _branchCtrl.remove = function (objeto, index) {
            var confirm = $mdDialog.confirm()
                .title('Tem certeza que deseja remover o registro?')
                .ok('Remover!')
                .cancel('Cancelar');

            $mdDialog.show(confirm).then(function() {
                Ramal.delete(objeto.id)
                    .then(function () {
                        _branchCtrl.listaRamais.splice(index, 1);
                    });

            }, function() {

            });
        };

        function __success(){
            var dados = _branchCtrl.form;
            dados.unidade = dados.unidade.toUpperCase();
            if (!dados.id) {
                _branchCtrl.listaRamais.unshift(dados);
            }

            _branchCtrl.form = {};
        }

        function __error(error) {
            $mdDialog.show(
                $mdDialog.alert()
                    .title('Aviso')
                    .textContent(error)
                    .ok('Fechar')
            );
        }

        function __validate(dados) {

            var reg = new RegExp(/[a-zA-Z]+/);

            if (!dados) {
                __error("Preencha os campos");
                return false;
            }

            if (dados.nome == undefined || dados.nome == "" || dados.nome == null) {
                __error("Nome é obrigatório");
                return false;
            }
            if (!dados.numero || dados.numero == "" || dados.numero == null) {
                __error("Telefone ou ramal é obrigatório");
                return false;
            }

            if (reg.test(dados.numero)) {
                __error("Só é permitido números e traços");
                return false;
            }
            if (!dados.unidade || dados.unidade == "" || dados.unidade == null) {
                __error("Unidade é obrigatório");
                return false;
            }
            return true;
        }

        function __removeElementLoading()
        {
            var ele = document.getElementById("loading");
            ele.className = "loading loading-hide";

            setTimeout(function () {
                ele.className = "loading hide";
            }, 3000);
        }

        _branchCtrl.aboutApp = function () {
            $mdDialog.show({
                    controller: DialogController,
                    templateUrl: _templateBase + '/branchs/views/about.html',
                    parent: angular.element(document.body),
                    clickOutsideToClose:true
                })
        }

    }

    function DialogController($scope, $mdDialog) {
        $scope.hide = function() {
            $mdDialog.hide();
        };
        $scope.cancel = function() {
            $mdDialog.cancel();
        };
        $scope.answer = function(answer) {
            $mdDialog.hide(answer);
        };
    }

})(angular);
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