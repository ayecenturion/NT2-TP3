new Vue({
    el: '#app',
    data: {
        saludJugador: 100,
        saludMonstruo: 100,
        hayUnaPartidaEnJuego: false,
        turnos: [], //es para registrar los eventos de la partida
        esJugador: false,
        rangoAtaque: [3, 10],
        rangoAtaqueEspecial: [10, 20],
        rangoAtaqueDelMonstruo: [5, 12],
        rangoCuracionMonstruo: [2, 5]
    },

    methods: {
        getSalud(salud) {
            return `${salud}%`
        },
        empezarPartida: function () {
            this.hayUnaPartidaEnJuego = true,
            this.saludJugador = 100,
            this.saludMonstruo = 100,
            this.turnos = []
        },
        atacar: function () {
            let danio = this.calcularHeridas(this.rangoAtaque)
            this.saludMonstruo -= danio
            this.registrarEvento({ esJugador: true, text: 'EL JUGADOR LASTIMA AL MONSTRUO EN ' + danio 
            })
            if (this.verificarGanador()){
                return this
            }  
            this.ataqueDelMonstruo()
        },
        ataqueDelMonstruo: function () {
            let danio = this.calcularHeridas(this.rangoAtaqueDelMonstruo)
            this.saludJugador -= danio
            this.registrarEvento({ esJugador: false, text: 'EL MONSTRUO LASTIMA AL JUGADOR POR ' + danio 
            })
            this.verificarGanador()
        },

        ataqueEspecial: function () {
            let danio = this.calcularHeridas(this.rangoAtaqueEspecial)
            this.saludMonstruo -= danio
            this.registrarEvento({ esJugador: true, text: 'EL JUGADOR LASTIMA AL MONSTRUO EN ' + danio 
            })
            if (this.verificarGanador()){
                return this
            }  
            this.ataqueDelMonstruo()
        },

        /*En el PDF figura: que el jugador recupera más energía que el jugador (Yo interpreto que sería más que el monstruo. Entonces =>
            Jugador recupera +10
            Monstruo recupera e/ +2 y +5)*/

        curar: function () {
            (this.saludJugador <= 90)? this.saludJugador += 10 : this.saludJugador = 100
            this.registrarEvento({ esJugador: true, text: 'EL JUGADOR SE CURA POR 10'  
            })
            this.curarMostruo()
        },

        curarMostruo: function () {
            let energia = this.calcularHeridas(this.rangoCuracionMonstruo)
            this.saludMonstruo += energia
            this.registrarEvento({ esJugador: false, text: 'EL MONSTRUO SE CURA POR ' + energia  
            })
        },

        registrarEvento(evento) {
            this.turnos.unshift(evento)
        },
        terminarPartida: function () {
            this.hayUnaPartidaEnJuego = false
        },

        calcularHeridas: function (rango) {
            let min = rango[0]
            let max = rango[1]
            return Math.max(Math.floor(Math.random() * max) + 1,min);

        },
        verificarGanador: function () {
            if (this.saludJugador <= 0 ){
                if(confirm("Perdiste :(, ¿queres jugar de nuevo?")){
                    this.empezarPartida()
                } else{
                    this.hayUnaPartidaEnJuego = false
                    this.saludJugador = 100,
                    this.saludMonstruo = 100,
                    this.turnos = []
                }
                return true
            } else if (this.saludMonstruo <=0) {
                if(confirm("¡¡Ganaste!!, ¿queres jugar de nuevo?")){
                    this.empezarPartida()
                } else {
                    this.hayUnaPartidaEnJuego = false,
                    this.saludJugador = 100,
                    this.saludMonstruo = 100,
                    this.turnos = []
                }
                return true
            } 
            return false;
        },
        cssEvento(turno) {
            //Este return de un objeto es prque vue asi lo requiere, pero ponerlo acá queda mucho mas entendible en el codigo HTML.
            return {
                'player-turno': turno.esJugador,
                'monster-turno': !turno.esJugador
            }
        }
    }
});