import Projectile from './Projectile.js';

class Enemy {
    constructor(type, health, position, speed, color) {
        this.type = type;
        this.health = health;
        this.position = position;
        this.speed = speed;
        this.color = color;
        this.size = 32;
    }

    moveTowards(targetPosition) {
        const deltaX = targetPosition.x - this.position.x;
        const deltaY = targetPosition.y - this.position.y;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        if (distance > 0) {
            this.position.x += (deltaX / distance) * this.speed;
            this.position.y += (deltaY / distance) * this.speed;
        }
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health < 0) {
            this.health = 0;
        }
    }
}

class FastEnemy extends Enemy {
    constructor(position) {
        super('FastEnemy', 50, position, 2, 'yellow');
    }

    shoot(playerPosition) {
        const direction = {
            x: playerPosition.x - this.position.x,
            y: playerPosition.y - this.position.y
        };
        const magnitude = Math.sqrt(direction.x ** 2 + direction.y ** 2);
        direction.x /= magnitude;
        direction.y /= magnitude;

        return new Projectile(7, 5, { ...this.position }, direction, 'red');
    }
}

class ColorChangingEnemy extends Enemy {
    constructor(position) {
        super('ColorChangingEnemy', 100, position, 1, 'random');
        this.colors = ['red', 'green', 'blue', 'purple'];
        this.changeColor();
    }

    changeColor() {
        setInterval(() => {
            this.color = this.colors[Math.floor(Math.random() * this.colors.length)];
        }, 1000);
    }

    shoot(playerPosition) {
        const direction = {
            x: playerPosition.x - this.position.x,
            y: playerPosition.y - this.position.y
        };
        const magnitude = Math.sqrt(direction.x ** 2 + direction.y ** 2);
        direction.x /= magnitude;
        direction.y /= magnitude;

        return new Projectile(5, 0, { ...this.position }, direction, 'lightblue');
    }
}

export { Enemy, FastEnemy, ColorChangingEnemy };