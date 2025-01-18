class GameStateManager {
    constructor() {
        this.state = 'start'; // Adicionando o estado 'start' para a tela de início
    }

    startGame() {
        if (this.state === 'start' || this.state === 'gameover') {
            this.state = 'running';
            console.log('Game started');
            // Inicializar ou reiniciar o jogo
        }
    }

    pauseGame() {
        if (this.state === 'running') {
            this.state = 'paused';
            console.log('Game paused');
            // Lógica para pausar o jogo
        }
    }

    resumeGame() {
        if (this.state === 'paused') {
            this.state = 'running';
            console.log('Game resumed');
            // Lógica para retomar o jogo
        }
    }

    endGame() {
        if (this.state === 'running' || this.state === 'paused') {
            this.state = 'gameover';
            console.log('Game over');
            // Lógica para finalizar o jogo
        }
    }

    getState() {
        return this.state;
    }
}

export default GameStateManager; 