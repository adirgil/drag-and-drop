async function createImages() {
  const imagesDiv = document.getElementById("images");
  const images = await window.api.getImages();
  const thumbnailWidth = 200;
  const thumbnailHeight = 150;
  images.forEach((imgObj) => {
    const randomImage = document.createElement("img");
    randomImage.src = `https://picsum.photos/id/${imgObj.id}/${thumbnailWidth}/${thumbnailHeight}`;
    imagesDiv.appendChild(randomImage);
    randomImage.ondblclick = function () {
      window.api.openImagesWindow(imgObj);
    };
  });

  const imagesInterval = window.setInterval(function () {
    const elem = document.getElementById("images");
    const stop = elem.scrollWidth - elem.clientWidth;
    elem.scrollBy(1, 0);
    if (stop < elem.scrollLeft) {
      clearInterval(imagesInterval);
    }
  }, 10);
}
