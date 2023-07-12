const bloggys = document.querySelector(".blogs");
let blogList = "";

const articleForm = document.querySelector(".add-new-article");
const articleTitle = document.getElementById("titleInput");
const articleContent = document.getElementById("contentInput");
const submitBtn = document.querySelector("#submitBtn");

const url = "https://sistech-api.vercel.app/blog/";
const headers = {
  Authorization: "Bearer cf086647-14e2-4c43-b319-ceec15d4e55d",
};

const refreshPage = (data) => {
  data.forEach((item) => {
    blogList += `<div class="card mt-2">
        <div class="card-body row">
        <div class="col-auto me-auto">
        <h5 class="card-title">${item.title}</h5>
          <p class="card-text text-truncate">${item.content}</p>
        </div>
        <div class="col-auto" id=${item.id}>
        <a href="#" class="btn btn-primary" id="update-blog">Update</a>
          <button type="button" class="btn btn-outline-danger" id="like-blog">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-suit-heart-fill" viewBox="0 0 16 16">
<path d="M4 1c2.21 0 4 1.755 4 3.92C8 2.755 9.79 1 12 1s4 1.755 4 3.92c0 3.263-3.234 4.414-7.608 9.608a.513.513 0 0 1-.784 0C3.234 9.334 0 8.183 0 4.92 0 2.755 1.79 1 4 1z"></path>
</svg>  ${item.like}
        </button>
        </div>
        </div>
      </div>`;
  });
  bloggys.innerHTML = blogList;
};

//Listing the blog
fetch(url, { headers })
  .then((res) => res.json())
  .then((data) => refreshPage(data));

//Create new blog
articleForm.addEventListener("submit", (e) => {
  e.preventDefault();
  fetch(url, {
    method: "POST",
    headers: {
      Authorization: "Bearer cf086647-14e2-4c43-b319-ceec15d4e55d",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: articleTitle.value,
      content: articleContent.value,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      const dataArray = [];
      dataArray.push(data);
      refreshPage(dataArray);
      articleTitle.value = "";
      articleContent.value = "";
    });
});

//Update and Like blog
bloggys.addEventListener("click", (e) => {
  e.preventDefault();
  let updateBtnPressed = e.target.id == "update-blog";
  let likeBtnPressed = e.target.id == "like-blog";

  let id = e.target.parentNode.id;

  //Update
  if (updateBtnPressed) {
    const grandParent = e.target.parentNode.parentNode;
    let oldArticleTitle = grandParent.querySelector(".card-title").textContent;
    let oldArticleContent = grandParent.querySelector(".card-text").textContent;

    articleTitle.value = oldArticleTitle;
    articleContent.value = oldArticleContent;
  }

  submitBtn.addEventListener("click", (e) => {
    e.preventDefault();
    fetch(url, {
      method: "PUT",
      headers: {
        Authorization: "Bearer cf086647-14e2-4c43-b319-ceec15d4e55d",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: articleTitle.value,
        content: articleContent.value,
        id: id,
      }),
    })
      .then((res) => res.json())
      .then(() => location.reload());
    articleTitle.value = "";
    articleContent.value = "";
  });

  if (likeBtnPressed) {
    const likeBtn = e.target.parentNode.querySelector("#like-blog");

    // likeBtn.addEventListener("click", (e) => {
    //   e.preventDefault();
    fetch("https://sistech-api.vercel.app/blog/like", {
      method: "POST",
      headers: {
        Authorization: "Bearer cf086647-14e2-4c43-b319-ceec15d4e55d",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
      }),
    })
      .then((res) => res.json())
      .then(() => location.reload());
    // });
  }
});
