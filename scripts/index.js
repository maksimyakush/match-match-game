import {$} from '../helpers.js';
function setScrollDown(numberOfSection) {
  window.scrollTo(0, numberOfSection * 1000);
  if (numberOfSection == 1) {
	$(`.rule-of-game__item-${numberOfSection}`).classList.add('animation');          
	$(`.rule-of-game__item-${numberOfSection}`).parentElement.dataset.active = "true";
  }
  else {
	$(`.rule-of-game__item-${numberOfSection}`).classList.add('animation');
	$(`.rule-of-game__item-${numberOfSection-1}`).classList.remove('animation');
	$(`.rule-of-game__item-${numberOfSection-1}`).parentElement.dataset.active = "false";  
	$(`.rule-of-game__item-${numberOfSection}`).parentElement.dataset.active = "true"; 
  }
  
}

function setScrollUp(numberOfSection) {
  window.scrollTo(0, numberOfSection * 1000);
  if (numberOfSection == 0) {
	$(`.rule-of-game__item-${numberOfSection + 1}`).classList.remove('animation');
	$(`.rule-of-game__item-${numberOfSection + 1}`).parentElement.dataset.active = "false";
  }
  else {
	  $(`.rule-of-game__item-${numberOfSection}`).classList.add('animation');
	  $(`.rule-of-game__item-${numberOfSection + 1}`).classList.remove('animation');
	  $(`.rule-of-game__item-${numberOfSection}`).parentElement.dataset.active = "true";  
	  $(`.rule-of-game__item-${numberOfSection + 1}`).parentElement.dataset.active = "false";
  }
}

function scrollUpAndDown() {
	if (window.scrollY == 100) {
		setScrollDown(1)    
  }
  else if(window.scrollY == 1100) {
	setScrollDown(2)
	}
	else if(window.scrollY == 2100) {
		setScrollDown(3)        
	}
	else if(window.scrollY == 3100) {
		setScrollDown(4)            
	}
  else if(window.scrollY == 4100) {
	setScrollDown(5)      
  }

	else if(window.scrollY<1000) {
		setScrollUp(0)  
						
	}
	else if(window.scrollY<2000) {
		setScrollUp(1) 
	}
	else if(window.scrollY<3000) {
		setScrollUp(2)
	}
	else if(window.scrollY<4000) {
		setScrollUp(3) 
	}
  setStages();
}


function setStages() {
  let html = [...document.querySelectorAll(".how-to-play")].map((item, i) =>`<div>${i + 1}</div>`).join("");
  document.querySelectorAll(".how-to-play").forEach((item,i)=>{
	item.children[0].innerHTML = html;
	if (item.dataset.active == "true") {
	item.children[0].children[i].style.background = 'yellow';
	}
  })
} 

$('.button__main').addEventListener('click', () => setScrollDown(1))
document.querySelectorAll('.rule-of-game button').forEach((item, i) => {
  item.addEventListener('click', () => {
	if (i == 0) {
	  setScrollDown(2); 
	}
	if (i == 1) {
	  setScrollDown(3);
	}
	if (i == 2) {
	setScrollDown(4);  
	}
  })
})
window.addEventListener('scroll',scrollUpAndDown)
   