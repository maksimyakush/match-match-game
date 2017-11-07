     import {Box} from "./Box.js";
     import {images} from "../../data.js";

export class Game {
    constructor(boxes) {
        this.arrayOfBoxes = images.map((item, i) => new Box(item,i));
        this.arrayOfBoxes.length = boxes;
        this.compareBoxes = [];
        this.sound = false;
        this.attempts = 0;
    }
    randomize() {
        this.arrayOfBoxes.sort((a,b)=>Math.random()-0.5)
    }
    setChanges(index) {
        if(this.compareBoxes.length > 2) return;
        this.arrayOfBoxes[index].visible = true;
        this.compareBoxes.push(index);       
    }
    setVisibility() {
        if(this.compareBoxes.length == 2) {
            if(this.arrayOfBoxes[this.compareBoxes[0]].image!==this.arrayOfBoxes[this.compareBoxes[1]].image) {
                this.arrayOfBoxes[this.compareBoxes[0]].visible = false;
                this.arrayOfBoxes[this.compareBoxes[1]].visible = false;
                this.compareBoxes = [];
            }
            else if(this.arrayOfBoxes[this.compareBoxes[0]].image===this.arrayOfBoxes[this.compareBoxes[1]].image ) {
                this.arrayOfBoxes[this.compareBoxes[0]].deleted = true;
                this.arrayOfBoxes[this.compareBoxes[1]].deleted = true;
                this.arrayOfBoxes[this.compareBoxes[0]].visible = false;
                this.arrayOfBoxes[this.compareBoxes[1]].visible = false;
                this.compareBoxes = [];
                this.sound = true;
            } 
            this.attempts++;
        }

    }
    getWinner() {
        if (this.arrayOfBoxes.every(a=>a.deleted==true)) return true;
    }
}