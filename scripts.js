var i = 0;
var txt = 'Hola buenos dias, bienvenido a mi CV...';
var speed = 50;

const scrollElements = document.querySelectorAll(".js-scroll");

const elementInView = (el, dividend = 1) => {
  const elementTop = el.getBoundingClientRect().top;

  return (
    elementTop <=
    (window.innerHeight || document.documentElement.clientHeight) / dividend
  );
};

const elementOutofView = (el) => {
  const elementTop = el.getBoundingClientRect().top;

  return (
    elementTop > (window.innerHeight || document.documentElement.clientHeight)
  );
};

const displayScrollElement = (element) => {
  element.classList.add("scrolled");
};

const hideScrollElement = (element) => {
  element.classList.remove("scrolled");
};

const handleScrollAnimation = () => {
  scrollElements.forEach((el) => {
    if (elementInView(el, 1.25)) {
      displayScrollElement(el);
    } else if (elementOutofView(el)) {
      hideScrollElement(el)
    }
  })
}

window.addEventListener("scroll", () => { 
  handleScrollAnimation();
});

function typeWriter() {
    document.getElementById("bot").style.display="none";
  if (i < txt.length) {
    document.getElementById("presentacion").innerHTML += txt.charAt(i);
    i++;
    if(txt.charAt(i)=="."){
        setTimeout(typeWriter,speed+1000);
    }else{
        setTimeout(typeWriter, speed);
    }
    
  }
}