class Player {
    constructor(name, health, position) {
        this.name = name;
        this.health = health;
        this.position = position;
        this.size = 32;
        this.color = 'blue';
    }

    // Método: Move o jogador para uma nova posição
    move(x, y) {
        this.position.x += x;
        this.position.y += y;
    }
    // Método takeDamage: Reduz a saúde do jogador e garante que não fique negativa.
    takeDamage(amount) {
        this.health -= amount;
        if (this.health < 0) {
            this.health = 0;
        }
    }
}

export default Player; 