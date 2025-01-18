class Renderer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            throw new Error(`Canvas with ID '${canvasId}' not found`);
        }
        this.context = this.canvas.getContext('2d');
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawEntity(entity) {
        this.context.fillStyle = entity.color || 'black';
        this.context.beginPath();
        this.context.arc(entity.position.x, entity.position.y, entity.size / 2, 0, Math.PI * 2);
        this.context.fill();
    }

    drawDirectionIndicator(player, direction) {
        const lineLength = 20;
        this.context.strokeStyle = 'white';
        this.context.lineWidth = 2;
        this.context.beginPath();
        this.context.moveTo(player.position.x, player.position.y);
        this.context.lineTo(
            player.position.x + direction.x * lineLength,
            player.position.y + direction.y * lineLength
        );
        this.context.stroke();
    }

    render(entities, player, direction) {
        this.clear();
        entities.forEach(entity => this.drawEntity(entity));
        this.drawEntity(player);
        this.drawDirectionIndicator(player, direction);
    }
}

export default Renderer;