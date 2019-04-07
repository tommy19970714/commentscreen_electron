class CommentStage {
    constructor(stageName, width, height) {
        this.width = width;
        this.height = height - 70;
        var stage = new createjs.Stage(stageName);
        this.container = new createjs.Container();
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
            for (var y = 0; y < lines.length; y++) {
                let line = lines[y];
                for (var z = 0; z < line.length; z++) {
                    line[z].x -= (((line[z].text.length * Math.floor(height / 11)) + width) / 10) / 80;
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
            }
            stage.update();
        });
    }

    insertText(comment) {
        console.log("insert text loaded");
        var text = new createjs.Text(comment, Math.floor(this.height / 11) - 12 + "px Arial", "#000000");
        text.alpha = 0.5;
        text.x = this.width;
        for (var y = 0; y < 11; y++) {
            if (this.isInsert(this.lines[y]) == true) {
                text.y = (this.height / 11) * y;
                this.lines[y].push(text);
                this.container.addChild(text);
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
            if (line[i].x + line[i].text.length * Math.floor(this.height / 11) > this.width) {
                return false;
            }
        }
        return true;
    }
}