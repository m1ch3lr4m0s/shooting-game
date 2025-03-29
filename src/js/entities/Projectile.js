class Projectile {
    constructor(speed, damage, position, direction, color = 'yellow') {
        this.speed = speed;
        this.damage = damage;
        this.position = position;
        this.direction = direction;
        this.size = 5;
        this.color = color;
    }

    updatePosition() {
        this.position.x += this.direction.x * this.speed;
        this.position.y += this.direction.y * this.speed;
    }

    checkCollision(target) {
        const distance = Math.sqrt(
            (this.position.x - target.position.x) ** 2 +
            (this.position.y - target.position.y) ** 2
        );
        return distance < (this.size + target.size);
    }
}

export default Projectile;