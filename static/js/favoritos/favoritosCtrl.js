app.controller("favoritosCtrl", function($scope, FavoritosService, PlaylistsService, SesionService, MensajesService) {
    $scope.SesionService = SesionService;
    $scope.favoritos = [];
    $scope.playlists = [];

    $scope.nuevo = {
        targetId: "",
        type: "playlist"
    };

    function cargar() {
        FavoritosService.obtener().then(data => {
            $scope.favoritos = data;
            $scope.$applyAsync();
        });

        PlaylistsService.obtenerPlaylists().then(data => {
            $scope.playlists = data;
            $scope.$applyAsync();
        });
    }

    $scope.agregar = function() {

        if (!$scope.nuevo.targetId || !$scope.nuevo.type) {
            MensajesService.pop("Falta target o type");
            return;
        }

        FavoritosService.agregar($scope.nuevo)
            .then(() => {
                MensajesService.toast("Favorito agregado");
                $scope.nuevo.targetId = "";
                cargar();
            })
            .catch(() => MensajesService.pop("No se pudo agregar favorito"));
    };

    $scope.actualizarTipo = function(fav, nuevoTipo) {
        FavoritosService.actualizar(fav.id, { type: nuevoTipo })
            .then(() => {
                MensajesService.toast("Favorito actualizado");
                cargar();
            })
            .catch(() => MensajesService.pop("No se pudo actualizar favorito"));
    };

    $scope.eliminar = function(fav) {
        if (!confirm("¿Eliminar favorito?")) return;

        FavoritosService.eliminar(fav.id)
            .then(() => {
                MensajesService.toast("Favorito eliminado");
                cargar();
            })
            .catch(() => MensajesService.pop("No se pudo eliminar favorito"));
    };

    $scope.getNombrePlaylist = function(id) {
        const p = $scope.playlists.find(pl => pl.idPlaylist == id);
        return p ? p.nombre : "(sin nombre)";
    };

    cargar();
});
