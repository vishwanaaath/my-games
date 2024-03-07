function game() {
  const mapArray = [];

  function fillmap() {
    for (let i = 1; i <= 18; i++) {
      const k = i;
      const map = {};
      map[k] = { i: i, j: i + 18 };
      mapArray.push(map);
    }
  }
  fillmap();
  console.log(mapArray);

  function insertImage() {
    let elementsToAppend = [];
    for (const map of mapArray) {
      for (const k in map) {
        const { i, j } = map[k];

        const firstImageDiv = document.createElement("div");
        firstImageDiv.className = "ImageDiv";

        const secondImageDiv = document.createElement("div");
        secondImageDiv.className = "ImageDiv";

        const image1 = document.createElement("img");
        image1.id = `${i}`;
        image1.className = "image";
        image1.src = `image/pokeball.png`;
        firstImageDiv.appendChild(image1);

        const image2 = document.createElement("img");
        image2.id = `${j}`;
        image2.className = "image";
        image2.src = `image/pokeball.png`;
        secondImageDiv.appendChild(image2);

        elementsToAppend.push(secondImageDiv);
        elementsToAppend.push(firstImageDiv);
      }
    }
    shuffleArray(elementsToAppend);
    elementsToAppend.forEach((element) => {
      container.appendChild(element);
    });
  }

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  let selectedImages = [];
  let points = 0;
  let click = 0;

  function showPokemon() {
    const images = document.querySelectorAll("img");
    images.forEach((image) => {
      image.addEventListener("click", function () {
        const imageId = parseInt(this.id);

        if (this.src.includes("pokeball.png")) {
          increaseClicks();
          this.src = `image/${imageId}.png`;
          selectedImages.push(imageId);

          if (selectedImages.length === 2) {
            const [id1, id2] = selectedImages;

            if (checkmap(id1, id2)) {
              revealImages(id1, id2);
              increasePoints();
              console.log(id1, id2);
              if (points === 18) {
                let win = document.getElementById("win");
                container.style.display = "none";
                win.style.display = "flex";
              }
            } else {
              setTimeout(() => {
                hideImages(id1, id2);
              }, 250);
            }
            selectedImages = [];
          }
        }
      });
    });
  }

  function checkmap(id1, id2) {
    for (const map of mapArray) {
      for (const k in map) {
        const { i, j } = map[k];
        if ((i === id1 && j === id2) || (i === id2 && j === id1)) {
          return true;
        }
      }
    }
    return false;
  }

  function increasePoints() {
    points++;
    let score = document.getElementById("score");
    score.innerHTML = "SCORE:" + points;
    console.log("Points: " + points);
  }

  function increaseClicks() {
    click++;
    let clickElement = document.getElementById("click");
    clickElement.innerHTML = "CLICKS:" + click;
  }

  function revealImages(id1, id2) {
    const images = document.querySelectorAll("img");
    images.forEach((image) => {
      if (parseInt(image.id) === id1 || parseInt(image.id) === id2) {
        image.src = `image/${image.id}.png`;
      }
    });
  }

  function hideImages(id1, id2) {
    const images = document.querySelectorAll("img");
    images.forEach((image) => {
      if (parseInt(image.id) === id1 || parseInt(image.id) === id2) {
        image.src = "image/pokeball.png";
      }
    });
  }

  window.onload = function () {
    insertImage();
    showPokemon();
  };
}

game();
