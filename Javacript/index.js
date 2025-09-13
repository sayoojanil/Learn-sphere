  // API Configuration
        const API_BASE_URL = 'https://api-hammadii-6.onrender.com/';
        const API_ENDPOINTS = {
            signup: '/signup',
            login: '/loginWithEmail'
        };

        // DOM Elements
        const signupBtn = document.getElementById('signup-btn');
        const loginBtn = document.getElementById('login-btn');
        const browseCoursesBtn = document.getElementById('browse-courses-btn');
        const signupModal = document.getElementById('signup-modal');
        const loginModal = document.getElementById('login-modal');
        const closeBtns = document.querySelectorAll('.close-btn');
        const showLogin = document.getElementById('show-login');
        const showSignup = document.getElementById('show-signup');
        const homeLink = document.getElementById('home-link');
        const navLinks = document.querySelectorAll('.nav-link');
        const pages = document.querySelectorAll('.page');
        const signupSubmitBtn = document.getElementById('signup-submit-btn');
        const loginSubmitBtn = document.getElementById('login-submit-btn');
        const signupError = document.getElementById('signup-error');
        const loginError = document.getElementById('login-error');
        const authButtons = document.getElementById('auth-buttons');
        const userProfile = document.getElementById('user-profile');
        const userNameDisplay = document.getElementById('user-name');
        const logoutBtn = document.getElementById('logout-btn');
        const userProfileIcon = document.getElementById('user-profile-icon');
        const userNameDropdown = document.getElementById('user-name-dropdown');
        const searchInput = document.getElementById('search-input');
        const categoryFilter = document.getElementById('category-filter');
        const difficultyFilter = document.getElementById('difficulty-filter');
        const coursesGrid = document.getElementById('courses-grid');
        const hamburger = document.getElementById('hamburger');
        const navLinksContainer = document.getElementById('nav-links');

        // Axios instance
        const api = axios.create({
            baseURL: API_BASE_URL,
            timeout: 5000,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Course data with difficulty levels
        const courses = [
            {
                title: 'JavaScript Fundamentals',
                description: 'Master the essentials of JavaScript to build interactive web applications.',
                category: 'Web Development',
                difficulty: 'Beginner',
                instructor: 'John Doe',
                rating: 4.5
            },
            {
                title: 'Python for Data Science',
                description: 'Learn Python programming for data analysis and visualization.',
                category: 'Data Science',
                difficulty: 'Intermediate',
                instructor: 'Jane Smith',
                rating: 4.0
            },
            {
                title: 'UI/UX Design Principles',
                description: 'Create user-friendly interfaces with modern design techniques.',
                category: 'Design',
                difficulty: 'Beginner',
                instructor: 'Emma Brown',
                rating: 5.0
            }
        ];

        // Function to update auth UI
        function updateAuthUI() {
            const token = localStorage.getItem('token');
            const userName = localStorage.getItem('userName');

            if (token && userName) {
                signupBtn.style.display = 'none';
                loginBtn.style.display = 'none';
                userProfile.style.display = 'flex';
                userNameDisplay.textContent = userName || 'User';
            } else {
                signupBtn.style.display = 'inline-block';
                loginBtn.style.display = 'inline-block';
                userProfile.style.display = 'none';
                userNameDisplay.textContent = '';
            }
        }

        // Function to get course icon
        function getCourseIcon(category) {
            const icons = {
                'Web Development': 'js',
                'Data Science': 'database',
                'Design': 'paint-brush',
                'Mobile Development': 'mobile-alt',
                'Business': 'chart-line',
                'Cloud Computing': 'cloud'
            };
            return icons[category] || 'book';
        }

        // Function to generate star rating
        function generateStars(rating) {
            let stars = '';
            const fullStars = Math.floor(rating);
            const hasHalfStar = rating % 1 >= 0.5;
            for (let i = 0; i < 5; i++) {
                if (i < fullStars) {
                    stars += '<i class="fas fa-star"></i>';
                } else if (i === fullStars && hasHalfStar) {
                    stars += '<i class="fas fa-star-half-alt"></i>';
                } else {
                    stars += '<i class="far fa-star"></i>';
                }
            }
            return stars;
        }

        // Function to render courses
        function renderCourses(filteredCourses) {
            coursesGrid.innerHTML = '';
            filteredCourses.forEach(course => {
                const courseCard = document.createElement('div');
                courseCard.className = 'course-card';
                courseCard.setAttribute('data-category', course.category);
                courseCard.setAttribute('data-difficulty', course.difficulty);
                courseCard.innerHTML = `
                    <div class="course-image">
                        ${course.image ? `<img src="${course.image}" alt="${course.title}">` : `<i class="fas fa-${getCourseIcon(course.category)}"></i>`}
                    </div>
                    <div class="course-content">
                        <span class="course-category">${course.category}</span>
                        <h3 class="course-title">${course.title}</h3>
                        <p class="course-description">${course.description}</p>
                        <div class="course-meta">
                            <div class="course-instructor">
                                <div class="instructor-avatar">${course.instructor[0]}${course.instructor.split(' ')[1]?.[0] || ''}</div>
                                <span>${course.instructor}</span>
                            </div>
                            <div class="course-rating">
                                ${generateStars(course.rating)}
                                <span>${course.rating}</span>
                            </div>
                        </div>
                    </div>
                `;
                coursesGrid.appendChild(courseCard);
            });
        }

        document.addEventListener('DOMContentLoaded', function () {
            document.querySelectorAll('.featured-courses-grid .course-card').forEach(card => {
                card.style.cursor = 'pointer';
                card.addEventListener('click', function () {
                    window.location.href = 'course.html';
                });
            });
        });

        // Search and filter function
        function filterCourses() {
            const searchText = searchInput?.value.toLowerCase() || '';
            const selectedCategory = categoryFilter?.value || 'all';
            const selectedDifficulty = difficultyFilter?.value || 'all';

            const filteredCourses = courses.filter(course => {
                const matchesSearch = course.title.toLowerCase().includes(searchText) ||
                                    course.description.toLowerCase().includes(searchText) ||
                                    course.category.toLowerCase().includes(searchText);
                const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
                const matchesDifficulty = selectedDifficulty === 'all' || course.difficulty === selectedDifficulty;
                return matchesSearch && matchesCategory && matchesDifficulty;
            });

            renderCourses(filteredCourses);
        }

        // Event listeners for search and filters
        if (searchInput) searchInput.addEventListener('input', filterCourses);
        if (categoryFilter) categoryFilter.addEventListener('change', filterCourses);
        if (difficultyFilter) difficultyFilter.addEventListener('change', filterCourses);

        // Hamburger menu toggle
        hamburger.addEventListener('click', () => {
            navLinksContainer.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        // Close mobile menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const page = link.getAttribute('data-page');
                if (page) {
                    e.preventDefault();
                    showPage(page);
                    navLinksContainer.classList.remove('active');
                    hamburger.classList.remove('active');
                }
            });
        });

        // Existing event listeners
        document.addEventListener('DOMContentLoaded', updateAuthUI);

        userProfileIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            userNameDropdown.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (!userProfileIcon.contains(e.target) && !userNameDropdown.contains(e.target)) {
                userNameDropdown.classList.remove('active');
            }
        });

        signupBtn.addEventListener('click', (e) => {
            e.preventDefault();
            signupModal.style.display = 'flex';
            signupError.style.display = 'none';
        });

        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            loginModal.style.display = 'flex';
            loginError.style.display = 'none';
        });

        browseCoursesBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'course.html';
        });

        closeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                signupModal.style.display = 'none';
                loginModal.style.display = 'none';
                signupError.style.display = 'none';
                loginError.style.display = 'none';
            });
        });

        showLogin.addEventListener('click', (e) => {
            e.preventDefault();
            signupModal.style.display = 'none';
            loginModal.style.display = 'flex';
            signupError.style.display = 'none';
            loginError.style.display = 'none';
        });

        showSignup.addEventListener('click', (e) => {
            e.preventDefault();
            loginModal.style.display = 'none';
            signupModal.style.display = 'flex';
            signupError.style.display = 'none';
            loginError.style.display = 'none';
        });

        homeLink.addEventListener('click', (e) => {
            e.preventDefault();
            showPage('home');
            navLinksContainer.classList.remove('active');       
            hamburger.classList.remove('active');
        });

        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('token');
            localStorage.removeItem('userName');
            localStorage.removeItem('rememberMe');
            updateAuthUI();
            alert('Logged out successfully!');
        });

        window.addEventListener('click', (e) => {
            if (e.target === signupModal) {
                signupModal.style.display = 'none';
                signupError.style.display = 'none';
            }
            if (e.target === loginModal) {
                loginModal.style.display = 'none';
                loginError.style.display = 'none';
            }
        });

        signupSubmitBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            signupError.style.display = 'none';

            const name = document.getElementById('signup-name').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            const confirmPassword = document.getElementById('signup-confirm').value;

            if (password !== confirmPassword) {
                signupError.textContent = 'Passwords do not match';
                signupError.style.display = 'block';
                return;
            }

            try {
                const response = await api.post(API_ENDPOINTS.signup, {
                    name,
                    email,
                    password
                });

                localStorage.setItem('token', response.data.token);
                localStorage.setItem('userName', name);
                alert('Account created successfully! Welcome to LearnSphere.');
                signupModal.style.display = 'none';
                document.getElementById('signup-name').value = '';
                document.getElementById('signup-email').value = '';
                document.getElementById('signup-password').value = '';
                document.getElementById('signup-confirm').value = '';
                updateAuthUI();
            } catch (error) {
                signupError.textContent = error.response?.data?.message || 'An error occurred during signup';
                signupError.style.display = 'block';
            }
        });

        loginSubmitBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            loginError.style.display = 'none';

            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            const remember = document.getElementById('remember').checked;

            try {
                const response = await api.post(API_ENDPOINTS.login, {
                    email,
                    password
                });

                localStorage.setItem('token', response.data.token);
                localStorage.setItem('userName', response.data.name || response.data.userName || 'User');

                if (remember) {
                    localStorage.setItem('rememberMe', 'true');
                } else {
                    localStorage.removeItem('rememberMe');
                }

                alert('Login successful! Welcome back.');
                loginModal.style.display = 'none';
                document.getElementById('login-email').value = '';
                document.getElementById('login-password').value = '';
                document.getElementById('remember').checked = false;
                updateAuthUI();
            } catch (error) {
                loginError.textContent = error.response?.data?.message || 'Invalid email or password';
                loginError.style.display = 'block';

                if (error.response?.status === 401) {
                    loginError.textContent = 'Invalid email or password';
                    loginError.style.display = 'block';
                } else {
                    loginError.textContent = 'Server error, please try again later';
                    loginError.style.display = 'block';
                }
            }
        });

        function showPage(pageName) {
            pages.forEach(page => {
                page.classList.toggle('active', page.id === `${pageName}-page`);
            });
            window.scrollTo(0, 0);
        }