// Magic Drawing Canvas
// Author: Tomato Automation
// Version: 1.0

class DrawingCanvas {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.drawing = false;
        this.currentColor = '#000000';
        this.currentSize = 5;
        
        this.init();
        this.setupEventListeners();
        this.setupTools();
    }
    
    init() {
        // Set initial brush style
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update status
        this.updateStatus('Ready to draw 🎨');
    }
    
    setupEventListeners() {
        // Mouse events
        this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
        this.canvas.addEventListener('mouseup', () => this.stopDrawing());
        this.canvas.addEventListener('mousemove', (e) => this.draw(e));
        this.canvas.addEventListener('mouseleave', () => this.stopDrawing());
        
        // Touch events for mobile
        this.canvas.addEventListener('touchstart', (e) => this.startDrawing(e));
        this.canvas.addEventListener('touchend', () => this.stopDrawing());
        this.canvas.addEventListener('touchmove', (e) => this.draw(e));
        this.canvas.addEventListener('touchcancel', () => this.stopDrawing());
    }
    
    setupTools() {
        // Color picker
        const colorPicker = document.getElementById('colorPicker');
        colorPicker.addEventListener('input', (e) => {
            this.currentColor = e.target.value;
            this.updateStatus(`Color changed to ${this.currentColor}`);
        });
        
        // Brush size slider
        const brushSizeSlider = document.getElementById('brushSize');
        const sizeValue = document.getElementById('sizeValue');
        brushSizeSlider.addEventListener('input', (e) => {
            this.currentSize = e.target.value;
            sizeValue.textContent = `${this.currentSize}px`;
            this.updateStatus(`Brush size: ${this.currentSize}px`);
        });
        
        // Clear button
        const clearBtn = document.getElementById('clearBtn');
        clearBtn.addEventListener('click', () => this.clearCanvas());
        
        // Save button
        const saveBtn = document.getElementById('saveBtn');
        saveBtn.addEventListener('click', () => this.saveCanvas());
    }
    
    startDrawing(e) {
        this.drawing = true;
        this.updateStatus('Drawing in progress... ✏️');
        
        // Get coordinates and start path
        const coords = this.getCoordinates(e);
        if (coords) {
            this.ctx.beginPath();
            this.ctx.moveTo(coords.x, coords.y);
            this.draw(e); // Draw immediately
        }
    }
    
    stopDrawing() {
        if (this.drawing) {
            this.drawing = false;
            this.ctx.beginPath(); // Reset path
            this.updateStatus('Ready to draw 🎨');
        }
    }
    
    draw(e) {
        if (!this.drawing) return;
        
        const coords = this.getCoordinates(e);
        if (!coords) return;
        
        // Set drawing styles
        this.ctx.strokeStyle = this.currentColor;
        this.ctx.lineWidth = this.currentSize;
        
        // Draw line
        this.ctx.lineTo(coords.x, coords.y);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(coords.x, coords.y);
    }
    
    getCoordinates(e) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        
        let clientX, clientY;
        
        if (e.touches) {
            // Touch event
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
            e.preventDefault();
        } else {
            // Mouse event
            clientX = e.clientX;
            clientY = e.clientY;
        }
        
        const x = (clientX - rect.left) * scaleX;
        const y = (clientY - rect.top) * scaleY;
        
        // Check boundaries
        if (x < 0 || x > this.canvas.width || y < 0 || y > this.canvas.height) {
            return null;
        }
        
        return { x, y };
    }
    
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.beginPath();
        this.updateStatus('Canvas cleared! Ready for new drawing ✨');
        
        // Add a subtle animation effect
        this.canvas.style.transform = 'scale(0.98)';
        setTimeout(() => {
            this.canvas.style.transform = 'scale(1)';
        }, 200);
    }
    
    saveCanvas() {
        try {
            const link = document.createElement('a');
            const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
            link.download = `my-drawing-${timestamp}.png`;
            link.href = this.canvas.toDataURL();
            link.click();
            this.updateStatus('Drawing saved successfully! 💾');
        } catch (error) {
            this.updateStatus('Error saving drawing 😕');
            console.error('Save error:', error);
        }
    }
    
    updateStatus(message) {
        const statusElement = document.getElementById('drawingStatus');
        if (statusElement) {
            statusElement.textContent = message;
            
            // Auto-clear status after 2 seconds for non-critical messages
            if (!message.includes('Drawing in progress') && !message.includes('Ready to draw')) {
                setTimeout(() => {
                    if (statusElement.textContent === message) {
                        statusElement.textContent = 'Ready to draw 🎨';
                    }
                }, 2000);
            }
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DrawingCanvas('drawingCanvas');
});
