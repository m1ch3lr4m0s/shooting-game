class Projectile {
    constructor(speed, damage, position, direction, color = 'yellow') {
        this.speed = speed;
        this.damage = damage;
        this.position = position;
        this.direction = direction;
        this.size = 5; // Tamanho do projétil
        this.color = color;
    }

    updatePosition() {
        this.position.x += this.direction.x * this.speed;
        this.position.y += this.direction.y * this.speed;
        console.log('Posição do projétil atualizada:', this.position); // Log para verificar atualização
    }

    checkCollision(target) {
        const distance = Math.sqrt(
            (this.position.x - target.position.x) ** 2 +
            (this.position.y - target.position.y) ** 2
        );
        return distance < target.size;
    }
}

export default Projectile;