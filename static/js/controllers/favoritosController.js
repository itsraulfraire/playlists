app.controller("favoritosController", function($scope, $http) {

    $scope.favoritos = [];
    $scope.nuevo = { targetId: "", type: "playlist" };

    // Cargar lista
    $scope.cargar = function() {
        $http.get("/api/favoritos").then(res => {
            $scope.favoritos = res.data;
        });
    };

    // Agregar favorito
    $scope.agregar = function() {
        $http.post("/api/favoritos", $scope.nuevo).then(() => {
            $scope.cargar();
            $scope.nuevo = { targetId: "", type: "playlist" };
        });
    };

    // Actualizar tipo
    $scope.actualizarTipo = function(f, nuevoTipo) {
        $http.put(`/api/favoritos/${f.id}`, { type: nuevoTipo }).then(() => {
            $scope.cargar();
        });
    };

    // Eliminar
    $scope.eliminar = function(f) {
        $http.delete(`/api/favoritos/${f.id}`).then(() => {
            $scope.cargar();
        });
    };

    // Inicializar
    $scope.cargar();
});
