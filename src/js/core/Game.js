import { Enemy, FastEnemy, ColorChangingEnemy } from '../entities/Enemy.js';
import Player from '../entities/Player.js';
import Projectile from '../entities/Projectile.js';
import GameStateManager from '../managers/GameStateManager.js';
import CollisionManager from '../managers/CollisionManager.js';
import Renderer from './Renderer.js';

class Game {
    constructor() {
        this.gameStateManager = new GameStateManager();
        this.collisionManager = new CollisionManager();
        this.player = new Player('Hero', 100, { x: 50, y: 50 });
        this.enemies = [];
        this.projectiles = [];
        this.renderer = new Renderer('gameCanvas');
        this.mousePosition = { x: 0, y: 0 };
        this.mouseDirection = { x: 1, y: 0 };
        this.smoothedDirection = { x: 1, y: 0 };
        this.smoothingFactor = 0.1;
        this.targetEnemy = null;
        this.isFrozen = false;
        this.frozenTime = 0;
        this.setupEventListeners();
        this.spawnEnemies();
        this.backgroundImage = new Image(); // Cria um novo objeto de imagem
        this.backgroundImage.src = 'src/images/space.jpg'; // Defina o caminho para a sua imagem
        this.backgroundImage.onload = () => {
            console.log('Imagem de fundo carregada com sucesso!');
        };
    }

    setupEventListeners() {
        document.addEventListener('mousemove', (event) => {
            const rect = this.renderer.canvas.getBoundingClientRect();
            const newMousePosition = {
                x: event.clientX - rect.left,
                y: event.clientY - rect.top
            };

            if (!this.targetEnemy) {
                this.mouseDirection = {
                    x: newMousePosition.x - this.player.position.x,
                    y: newMousePosition.y - this.player.position.y
                };
                const magnitude = Math.sqrt(this.mouseDirection.x ** 2 + this.mouseDirection.y ** 2);
                if (magnitude > 0) {
                    this.mouseDirection.x /= magnitude;
                    this.mouseDirection.y /= magnitude;
                }

                this.smoothedDirection.x = (1 - this.smoothingFactor) * this.smoothedDirection.x + this.smoothingFactor * this.mouseDirection.x;
                this.smoothedDirection.y = (1 - this.smoothingFactor) * this.smoothedDirection.y + this.smoothingFactor * this.mouseDirection.y;
            }

            this.mousePosition = newMousePosition;
        });

        document.addEventListener('mousedown', (event) => {
            if (event.button === 2) {
                this.targetEnemy = this.findClosestEnemy();
            }
        });

        document.addEventListener('mouseup', (event) => {
            if (event.button === 2) {
                this.targetEnemy = null;
            }
        });

          // Evento para a barra de espaço
    document.addEventListener('keydown', (event) => {
        if (event.code === 'Space') {
            console.log('Barra de espaço pressionada, concentrando a mira...');
            this.targetEnemy = this.findClosestEnemy(); // Aqui você pode adicionar a lógica para concentrar a mira
        }
    });

        document.addEventListener('click', (event) => {
            if (this.gameStateManager.getState() === 'running') {
                console.log('Clique detectado, disparando projétil...');
                this.shootProjectile();
            }
        });
    }

    findClosestEnemy() {
        let closestEnemy = null;
        let minDistance = Infinity;
        this.enemies.forEach(enemy => {
            const distance = Math.sqrt(
                (enemy.position.x - this.player.position.x) ** 2 +
                (enemy.position.y - this.player.position.y) ** 2
            );
            if (distance < minDistance) {
                minDistance = distance;
                closestEnemy = enemy;
            }
        });
        return closestEnemy;
    }

