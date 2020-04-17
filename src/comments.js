const Store = require('electron-store');
const store = new Store();

class CommentStage {
    constructor(stageName, width, height) {
        this.width = width;
        this.height = height - 70;
        var stage = new createjs.Stage(stageName);
        var container = new createjs.Container();
        this.container = container;
        stage.addChild(this.container);
        stage.update();

        var lines = new Array(11);
        for (var i = 0; i < lines.length; i++) {
            lines[i] = [];
        }
        this.lines = lines;

        var emojis = [];
        this.emojis = emojis;
        createjs.Ticker.timingMode = createjs.Ticker.RAF
        createjs.Ticker.addEventListener("tick", function () {
            var speed = store.get('text-speed') || 2;
            for (var y = 0; y < lines.length; y++) {
                let line = lines[y];
                for (var z = 0; z < line.length; z++) {
                    let textlength = line[z].getChildAt(0).text.length;
                    line[z].x -= speed * (((textlength * Math.floor(height / 11)) + width) / 10) / 100;
                    
                    if (line[z].x < -textlength * Math.floor(height / 11)) {
                        container.removeChild(line[z]);
                        line.splice(z, 1);
                    }
                }
            }

            for (y = 0; y < emojis.length; y++) {
                emojis[y].y -= Math.floor(Math.random() * 4);
                emojis[y].x += Math.floor(Math.random() * 4 - 2);

                if (emojis[y].y > height / 5) {
                    emojis[y].alpha -= 0.004;
                } else {
                    emojis[y].alpha -= 0.05;
                }
                if(emojis[y].alpha < 0) {
                    container.removeChild(emojis[y]);
                    emojis.splice(y, 1);
                }
            }
            stage.update();
        });
    }

    insertText(comment) {
        console.log("insert text loaded");
        // Default fontsize set to 60
        var textSize = store.get('text-fontsize') || 60;
        // Option to hide outline
        var showOutline = store.get('text-show-outline') || true;

        // Default inline color set to white
        var textInlineColor = store.get('text-inline-color') || "#ffffff";
        var textInline = new createjs.Text(comment, textSize + "px Arial", textInlineColor)
        textInline.outline = false;

        // Default outline color set to black
        var textOutlineColor = store.get('text-outline-color') || "#000000";
        var textOutline = new createjs.Text(comment, textSize + "px Arial", textOutlineColor);
        textOutline.outline = 2;

        for (var y = 0; y < 11; y++) {
            if (this.isInsert(this.lines[y]) == true) {
                var textview = new createjs.Container();
                textview.x = this.width;
                textview.y = (this.height / 11) * y;
                textview.addChild(textInline);
                if (showOutline) {textview.addChild(textOutline)}
                this.lines[y].push(textview);
                this.container.addChild(textview);
                break;
            }
        }
    }

    insertEmoji(emoji) {
        this.putEmoji(emoji, null, null);
    }

    putEmoji(emoji, x, y) {
        var text = new createjs.Text(emoji, Math.floor(35) + "px Arial", "#fff");
        var random = Math.floor(Math.random() * this.width);

        if (x == null || y == null) {
            text.x = random;
            text.y = this.height;
        } else {
            text.x = x;
            text.y = y;
        }
        this.emojis.push(text);
        this.container.addChild(text);
    }

    isInsert(line) {
        for (var i = 0; i < line.length; i++) {
            let textlength = line[i].getChildAt(0).text.length;
            if (line[i].x + textlength * Math.floor(this.height / 11) > this.width) {
                return false;
            }
        }
        return true;
    }
}