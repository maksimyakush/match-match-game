import {Game} from "./classes/Game.js";
import {$} from '../helpers.js';
import {configFirebase} from "../environments/environment.js";
let matchMatchGame;
let intervalId;
firebase.initializeApp(configFirebase);
let db = firebase.firestore();
let audioHideBoxes = document.createElement('audio');
audioHideBoxes.src = "../multimedia/audio/get-hidden.mp3";
let audioOpenBoxes = document.createElement('audio');
audioOpenBoxes.src = "../multimedia/audio/rotate.wav";
let allAudiosArray = [audioHideBoxes, audioOpenBoxes];
let setPointerEvents = (eventValue) => document.querySelectorAll('.box').forEach(item => item.style.setProperty('pointer-events', eventValue));

function initialRender() {
    const items = JSON.parse(localStorage.getItem('items')) || [];
    if (items.amountOfBoxes) { 
        renderAfterRangeAndColorChange(items.amountOfBoxes, items.colorOfBoxes)
    }
    else {
        renderAfterRangeAndColorChange($('[type = "range"]').value, $('[type = "color"]').value)
    }
    clearInterval(intervalId);
    $('.timer').textContent = '';
    $('.new-game').hidden = true;
    $('.reset-game').hidden = true;
    $('.start-game').hidden = false;
    $("fieldset").style.visibility = "";
    $(".popup-content").classList.remove('show-popup');
    $('.popup').style.display = "";
    $('.timer').textContent = '0:00';
    $('.attempts>span').textContent = "0";
    setPointerEvents("none");
}

function renderAfterRangeAndColorChange(range,color) {
        if(range == 12) {
            document.documentElement.style.setProperty('--fa-font-size',"120px");
        }
        else if (range == 18) {
            document.documentElement.style.setProperty('--fa-font-size',"90px");
        }
        else if (range == 24) {
            document.documentElement.style.setProperty('--fa-font-size',"70px");
        }
        document.documentElement.style.setProperty('--columns',range/3);
        document.documentElement.style.setProperty('--color',color);
        $('[type="range"]').value = range;
        $('[type="color"]').value = color;
        matchMatchGame = new Game(range);
        matchMatchGame.randomize();
        renderBoxes();
        localStorage.setItem('items', JSON.stringify({amountOfBoxes: range, colorOfBoxes: color})); 
        setPointerEvents("none");
}

function renderBoxes() {
    let html = '';
    html = matchMatchGame.arrayOfBoxes.map((item) => {
        return `<div class="box"><div class="overlay"></div>${item.image}</div>`;
    }).join('');
    $('.gamefield').innerHTML = html;
}

function renderPopup() {
    $(".popup-content__attempts").textContent = "";
    $(".popup-content__spent-time").textContent = "";
    $('.popup').style.display = "block";
    $(".popup-content").classList.add('show-popup');
    $(".popup-content__attempts").textContent = matchMatchGame.attempts;
    $(".popup-content__spent-time").textContent = $('.timer').textContent;
}

function renderChangesInBoxes() {
    document.querySelectorAll('.box').forEach((item, i) => {
        if (matchMatchGame.arrayOfBoxes[i].visible == true) {
            item.children[1].style.visibility = 'visible';
            item.children[0].classList.add('clicked');
            audioOpenBoxes.play();
        }
        if (matchMatchGame.arrayOfBoxes[i].visible == false) {
            item.children[0].classList.remove('clicked');
            item.children[1].style.visibility = 'hidden'
        }
        if (matchMatchGame.arrayOfBoxes[i].deleted == true) {
            item.style.visibility = 'hidden';
            item.classList.add('box__hidden');
            item.children[1].classList.add('box__hidden');
        }
        if (matchMatchGame.sound == true)  {
            audioHideBoxes.play();
        }
        $('.attempts > span').textContent = "";
        $('.attempts > span').textContent = matchMatchGame.attempts;

        matchMatchGame.sound = false;
        console.log(matchMatchGame)
    })
    if(matchMatchGame.getWinner()) {
         renderPopup();
         clearInterval(intervalId);   
    }
}

function setTimer() {
    let mins = 0;
    let secs = 0;
    return () => {
        secs = secs + 1;
        if (secs % 59 == 0) {
            ++mins;
            secs = 0;
        }
        $('.timer').textContent = '';
        $('.timer').textContent = `${mins}:${secs < 10 ? '0' : '' }${secs}`;  
    }      
}

$(".game-controller__default-settings").addEventListener("click", () => {
    renderAfterRangeAndColorChange(12, "#ab6d6d");
    localStorage.setItem('items', JSON.stringify({}));
})

$('[type="color"]').addEventListener('change', () => renderAfterRangeAndColorChange($('[type = "range"]').value, $('[type = "color"]').value))
$('[type="range"]').addEventListener('change', () => renderAfterRangeAndColorChange($('[type = "range"]').value, $('[type = "color"]').value))
$('.new-game').addEventListener("click", initialRender)
$('.reset-game').addEventListener("click", () => {
    initialRender();
    clearInterval(intervalId);
    intervalId = setInterval(setTimer(), 1000);
    setPointerEvents("");
    $("fieldset").style.visibility = "hidden";
    $('.start-game').hidden = true;
    $('.new-game').hidden = false;
    $('.reset-game').hidden = false;
})

$('.start-game').addEventListener("click", (e) => {
    clearInterval(intervalId);
    intervalId = setInterval(setTimer(), 1000);
    setPointerEvents("");
    $("fieldset").style.visibility = "hidden";
    $('.start-game').hidden = true;
    $('.new-game').hidden = false;
    $('.reset-game').hidden = false;
})

$('.gamefield').addEventListener('click', (e) => {
    if (matchMatchGame.compareBoxes.length > 1) return;
    if (e.target.parentElement.parentElement.classList.contains('gamefield')) {
        const index = Array.from(e.target.parentElement.parentElement.children).indexOf(e.target.parentElement);
        matchMatchGame.setChanges(index);
        renderChangesInBoxes();
        if (matchMatchGame.compareBoxes.length > 1) {
            setTimeout(() => {
            matchMatchGame.setVisibility();
            renderChangesInBoxes();
        }, 1300)}    
    }
})

$(".popup-content .close").addEventListener("click", initialRender)
$('[type="checkbox"]').addEventListener('click', (e) => e.target.checked == false ? allAudiosArray.forEach(item => item.muted = true) : allAudiosArray.forEach(item => item.muted = false));
$(".send-name").addEventListener("submit", (e) => {
    let tempDataFromFirebase = [];
    e.preventDefault();
    $(".loader").hidden = false;
    db.collection(`${$("[type=range]").value}fields`).add({
        name: $(".send-name input").value,
        attempts: matchMatchGame.attempts,
        country: $('.timer').textContent
    })
    .then((res) => {
        db.collection(`${$("[type=range]").value}fields`).orderBy("attempts").get().then((querySnapshot) => {
            querySnapshot.forEach((doc,i) => {
                tempDataFromFirebase.push(doc.data())
            })
            $(".loader").hidden = true;
            for (var i = 0; i < tempDataFromFirebase.length; i++) {
                if (tempDataFromFirebase[i].name == $(".send-name input").value) {
                    console.log(tempDataFromFirebase[i].name)
                    $(".your-rank").textContent = "";
                    $(".your-rank").textContent = `Your rank is  # ${i + 1}`;
                } 
            }  
        })
    });
})
initialRender();
