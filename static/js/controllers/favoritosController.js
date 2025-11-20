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
        let payload = {
            targetId: $scope.nuevo.targetId,
            type: $scope.nuevo.type,
            user_id: localStorage.getItem("id_usr")
        };
    
        $http.post("/api/favoritos", payload)
        .then(res => {
            console.log("Agregado", res.data);
            $scope.cargar();
        })
        .catch(err => console.error(err));
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
