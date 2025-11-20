app.service("FavoritosService", function(FavoritosDAO) {

    this.obtener = function() {
        return FavoritosDAO.obtener();
    };

    this.agregar = function({ targetId, type }) {
        return FavoritosDAO.crear({
            targetId,
            type,
            id_usuarios: localStorage.getItem("id_usr")
        });
    };

    this.actualizar = function(id, { type }) {
        return FavoritosDAO.actualizar(id, { type });
    };

    this.eliminar = function(id) {
        return FavoritosDAO.eliminar(id);
    };

});