    shootProjectile() {
        let direction;
        if (this.targetEnemy) {
            direction = {
                x: this.targetEnemy.position.x - this.player.position.x,
                y: this.targetEnemy.position.y - this.player.position.y
            };
        } else {
            direction = { ...this.smoothedDirection };
        }
    
        const magnitude = Math.sqrt(direction.x ** 2 + direction.y ** 2);
        if (magnitude === 0) {
            return;
        }
        direction.x /= magnitude;
        direction.y /= magnitude;
    
        const startPosition = {
            x: this.player.position.x + direction.x * (this.player.size / 2),
            y: this.player.position.y + direction.y * (this.player.size / 2)
        };
    
        const projectileSpeed = 10;
        const projectile = new Projectile(projectileSpeed, 10, startPosition, direction);
        this.addProjectile(projectile);
        this.projectiles.push(projectile);
        console.log('Projectile created:', projectile); // Log para verificar criação
    }

    addProjectile(projectile) {
        this.projectiles.push(projectile);
    }

    addEnemy(enemy) {
        this.enemies.push(enemy);
    }

    spawnEnemies() {
        setInterval(() => {
            const enemyType = Math.random();
            let enemy;
            const position = { x: Math.random() * 800, y: Math.random() * 600 };

            if (enemyType < 0.5) {
                enemy = new Enemy('Enemy', 50, position, 1, 'red');
            } else if (enemyType < 0.8) {
                enemy = new FastEnemy(position);
            } else {
                enemy = new ColorChangingEnemy(position);
            }

            this.addEnemy(enemy);
        }, 2000);
    }

    updateEntities() {
        if (!this.isFrozen) {
            this.player.position.x = this.mousePosition.x;
            this.player.position.y = this.mousePosition.y;
        }

        this.projectiles.forEach(projectile => projectile.updatePosition());
        this.enemies.forEach(enemy => {
            enemy.moveTowards(this.player.position);
            if (enemy instanceof FastEnemy || enemy instanceof ColorChangingEnemy) {
                const projectile = enemy.shoot(this.player.position);
                this.addProjectile(projectile);
            }
        });

        if (this.isFrozen) {
            this.frozenTime -= 1;
            if (this.frozenTime <= 0) {
                this.isFrozen = false;
            }
        }
    }

    handleCollisions() {
        this.collisionManager.handleCollisions(this.projectiles, this.enemies);

        this.enemies.forEach((enemy, eIndex) => {
            if (this.collisionManager.checkCollision(this.player, enemy)) {
                if (enemy instanceof ColorChangingEnemy) {
                    this.player.health = 0; // Morte instantânea
                } else {
                    this.player.takeDamage(10);
                }
                // Não remover o inimigo ao colidir com o jogador
            }
        });

        this.projectiles.forEach((projectile, pIndex) => {
            if (projectile.checkCollision(this.player)) {
                if (projectile.color === 'lightblue') {
                    this.isFrozen = true;
                    this.frozenTime = 180; // Congelado por 3 segundos (60 FPS)
                } else {
                    this.player.takeDamage(projectile.damage);
                }
                this.projectiles.splice(pIndex, 1);
            }
        });
    }

    render() {
        if (this.gameStateManager.getState() === 'start') {
            this.renderer.clear();
            // Desenhar a imagem de fundo
            this.renderer.context.drawImage(this.backgroundImage, 0, 0, this.renderer.canvas.width, this.renderer.canvas.height);
            // Desenhar o texto
            this.renderer.context.fillStyle = 'white';
            this.renderer.context.font = '30px Arial';
            this.renderer.context.fillText('Clique para começar', 250, 300);
        } else {
            // Desenhar a imagem de fundo em todos os estados, se necessário
            this.renderer.context.drawImage(this.backgroundImage, 0, 0, 800, 600);
            
            // Desenhar todas as entidades (projéteis, inimigos, jogador)
            this.renderer.render([...this.enemies, ...this.projectiles], this.player, this.smoothedDirection);
        }
    }

    gameLoop() {
        if (this.gameStateManager.getState() === 'running') {
            this.updateEntities();
            this.handleCollisions();
            this.render();
            requestAnimationFrame(() => this.gameLoop());
        }
    }

    start() {
        this.gameStateManager.startGame();
        this.gameLoop();
    }
}

export default Game;