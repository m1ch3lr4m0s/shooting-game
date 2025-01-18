class CollisionManager {
    constructor() {
        // Inicialize qualquer estado necessário para o gerenciador de colisões
    }

    checkCollision(entity1, entity2) {
        const distance = Math.sqrt(
            (entity1.position.x - entity2.position.x) ** 2 +
            (entity1.position.y - entity2.position.y) ** 2
        );
        return distance < (entity1.size + entity2.size) / 2;
    }

    handleCollisions(projectiles, enemies) {
        projectiles.forEach((projectile, pIndex) => {
            enemies.forEach((enemy, eIndex) => {
                if (this.checkCollision(projectile, enemy)) {
                    console.log(`Collision detected between projectile and enemy`);
                    projectiles.splice(pIndex, 1);
                    enemy.takeDamage(projectile.damage);
                    if (enemy.health <= 0) {
                        enemies.splice(eIndex, 1);
                    }
                }
            });
        });
    }
}

export default CollisionManager;