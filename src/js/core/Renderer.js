class Renderer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            throw new Error(`Canvas com ID '${canvasId}' não encontrado`);
        }
        this.context = this.canvas.getContext('2d');
    }

    clear() {
        this.context.fillStyle = 'black'; // Fundo preto para contraste
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawEntity(entity) {
        this.context.fillStyle = entity.color || 'white';
        this.context.beginPath();
        this.context.arc(entity.position.x, entity.position.y, entity.size / 2, 0, Math.PI * 2);
        this.context.fill();
    }

    render(entities, player, direction) {
        this.clear();
        entities.forEach(entity => this.drawEntity(entity));
        this.drawEntity(player);
    }
}

export default Renderer;