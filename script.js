// Данные для галереи (космическая тема)
const imagesData = [
    { id: 1, title: "Юпитер", category: "planet", date: "12.03.2025", desc: "Газовый гигант, самая большая планета Солнечной системы.", tags: ["планета", "газовый гигант"], img: "images/1.jpg" },
    { id: 2, title: "Туманность Орёл", category: "nebula", date: "05.07.2025", desc: "Звёздные ясли, знаменитые 'Столпы творения'.", tags: ["туманность", "звёзды"], img: "images/2.jpg" },
    { id: 3, title: "Галактика Андромеды", category: "galaxy", date: "19.01.2025", desc: "Ближайшая крупная галактика, будущее столкновение с Млечным Путём.", tags: ["галактика", "спираль"], img: "images/3.jpg" },
    { id: 4, title: "Бетельгейзе", category: "star", date: "22.08.2025", desc: "Красный сверхгигант, скоро взорвётся сверхновой.", tags: ["звезда", "сверхгигант"], img: "images/4.jpg" },
    { id: 5, title: "Чёрная дыра", category: "galaxy", date: "10.04.2025", desc: "Область пространства с огромной гравитацией, даже свет не уходит.", tags: ["чёрная дыра", "гравитация"], img: "images/5.jpg" },
    { id: 6, title: "Млечный Путь", category: "galaxy", date: "01.09.2025", desc: "Наша галактика, содержит более 100 миллиардов звёзд.", tags: ["галактика", "Млечный Путь"], img: "images/6.jpg" },
    { id: 7, title: "Космонавт", category: "planet", date: "15.11.2025", desc: "Выход в открытый космос – мечта любого исследователя.", tags: ["человек", "космос"], img: "images/7.jpg" }
];

let currentFilter = "all";
let currentView = "grid";
let totalLikes = 0;
let likesMap = new Map(); // id -> количество лайков

// Элементы DOM
const galleryContainer = document.getElementById("image-gallery");
const imageCounterSpan = document.getElementById("image-counter");
const totalLikesSpan = document.getElementById("total-likes");
const filterBtns = document.querySelectorAll(".filter-btn");
const gridViewBtn = document.getElementById("grid-view");
const listViewBtn = document.getElementById("list-view");

// Функция рендера карточек
function renderGallery() {
    let filtered = imagesData.filter(img => currentFilter === "all" || img.category === currentFilter);
    imageCounterSpan.textContent = filtered.length;
    
    let html = "";
    filtered.forEach(img => {
        const likeCount = likesMap.get(img.id) || 0;
        const likedClass = likeCount > 0 ? "liked" : "";
        html += `
            <article class="image-card" data-id="${img.id}" data-category="${img.category}">
                <div class="card-image">
                    <img src="${img.img}" alt="${img.title}" class="gallery-img" loading="lazy">
                    <div class="image-overlay">
                        <button class="like-btn ${likedClass}" data-id="${img.id}">
                            <i class="fa-regular fa-heart"></i>
                            <span class="like-count">${likeCount}</span>
                        </button>
                        <button class="zoom-btn" data-img="${img.img}">
                            <i class="fas fa-expand"></i>
                        </button>
                    </div>
                </div>
                <div class="card-content">
                    <h3 class="image-title">${img.title}</h3>
                    <p class="image-date"><i class="far fa-calendar"></i> ${img.date}</p>
                    <p class="image-description">${img.desc}</p>
                    <div class="image-tags">
                        ${img.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
                    </div>
                </div>
            </article>
        `;
    });
    galleryContainer.innerHTML = html;
    
    // Обновить класс вида
    if (currentView === "list") {
        galleryContainer.classList.add("list-view");
    } else {
        galleryContainer.classList.remove("list-view");
    }
    
    // Перепривязать события лайков и зума
    attachLikeEvents();
    attachZoomEvents();
    updateTotalLikesDisplay();
}

// Лайки
function attachLikeEvents() {
    document.querySelectorAll(".like-btn").forEach(btn => {
        btn.removeEventListener("click", likeHandler);
        btn.addEventListener("click", likeHandler);
    });
}

function likeHandler(e) {
    e.stopPropagation();
    const btn = e.currentTarget;
    const id = parseInt(btn.dataset.id);
    const likeSpan = btn.querySelector(".like-count");
    let current = likesMap.get(id) || 0;
    
    if (btn.classList.contains("liked")) {
        current--;
        btn.classList.remove("liked");
    } else {
        current++;
        btn.classList.add("liked");
    }
    likesMap.set(id, current);
    likeSpan.textContent = current;
    updateTotalLikesDisplay();
    
    // анимация
    btn.style.transform = "scale(1.2)";
    setTimeout(() => btn.style.transform = "", 200);
}

function updateTotalLikesDisplay() {
    totalLikes = Array.from(likesMap.values()).reduce((sum, val) => sum + val, 0);
    totalLikesSpan.textContent = totalLikes;
}

// Зум (просто alert для демонстрации)
function attachZoomEvents() {
    document.querySelectorAll(".zoom-btn").forEach(btn => {
        btn.removeEventListener("click", zoomHandler);
        btn.addEventListener("click", zoomHandler);
    });
}

function zoomHandler(e) {
    e.stopPropagation();
    const imgSrc = e.currentTarget.dataset.img;
    alert("Увеличенный просмотр: " + imgSrc + "\n(в реальном проекте открывалось бы модальное окно)");
}

// Фильтры
function initFilters() {
    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            filterBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentFilter = btn.dataset.filter;
            renderGallery();
        });
    });
}

// Переключение вида
function initViewToggle() {
    gridViewBtn.addEventListener("click", () => {
        currentView = "grid";
        gridViewBtn.classList.add("active");
        listViewBtn.classList.remove("active");
        renderGallery();
    });
    listViewBtn.addEventListener("click", () => {
        currentView = "list";
        listViewBtn.classList.add("active");
        gridViewBtn.classList.remove("active");
        renderGallery();
    });
}

// Инициализация
document.addEventListener("DOMContentLoaded", () => {
    // Инициализируем лайки нулями
    imagesData.forEach(img => likesMap.set(img.id, 0));
    renderGallery();
    initFilters();
    initViewToggle();
    console.log("Галерея загружена, JavaScript работает!");
});
