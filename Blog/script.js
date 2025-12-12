document.addEventListener('DOMContentLoaded', function() {
    // Données initiales (simule une base de données)
    let blogData = {
        posts: JSON.parse(localStorage.getItem('blogPosts')) || [
            {
                id: 1,
                title: "Bienvenue sur le Mini Blog",
                content: "Ceci est un exemple d'article. Vous pouvez ajouter vos propres articles en cliquant sur le bouton 'Nouvel Article'.",
                author: "Admin",
                date: "2024-01-15",
                category: "technologie",
                likes: 5,
                comments: [
                    { id: 1, author: "Visiteur", content: "Super article !", date: "2024-01-16" }
                ]
            },
            {
                id: 2,
                title: "Les voyages forment la jeunesse",
                content: "Partir à l'aventure permet de découvrir de nouvelles cultures et de s'ouvrir l'esprit. Quel est votre prochain voyage ?",
                author: "Jean Dupont",
                date: "2024-01-14",
                category: "voyage",
                likes: 12,
                comments: []
            }
        ],
        currentPage: 1,
        postsPerPage: 4,
        currentFilter: ''
    };

    // Initialisation
    initBlog();

    // Fonctions principales
    function initBlog() {
        displayPosts();
        setupEventListeners();
        updatePostCount();
    }

    function displayPosts(page = 1, filter = '') {
        const container = document.getElementById('postsContainer');
        const loadingSpinner = document.getElementById('loadingSpinner');
        
        // Afficher le spinner
        container.innerHTML = '<div class="col-12 text-center"><div class="spinner-border text-primary" id="loadingSpinner"></div></div>';
        
        // Simuler un délai de chargement
        setTimeout(() => {
            let filteredPosts = blogData.posts;
            
            // Appliquer le filtre si spécifié
            if (filter) {
                filteredPosts = blogData.posts.filter(post => 
                    post.category === filter ||
                    post.title.toLowerCase().includes(filter.toLowerCase()) ||
                    post.content.toLowerCase().includes(filter.toLowerCase())
                );
            }
            
            // Pagination
            const startIndex = (page - 1) * blogData.postsPerPage;
            const endIndex = startIndex + blogData.postsPerPage;
            const postsToDisplay = filteredPosts.slice(startIndex, endIndex);
            
            // Vider le container
            container.innerHTML = '';
            
            if (postsToDisplay.length === 0) {
                container.innerHTML = `
                    <div class="col-12 text-center py-5">
                        <i class="fas fa-newspaper fa-3x text-muted mb-3"></i>
                        <h3>Aucun article trouvé</h3>
                        <p>Soyez le premier à publier un article !</p>
                    </div>
                `;
            } else {
                // Générer les articles
                postsToDisplay.forEach(post => {
                    const postElement = createPostElement(post);
                    container.appendChild(postElement);
                });
            }
            
            // Mettre à jour la pagination
            updatePagination(filteredPosts.length, page);
            blogData.currentPage = page;
            blogData.currentFilter = filter;
        }, 300);
    }

    function createPostElement(post) {
        const template = document.getElementById('postTemplate');
        const clone = template.cloneNode(true);
        
        // Remplir les données (simulation Thymeleaf)
        clone.querySelector('[data-th-text="${post.category}"]').textContent = 
            post.category.charAt(0).toUpperCase() + post.category.slice(1);
        clone.querySelector('[data-th-text="${post.date}"]').textContent = 
            formatDate(post.date);
        clone.querySelector('[data-th-text="${post.title}"]').textContent = post.title;
        clone.querySelector('[data-th-text="${post.content}"]').textContent = 
            post.content.length > 150 ? post.content.substring(0, 150) + '...' : post.content;
        clone.querySelector('[data-th-text="${post.author}"]').textContent = post.author;
        clone.querySelector('.like-count').textContent = post.likes;
        clone.querySelector('.comment-count').textContent = post.comments.length;
        
        // Supprimer l'attribut d'ID du template
        clone.removeAttribute('id');
        clone.style.display = 'block';
        
        // Ajouter les événements
        const likeBtn = clone.querySelector('.like-btn');
        const commentToggle = clone.querySelector('.comment-toggle');
        const commentSection = clone.querySelector('.comment-section');
        const commentForm = clone.querySelector('.add-comment-form');
        const commentsContainer = clone.querySelector('.comments-container');
        
        likeBtn.addEventListener('click', () => handleLike(post.id, likeBtn));
        commentToggle.addEventListener('click', () => {
            commentSection.style.display = commentSection.style.display === 'none' ? 'block' : 'none';
            if (commentSection.style.display === 'block') {
                displayComments(post.id, commentsContainer);
            }
        });
        
        commentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            addComment(post.id, commentForm.querySelector('input').value, commentsContainer);
            commentForm.reset();
        });
        
        return clone;
    }

    function handleLike(postId, button) {
        const post = blogData.posts.find(p => p.id === postId);
        if (post) {
            post.likes++;
            button.querySelector('.like-count').textContent = post.likes;
            button.classList.add('active');
            saveToLocalStorage();
            
            // Animation
            button.style.transform = 'scale(1.2)';
            setTimeout(() => {
                button.style.transform = 'scale(1)';
            }, 300);
        }
    }

    function displayComments(postId, container) {
        const post = blogData.posts.find(p => p.id === postId);
        container.innerHTML = '';
        
        if (post.comments.length === 0) {
            container.innerHTML = '<p class="text-muted text-center">Aucun commentaire</p>';
            return;
        }
        
        post.comments.forEach(comment => {
            const commentElement = createCommentElement(comment);
            container.appendChild(commentElement);
        });
    }

    function createCommentElement(comment) {
        const template = document.getElementById('commentTemplate');
        const clone = template.cloneNode(true);
        
        clone.querySelector('[data-th-text="${comment.author}"]').textContent = comment.author;
        clone.querySelector('[data-th-text="${comment.date}"]').textContent = 
            formatDate(comment.date);
        clone.querySelector('[data-th-text="${comment.content}"]').textContent = comment.content;
        
        clone.removeAttribute('id');
        clone.style.display = 'block';
        
        return clone;
    }

    function addComment(postId, content, container) {
        if (!content.trim()) return;
        
        const post = blogData.posts.find(p => p.id === postId);
        if (post) {
            const newComment = {
                id: Date.now(),
                author: "Utilisateur",
                content: content,
                date: new Date().toISOString().split('T')[0]
            };
            
            post.comments.push(newComment);
            saveToLocalStorage();
            
            // Mettre à jour le compteur
            document.querySelectorAll('.post-card').forEach(card => {
                if (card.querySelector('.card-title').textContent === post.title) {
                    card.querySelector('.comment-count').textContent = post.comments.length;
                }
            });
            
            // Ajouter le nouveau commentaire
            const commentElement = createCommentElement(newComment);
            container.appendChild(commentElement);
        }
    }

    function updatePagination(totalPosts, currentPage) {
        const pagination = document.getElementById('pagination');
        const totalPages = Math.ceil(totalPosts / blogData.postsPerPage);
        
        pagination.innerHTML = '';
        
        if (totalPages <= 1) return;
        
        // Bouton précédent
        const prevLi = document.createElement('li');
        prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
        prevLi.innerHTML = `<a class="page-link" href="#">Précédent</a>`;
        prevLi.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentPage > 1) displayPosts(currentPage - 1, blogData.currentFilter);
        });
        pagination.appendChild(prevLi);
        
        // Numéros de page
        for (let i = 1; i <= totalPages; i++) {
            const li = document.createElement('li');
            li.className = `page-item ${i === currentPage ? 'active' : ''}`;
            li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
            li.addEventListener('click', (e) => {
                e.preventDefault();
                displayPosts(i, blogData.currentFilter);
            });
            pagination.appendChild(li);
        }
        
        // Bouton suivant
        const nextLi = document.createElement('li');
        nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
        nextLi.innerHTML = `<a class="page-link" href="#">Suivant</a>`;
        nextLi.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentPage < totalPages) displayPosts(currentPage + 1, blogData.currentFilter);
        });
        pagination.appendChild(nextLi);
    }

    function setupEventListeners() {
        // Formulaire d'ajout d'article
        document.getElementById('postForm').addEventListener('submit', (e) => {
            e.preventDefault();
            addNewPost();
        });
        
        // Recherche
        document.getElementById('searchInput').addEventListener('input', (e) => {
            const searchTerm = e.target.value;
            if (searchTerm.length === 0 || searchTerm.length >= 2) {
                displayPosts(1, searchTerm);
            }
        });
        
        // Filtre par catégorie
        document.getElementById('categoryFilter').addEventListener('change', (e) => {
            const filter = e.target.value;
            displayPosts(1, filter);
        });
    }

    function addNewPost() {
        const title = document.getElementById('postTitle').value;
        const content = document.getElementById('postContent').value;
        const author = document.getElementById('postAuthor').value;
        const category = document.getElementById('postCategory').value;
        
        const newPost = {
            id: Date.now(),
            title: title,
            content: content,
            author: author || 'Anonyme',
            date: new Date().toISOString().split('T')[0],
            category: category,
            likes: 0,
            comments: []
        };
        
        blogData.posts.unshift(newPost);
        saveToLocalStorage();
        
        // Fermer le modal et réinitialiser le formulaire
        const modal = bootstrap.Modal.getInstance(document.getElementById('addPostModal'));
        modal.hide();
        document.getElementById('postForm').reset();
        
        // Mettre à jour l'affichage
        displayPosts(1);
        updatePostCount();
        
        // Message de succès
        showAlert('Article publié avec succès !', 'success');
    }

    function updatePostCount() {
        document.getElementById('postCount').textContent = 
            `${blogData.posts.length} article${blogData.posts.length > 1 ? 's' : ''}`;
    }

    function saveToLocalStorage() {
        localStorage.setItem('blogPosts', JSON.stringify(blogData.posts));
    }

    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('fr-FR', options);
    }

    function showAlert(message, type = 'info') {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        alertDiv.style.cssText = `
            top: 20px;
            right: 20px;
            z-index: 1050;
            min-width: 300px;
        `;
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(alertDiv);
        
        setTimeout(() => {
            alertDiv.remove();
        }, 3000);
    }

    // Exposer certaines fonctions globalement pour le débogage
    window.blogData = blogData;
    window.displayPosts = displayPosts;
});