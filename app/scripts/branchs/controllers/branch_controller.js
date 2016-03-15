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